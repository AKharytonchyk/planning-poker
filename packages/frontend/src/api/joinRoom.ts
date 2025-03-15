export const fetchRoomDetails = async (roomUID: string) => {
  const response = await fetch(`/api/rooms/${roomUID}`);
  if (!response.ok) {
    throw new Error('Failed to join room');
  }

  return response.json();
};
