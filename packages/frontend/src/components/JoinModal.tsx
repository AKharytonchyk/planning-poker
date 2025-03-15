import { useForm } from '@mantine/form';
import { ModalProps } from '../types/ModalProps';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { fetchRoomDetails } from '../api/joinRoom';
import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useStorage } from '../hooks/useStorage';
import { Room } from '../types/Room';

const uuidV4Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const JoinModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rooms, saveRooms] = useStorage<Record<string, Room>>({
    key: 'room-owner-id',
    defaultValue: {},
  });

  const form = useForm({
    initialValues: {
      name: '',
      roomUID: '',
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      roomUID: (value) => (uuidV4Regex.test(value) ? null : 'Invalid room UID'),
    },
  });

  const handleSubmit = async (values: { name: string; roomUID: string }) => {
    setLoading(true);
    try {
      const room = rooms[values.roomUID];
      if (room) {
        navigate({ to: `/rooms/${room.roomId}` });
        onClose();
        return;
      }

      const data = await fetchRoomDetails(values.roomUID);
      saveRooms((current) => ({ ...current, [data.uid]: data }));
      navigate({ to: `/rooms/${data.uid}` });
      onClose();
    } catch (error) {
      form.setErrors({ roomUID: 'Failed to join room' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Join Room" size="md" opened={isOpen} onClose={onClose}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput required label="Name" {...form.getInputProps('name')} />
        <TextInput
          required
          mt="md"
          label="Room UID"
          {...form.getInputProps('roomUID')}
        />
        <Group mt="md">
          <Button type="submit" loading={loading}>
            Join
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
