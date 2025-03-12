import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

type Room = {
  roomId: string;
  roomName: string;
  ownerToken: string;
  users: User[];
};

type User = {
  id: string;
  name: string;
  isOwner: boolean;
};

const db = new JsonDB(new Config('pokerDB', true, false, '/'));

app.use(express.json());

app.post('/api/rooms', (req, res) => {
  const { name, roomName } = req.body;
  if (!name || !roomName) {
    res.status(400).json({ error: 'Name and roomName are required' });

    return;
  }

  const roomId = uuidv4();
  const ownerToken = uuidv4();
  const room = {
    roomId,
    roomName,
    ownerToken,
    users: [],
  } as Room;

  db.push(`/rooms/${roomId}`, room);
  res.json({ uid: roomId, ownerToken });
});

app.get('/api/rooms/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const { ownerToken, ...room } = (await db.getData(`/rooms/${roomId}`)) ?? {};
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  res.json(room);
});

app.post('/health', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', async (data) => {
    const { roomUID, userName, ownerToken } = data;
    try {
      const room = await db.getData(`/rooms/${roomUID}`);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      const isOwner = ownerToken && ownerToken === room.ownerToken;
      const user = { id: socket.id, name: userName, isOwner };

      room.users.push(user);
      db.push(`/rooms/${roomUID}`, room);

      socket.join(roomUID);
      socket.data.roomId = roomUID;

      // Notify all users in the room
      io.to(roomUID).emit('userJoined', user);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  // Handle user disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected');
    const roomId = socket.data.roomId;
    if (roomId) {
      try {
        const room = await db.getData(`/rooms/${roomId}`);
        room.users = room.users.filter((user: User) => user.id !== socket.id);
        db.push(`/rooms/${roomId}`, room);
        io.to(roomId).emit('userLeft', { id: socket.id });
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    }
  });
});

/** Basic route */
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
