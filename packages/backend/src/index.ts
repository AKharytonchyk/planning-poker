import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/rooms', (req, res) => {
  res.json({ uid: uuidv4() });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
