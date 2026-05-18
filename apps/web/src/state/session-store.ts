import { create } from 'zustand';
import { getSession, setSession } from '../persistence/storage';

interface SessionStore {
  lastOpened: string | null;
  onboardingComplete: boolean;
  loadSession: () => Promise<void>;
  persistSession: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  lastOpened: null,
  onboardingComplete: false,
  loadSession: async () => {
    const session = await getSession();
    set({
      ...session,
      lastOpened: new Date().toISOString(),
    });
  },
  persistSession: async () => {
    const { lastOpened, onboardingComplete } = get();
    await setSession({ lastOpened, onboardingComplete });
  },
}));
