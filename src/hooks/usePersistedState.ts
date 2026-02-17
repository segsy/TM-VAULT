import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const usePersistedState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
      setHydrated(true);
    };

    hydrate();
  }, [key]);

  const update = async (next: T) => {
    setValue(next);
    await AsyncStorage.setItem(key, JSON.stringify(next));
  };

  return { value, setValue: update, hydrated };
};
