import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { RootNavigation } from '../navigation/root-navigation';
import { useTaskStore } from '../state/task-store';
import { useSessionStore } from '../state/session-store';

export default function App() {
  const loadTasksFromStorage = useTaskStore((state) => state.loadTasksFromStorage);
  const loadSession = useSessionStore((state) => state.loadSession);
  const persistSession = useSessionStore((state) => state.persistSession);

  useEffect(() => {
    const initializeApp = async () => {
      await loadTasksFromStorage();
      await loadSession();
      await persistSession();
    };
    initializeApp();
  }, [loadTasksFromStorage, loadSession, persistSession]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RootNavigation />
    </SafeAreaView>
  );
}
