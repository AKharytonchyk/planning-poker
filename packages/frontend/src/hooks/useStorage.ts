// packages/frontend/src/hooks/useStorage.ts
import { useState } from 'react';
import CryptoJS from 'crypto-js';

export function useStorage<T>(
  key: string,
  initialValue: T,
  secret: string = 'not-so-secret',
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const bytes = CryptoJS.AES.decrypt(item, secret);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted) as T;
      }
      localStorage.setItem(
        key,
        CryptoJS.AES.encrypt(JSON.stringify(initialValue), secret).toString(),
      );
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage key “' + key + '”: ', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        secret,
      ).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error setting localStorage key “' + key + '”: ', error);
    }
  };

  return [storedValue, setValue] as const;
}
