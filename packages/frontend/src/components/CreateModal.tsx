import {
  Button,
  CopyButton,
  Group,
  Modal,
  Stack,
  TextInput,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { createRoom } from '../api/createRoom';
import { QRCodeSVG } from 'qrcode.react';
import { IconCopy, IconDoorExit } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useDebouncedCallback, useLocalStorage } from '@mantine/hooks';
import { ModalProps } from '../types/ModalProps';
import { Room } from '../types/Room';
import { useStorage } from '../hooks/useStorage';

export const CreateModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [roomUID, setRoomUID] = useState<string | null>(null);
  const [sharableLink, setSharableLink] = useState<string | null>(null);
  const navigate = useNavigate();

  const [_, setRoomOwnerData] = useStorage<Record<string, Room>>({
    key: 'room-owner-id',
    defaultValue: {},
  });

  const handleUpdateRoomData = (data: Room) => {
    setRoomOwnerData((current) => ({ ...current, [data.roomId]: data }));
  };

  const form = useForm({
    initialValues: {
      name: '',
      roomName: '',
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      roomName: (value) => (value ? null : 'Room name is required'),
    },
  });

  const handleSubmit = async (values: { name: string; roomName: string }) => {
    setLoading(true);
    try {
      const { roomId, roomName, ownerToken } = await createRoom(
        values.name,
        values.roomName
      );
      const link = `${window.location.origin}/rooms/=${roomId}`;
      setRoomUID(roomId);
      setSharableLink(link);
      handleUpdateRoomData({ roomId, roomName, ownerToken, users: [] });
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRoom = useDebouncedCallback(() => {
    if (roomUID) {
      navigate({ to: `/rooms/${roomUID}` });
      onClose();
    }
  }, 500);

  return (
    <Modal title="Create Room" size="md" opened={isOpen} onClose={onClose}>
      {roomUID && sharableLink ? (
        <Stack align="left">
          <Text>Room created! Share this link:</Text>
          <Group>
            <QRCodeSVG value={sharableLink} />
            <Stack w={260} justify="space-between">
              <Text lineClamp={3}>{sharableLink}</Text>
              <Group>
                <CopyButton value={sharableLink}>
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? 'teal' : 'blue'}
                      onClick={copy}
                      leftSection={!copied && <IconCopy size={16} />}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </CopyButton>
                <Button
                  leftSection={<IconDoorExit size={16} />}
                  onClick={handleGoToRoom}
                >
                  Go to Room
                </Button>
              </Group>
            </Stack>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Your Name"
            {...form.getInputProps('name')}
          />
          <TextInput
            required
            mt="md"
            label="Room Name"
            {...form.getInputProps('roomName')}
          />
          <Button type="submit" mt="md" loading={loading}>
            Create Room
          </Button>
        </form>
      )}
    </Modal>
  );
};
