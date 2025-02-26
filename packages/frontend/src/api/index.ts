import axios from 'axios';
import { User } from '../context/UserContext';
import { Session } from '../models/Session';

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
  try {
    const response = await api.get(`/users/${userId}`);
    if (response.status === 404) {
      return null;
    }

    return response.data;
  } catch (error) {
    return null;
  }
};

export const createRoom = async (userId: string) => {
  return (await api.post('/rooms', { userId })).data;
};

export const getRooms = async (userId: string) => {
  return api.get<Session>('/rooms', { params: { userId } });
};

export const getRoom = async (roomId: string) => {
  return (await api.get(`/rooms/${roomId}`)).data;
};
