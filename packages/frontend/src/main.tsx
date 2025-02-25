import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

import { routeTree } from './routeTree.gen';
import { UserContext } from './context/UserContext';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider>
        <UserContext.Provider value={{ user: null, setUser: () => {} }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </MantineProvider>
    </StrictMode>,
  );
}
