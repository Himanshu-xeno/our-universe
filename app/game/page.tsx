"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
import { isGameUnlocked, getGameUnlockHint } from "@/utils/unlockLogic";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import GlowButton from "@/components/ui/GlowButton";

import GameCanvas from "@/components/game/GameCanvas";
import StarCatcherCanvas from "@/components/game/StarCatcherCanvas";
import JumperCanvas from "@/components/game/JumperCanvas";
import CipherCanvas from "@/components/game/CipherCanvas";
import SyncCanvas from "@/components/game/SyncCanvas";

type GameType = "journey" | "catcher" | "jump" | "cipher" | "sync" | null;
type Difficulty = "Easy" | "Medium" | "Hard";

const GAME_DETAILS: Record<
  Exclude<GameType, null>,
  {
    title: string;
    desc: string;
    rules: string;
    icon: string;
    color: string;
    cardDesc: string;
    cardDifficulty: string;
  }
> = {
  journey: {
    title: "Cosmic Journey",
    desc: "Navigate through an asteroid field of doubts and fears. Collect trust, hope, and love to reach your destination.",
    rules:
      "Use W / A / S / D keys to move (W = up, A = left, S = down, D = right).\nArrow Keys (↑ ↓ ← →) also work for movement.\nOn mobile, touch and drag in any direction.\nAvoid the rotating obstacles — they reset your position!\nCollect all glowing items (Trust, Hope, Love...).\nOnce all items are collected, reach the pink Goal at the top.\nEach level has more obstacles, faster speeds, and less time.\n9 levels across Easy, Medium, and Hard.\nComplete all levels to conquer the cosmos!",
    icon: "🚀",
    color: "#4ecdc4",
    cardDesc: "9 levels of cosmic navigation. The ultimate test.",
    cardDifficulty: "Hard",
  },
  catcher: {
    title: "Star Catcher",
    desc: "Stars are falling from the sky! Move your astronaut to catch them before they vanish into the void.",
    rules:
      "Move your mouse or drag on mobile to control the Astronaut.\nCatch falling stars by moving under them.\nGolden stars give normal points. Blue bonus stars give extra!\nBuild combos by catching stars quickly for multiplied points.\nReach the target score before time runs out.\n9 levels with increasing speed, targets, and shorter timers.\nComplete all levels to master the stars!",
    icon: "⭐",
    color: "#ff6b9d",
    cardDesc: "9 levels of star catching. Combo your way to victory!",
    cardDifficulty: "Easy",
  },
  jump: {
    title: "Moon Jump",
    desc: "Pilot your rocket through a field of falling cosmic orbs. Catch the golden ones, dodge the bombs!",
    rules:
      "Move mouse or finger left/right to steer the rocket.\nCatch golden orbs for points. Blue orbs give bonus points!\nAvoid red bomb orbs on higher levels — they subtract points.\nThe rocket tilts based on your movement direction.\nReach the target score before the timer ends.\n9 levels from easy orbits to impossible black holes.\nComplete all levels to conquer the moon!",
    icon: "🌑",
    color: "#7b68ee",
    cardDesc: "9 levels of rocket piloting. Dodge bombs, catch orbs!",
    cardDifficulty: "Medium",
  },
  cipher: {
    title: "Love Cipher",
    desc: "Encrypted words of love, space, and philosophy are waiting to be decoded. Can you unscramble them all?",
    rules:
      "Scrambled letter tiles appear on screen.\nType the correct unscrambled word and press Enter.\nUse the Hint button if you're stuck.\nReshuffle the letters for a fresh arrangement.\nEach level has a unique word with increasing difficulty.\nA timer counts down — solve before it hits zero!\n12 levels across Easy, Medium, and Hard words.\nComplete all levels to decrypt the cosmos!",
    icon: "🧩",
    color: "#feca57",
    cardDesc: "12 levels of word puzzles. Decrypt cosmic secrets!",
    cardDifficulty: "Medium",
  },
  sync: {
    title: "Heart Sync",
    desc: "A pulsing ring expands and contracts. Tap at the perfect moment when it aligns with the target. Find your rhythm.",
    rules:
      "A colored ring expands and shrinks continuously.\nA static white target ring sits at a fixed size.\nTap or click anywhere when the rings overlap perfectly.\nA green flash means you synced! A red flash means you missed.\nOn Easy levels, a miss only loses 1 sync point.\nOn Medium and Hard, a miss resets your entire streak!\nEach level gets faster with tighter timing windows.\n9 levels from gentle pulses to impossible speeds.\nSync perfectly across all levels to win!",
    icon: "💓",
    color: "#ff9ff3",
    cardDesc: "9 levels of rhythm & timing. Find the heartbeat.",
    cardDifficulty: "Easy",
  },
};

// ─── FLOATING PARTICLES ───
const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ─── RULES MODAL ───
const RulesModal: React.FC<{
  game: GameType;
  onClose: () => void;
  onStart: () => void;
}> = ({ game, onClose, onStart }) => {
  if (!game) return null;
  const details = GAME_DETAILS[game];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-md w-full rounded-2xl relative border border-white/10 max-h-[85vh] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.95))`,
          boxShadow: `0 0 60px ${details.color}15, 0 0 120px ${details.color}08`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${details.color}, transparent)`,
          }}
        />

        <div className="p-8 overflow-y-auto max-h-[calc(85vh-4px)]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-5xl mb-4"
            >
              {details.icon}
            </motion.div>
            <h2 className="text-2xl font-serif text-white mb-2">
              {details.title}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              {details.desc}
            </p>
          </div>

          {/* Rules */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-xl mb-6">
            <h3
              className="font-bold mb-3 text-xs uppercase tracking-widest"
              style={{ color: details.color }}
            >
              How to Play
            </h3>
            <ul className="text-white/60 text-sm space-y-2.5">
              {details.rules.split("\n").map((rule, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="flex gap-2"
                >
                  <span
                    className="text-xs mt-0.5 shrink-0"
                    style={{ color: details.color }}
                  >
                    ✦
                  </span>
                  <span>{rule}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Info badge */}
          <div className="text-center mb-6">
            <span className="text-white/25 text-xs font-mono">
              Difficulty levels are selected inside the game
            </span>
          </div>

          {/* Start button */}
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <GlowButton onClick={onStart} variant="gold" size="lg">
                🎮 Play Now
              </GlowButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── GAME CARD ───
const GameCard: React.FC<{
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  isUnlocked: boolean;
  hint: string;
  onSelect: () => void;
}> = ({
  title,
  description,
  icon,
  color,
  difficulty,
  isUnlocked,
  hint,
  onSelect,
}) => (
  <motion.div
    whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
    whileTap={isUnlocked ? { scale: 0.98 } : {}}
    className={`relative rounded-2xl border overflow-hidden group h-full flex flex-col transition-all duration-300
      ${
        isUnlocked
          ? "border-white/10 cursor-pointer"
          : "border-white/5 opacity-50 grayscale"
      }`}
    style={{
      background: isUnlocked
        ? `linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,27,75,0.6))`
        : `rgba(15,23,42,0.5)`,
    }}
    onClick={isUnlocked ? onSelect : undefined}
  >
    {/* Top accent */}
    {isUnlocked && (
      <div
        className="h-0.5 w-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    )}

    {/* Hover glow */}
    {isUnlocked && (
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${color}, transparent 70%)`,
        }}
      />
    )}

    <div className="relative z-10 flex flex-col h-full p-6">
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <motion.div
          className="text-4xl"
          whileHover={isUnlocked ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        {isUnlocked ? (
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full border font-mono uppercase tracking-wider ${
              difficulty === "Easy"
                ? "text-green-400 border-green-400/30 bg-green-400/5"
                : difficulty === "Medium"
                  ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
                  : "text-red-400 border-red-400/30 bg-red-400/5"
            }`}
          >
            {difficulty}
          </span>
        ) : (
          <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/30 font-mono">
            Locked 🔒
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      {isUnlocked ? (
        <p className="text-sm text-white/40 mb-6 flex-grow leading-relaxed">
          {description}
        </p>
      ) : (
        <p className="text-sm text-nebula-pink/60 mb-6 flex-grow italic leading-relaxed">
          {hint}
        </p>
      )}

      {/* Button */}
      <button
        disabled={!isUnlocked}
        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
          isUnlocked
            ? "hover:brightness-125 active:scale-[0.98]"
            : "cursor-not-allowed bg-white/[0.03] text-white/15 border border-white/5"
        }`}
        style={
          isUnlocked
            ? {
                backgroundColor: `${color}20`,
                border: `1px solid ${color}50`,
                color: color,
              }
            : {}
        }
      >
        {isUnlocked ? "▶ Play Now" : "Locked"}
      </button>
    </div>
  </motion.div>
);

// ─── MAIN PAGE ───
export default function GameHubPage() {
  const router = useRouter();
  useRefreshRedirect();

  const {
    visitedStars,
    openedLetters,
    gamesPlayed,
    wonGameIds,
    revealUnlocked,
    canAccessGame,
    incrementGamesPlayed,
    recordGameWin,
  } = useAppStore();
  const _hasHydrated = useAppStore((s) => s._hasHydrated);

  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gameDifficulty] = useState<Difficulty>("Easy");
  const [showVictory, setShowVictory] = useState(false);
  const [showLose, setShowLose] = useState(false);

  const stats = {
    visitedStars,
    openedLetters,
    gamesPlayed,
    wonGameIds,
    revealUnlocked,
  };

  useEffect(() => {
    if (_hasHydrated && !canAccessGame()) router.push("/universe");
  }, [_hasHydrated, canAccessGame, router]);

  const handleSelectGame = (game: GameType) => {
    setSelectedGame(game);
  };

  const handleStartGame = () => {
    incrementGamesPlayed();
    setActiveGame(selectedGame);
    setSelectedGame(null);
  };

  const handleWin = () => {
    if (activeGame) recordGameWin(activeGame);
    setShowVictory(true);
  };

  const handleLose = () => {
    setShowLose(true);
  };

  const closeGame = () => {
    setActiveGame(null);
    setShowVictory(false);
    setShowLose(false);
  };

  const retryGame = () => {
    setShowVictory(false);
    setShowLose(false);
    const currentGame = activeGame;
    setActiveGame(null);
    setTimeout(() => setActiveGame(currentGame), 50);
  };

  if (!_hasHydrated) return null;

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      {/* Audio - preserved */}
      <AudioPlayer />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(123,104,238,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,107,157,0.06) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating particles */}
      {!activeGame && <FloatingParticles />}

      {/* Navigation */}
      {!activeGame && <BackButton to="/universe" label="Universe" />}
      {activeGame && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={closeGame}
          className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2.5 rounded-full cursor-pointer transition-all hover:bg-white/10 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">
            ←
          </span>
          <span className="text-sm">Exit Game</span>
        </motion.button>
      )}

      {/* Rules Modal */}
      <AnimatePresence>
        {selectedGame && (
          <RulesModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onStart={handleStartGame}
          />
        )}
      </AnimatePresence>

      {/* Game Hub Grid */}
      <AnimatePresence mode="wait">
        {!activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              {/* Decorative stars */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white/20"
                >
                  ✦
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                  className="text-white/30"
                >
                  ✧
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  className="text-white/20"
                >
                  ✦
                </motion.span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-glow mb-4 tracking-tight">
                Cosmic Arcade
              </h1>
              <p className="text-white/40 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
                Where stars become games and every challenge brings you closer
                to the cosmos
              </p>

              {/* <span className="text-white/20 text-xs font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/50" />
                  {gamesPlayed} played
                </span>
                <span className="text-white/10">|</span>
                <span className="text-white/20 text-xs font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                  {wonGameIds.length} mastered
                </span> */}
            </motion.div>

            {/* Game Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pb-20"
            >
              {(
                [
                  {
                    id: "catcher" as const,
                    details: GAME_DETAILS.catcher,
                  },
                  {
                    id: "sync" as const,
                    details: GAME_DETAILS.sync,
                  },
                  {
                    id: "jump" as const,
                    details: GAME_DETAILS.jump,
                  },
                  {
                    id: "cipher" as const,
                    details: GAME_DETAILS.cipher,
                  },
                  {
                    id: "journey" as const,
                    details: GAME_DETAILS.journey,
                  },
                ] as const
              ).map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                >
                  <GameCard
                    id={game.id}
                    title={game.details.title}
                    description={game.details.cardDesc}
                    icon={game.details.icon}
                    color={game.details.color}
                    difficulty={game.details.cardDifficulty}
                    isUnlocked={isGameUnlocked(game.id, stats)}
                    hint={getGameUnlockHint(game.id)}
                    onSelect={() => handleSelectGame(game.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Game */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-3 md:p-6"
          >
            {/* Victory / Lose Overlay */}
            {(showVictory || showLose) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center p-10 rounded-2xl max-w-sm border border-white/10 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.95))`,
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background: showVictory
                        ? "linear-gradient(90deg, transparent, #facc15, transparent)"
                        : "linear-gradient(90deg, transparent, #ef4444, transparent)",
                    }}
                  />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-5"
                  >
                    {showVictory ? "🏆" : "💫"}
                  </motion.div>

                  <h2 className="text-3xl font-serif text-white mb-2">
                    {showVictory ? "Brilliant!" : "Almost There!"}
                  </h2>

                  <p className="text-white/40 mb-8 text-sm leading-relaxed">
                    {showVictory
                      ? "You've proven your cosmic worth. The universe remembers your victory."
                      : "Every star that falls still lights the way. Try once more — the cosmos believes in you."}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={retryGame}
                      className="text-white/50 hover:text-white px-5 py-2.5 border border-white/15 rounded-xl hover:border-white/30 transition-all text-sm font-mono"
                    >
                      ↻ Retry
                    </motion.button>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GlowButton onClick={closeGame} variant="gold" size="sm">
                        ← Arcade
                      </GlowButton>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Game Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative border border-white/[0.06] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,27,75,0.8))",
              }}
            >
              {activeGame === "journey" && (
                <GameCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "catcher" && (
                <StarCatcherCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "jump" && (
                <JumperCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "cipher" && (
                <CipherCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "sync" && (
                <SyncCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
