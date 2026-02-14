// app/universe/page.tsx
"use client";

import React, { useState, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, StarData } from "@/store/useAppStore";
import { useProgress } from "@/hooks/useProgress";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import { STARS_DATA } from "@/utils/constants";

const GalaxyScene = lazy(() => import("@/components/galaxy/GalaxyScene"));

const StarModal: React.FC<{
  star: StarData | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ star, isOpen, onClose }) => {
  if (!star) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong max-w-md w-full p-8 pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10
                           flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

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

              <p className="text-center text-xs text-white/40 mb-2">
                {star.date}
              </p>
              <h2
                className="font-serif text-xl text-center mb-4 font-semibold"
                style={{ color: star.color }}
              >
                {star.title}
              </h2>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4" />

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

export default function UniversePage() {
  const router = useRouter();
  const visitedStars = useAppStore((s) => s.visitedStars);
  const visitStar = useAppStore((s) => s.visitStar);
  const unlockReveal = useAppStore((s) => s.unlockReveal);
  const {
    canAccessLetters,
    canAccessGame,
    canSeeHiddenStar,
    progress,
    visitedStarsCount,
  } = useProgress();

  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    setTimeout(() => setSelectedStar(null), 500);
  }, []);

  const handleHiddenStarClick = useCallback(() => {
    unlockReveal();
    router.push("/reveal");
  }, [unlockReveal, router]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-deep-navy">
      {/* 3D Galaxy */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-soft-white/50 font-serif text-lg"
              >
                Loading the universe...
              </motion.div>
            </div>
          }
        >
          <GalaxyScene
            visitedStars={visitedStars}
            showHiddenStar={canSeeHiddenStar}
            onStarClick={handleStarClick}
            onHiddenStarClick={handleHiddenStarClick}
          />
        </Suspense>
      </div>

      {/* Audio toggle */}
      <AudioPlayer />

      {/* Back to Landing Page - CENTERED */}
      <BackButton to="/" label="Home" position="center" />

      {/* Progress indicator - stays on left */}
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
          {visitedStarsCount} / {STARS_DATA.length} stars visited
        </p>
      </motion.div>

      {/* Bottom navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3"
      >
        <GlowButton
          onClick={() => router.push("/letters")}
          variant="blue"
          size="sm"
          disabled={!canAccessLetters}
        >
          {canAccessLetters
            ? "💌 Letters"
            : `🔒 Visit ${3 - visitedStarsCount} more stars`}
        </GlowButton>

        <GlowButton
          onClick={() => router.push("/game")}
          variant="gold"
          size="sm"
          disabled={!canAccessGame}
        >
          {canAccessGame ? "🎮 Game" : "🔒 Open a letter first"}
        </GlowButton>
      </motion.div>

      {/* Star detail modal */}
      <StarModal
        star={selectedStar}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Interaction hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3 }}
        exit={{ opacity: 0 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.p
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-white/30 text-center"
        >
          Click on the glowing stars • Drag to rotate
        </motion.p>
      </motion.div>
    </div>
  );
}
