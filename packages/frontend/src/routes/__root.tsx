import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const RootComponent = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <div>Logo</div>
            <Button.Group>
              <Button variant="default" onClick={() => navigate({ to: '/' })}>
                Home
              </Button>
              <Button
                variant="default"
                onClick={() => navigate({ to: '/about' })}
              >
                About
              </Button>
            </Button.Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
        <TanStackRouterDevtools />
      </AppShell.Main>
    </AppShell>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
