export interface Room {
  id: string;
  owner: string; // UID of the room owner
  peers: string[]; // Array of socket IDs
}

export interface DataSchema {
  rooms: Room[];
  users: User[];
}

export interface User {
  uid: string;
  username?: string;
}
