// src/db.ts

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { DataSchema, Room, User } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

const adapter = new JSONFile<DataSchema>('db.json');
export const db = new Low<DataSchema>(adapter, { rooms: [], users: [] });

export const initDB = async () => {
  await db.read();
  db.data ||= { rooms: [], users: [] };
  await db.write();
};

export const saveRoom = async (room: Room) => {
  const index = db.data!.rooms.findIndex((r) => r.id === room.id);
  if (index !== -1) {
    db.data!.rooms[index] = room;
  } else {
    db.data!.rooms.push(room);
  }
  await db.write();
};

export const saveUser = async (user: User) => {
  const index = db.data!.users.findIndex((u) => u.uid === user.uid);
  if (index !== -1) {
    db.data!.users[index] = user;
  } else {
    db.data!.users.push(user);
  }

  await db.write();
};

export const createUser = async (username: string) => {
  const uid = uuidv4();

  saveUser({ uid, username });
  return { uid, username };
};

export const getUser = (userId: string) => {
  return db.data!.users.find((u) => u.uid === userId);
};

export const deleteRoom = async (roomId: string) => {
  db.data!.rooms = db.data!.rooms.filter((r) => r.id !== roomId);
  await db.write();
};

export const deleteUser = async (userId: string) => {
  db.data!.users = db.data!.users.filter((u) => u.uid !== userId);
  await db.write();
};

export const getRoom = (roomId: string) => {
  return db.data!.rooms.find((r) => r.id === roomId);
};

export const getJoinedRooms = (userId: string) => {
  return db.data!.rooms.filter((r) => r.peers.includes(userId));
};
