"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { LETTERS_DATA } from "@/utils/constants";
import { isLetterUnlocked } from "@/utils/unlockLogic";
import LetterCard from "@/components/letters/LetterCard";
import LetterModal from "@/components/letters/LetterModal";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";
import type { LetterData } from "@/store/useAppStore";

export default function LettersPage() {
  const router = useRouter();
  const visitedStars = useAppStore((s) => s.visitedStars);
  const openedLetters = useAppStore((s) => s.openedLetters);
  const gameCompleted = useAppStore((s) => s.gameCompleted);
  const openLetter = useAppStore((s) => s.openLetter);
  const canAccessLetters = useAppStore((s) => s.canAccessLetters);

  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Redirect if not yet unlocked
  useEffect(() => {
    if (!canAccessLetters()) {
      router.push("/universe");
    }
  }, [canAccessLetters, router]);

  const handleLetterClick = useCallback(
    (letter: LetterData) => {
      openLetter(letter.id);
      setSelectedLetter(letter);
      setModalOpen(true);
    },
    [openLetter],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedLetter(null), 500);
  }, []);

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-cosmic-purple/30 via-deep-navy to-deep-navy pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-nebula-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-nebula-blue/5 rounded-full blur-3xl pointer-events-none" />

      <AudioPlayer />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
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
        </motion.div>

        {/* Letter cards */}
        <div className="space-y-4 mb-12">
          {LETTERS_DATA.map((letter, index) => {
            const unlocked = isLetterUnlocked(
              letter,
              visitedStars,
              gameCompleted,
            );
            const opened = openedLetters.includes(letter.id);

            return (
              <LetterCard
                key={letter.id}
                letter={letter}
                isUnlocked={unlocked}
                isOpened={opened}
                onClick={() => handleLetterClick(letter)}
                index={index}
              />
            );
          })}
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <GlowButton
            onClick={() => router.push("/universe")}
            variant="blue"
            size="sm"
          >
            ← Back to Universe
          </GlowButton>
        </motion.div>
      </div>

      {/* Letter modal */}
      <LetterModal
        letter={selectedLetter}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
