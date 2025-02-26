import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useSocket } from '../hooks/useSocket';
import Peer from 'simple-peer';

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useContext(UserContext);
  const { sessionId } = Route.useParams();
  const socket = useSocket();
  const navigate = useNavigate();
  // const [peer, setPeer] = useState<Peer.Instance | null>(null);
  // const [remoteData, setRemoteData] = useState<string | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (!socket || !sessionId || !user || !peerRef.current) return;

    const isInitiator = true;
    const newPeer = new Peer({ initiator: isInitiator, trickle: false });
    peerRef.current = newPeer;
    // setPeer(newPeer);

    newPeer.on('signal', (signalData) => {
      socket.emit('p2p-signal', { sessionId, user, signalData });
    });

    // When data is received from the peer:
    // newPeer.on('data', (data: Buffer) => {
    //   setRemoteData(data.toString());
    // });

    // Handle errors or connection events as needed.
    newPeer.on('connect', () => {
      console.log('P2P connection established!');
      // You can now send data directly
      newPeer.send('Hello from peer!');
    });

    return () => {
      newPeer.destroy();
    };
  }, [socket, sessionId, user]);

  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      console.log('Sending heartbeat');
      socket?.emit('heartbeat', { roomId: sessionId, userId: user?.uid });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, sessionId, user]);

  useEffect(() => {
    if (!socket) return;

    socket?.emit('join-room', { roomId: sessionId, user: user });

    socket?.on('peer-joined', (room) => {
      console.log('Room joined', room);
    });
  }, [socket, sessionId, user]);

  if (!user) {
    navigate({ to: '/login' });
    return null;
  }

  return <div>Hello "/sessions/{sessionId}"!</div>;
}
