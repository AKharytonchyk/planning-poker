import React, { useState, useEffect } from 'react';
import { Container, TextInput, Button, Title, Text, Group, Paper } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
  const [uid, setUid] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    // Check if a UID is stored in localStorage
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleCreateUid = () => {
    const newUid = uuidv4();
    setUid(newUid);
    localStorage.setItem('uid', newUid);
  };

  const handleSetUid = () => {
    if (inputValue.trim()) {
      setUid(inputValue);
      localStorage.setItem('uid', inputValue);
    }
  };

  return (
    <Container size="sm" my="xl">
      <Paper shadow="sm" p="lg">
        <Title mb="md">
          Welcome to Planning Poker
        </Title>
        {uid ? (
          <div>
            <Title order={3}>Your UID:</Title>
            <Text size="lg" mt="sm">
              {uid}
            </Text>
          </div>
        ) : (
          <div>
            <TextInput
              label="Enter your UID"
              placeholder="Enter UID"
              value={inputValue}
              onChange={(event) => setInputValue(event.currentTarget.value)}
            />
            <Group mt="md">
              <Button onClick={handleSetUid}>Submit UID</Button>
              <Button variant="outline" onClick={handleCreateUid}>
                Create New UID
              </Button>
            </Group>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
