import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { RoomPage } from '../pages/Room';
import { fetchRoomDetails } from '../api/joinRoom';

export const Route = createFileRoute('/rooms/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const roomData = await fetchRoomDetails(params.id);

    return roomData ? roomData : { error: 'Room not found' };
  },
});

function RouteComponent() {
  const data = useLoaderData({
    from: '/rooms/$id',
  });

  return <RoomPage {...data} />;
}
