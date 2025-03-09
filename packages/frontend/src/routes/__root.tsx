import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import {
  AppShell,
  createTheme,
  Group,
  MantineProvider,
  Switch,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCards, IconMoonStars, IconSun } from '@tabler/icons-react';

export const Route = createRootRoute({
  component: RootComponent,
});

const mantineDark = createTheme({
  primaryColor: 'cyan',
  fontFamily: 'Open Sans, sans-serif',
});

function RootComponent() {
  const [dark, { toggle }] = useDisclosure(true);

  return (
    <React.Fragment>
      <MantineProvider
        theme={mantineDark}
        defaultColorScheme={dark ? 'dark' : 'light'}
      >
        <AppShell
          header={{ height: { base: 60, md: 70, lg: 80 } }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <IconCards size={30} />
              <Title order={2}>Planning Poker</Title>
              <Switch
                size="md"
                color="dark.4"
                checked={dark}
                onChange={toggle}
                style={{ marginLeft: 'auto' }}
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
          </AppShell.Header>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </React.Fragment>
  );
}
