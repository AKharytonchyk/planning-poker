import superjson from 'superjson';
import { useLocalStorage } from '@mantine/hooks';

export const useStorage = <T>({
  key,
  defaultValue,
}: {
  key: string;
  defaultValue: T;
}) => {
  const [value, setValue] = useLocalStorage<T>({
    key,
    defaultValue,
    serialize: (value) => superjson.stringify(value),
    deserialize: (value) =>
      value === undefined ? defaultValue : superjson.parse(value),
  });
  return [value, setValue] as const;
};
