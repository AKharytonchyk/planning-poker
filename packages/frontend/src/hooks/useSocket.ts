import { useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = '/socket.io';

export const useSocket = () => {
  const socket: Socket = useMemo(
    () => io(SOCKET_URL, { autoConnect: false }),
    []
  );

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const joinRoom = (roomUID: string) => {
    socket.emit('join', roomUID);
  };

  const listen = (event: string, callback: (...args: any[]) => void) => {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  return { socket, joinRoom, listen };
};
