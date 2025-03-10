import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import {
  AppShell,
  Button,
  Container,
  createTheme,
  Group,
  MantineProvider,
  Switch,
  Title,
} from '@mantine/core';
import {
  useDebouncedCallback,
  useDisclosure,
  useMediaQuery,
} from '@mantine/hooks';
import {
  IconCards,
  IconCirclePlus,
  IconDoorEnter,
  IconMoonStars,
  IconSun,
} from '@tabler/icons-react';
import { CreateModal } from '../components/CreateModal';
import { JoinModal } from '../components/JoinModal';

export const Route = createRootRoute({
  component: RootComponent,
});

const mantineDark = createTheme({
  primaryColor: 'cyan',
  fontFamily: 'Open Sans, sans-serif',
});

function RootComponent() {
  const [light, { toggle }] = useDisclosure(true);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [joinOpened, { open: openJoin, close: closeJoin }] =
    useDisclosure(false);

  const handleCreateRoom = useDebouncedCallback(() => {
    openCreate();
  }, 500);

  const handleJoinRoom = useDebouncedCallback(() => {
    openJoin();
  }, 500);

  const CreateRoomButton = React.memo(() => (
    <Button
      leftSection={<IconCirclePlus size={16} />}
      onClick={handleCreateRoom}
    >
      Create room
    </Button>
  ));

  const JoinRoomButton = React.memo(() => (
    <Button leftSection={<IconDoorEnter size={16} />} onClick={handleJoinRoom}>
      Join room
    </Button>
  ));

  return (
    <React.Fragment>
      <MantineProvider
        theme={mantineDark}
        defaultColorScheme={'dark'}
        forceColorScheme={light ? 'light' : 'dark'}
      >
        <AppShell
          header={{ height: { base: 60, md: 70, lg: 80 } }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between" wrap="wrap">
              <Group>
                <IconCards size={30} />
                <Title order={2}>Planning Poker</Title>
              </Group>
              <Group>
                {!isMobile && (
                  <>
                    <CreateRoomButton />
                    <JoinRoomButton />
                  </>
                )}
                <Switch
                  size="md"
                  color="dark.4"
                  checked={light}
                  onChange={toggle}
                  onLabel={
                    <IconSun
                      size={16}
                      stroke={2.5}
                      color="var(--mantine-color-yellow-4)"
                    />
                  }
                  offLabel={
                    <IconMoonStars
                      size={16}
                      stroke={2.5}
                      color="var(--mantine-color-blue-6)"
                    />
                  }
                />
              </Group>
            </Group>
          </AppShell.Header>
          <AppShell.Main>
            <Container size={isMobile ? 'sm' : 'md'}>
              <Outlet />
            </Container>
            <CreateModal isOpen={createOpened} onClose={closeCreate} />
            <JoinModal isOpen={joinOpened} onClose={closeJoin} />
          </AppShell.Main>
          {/* App footer only on mobile */}
          {isMobile && (
            <AppShell.Footer>
              <Group px="md" justify="center" p="md">
                <CreateRoomButton />
                <JoinRoomButton />
              </Group>
            </AppShell.Footer>
          )}
        </AppShell>
      </MantineProvider>
    </React.Fragment>
  );
}
