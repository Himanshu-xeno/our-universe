// // import { LetterData } from '@/store/useAppStore'

// // /**
// //  * Determines whether a specific letter is unlocked based on current progress.
// //  */
// // export function isLetterUnlocked(
// //   letter: LetterData,
// //   visitedStars: string[],
// //   gameCompleted: boolean
// // ): boolean {
// //   switch (letter.unlockType) {
// //     case 'date': {
// //       if (!letter.unlockDate) return true
// //       const unlockDate = new Date(letter.unlockDate)
// //       return new Date() >= unlockDate
// //     }
// //     case 'progress': {
// //       const required = letter.requiredStars || 0
// //       return visitedStars.length >= required
// //     }
// //     case 'game': {
// //       return gameCompleted
// //     }
// //     default:
// //       return false
// //   }
// // }

// // /**
// //  * Returns the unlock hint text for a locked letter.
// //  */
// // export function getUnlockHint(letter: LetterData): string {
// //   switch (letter.unlockType) {
// //     case 'date':
// //       return `Unlocks on ${letter.unlockDate}`
// //     case 'progress':
// //       return `Visit ${letter.requiredStars} stars to unlock`
// //     case 'game':
// //       return 'Complete the game to unlock'
// //     default:
// //       return 'Locked'
// //   }
// // }

// // /**
// //  * Calculate overall progress percentage.
// //  */
// // export function calculateProgress(
// //   visitedStars: string[],
// //   openedLetters: string[],
// //   gameCompleted: boolean,
// //   totalStars: number,
// //   totalLetters: number
// // ): number {
// //   const starProgress = (visitedStars.length / totalStars) * 40
// //   const letterProgress = (openedLetters.length / totalLetters) * 30
// //   const gameProgress = gameCompleted ? 20 : 0
// //   const bonusProgress = visitedStars.length >= 5 && gameCompleted ? 10 : 0

// //   return Math.min(100, Math.round(starProgress + letterProgress + gameProgress + bonusProgress))
// // }

// import { LetterData } from '@/store/useAppStore';
// import { STARS_DATA } from '@/utils/constants';

// interface GameStats {
//   visitedStars: string[];
//   openedLetters: string[];
//   gamesPlayed: number;
//   wonGameIds: string[];
//   revealUnlocked: boolean;
// }

// /** Check if a letter is unlocked */
// export const isLetterUnlocked = (letter: LetterData, stats: GameStats): boolean => {
//   switch (letter.condition) {
//     case 'default': return true;
//     case 'visit_3_stars': return stats.visitedStars.length >= 3;
//     case 'visit_5_stars': return stats.visitedStars.length >= 5;
//     case 'visit_all_stars': return stats.visitedStars.length >= STARS_DATA.length;
//     case 'play_1_game': return stats.gamesPlayed >= 1;
//     case 'win_3_games': return stats.wonGameIds.length >= 3;
//     case 'find_hidden_star': return stats.revealUnlocked;
//     case 'open_5_letters': return stats.openedLetters.length >= 5;
//     default: return false;
//   }
// };

// /** Get hint text for letters */
// export const getLetterUnlockHint = (letter: LetterData): string => {
//   switch (letter.condition) {
//     case 'visit_3_stars': return "Visit 3 stars to unlock";
//     case 'visit_5_stars': return "Visit 5 stars to unlock";
//     case 'visit_all_stars': return "Visit every star in the sky";
//     case 'play_1_game': return "Play a game in the Arcade";
//     case 'win_3_games': return "Win 3 different games";
//     case 'find_hidden_star': return "Find the hidden secret";
//     case 'open_5_letters': return "Read 5 other letters first";
//     default: return "Locked";
//   }
// };

// /** Check if a game is unlocked */
// export const isGameUnlocked = (gameId: string, stats: GameStats): boolean => {
//   switch (gameId) {
//     case 'catcher': return true;
//     case 'sync': return true;
//     case 'memory': return stats.visitedStars.length >= 5;
//     case 'cipher': return stats.openedLetters.length >= 3;
//     case 'journey': return stats.wonGameIds.length >= 1;
//     default: return false;
//   }
// };

// /** Get hint text for games */
// export const getGameUnlockHint = (gameId: string): string => {
//   switch (gameId) {
//     case 'memory': return "Visit 5 stars to unlock";
//     case 'cipher': return "Open 3 letters to unlock";
//     case 'journey': return "Win 1 game to unlock";
//     default: return "Locked";
//   }
// };




// import { LetterData } from '@/store/useAppStore';
// import { STARS_DATA } from '@/utils/constants';

// interface GameStats {
//   visitedStars: string[];
//   openedLetters: string[];
//   gamesPlayed: number;
//   wonGameIds: string[];
//   revealUnlocked: boolean;
// }

// // === LETTER LOCKING LOGIC ===
// export const isLetterUnlocked = (letter: LetterData, stats: GameStats): boolean => {
//   switch (letter.condition) {
//     case 'default': return true;
//     case 'visit_3_stars': return stats.visitedStars.length >= 3;
//     case 'visit_5_stars': return stats.visitedStars.length >= 5;
//     case 'visit_all_stars': return stats.visitedStars.length >= STARS_DATA.length;
//     case 'play_1_game': return stats.gamesPlayed >= 1;
//     case 'win_3_games': return stats.wonGameIds.length >= 3;
//     case 'find_hidden_star': return stats.revealUnlocked;
//     case 'open_5_letters': return stats.openedLetters.length >= 5;
//     default: return false;
//   }
// };

// export const getLetterUnlockHint = (letter: LetterData): string => {
//   switch (letter.condition) {
//     case 'visit_3_stars': return "Visit 3 stars to unlock";
//     case 'visit_5_stars': return "Visit 5 stars to unlock";
//     case 'visit_all_stars': return "Visit every star in the sky";
//     case 'play_1_game': return "Play a game in the Arcade";
//     case 'win_3_games': return "Win 3 different games";
//     case 'find_hidden_star': return "Find the hidden secret";
//     case 'open_5_letters': return "Read 5 other letters first";
//     default: return "Locked";
//   }
// };

// // === GAME LOCKING LOGIC ===
// export const isGameUnlocked = (gameId: string, stats: GameStats): boolean => {
//   switch (gameId) {
//     case 'catcher': return true; // Default unlocked
//     case 'sync': return true;    // Default unlocked
//     case 'memory': return stats.visitedStars.length >= 5;
//     case 'cipher': return stats.openedLetters.length >= 3;
//     case 'journey': return stats.wonGameIds.length >= 1;
//     default: return false;
//   }
// };

// export const getGameUnlockHint = (gameId: string): string => {
//   switch (gameId) {
//     case 'memory': return "Visit 5 stars to unlock";
//     case 'cipher': return "Open 3 letters to unlock";
//     case 'journey': return "Win 1 game to unlock";
//     default: return "Locked";
//   }
// };






// import { LetterData } from '@/store/useAppStore';
// import { STARS_DATA } from '@/utils/constants';

// interface GameStats {
//   visitedStars: string[];
//   openedLetters: string[];
//   gamesPlayed: number;
//   wonGameIds: string[];
//   revealUnlocked: boolean;
// }

// /** Check if a letter is unlocked */
// export const isLetterUnlocked = (letter: LetterData, stats: GameStats): boolean => {
//   switch (letter.condition) {
//     case 'default': return true;
//     case 'visit_3_stars': return stats.visitedStars.length >= 3;
//     case 'visit_5_stars': return stats.visitedStars.length >= 5;
//     case 'visit_all_stars': return stats.visitedStars.length >= STARS_DATA.length;
//     case 'play_1_game': return stats.gamesPlayed >= 1;
//     case 'win_3_games': return stats.wonGameIds.length >= 3;
//     case 'find_hidden_star': return stats.revealUnlocked;
//     case 'open_5_letters': return stats.openedLetters.length >= 5;
//     default: return false;
//   }
// };

// /** Get hint text for letters */
// export const getLetterUnlockHint = (letter: LetterData): string => {
//   switch (letter.condition) {
//     case 'visit_3_stars': return "Visit 3 stars to unlock";
//     case 'visit_5_stars': return "Visit 5 stars to unlock";
//     case 'visit_all_stars': return "Visit every star in the sky";
//     case 'play_1_game': return "Play a game in the Arcade";
//     case 'win_3_games': return "Win 3 different games";
//     case 'find_hidden_star': return "Find the hidden secret";
//     case 'open_5_letters': return "Read 5 other letters first";
//     default: return "Locked";
//   }
// };

// /** Check if a game is unlocked */
// export const isGameUnlocked = (gameId: string, stats: GameStats): boolean => {
//   switch (gameId) {
//     case 'catcher': return true; // Default unlocked
//     case 'sync': return true;    // Default unlocked
//     case 'memory': return stats.visitedStars.length >= 5;
//     case 'cipher': return stats.openedLetters.length >= 3;
//     case 'journey': return stats.wonGameIds.length >= 1;
//     default: return false;
//   }
// };

// /** Get hint text for games */
// export const getGameUnlockHint = (gameId: string): string => {
//   switch (gameId) {
//     case 'memory': return "Visit 5 stars to unlock";
//     case 'cipher': return "Open 3 letters to unlock";
//     case 'journey': return "Win 1 game to unlock";
//     default: return "Locked";
//   }
// };




// import { LetterData } from '@/store/useAppStore';
// import { STARS_DATA } from '@/utils/constants';

// interface GameStats {
//   visitedStars: string[];
//   openedLetters: string[];
//   gamesPlayed: number;
//   wonGameIds: string[];
//   revealUnlocked: boolean;
// }

// /** Check if a letter is unlocked */
// export const isLetterUnlocked = (letter: LetterData, stats: GameStats): boolean => {
//   switch (letter.condition) {
//     case 'default': return true;
//     case 'visit_3_stars': return stats.visitedStars.length >= 3;
//     case 'visit_5_stars': return stats.visitedStars.length >= 5;
//     case 'visit_all_stars': return stats.visitedStars.length >= STARS_DATA.length;
//     case 'play_1_game': return stats.gamesPlayed >= 1;
//     case 'win_3_games': return stats.wonGameIds.length >= 3;
//     case 'find_hidden_star': return stats.revealUnlocked;
//     case 'open_5_letters': return stats.openedLetters.length >= 5;
//     default: return false;
//   }
// };

// /** Get hint text for letters */
// export const getLetterUnlockHint = (letter: LetterData): string => {
//   switch (letter.condition) {
//     case 'visit_3_stars': return "Visit 3 stars to unlock";
//     case 'visit_5_stars': return "Visit 5 stars to unlock";
//     case 'visit_all_stars': return "Visit every star in the sky";
//     case 'play_1_game': return "Play a game in the Arcade";
//     case 'win_3_games': return "Win 3 different games";
//     case 'find_hidden_star': return "Find the hidden secret";
//     case 'open_5_letters': return "Read 5 other letters first";
//     default: return "Locked";
//   }
// };

// /** Check if a game is unlocked */
// export const isGameUnlocked = (gameId: string, stats: GameStats): boolean => {
//   switch (gameId) {
//     case 'catcher': return true; // Default unlocked
//     case 'sync': return true;    // Default unlocked
//     //case 'memory': return stats.visitedStars.length >= 5;
//     case 'jump': return stats.visitedStars.length >= 5; // Replaces 'memory'
//     case 'cipher': return stats.openedLetters.length >= 3;
//     case 'journey': return stats.wonGameIds.length >= 1;
//     default: return false;
//   }
// };

// /** Get hint text for games */
// export const getGameUnlockHint = (gameId: string): string => {
//   switch (gameId) {
//     //case 'memory': return "Visit 5 stars to unlock";
//     case 'jump': return "Visit 5 stars to unlock"; // Replaces 'memory'
//     case 'cipher': return "Open 3 letters to unlock";
//     case 'journey': return "Win 1 game to unlock";
//     default: return "Locked";
//   }
// };


import { LetterData } from '@/store/useAppStore';
import { STARS_DATA } from '@/utils/constants';

interface GameStats {
  visitedStars: string[];
  openedLetters: string[];
  gamesPlayed: number;
  wonGameIds: string[];
  revealUnlocked: boolean;
}

/** Check if a letter is unlocked */
export const isLetterUnlocked = (letter: LetterData, stats: GameStats): boolean => {
  switch (letter.condition) {
    case 'default': return true;
    case 'visit_3_stars': return stats.visitedStars.length >= 3;
    case 'visit_5_stars': return stats.visitedStars.length >= 5;
    case 'visit_all_stars': return stats.visitedStars.length >= STARS_DATA.length;
    case 'play_1_game': return stats.gamesPlayed >= 1;
    case 'win_3_games': return stats.wonGameIds.length >= 3;
    case 'find_hidden_star': return stats.revealUnlocked;
    case 'open_5_letters': return stats.openedLetters.length >= 5;
    default: return false;
  }
};

/** Get hint text for letters */
export const getLetterUnlockHint = (letter: LetterData): string => {
  switch (letter.condition) {
    case 'visit_3_stars': return "Visit 3 stars to unlock";
    case 'visit_5_stars': return "Visit 5 stars to unlock";
    case 'visit_all_stars': return "Visit every star in the sky";
    case 'play_1_game': return "Play a game in the Arcade";
    case 'win_3_games': return "Win 3 different games";
    case 'find_hidden_star': return "Find the hidden secret";
    case 'open_5_letters': return "Read 5 other letters first";
    default: return "Locked";
  }
};

/** Check if a game is unlocked */
export const isGameUnlocked = (gameId: string, stats: GameStats): boolean => {
  switch (gameId) {
    case 'catcher': return true; // Default unlocked
    case 'sync': return true;    // Default unlocked
    case 'jump': return stats.visitedStars.length >= 5; // Replaces Memory
    case 'cipher': return stats.openedLetters.length >= 3;
    case 'journey': return stats.wonGameIds.length >= 1;
    default: return false;
  }
};

/** Get hint text for games */
export const getGameUnlockHint = (gameId: string): string => {
  switch (gameId) {
    case 'jump': return "Visit 5 stars to unlock";
    case 'cipher': return "Open 3 letters to unlock";
    case 'journey': return "Win 1 game to unlock";
    default: return "Locked";
  }
};