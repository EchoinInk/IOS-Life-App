import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createNamespacedStorage, STORE_VERSION } from "@/store/sharedPersist";
import { Streak, StreakType } from "./streaks.types";

type State = {
  streaks: Record<StreakType, Streak>;
  updateStreak: (type: StreakType, completed: boolean) => void;
  resetStreak: (type: StreakType) => void;
};

const getDefaultStreak = (type: StreakType): Streak => ({
  type,
  current: 0,
  longest: 0,
  lastUpdated: 0,
});

export const useStreaksStore = create<State>()(
  persist(
    (set, get) => ({
      streaks: {
        tasks: getDefaultStreak("tasks"),
        meals: getDefaultStreak("meals"),
      },

      updateStreak: (type, completed) => {
        const now = Date.now();
        const prev = get().streaks[type];
        
        if (!completed) {
          // Reset streak if not completed
          set((state) => ({
            streaks: {
              ...state.streaks,
              [type]: { ...prev, current: 0, lastUpdated: now },
            },
          }));
          return;
        }

        // Check if this is a new day
        const isSameDay = prev.lastUpdated > 0 && 
          new Date(prev.lastUpdated).toDateString() === new Date(now).toDateString();
        
        if (isSameDay) {
          // Already updated today, don't increment
          return;
        }

        const next: Streak = {
          type,
          current: (prev?.current || 0) + 1,
          longest: Math.max(prev?.longest || 0, (prev?.current || 0) + 1),
          lastUpdated: now,
        };

        set((state) => ({
          streaks: { ...state.streaks, [type]: next },
        }));
      },

      resetStreak: (type) => {
        const now = Date.now();
        const prev = get().streaks[type];
        
        set((state) => ({
          streaks: {
            ...state.streaks,
            [type]: { ...prev, current: 0, lastUpdated: now },
          },
        }));
      },
    }),
    {
      name: "streaks",
      version: STORE_VERSION,
      storage: createNamespacedStorage<Pick<State, "streaks">>(["streaks"]),
      partialize: (state) => ({
        streaks: state.streaks,
      }),
    }
  )
);
