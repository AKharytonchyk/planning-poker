import { useState } from 'react';
import { Room } from '../types/Room';
import { useStorage } from '../hooks/useStorage';

export type RoomProps = Room;

export const RoomPage: React.FC<RoomProps> = ({ users, roomId, roomName }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [savedRooms, saveRooms] = useStorage<Record<string, Room>>({
    key: 'room-owner-id',
    defaultValue: {},
  });

  const isOwner = !!savedRooms[roomId]?.ownerToken;

  return (
    <div>
      Room {roomId}. {isOwner ? 'Owner' : 'Joiner'}
    </div>
  );
};
