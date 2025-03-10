export type CreateRoomResponse = {
  uid: string;
};

export const createRoom = async (
  name: string,
  roomName: string
): Promise<CreateRoomResponse> => {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, roomName }),
  });
  if (!response.ok) {
    throw new Error('Failed to create room');
  }
  return response.json();
};
