import { Title, Text, Stack, List, ThemeIcon, Box, Space } from '@mantine/core';
import {
  IconShare,
  IconCards,
  IconEye,
  IconRepeat,
  IconCirclePlus,
  IconDoorEnter,
} from '@tabler/icons-react';

export const HomePage: React.FC = () => {
  return (
    <Stack align="center" justify="center" pt="xl" style={{ height: '100%' }}>
      <Stack style={{ maxWidth: 600, width: '100%' }}>
        {/* Greeting */}
        <Title order={3} pb="sm">
          Welcome to Planning Poker!
        </Title>
        <Text>
          Planning Poker is a technique used to estimate the effort required to
          complete a task. Get started by creating or joining a room.
        </Text>
        <Space h="md" />

        <Stack pb="md">
          <Title order={4}>Next Steps</Title>
          <Text size="sm">Choose an action to begin:</Text>
          <List spacing="xs" size="sm" center>
            <List.Item
              icon={
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
                  size={24}
                >
                  <IconCirclePlus size={16} />
                </ThemeIcon>
              }
            >
              Click "Create room" in the header to start a new planning session.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime', deg: 135 }}
                  size={24}
                >
                  <IconDoorEnter size={16} />
                </ThemeIcon>
              }
            >
              Click "Join room" in the header to enter an existing session.
            </List.Item>
          </List>
        </Stack>
        <Space h="md" />

        {/* How to Use */}
        <Stack pb="md">
          <Title order={4}>How to Use</Title>
          <List spacing="xs" size="sm" center>
            <List.Item
              icon={
                <ThemeIcon color="green" size={24} radius="xl">
                  <IconShare size={16} />
                </ThemeIcon>
              }
            >
              Share the room ID with your team members.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconCards size={16} />
                </ThemeIcon>
              }
            >
              Select a task to estimate.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="red" size={24} radius="xl">
                  <IconEye size={16} />
                </ThemeIcon>
              }
            >
              Each member submits their estimate secretly.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="violet" size={24} radius="xl">
                  <IconRepeat size={16} />
                </ThemeIcon>
              }
            >
              Reveal the estimates and discuss any discrepancies. Repeat for
              other tasks.
            </List.Item>
          </List>
        </Stack>
        <Space h="md" />
        <Box>
          <Text size="xs" c="dimmed" ta="center">
            This app is free to use and does not track any personal data.
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
};
