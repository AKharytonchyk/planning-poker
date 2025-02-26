export interface Session {
  id: string;
  owner: string; // UID of the room owner
  peers: string[]; // Array of socket IDs
}
