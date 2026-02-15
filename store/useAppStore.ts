import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StarData {
  id: string;
  title: string;
  date: string;
  message: string;
  color: string;
  position: [number, number, number];
  image?: string;
}

export interface LetterData {
  id: string;
  title: string;
  message: string;
  condition: string;
}

interface AppState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  visitedStars: string[];
  openedLetters: string[];
  revealUnlocked: boolean; // Hidden star found
  
  // Game Stats
  gamesPlayed: number;
  wonGameIds: string[]; // Track unique games won

  // Actions
  visitStar: (starId: string) => void;
  openLetter: (letterId: string) => void;
  unlockReveal: () => void;
  incrementGamesPlayed: () => void;
  recordGameWin: (gameId: string) => void;
  resetProgress: () => void;

  // Helper Accessors
  canAccessLetters: () => boolean;
  canAccessGame: () => boolean;
  canSeeHiddenStar: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      visitedStars: [],
      openedLetters: [],
      revealUnlocked: false,
      gamesPlayed: 0,
      wonGameIds: [],

      visitStar: (starId) => {
        const { visitedStars } = get();
        if (!visitedStars.includes(starId)) {
          set({ visitedStars: [...visitedStars, starId] });
        }
      },

      openLetter: (letterId) => {
        const { openedLetters } = get();
        if (!openedLetters.includes(letterId)) {
          set({ openedLetters: [...openedLetters, letterId] });
        }
      },

      unlockReveal: () => set({ revealUnlocked: true }),

      incrementGamesPlayed: () => set((state) => ({ gamesPlayed: state.gamesPlayed + 1 })),

      recordGameWin: (gameId) => {
        const { wonGameIds } = get();
        if (!wonGameIds.includes(gameId)) {
          set({ wonGameIds: [...wonGameIds, gameId] });
        }
      },

      resetProgress: () => {
        set({
          visitedStars: [],
          openedLetters: [],
          revealUnlocked: false,
          gamesPlayed: 0,
          wonGameIds: [],
        });
      },

      // Global Page Access Rules
      canAccessLetters: () => get().visitedStars.length >= 3,
      canAccessGame: () => get().openedLetters.length >= 1,
      canSeeHiddenStar: () => get().visitedStars.length >= 15 && get().wonGameIds.length >= 1,
    }),
    {
      name: "our-universe-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);