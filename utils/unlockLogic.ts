import { LetterData } from '@/store/useAppStore'

/**
 * Determines whether a specific letter is unlocked based on current progress.
 */
export function isLetterUnlocked(
  letter: LetterData,
  visitedStars: string[],
  gameCompleted: boolean
): boolean {
  switch (letter.unlockType) {
    case 'date': {
      if (!letter.unlockDate) return true
      const unlockDate = new Date(letter.unlockDate)
      return new Date() >= unlockDate
    }
    case 'progress': {
      const required = letter.requiredStars || 0
      return visitedStars.length >= required
    }
    case 'game': {
      return gameCompleted
    }
    default:
      return false
  }
}

/**
 * Returns the unlock hint text for a locked letter.
 */
export function getUnlockHint(letter: LetterData): string {
  switch (letter.unlockType) {
    case 'date':
      return `Unlocks on ${letter.unlockDate}`
    case 'progress':
      return `Visit ${letter.requiredStars} stars to unlock`
    case 'game':
      return 'Complete the game to unlock'
    default:
      return 'Locked'
  }
}

/**
 * Calculate overall progress percentage.
 */
export function calculateProgress(
  visitedStars: string[],
  openedLetters: string[],
  gameCompleted: boolean,
  totalStars: number,
  totalLetters: number
): number {
  const starProgress = (visitedStars.length / totalStars) * 40
  const letterProgress = (openedLetters.length / totalLetters) * 30
  const gameProgress = gameCompleted ? 20 : 0
  const bonusProgress = visitedStars.length >= 5 && gameCompleted ? 10 : 0

  return Math.min(100, Math.round(starProgress + letterProgress + gameProgress + bonusProgress))
}