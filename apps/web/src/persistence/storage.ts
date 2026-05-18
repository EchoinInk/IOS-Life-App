import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface Session {
  lastOpened: string | null;
  onboardingComplete: boolean;
}

export async function getTasks(): Promise<Task[]> {
  const tasksJson = await AsyncStorage.getItem('tasks');
  return tasksJson ? JSON.parse(tasksJson) : [];
}

export async function setTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
}

export async function getSession(): Promise<Session> {
  const sessionJson = await AsyncStorage.getItem('session');
  return sessionJson ? JSON.parse(sessionJson) : { lastOpened: null, onboardingComplete: false };
}

export async function setSession(session: Session): Promise<void> {
  await AsyncStorage.setItem('session', JSON.stringify(session));
}
