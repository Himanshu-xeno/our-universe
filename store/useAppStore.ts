// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// /** Types for the application state */
// export interface StarData {
//   id: string
//   title: string
//   date: string
//   message: string
//   color: string
//   position: [number, number, number]
//   image?: string
// }

// export interface LetterData {
//   id: string
//   title: string
//   message: string
//   unlockType: 'date' | 'progress' | 'game'
//   unlockDate?: string
//   requiredStars?: number
//   requiresGame?: boolean
// }

// interface AppState {
//   // Progress tracking
//   visitedStars: string[]
//   openedLetters: string[]
//   gameCompleted: boolean
//   revealUnlocked: boolean
//   hasEnteredUniverse: boolean
//   audioEnabled: boolean

//   // Actions
//   visitStar: (starId: string) => void
//   openLetter: (letterId: string) => void
//   completeGame: () => void
//   unlockReveal: () => void
//   setHasEnteredUniverse: (value: boolean) => void
//   toggleAudio: () => void
//   resetProgress: () => void

//   // Computed helpers
//   canAccessLetters: () => boolean
//   canAccessGame: () => boolean
//   canSeeHiddenStar: () => boolean
// }

// export const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({
//       // Initial state
//       visitedStars: [],
//       openedLetters: [],
//       gameCompleted: false,
//       revealUnlocked: false,
//       hasEnteredUniverse: false,
//       audioEnabled: false,

//       // Visit a star (add to visited list if not already there)
//       visitStar: (starId: string) => {
//         const { visitedStars } = get()
//         if (!visitedStars.includes(starId)) {
//           set({ visitedStars: [...visitedStars, starId] })
//         }
//       },

//       // Open a letter
//       openLetter: (letterId: string) => {
//         const { openedLetters } = get()
//         if (!openedLetters.includes(letterId)) {
//           set({ openedLetters: [...openedLetters, letterId] })
//         }
//       },

//       // Complete the mini game
//       completeGame: () => {
//         set({ gameCompleted: true })
//       },

//       // Unlock the final reveal
//       unlockReveal: () => {
//         set({ revealUnlocked: true })
//       },

//       // Mark that user has entered the universe
//       setHasEnteredUniverse: (value: boolean) => {
//         set({ hasEnteredUniverse: value })
//       },

//       // Toggle background audio
//       toggleAudio: () => {
//         set({ audioEnabled: !get().audioEnabled })
//       },

//       // Reset all progress
//       resetProgress: () => {
//         set({
//           visitedStars: [],
//           openedLetters: [],
//           gameCompleted: false,
//           revealUnlocked: false,
//           hasEnteredUniverse: false,
//         })
//       },

//       // Letters page unlocks after visiting 3 stars
//       canAccessLetters: () => {
//         return get().visitedStars.length >= 3
//       },

//       // Game unlocks after opening at least 1 letter
//       canAccessGame: () => {
//         return get().openedLetters.length >= 1
//       },

//       // Hidden star appears when 5+ stars visited AND game completed
//       canSeeHiddenStar: () => {
//         const { visitedStars, gameCompleted } = get()
//         return visitedStars.length >= 5 && gameCompleted
//       },
//     }),
//     {
//       name: 'our-universe-progress',
//     }
//   )
// )

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Types for the application state */
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
  unlockType: "date" | "progress" | "game";
  unlockDate?: string;
  requiredStars?: number;
  requiresGame?: boolean;
}

interface AppState {
  // Hydration flag
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Progress tracking
  visitedStars: string[];
  openedLetters: string[];
  gameCompleted: boolean;
  revealUnlocked: boolean;
  hasEnteredUniverse: boolean;
  audioEnabled: boolean;

  // Actions
  visitStar: (starId: string) => void;
  openLetter: (letterId: string) => void;
  completeGame: () => void;
  unlockReveal: () => void;
  setHasEnteredUniverse: (value: boolean) => void;
  toggleAudio: () => void;
  resetProgress: () => void;

  // Computed helpers
  canAccessLetters: () => boolean;
  canAccessGame: () => boolean;
  canSeeHiddenStar: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Initial state
      visitedStars: [],
      openedLetters: [],
      gameCompleted: false,
      revealUnlocked: false,
      hasEnteredUniverse: false,
      audioEnabled: false,

      // Visit a star
      visitStar: (starId: string) => {
        const { visitedStars } = get();
        if (!visitedStars.includes(starId)) {
          set({ visitedStars: [...visitedStars, starId] });
        }
      },

      // Open a letter
      openLetter: (letterId: string) => {
        const { openedLetters } = get();
        if (!openedLetters.includes(letterId)) {
          set({ openedLetters: [...openedLetters, letterId] });
        }
      },

      completeGame: () => {
        set({ gameCompleted: true });
      },

      unlockReveal: () => {
        set({ revealUnlocked: true });
      },

      setHasEnteredUniverse: (value: boolean) => {
        set({ hasEnteredUniverse: value });
      },

      toggleAudio: () => {
        set({ audioEnabled: !get().audioEnabled });
      },

      resetProgress: () => {
        set({
          visitedStars: [],
          openedLetters: [],
          gameCompleted: false,
          revealUnlocked: false,
          hasEnteredUniverse: false,
        });
      },

      canAccessLetters: () => {
        return get().visitedStars.length >= 3;
      },

      canAccessGame: () => {
        return get().openedLetters.length >= 1;
      },

      canSeeHiddenStar: () => {
        const { visitedStars, gameCompleted } = get();
        return visitedStars.length >= 5 && gameCompleted;
      },
    }),
    {
      name: "our-universe-progress",

      // 🔥 THIS FIXES HYDRATION
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
