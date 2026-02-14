import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { STARS_DATA, LETTERS_DATA } from '@/utils/constants'
import { calculateProgress } from '@/utils/unlockLogic'

/**
 * Hook to compute and return the user's overall progress and unlock status.
 */
export function useProgress() {
  const visitedStars = useAppStore((s) => s.visitedStars)
  const openedLetters = useAppStore((s) => s.openedLetters)
  const gameCompleted = useAppStore((s) => s.gameCompleted)
  const canAccessLetters = useAppStore((s) => s.canAccessLetters)
  const canAccessGame = useAppStore((s) => s.canAccessGame)
  const canSeeHiddenStar = useAppStore((s) => s.canSeeHiddenStar)

  const progress = useMemo(
    () =>
      calculateProgress(
        visitedStars,
        openedLetters,
        gameCompleted,
        STARS_DATA.length,
        LETTERS_DATA.length
      ),
    [visitedStars, openedLetters, gameCompleted]
  )

  return {
    progress,
    visitedStarsCount: visitedStars.length,
    openedLettersCount: openedLetters.length,
    totalStars: STARS_DATA.length,
    totalLetters: LETTERS_DATA.length,
    gameCompleted,
    canAccessLetters: canAccessLetters(),
    canAccessGame: canAccessGame(),
    canSeeHiddenStar: canSeeHiddenStar(),
  }
}