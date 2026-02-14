"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import GameCanvas from "@/components/game/GameCanvas";

export default function GamePage() {
  const router = useRouter();
  const completeGame = useAppStore((s) => s.completeGame);
  const canAccessGame = useAppStore((s) => s.canAccessGame);
  const [showIntro, setShowIntro] = useState(true);

  // Redirect if not yet unlocked
  useEffect(() => {
    if (!canAccessGame()) {
      router.push("/universe");
    }
  }, [canAccessGame, router]);

  const handleWin = useCallback(() => {
    completeGame();
    setTimeout(() => {
      router.push("/universe");
    }, 1000);
  }, [completeGame, router]);

  const startGame = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className="w-screen h-screen bg-deep-navy overflow-hidden relative">
      {/* Game intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 bg-deep-navy/95 flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl md:text-5xl text-glow mb-6"
            >
              🎮 The Journey
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="glass max-w-md p-6 rounded-2xl mb-8"
            >
              <p className="text-soft-white/70 mb-4 font-serif italic">
                "Love is not a destination — it is the courage to keep moving
                toward each other."
              </p>
              <div className="space-y-2 text-left text-sm text-white/50">
                <p>💕 Guide the heart to reach your person</p>
                <p>
                  ✨ Collect <span className="text-nebula-blue">Trust</span>,{" "}
                  <span className="text-star-gold">Patience</span>, and{" "}
                  <span className="text-purple-400">Communication</span>
                </p>
                <p>
                  🚫 Avoid <span className="text-red-400">Ego</span>,{" "}
                  <span className="text-red-400">Distance</span>, and{" "}
                  <span className="text-red-400">Overthinking</span>
                </p>
                <p className="mt-3 text-white/40">
                  {typeof window !== "undefined" && "ontouchstart" in window
                    ? "Drag to move"
                    : "Arrow keys or WASD to move"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-600 to-rose-500 px-10 py-4 rounded-full
                           text-white font-medium text-lg
                           hover:shadow-[0_0_30px_rgba(255,107,157,0.5)] transition-shadow
                           active:scale-95 transform"
              >
                Begin ✦
              </button>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.2 }}
              onClick={() => router.push("/universe")}
              className="mt-6 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              ← Back to universe
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game canvas */}
      {!showIntro && <GameCanvas onWin={handleWin} />}
    </div>
  );
}
