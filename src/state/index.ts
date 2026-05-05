import { create } from 'zustand';

type AppState = {
  qaMode: boolean;
  setQaMode: (v: boolean) => void;
};

export const useAppState = create<AppState>((set) => ({
  qaMode: false,
  setQaMode: (v) => set({ qaMode: v }),
}));
