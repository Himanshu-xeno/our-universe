"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import GlowButton from "@/components/ui/GlowButton";

import GameCanvas from "@/components/game/GameCanvas";
import StarCatcherCanvas from "@/components/game/StarCatcherCanvas";
import MemoryCanvas from "@/components/game/MemoryCanvas";
import CipherCanvas from "@/components/game/CipherCanvas";
import SyncCanvas from "@/components/game/SyncCanvas";

type GameType = "journey" | "catcher" | "memory" | "cipher" | "sync" | null;

const GameCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  onPlay: () => void;
}> = ({ title, description, icon, color, difficulty, onPlay }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group cursor-pointer h-full flex flex-col"
    onClick={onPlay}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
      style={{
        background: `radial-gradient(circle at center, ${color}, transparent)`,
      }}
    />
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{icon}</div>
        <span
          className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${difficulty === "Easy" ? "text-green-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}
        >
          {difficulty}
        </span>
      </div>
      <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
      <button
        className="w-full py-2 rounded-lg font-medium text-sm transition-all"
        style={{ backgroundColor: `${color}40`, border: `1px solid ${color}` }}
      >
        Play Game
      </button>
    </div>
  </motion.div>
);

export default function GameHubPage() {
  const router = useRouter();
  useRefreshRedirect();
  const { canAccessGame, completeGame } = useAppStore();
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (!canAccessGame()) router.push("/universe");
  }, [canAccessGame, router]);

  const handleWin = () => {
    setGameWon(true);
    completeGame();
  };
  const handleBack = () => {
    setActiveGame(null);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      <AudioPlayer />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {activeGame ? (
        <button
          onClick={handleBack}
          className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full cursor-pointer"
        >
          ← Exit Game
        </button>
      ) : (
        <BackButton to="/universe" label="Universe" />
      )}

      <AnimatePresence mode="wait">
        {!activeGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-6xl mx-auto px-6 py-20"
          >
            <div className="text-center mb-16">
              <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
                Cosmic Arcade
              </h1>
              <p className="text-soft-white/60 text-lg">
                Select a challenge to prove your love.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              <GameCard
                title="Cosmic Journey"
                description="Guide your heart through the asteroid field."
                icon="🚀"
                color="#4ecdc4"
                difficulty="Hard"
                onPlay={() => setActiveGame("journey")}
              />
              <GameCard
                title="Star Catcher"
                description="Catch 100 falling hearts. Speed test."
                icon="💖"
                color="#ff6b9d"
                difficulty="Easy"
                onPlay={() => setActiveGame("catcher")}
              />
              <GameCard
                title="Memory of Us"
                description="Find matching celestial pairs."
                icon="🎴"
                color="#7b68ee"
                difficulty="Medium"
                onPlay={() => setActiveGame("memory")}
              />
              <GameCard
                title="Love Cipher"
                description="Unscramble the secret words."
                icon="🧩"
                color="#feca57"
                difficulty="Medium"
                onPlay={() => setActiveGame("cipher")}
              />
              <GameCard
                title="Heart Sync"
                description="Tap exactly when the rings overlap."
                icon="💓"
                color="#ff9ff3"
                difficulty="Easy"
                onPlay={() => setActiveGame("sync")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-4 md:p-8"
          >
            {gameWon && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-8 rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-serif text-white mb-2">
                    Victory!
                  </h2>
                  <p className="text-white/50 mb-6">
                    You've unlocked a secret letter.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <GlowButton onClick={handleBack} variant="gold" size="sm">
                      Arcade Menu
                    </GlowButton>
                    <GlowButton
                      onClick={() => router.push("/letters")}
                      variant="blue"
                      size="sm"
                    >
                      Read Letter
                    </GlowButton>
                  </div>
                </motion.div>
              </div>
            )}
            <div className="w-full h-full max-w-5xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
              {activeGame === "journey" && <GameCanvas onWin={handleWin} />}
              {activeGame === "catcher" && (
                <StarCatcherCanvas onWin={handleWin} />
              )}
              {activeGame === "memory" && <MemoryCanvas onWin={handleWin} />}
              {activeGame === "cipher" && <CipherCanvas onWin={handleWin} />}
              {activeGame === "sync" && (
                <div className="w-[300px] h-[300px]">
                  <SyncCanvas onWin={handleWin} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
