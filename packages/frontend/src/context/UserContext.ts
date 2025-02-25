import { createContext } from 'react';

export type User = {
  uid: string;
  username: string;
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
});
