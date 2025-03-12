export type Room = {
  roomId: string;
  roomName: string;
  ownerToken: string;
  users: User[];
};

export type User = {
  id: string;
  name: string;
  isOwner: boolean;
};
