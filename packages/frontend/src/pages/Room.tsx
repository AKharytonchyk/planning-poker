export type RoomProps = {
  uid: string;
};

export const Room: React.FC<RoomProps> = ({ uid }) => {
  return <div>Room {uid}</div>;
};
