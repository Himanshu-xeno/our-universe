"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import GlowButton from "@/components/ui/GlowButton";

/**
 * Confetti burst effect
 */
const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<
    {
      id: number;
      x: number;
      color: string;
      delay: number;
      duration: number;
      size: number;
    }[]
  >([]);

  useEffect(() => {
    if (!active) return;

    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#ff6b9d", "#4ecdc4", "#ffd700", "#7b68ee", "#ff9a56", "#e056ff"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
    }));

    setPieces(newPieces);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="confetti-piece rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Particle background for the reveal page
 */
const RevealParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      targetOpacity: number;
      color: string;
    }

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: 0,
      targetOpacity: Math.random() * 0.6 + 0.2,
      color: ["#ff6b9d", "#4ecdc4", "#ffd700", "#ffffff"][
        Math.floor(Math.random() * 4)
      ],
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Slow fade in
        p.opacity += (p.targetOpacity - p.opacity) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Glow
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * 0.1;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default function RevealPage() {
  const router = useRouter();
  const revealUnlocked = useAppStore((s) => s.revealUnlocked);
  const [stage, setStage] = useState(0); // 0: black, 1: particles, 2: text, 3: message, 4: confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect if not unlocked
  useEffect(() => {
    if (!revealUnlocked) {
      router.push("/universe");
      return;
    }

    // Cinematic sequence timing
    const timers = [
      setTimeout(() => setStage(1), 1500), // Particles fade in
      setTimeout(() => setStage(2), 3500), // Text appears
      setTimeout(() => setStage(3), 6000), // Full message
      setTimeout(() => {
        setStage(4);
        setShowConfetti(true);
      }, 9000), // Confetti
    ];

    return () => timers.forEach(clearTimeout);
  }, [revealUnlocked, router]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Particles background */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <RevealParticles />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient glow pulse */}
      {stage >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0.05, 0.15] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,107,157,0.2) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Main reveal text */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl text-glow mb-8 leading-tight"
            >
              You are my
              <br />
              <span className="text-nebula-pink">entire universe</span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Detailed message */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="space-y-4 mb-12"
            >
              <p className="font-serif text-lg md:text-xl text-soft-white/70 italic leading-relaxed">
                Every star we visited together, every letter written in the
                dark, every obstacle we overcame — they were all leading here.
              </p>
              <p className="font-serif text-lg md:text-xl text-soft-white/70 italic leading-relaxed">
                To this moment. To us. To a love that the universe itself
                conspired to create.
              </p>
              <p className="font-serif text-xl md:text-2xl text-nebula-pink text-glow mt-6">
                This is not the end. This is where forever begins. ✦
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final button */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-4"
            >
              <GlowButton
                onClick={() => router.push("/universe")}
                variant="pink"
                size="lg"
              >
                Return to Our Universe 🌌
              </GlowButton>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2 }}
                className="text-xs text-white/20 mt-4"
              >
                Made with infinite love ♾️
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
