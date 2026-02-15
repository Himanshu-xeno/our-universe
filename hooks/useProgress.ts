import { useAppStore } from "@/store/useAppStore";
import { STARS_DATA, LETTERS_DATA } from "@/utils/constants";

export function useProgress() {
  const visitedStars = useAppStore((s) => s.visitedStars);
  const openedLetters = useAppStore((s) => s.openedLetters);
  const wonGameIds = useAppStore((s) => s.wonGameIds);

  const totalStars = STARS_DATA.length;
  const totalLetters = LETTERS_DATA.length;
  const visitedStarsCount = visitedStars.length;
  const openedLettersCount = openedLetters.length;

  // gameCompleted = true if player has won at least one game
  const gameCompleted = wonGameIds.length >= 1;

  // Progress calculation
  // Stars = 50%, Letters = 25%, Game = 15%, Bonus = 10%
  let progressValue = 0;
  if (totalStars > 0) {
    progressValue += (visitedStarsCount / totalStars) * 50;
  }
  if (totalLetters > 0) {
    progressValue += (openedLettersCount / totalLetters) * 25;
  }
  if (gameCompleted) {
    progressValue += 15;
  }
  if (visitedStarsCount >= 5 && gameCompleted) {
    progressValue += 10;
  }
  const progress = Math.min(100, Math.round(progressValue));

  // Unlock conditions
  const canAccessLetters = visitedStarsCount >= 3;
  const canAccessGame = openedLettersCount >= 1;
  const canSeeHiddenStar = visitedStarsCount >= 5 && gameCompleted;

  return {
    progress,
    visitedStarsCount,
    openedLettersCount,
    totalStars,
    totalLetters,
    gameCompleted,
    canAccessLetters,
    canAccessGame,
    canSeeHiddenStar,
  };
}