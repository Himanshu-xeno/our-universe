import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Types */
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
  /** Hydration */
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  /** Progress */
  visitedStars: string[];
  openedLetters: string[];
  revealUnlocked: boolean;

  /** Game stats */
  gamesPlayed: number;
  wonGameIds: string[];

  /** Explicit game completed flag */
  gameCompleted: boolean;
  setGameCompleted: (val: boolean) => void;

  /** Actions */
  visitStar: (starId: string) => void;
  openLetter: (letterId: string) => void;
  unlockReveal: () => void;
  incrementGamesPlayed: () => void;
  recordGameWin: (gameId: string) => void;
  resetProgress: () => void;

  /** Computed helpers */
  canAccessLetters: () => boolean;
  canAccessGame: () => boolean;
  canSeeHiddenStar: () => boolean;
  starsCollected: () => number;
  lettersOpenedCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      /** Hydration */
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      /** Initial state */
      visitedStars: [],
      openedLetters: [],
      revealUnlocked: false,
      gamesPlayed: 0,
      wonGameIds: [],
      gameCompleted: false,

      /** Actions */

      visitStar: (starId: string) => {
        const { visitedStars } = get();
        if (!visitedStars.includes(starId)) {
          set({ visitedStars: [...visitedStars, starId] });
        }
      },

      openLetter: (letterId: string) => {
        const { openedLetters } = get();
        if (!openedLetters.includes(letterId)) {
          set({ openedLetters: [...openedLetters, letterId] });
        }
      },

      unlockReveal: () => set({ revealUnlocked: true }),

      incrementGamesPlayed: () =>
        set((state) => ({ gamesPlayed: state.gamesPlayed + 1 })),

      recordGameWin: (gameId: string) => {
        const { wonGameIds } = get();
        if (!wonGameIds.includes(gameId)) {
          set({ wonGameIds: [...wonGameIds, gameId], gameCompleted: true });
        }
      },

      setGameCompleted: (val: boolean) => set({ gameCompleted: val }),

      resetProgress: () => {
        set({
          visitedStars: [],
          openedLetters: [],
          revealUnlocked: false,
          gamesPlayed: 0,
          wonGameIds: [],
          gameCompleted: false,
        });
      },

      /** Computed helpers */

      // Access letters page after visiting 3 stars
      canAccessLetters: () => get().visitedStars.length >= 3,

      // Access game page after opening 1 letter
      canAccessGame: () => get().openedLetters.length >= 1,

      // Show hidden star after visiting 5 stars and winning at least 1 game
      canSeeHiddenStar: () =>
        get().visitedStars.length >= 5 && get().wonGameIds.length >= 1,

      // Derived counts
      starsCollected: () => get().visitedStars.length,
      lettersOpenedCount: () => get().openedLetters.length,
    }),
    {
      name: "our-universe-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
