"use client";

import React, { useState, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, StarData } from "@/store/useAppStore";
import { useProgress } from "@/hooks/useProgress";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import { STARS_DATA } from "@/utils/constants";

// Lazy load the heavy 3D component
const GalaxyScene = lazy(() => import("@/components/galaxy/GalaxyScene"));

// ============================================================================
// LOADING COMPONENT
// ============================================================================
const LoadingScreen: React.FC = () => (
  <div className="w-screen h-screen bg-deep-navy flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-soft-white/50 font-serif text-lg"
      >
        ✨ Preparing your universe...
      </motion.div>
    </motion.div>
  </div>
);

// ============================================================================
// GALAXY LOADING FALLBACK
// ============================================================================
const GalaxyLoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-soft-white/50 font-serif text-lg"
    >
      Loading the stars...
    </motion.div>
  </div>
);

// ============================================================================
// STAR MODAL COMPONENT
// ============================================================================
interface StarModalProps {
  star: StarData | null;
  isOpen: boolean;
  onClose: () => void;
}

const StarModal: React.FC<StarModalProps> = ({ star, isOpen, onClose }) => {
  if (!star) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="star-modal-title"
          >
            <div
              className="glass-strong max-w-md w-full p-8 pointer-events-auto relative rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10
                           flex items-center justify-center hover:bg-white/20 
                           transition-colors focus:outline-none focus:ring-2 
                           focus:ring-white/30"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Star Icon */}
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${star.color}40, transparent)`,
                  boxShadow: `0 0 30px ${star.color}40`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: star.color }}
                />
              </div>

              {/* Date */}
              <p className="text-center text-xs text-white/40 mb-2">
                {star.date}
              </p>

              {/* Title */}
              <h2
                id="star-modal-title"
                className="font-serif text-xl text-center mb-4 font-semibold"
                style={{ color: star.color }}
              >
                {star.title}
              </h2>

              {/* Divider */}
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4" />

              {/* Message */}
              <p className="text-soft-white/80 font-serif text-sm leading-relaxed text-center">
                {star.message}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// PROGRESS INDICATOR COMPONENT
// ============================================================================
interface ProgressIndicatorProps {
  progress: number;
  visitedStarsCount: number;
  totalStars: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  visitedStarsCount,
  totalStars,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
    className="fixed top-4 left-4 z-30 glass px-4 py-3 rounded-xl"
  >
    <p className="text-xs text-white/50 mb-1">Journey Progress</p>
    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-nebula-pink to-nebula-blue rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <p className="text-xs text-white/30 mt-1">
      {visitedStarsCount} / {totalStars} stars visited
    </p>
  </motion.div>
);

// ============================================================================
// BOTTOM NAVIGATION COMPONENT
// ============================================================================
interface BottomNavigationProps {
  canAccessLetters: boolean;
  canAccessGame: boolean;
  visitedStarsCount: number;
  onLettersClick: () => void;
  onGameClick: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  canAccessLetters,
  canAccessGame,
  visitedStarsCount,
  onLettersClick,
  onGameClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3"
  >
    <GlowButton
      onClick={onLettersClick}
      variant="blue"
      size="sm"
      disabled={!canAccessLetters}
    >
      {canAccessLetters
        ? "💌 Letters"
        : `🔒 Visit ${Math.max(0, 3 - visitedStarsCount)} more stars`}
    </GlowButton>

    <GlowButton
      onClick={onGameClick}
      variant="gold"
      size="sm"
      disabled={!canAccessGame}
    >
      {canAccessGame ? "🎮 Game" : "🔒 Open a letter first"}
    </GlowButton>
  </motion.div>
);

// ============================================================================
// INTERACTION HINT COMPONENT
// ============================================================================
const InteractionHint: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    transition={{ delay: 3 }}
    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20"
  >
    <motion.p
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs text-white/30 text-center"
    >
      Click on the glowing stars • Drag to rotate
    </motion.p>
  </motion.div>
);

// ============================================================================
// MAIN UNIVERSE PAGE COMPONENT
// ============================================================================
export default function UniversePage() {
  const router = useRouter();

  // Handle refresh/direct URL access redirect
  useRefreshRedirect();

  // Store state
  const _hasHydrated = useAppStore((s) => s._hasHydrated);
  const visitedStars = useAppStore((s) => s.visitedStars);
  const visitStar = useAppStore((s) => s.visitStar);
  const unlockReveal = useAppStore((s) => s.unlockReveal);

  // Progress tracking
  const {
    canAccessLetters,
    canAccessGame,
    canSeeHiddenStar,
    progress,
    visitedStarsCount,
  } = useProgress();

  // Modal state
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ========== EVENT HANDLERS ==========

  const handleStarClick = useCallback(
    (star: StarData) => {
      visitStar(star.id);
      setSelectedStar(star);
      setModalOpen(true);
    },
    [visitStar],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    // Delay clearing the star data to allow exit animation
    setTimeout(() => setSelectedStar(null), 500);
  }, []);

  const handleHiddenStarClick = useCallback(() => {
    unlockReveal();
    router.push("/reveal");
  }, [unlockReveal, router]);

  const handleLettersClick = useCallback(() => {
    router.push("/letters");
  }, [router]);

  const handleGameClick = useCallback(() => {
    router.push("/game");
  }, [router]);

  // ========== LOADING STATE ==========

  // Show loading screen until store is hydrated
  if (!_hasHydrated) {
    return <LoadingScreen />;
  }

  // ========== MAIN RENDER ==========

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-deep-navy">
      {/* 3D Galaxy Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<GalaxyLoadingFallback />}>
          <GalaxyScene
            visitedStars={visitedStars}
            showHiddenStar={canSeeHiddenStar}
            onStarClick={handleStarClick}
            onHiddenStarClick={handleHiddenStarClick}
          />
        </Suspense>
      </div>

      {/* Audio Player */}
      <AudioPlayer />

      {/* Back Button */}
      <BackButton to="/" label="Home" position="center" />

      {/* Progress Indicator */}
      <ProgressIndicator
        progress={progress}
        visitedStarsCount={visitedStarsCount}
        totalStars={STARS_DATA.length}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        canAccessLetters={canAccessLetters}
        canAccessGame={canAccessGame}
        visitedStarsCount={visitedStarsCount}
        onLettersClick={handleLettersClick}
        onGameClick={handleGameClick}
      />

      {/* Star Detail Modal */}
      <StarModal
        star={selectedStar}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Interaction Hint */}
      <InteractionHint />
    </div>
  );
}
