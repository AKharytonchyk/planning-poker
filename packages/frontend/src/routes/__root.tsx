import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { User, UserContext } from '../context/UserContext';
import { useStorage } from '../hooks/useStorage';

const RootComponent = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const [storedValue, setValue] = useStorage<User | null>('user', null);

  const handleLogout = () => {
    setValue(null);
    navigate({ to: '/login' });
  };

  return (
    <UserContext.Provider value={{ user: storedValue, setUser: setValue }}>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
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
                <Button variant="default" onClick={handleLogout}>
                  Logout
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
    </UserContext.Provider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
