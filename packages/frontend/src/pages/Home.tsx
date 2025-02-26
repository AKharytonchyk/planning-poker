import React, { useState, useEffect } from 'react';
import {
  Container,
  TextInput,
  Button,
  Title,
  Text,
  Group,
  Paper,
} from '@mantine/core';
import { useStorage } from '../hooks/useStorage';
import { User } from '../context/UserContext';
import { useNavigate } from '@tanstack/react-router';
import { createRoom, getRoom, getUser } from '../api';
import { useForm } from '@mantine/form';

const Home: React.FC = () => {
  const [uid, setUid] = useState<string>('');
  const navigate = useNavigate();
  const [storedValue] = useStorage<User | null>('user', null);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      SID: '',
    },
    validate: {
      SID: (value) =>
        value &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value,
        )
          ? null
          : 'SID must be a valid UID v4',
    },
  });

  useEffect(() => {
    if (!storedValue) {
      navigate({ to: '/login' });
    } else {
      const checkUser = async () => {
        const user = await getUser(storedValue.uid);

        console.log('USER!!!', user);
        if (!user) {
          navigate({ to: '/login' });
        } else {
          setUid(storedValue.uid);
        }
      };

      checkUser();
    }
  }, [storedValue]);

  const handleCreateNewSession = async () => {
    const session = await createRoom(uid);

    if (!session) {
      return;
    }

    navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } });
  };

  const handleSubmit = async (values: { SID: string }) => {
    const session = await getRoom(values.SID);

    if (!session) {
      return;
    }

    navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } });
  };

  return (
    <Container size="sm" my="xl">
      <Paper shadow="sm" p="lg">
        <Title mb="md">
          Welcome to Planning Poker
          {storedValue?.username ? `, ${storedValue.username}` : ''}
        </Title>
        <Text size="lg" mb="md">
          This is a simple planning poker app. You can create a new session and
          share the SID with your team to join the session.
        </Text>
        <Text size="lg" mb="md">
          Do you want to start a new session or join an existing one?
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Session ID"
            placeholder="Enter session ID"
            key={form.key('SID')}
            {...form.getInputProps('SID')}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Join session</Button>
            <Button variant="outline" onClick={handleCreateNewSession}>
              Create session
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default Home;
