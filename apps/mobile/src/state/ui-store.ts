import { create } from 'zustand';

interface UiStore {
  lowEnergy: boolean;
  toggleLowEnergy: () => void;
  density: 'normal' | 'reduced';
}

export const useUiStore = create<UiStore>((set) => ({
  lowEnergy: false,
  toggleLowEnergy: () => set((state) => ({ lowEnergy: !state.lowEnergy, density: !state.lowEnergy ? 'reduced' : 'normal' })),
  density: 'normal',
}));
