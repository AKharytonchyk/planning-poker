import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  initDB,
  saveRoom,
  deleteRoom,
  getRoom,
  getJoinedRooms,
  getUser,
  saveUser,
  createUser,
  createRoom,
} from './db';
import { Room, User } from './interfaces';

const HEARTBEAT_INTERVAL = 5000; // milliseconds: how often we expect a heartbeat
const HEARTBEAT_TIMEOUT = 15000; // milliseconds: if no heartbeat received, consider user offline

const heartbeats = new Map<string, number>();

initDB().then(() => console.log('Database initialized'));

const app = express();
const httpServer = createServer(app);
app.use(bodyParser.json());

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// Health endpoing
app.get('/health', (_, res) => {
  res.send('OK');
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = getUser(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const userName = req.body.userName;
  saveUser({ uid: userId, username: userName });
  res.send('User created');
});

app.post('/users', async (req, res) => {
  const userName = req.body.userName;
  const user = await createUser(userName);
  res.json(user);
});

app.post('/rooms', async (req, res) => {
  const userId = req.body.userId;
  const room = await createRoom(userId);

  res.json(room);
});

app.post('/rooms/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.body.userId;
  const peers = req.body.peers;
  const room = getRoom(roomId);

  if (!room) {
    res.status(404).send('Room not found');
    return;
  }

  if (room.owner !== userId) {
    res.status(403).send('Permission denied');
  }

  room.peers = peers;
  saveRoom(room);

  res.status(200).json(room);
});

app.get('/rooms', (req, res) => {
  const userId = req.query.userId as string;
  const rooms = getJoinedRooms(userId);

  if (!rooms || rooms.length === 0) {
    res.status(404).send('No rooms found');
  }

  res.json(rooms);
});

app.get('/rooms/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const room = getRoom(roomId);

  if (!room) {
    res.status(404).send('Room not found');
  }

  res.json(room);
});

io.on('connection', (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // When a client joins a room, they should send both roomId and userId.
  socket.on(
    'join-room',
    async ({ roomId, user }: { roomId: string; user: User }) => {
      console.log(`User ${user.username} joining room ${roomId}`);

      const room: Room | undefined = getRoom(roomId);

      if (!room) return;

      if (!room.peers.includes(socket.id)) {
        room.peers.push(socket.id);
      }

      await saveRoom(room);

      heartbeats.set(socket.id, Date.now());

      socket.join(roomId);
      socket.to(roomId).emit('peer-joined', { socketId: socket.id, userId });
    },
  );

  // Client sends periodic heartbeat events
  socket.on('heartbeat', (data: { roomId: string; userId: string }) => {
    console.log(`Heartbeat from ${data.userId}`);
    heartbeats.set(socket.id, Date.now());
  });

  // Event: leave room
  socket.on('leave-room', async (roomId: string) => {
    console.log(`Socket ${socket.id} leaving room ${roomId}`);
    const room: Room | undefined = getRoom(roomId);
    if (room) {
      room.peers = room.peers.filter((peerId) => peerId !== socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('peer-left', socket.id);
      if (room.peers.length === 0) {
        await deleteRoom(roomId);
      } else {
        await saveRoom(room);
      }
    }
    heartbeats.delete(socket.id);
  });

  socket.on('disconnect', async () => {
    console.log(`Socket disconnected: ${socket.id}`);
    heartbeats.delete(socket.id);
    for (const room of getJoinedRooms(socket.id)) {
      room.peers = room.peers.filter((peerId) => peerId !== socket.id);
      socket.to(room.id).emit('peer-left', socket.id);
      if (room.peers.length === 0) {
        await deleteRoom(room.id);
      } else {
        await saveRoom(room);
      }
    }
  });

  // Additional signaling: exchange SDP and ICE candidates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on('signal', (data: { roomId: string; signalData: any }) => {
    const { roomId, signalData } = data;
    socket.to(roomId).emit('signal', { from: socket.id, signalData });
  });
});

// Check periodically for missing heartbeats and remove offline peers
setInterval(async () => {
  const now = Date.now();
  for (const [socketId, lastBeat] of heartbeats.entries()) {
    if (now - lastBeat > HEARTBEAT_TIMEOUT) {
      console.log(`Heartbeat timeout for socket ${socketId}`);
      // Inform peers in the room(s) that this user is offline.
      const sockets = await io.fetchSockets();
      const socketToRemove = sockets.find((s) => s.id === socketId);
      if (socketToRemove) {
        // For every room that this socket is in, notify others.
        for (const roomId of socketToRemove.rooms) {
          // Skip the default room which is the socket id itself.
          if (roomId === socketId) continue;
          // socketToRemove.to(roomId).emit('peer-offline', socketId);
          // Remove the socket id from the room in the DB.
          const room: Room | undefined = getRoom(roomId);
          if (room) {
            room.peers = room.peers.filter((peerId) => peerId !== socketId);
            if (room.peers.length === 0) {
              await deleteRoom(roomId);
            } else {
              await saveRoom(room);
            }
          }
        }
        // Disconnect the socket forcibly.
        socketToRemove.disconnect();
      }
      // Remove from heartbeats
      heartbeats.delete(socketId);
    }
  }
}, HEARTBEAT_INTERVAL);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
