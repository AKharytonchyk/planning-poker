import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

export const createUser = async (userName: string) => {
  const response = await api.post('/users', { userName });

  if (response.status === 404) {
    throw new NotFoundError('User not found');
  }

  if (response.status >= 500) {
    throw new ServerError('Server error');
  }

  return response.data;
};

export const getUser = async (userId: string) => {
  return api.get(`/users/${userId}`);
};

export const createRoom = async (roomId: string, userId: string) => {
  return api.post('/rooms', { roomId, userId });
};

export const getRooms = async (userId: string) => {
  return api.get('/rooms', { params: { userId } });
};

export const getRoom = async (roomId: string) => {
  return api.get(`/rooms/${roomId}`);
};
