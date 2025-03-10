import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Room } from '../pages/Room';

export const Route = createFileRoute('/rooms/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    console.log(params.id);

    return Promise.resolve({
      uid: params.id,
      name: 'Room Name',
      owner: 'Owner Name',
    });
  },
});

function RouteComponent() {
  const data = useLoaderData({
    from: '/rooms/$id',
  });

  console.log(data);
  return <Room {...data} />;
}
