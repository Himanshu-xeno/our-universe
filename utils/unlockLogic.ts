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