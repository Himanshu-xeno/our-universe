"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
import { LETTERS_DATA } from "@/utils/constants";
import { isLetterUnlocked, getLetterUnlockHint } from "@/utils/unlockLogic";
import LetterCard from "@/components/letters/LetterCard";
import LetterModal from "@/components/letters/LetterModal";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";

interface LetterData {
  id: string;
  title: string;
  message: string;
  condition: string;
}

export default function LettersPage() {
  const router = useRouter();

  useRefreshRedirect();

  const visitedStars = useAppStore((s) => s.visitedStars);
  const openedLetters = useAppStore((s) => s.openedLetters);
  const gamesPlayed = useAppStore((s) => s.gamesPlayed);
  const wonGameIds = useAppStore((s) => s.wonGameIds);
  const revealUnlocked = useAppStore((s) => s.revealUnlocked);
  const openLetter = useAppStore((s) => s.openLetter);
  const canAccessLetters = useAppStore((s) => s.canAccessLetters);
  const _hasHydrated = useAppStore((s) => s._hasHydrated);

  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = {
    visitedStars,
    openedLetters,
    gamesPlayed,
    wonGameIds,
    revealUnlocked,
  };

  useEffect(() => {
    if (_hasHydrated && !canAccessLetters()) {
      router.push("/universe");
    }
  }, [_hasHydrated, canAccessLetters, router]);

  const handleLetterClick = useCallback(
    (letter: LetterData) => {
      const unlocked = isLetterUnlocked(letter, {
        visitedStars,
        openedLetters,
        gamesPlayed,
        wonGameIds,
        revealUnlocked,
      });
      if (!unlocked) return;

      openLetter(letter.id);
      setSelectedLetter(letter);
      setModalOpen(true);
    },
    [
      openLetter,
      visitedStars,
      openedLetters,
      gamesPlayed,
      wonGameIds,
      revealUnlocked,
    ],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedLetter(null), 500);
  }, []);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-soft-white/50 font-serif text-lg"
        >
          Loading letters...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-cosmic-purple/30 via-deep-navy to-deep-navy pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-nebula-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-nebula-blue/5 rounded-full blur-3xl pointer-events-none" />

      <AudioPlayer />
      <BackButton to="/universe" label="Universe" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-glow mb-4">
            💌 Letters
          </h1>
          <p className="text-soft-white/50 font-serif italic">
            Words written in starlight, meant only for you
          </p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-nebula-pink/50 to-transparent mx-auto mt-4" />
          <p className="text-white/30 text-xs mt-4">
            {openedLetters.length} / {LETTERS_DATA.length} letters opened
          </p>
        </motion.div>

        <div className="space-y-4 mb-12">
          {LETTERS_DATA.map((letter, index) => {
            const unlocked = isLetterUnlocked(letter, stats);
            const opened = openedLetters.includes(letter.id);
            const hint = getLetterUnlockHint(letter);

            return (
              <LetterCard
                key={letter.id}
                letter={letter}
                isUnlocked={unlocked}
                isOpened={opened}
                onClick={() => handleLetterClick(letter)}
                index={index}
                customHint={hint}
              />
            );
          })}
        </div>
      </div>

      <LetterModal
        letter={selectedLetter}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
