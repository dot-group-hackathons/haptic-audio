import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "user-name";

// Persistant storage of user's name. Used for name recognition.
export function useUserName() {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setName(await AsyncStorage.getItem(STORAGE_KEY));
      } catch (err) {
        console.error(err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveName = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setName(trimmed);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, trimmed);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { name, ready, saveName };
}
