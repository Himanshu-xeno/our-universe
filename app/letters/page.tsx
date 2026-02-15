"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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

// ═══════════════════════════════════════════════════════════
// FLOATING HEARTS COMPONENT
// ═══════════════════════════════════════════════════════════
const FloatingHearts: React.FC = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    size: 10 + Math.random() * 15,
    opacity: 0.1 + Math.random() * 0.15,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: "100vh", x: `${heart.x}vw`, opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, heart.opacity, heart.opacity, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-pink-400"
          style={{ fontSize: heart.size }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TWINKLING STARS BACKGROUND
// ═══════════════════════════════════════════════════════════
const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }

    const stars: Star[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.7,
      speed: 0.5 + Math.random() * 2,
    }));

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed) * 0.3 + 0.7;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

// ═══════════════════════════════════════════════════════════
// MAIN LETTERS PAGE
// ═══════════════════════════════════════════════════════════
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
      <div className="min-h-screen bg-[#0c0515] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/50 font-serif text-lg"
        >
          Loading letters...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ═══ Background Gradient ═══ */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255, 107, 157, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(167, 139, 250, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 70%),
            linear-gradient(180deg, #0c0515 0%, #1a0a2e 50%, #0f0720 100%)
          `,
        }}
      />

      {/* ═══ Stars ═══ */}
      <StarsBackground />

      {/* ═══ Floating Hearts ═══ */}
      <FloatingHearts />

      {/* ═══ Ambient Glow Orbs ═══ */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,157,0.25) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ═══ Audio Player ═══ */}
      <AudioPlayer />

      {/* ═══ Back Button - Goes to Universe ═══ */}
      <BackButton href="/universe" label="Universe" />

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Decorative Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-6xl"
            >
              💌
            </motion.span>
          </motion.div>

          {/* Title */}
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, #fff 0%, #fda4af 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 60px rgba(255,107,157,0.3)",
            }}
          >
            Love Letters
          </h1>

          {/* Subtitle */}
          <p className="text-white/40 font-serif italic text-lg mb-4">
            Words written in starlight, meant only for you
          </p>

          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center justify-center gap-4 my-6"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-pink-400/60 text-sm"
            >
              ♥
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
          </motion.div>

          {/* Progress Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,107,157,0.1)",
              border: "1px solid rgba(255,107,157,0.2)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-pink-400"
            />
            <span className="text-pink-300/80 text-sm">
              {openedLetters.length} / {LETTERS_DATA.length} letters opened
            </span>
          </motion.div>
        </motion.div>

        {/* Letters List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-12"
        >
          {LETTERS_DATA.map((letter, index) => {
            const unlocked = isLetterUnlocked(letter, stats);
            const opened = openedLetters.includes(letter.id);
            const hint = getLetterUnlockHint(letter);

            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
              >
                <LetterCard
                  letter={letter}
                  isUnlocked={unlocked}
                  isOpened={opened}
                  onClick={() => handleLetterClick(letter)}
                  index={index}
                  customHint={hint}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center justify-center gap-3 pb-8"
        >
          <motion.span
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-pink-400/30"
          >
            ✦
          </motion.span>
          <span className="text-white/20 text-xs tracking-[0.2em] uppercase">
            Forever & Always
          </span>
          <motion.span
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="text-pink-400/30"
          >
            ✦
          </motion.span>
        </motion.div>
      </div>

      {/* Letter Modal */}
      <LetterModal
        letter={selectedLetter}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
