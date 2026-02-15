//New code
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

const GAME_DETAILS = {
  journey: {
    title: "Cosmic Journey",
    desc: "Navigate through the asteroid field of doubts and fears. Collect trust and hope.",
    rules:
      "1. Use Arrow Keys or Drag to move.\n2. Avoid the Obstacles (gray boxes).\n3. Collect 5 items (Trust, Hope...).\n4. Reach the top to win.",
    difficulty: "Hard",
    icon: "🚀",
    hasDiff: false,
  },
  catcher: {
    title: "Star Catcher",
    desc: "Catch the falling stars before time runs out!",
    rules:
      "1. Drag or Move mouse to control the Astronaut.\n2. Catch 100 Stars to fill the meter.\n3. Watch the Timer! Higher difficulty = less time.",
    difficulty: "Easy",
    icon: "⭐",
    hasDiff: true,
  },
  jump: {
    title: "Moon Jump",
    desc: "Bounce on clouds to reach the moon.",
    rules:
      "1. Move mouse/finger Left or Right.\n2. Catch falling orbs with your rocket.\n3. Collect 1000 points before time runs out.\n4. Higher difficulty = less time.",
    difficulty: "Medium",
    icon: "🌑",
    hasDiff: true,
  },
  cipher: {
    title: "Love Cipher",
    desc: "Unscramble the romantic words.",
    rules:
      "1. Look at the scrambled letters.\n2. Type the correct word.\n3. Use the hint if you are stuck.\n4. Solve 4 levels to win.",
    difficulty: "Medium",
    icon: "🧩",
    hasDiff: false,
  },
  sync: {
    title: "Heart Sync",
    desc: "Align your heartbeat with the universe.",
    rules:
      "1. A ring will expand and contract.\n2. Tap ANYWHERE when the moving ring overlaps the static white ring.\n3. Sync 5 times perfectly to win.",
    difficulty: "Easy",
    icon: "💓",
    hasDiff: false,
  },
};

const RulesModal: React.FC<{
  game: GameType;
  onClose: () => void;
  onStart: (diff?: Difficulty) => void;
}> = ({ game, onClose, onStart }) => {
  if (!game) return null;
  const details = GAME_DETAILS[game];
  const [diff, setDiff] = useState<Difficulty>("Easy");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="glass-strong max-w-md w-full p-8 rounded-2xl relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{details.icon}</div>
          <h2 className="text-2xl font-serif text-white mb-2">
            {details.title}
          </h2>
          <p className="text-white/60 text-sm">{details.desc}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-nebula-blue font-bold mb-2 text-sm uppercase">
            How to Play
          </h3>
          <ul className="text-white/70 text-sm space-y-2 text-left list-disc list-inside">
            {details.rules.split("\n").map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {details.hasDiff && (
          <div className="mb-6">
            <p className="text-white/50 text-xs uppercase mb-2 text-center">
              Select Difficulty
            </p>
            <div className="flex gap-2 justify-center">
              {["Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d as Difficulty)}
                  className={`px-3 py-1 rounded-full text-xs border ${diff === d ? "bg-nebula-pink border-nebula-pink text-white" : "border-white/20 text-white/50"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <GlowButton onClick={() => onStart(diff)} variant="gold" size="lg">
            Start Game
          </GlowButton>
        </div>
      </div>
    </motion.div>
  );
};

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
    whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
    className={`glass p-6 rounded-2xl border relative overflow-hidden group h-full flex flex-col
      ${isUnlocked ? "border-white/10 cursor-pointer" : "border-white/5 opacity-60 grayscale"}`}
    onClick={isUnlocked ? onSelect : undefined}
  >
    {isUnlocked && (
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent)`,
        }}
      />
    )}
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{icon}</div>
        {isUnlocked ? (
          <span
            className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${difficulty === "Easy" ? "text-green-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}
          >
            {difficulty}
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/40">
            Locked 🔒
          </span>
        )}
      </div>
      <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
      {isUnlocked ? (
        <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
      ) : (
        <p className="text-sm text-nebula-pink/80 mb-6 flex-grow italic">
          {hint}
        </p>
      )}
      <button
        disabled={!isUnlocked}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${isUnlocked ? "" : "cursor-not-allowed bg-white/5 text-white/20"}`}
        style={
          isUnlocked
            ? { backgroundColor: `${color}40`, border: `1px solid ${color}` }
            : {}
        }
      >
        {isUnlocked ? "View Rules" : "Locked"}
      </button>
    </div>
  </motion.div>
);

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
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>("Easy");
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

  const handleStartGame = (diff: Difficulty = "Easy") => {
    setGameDifficulty(diff);
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
    setTimeout(() => setActiveGame(currentGame), 10);
  };

  if (!_hasHydrated) return null;

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      <AudioPlayer />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
      </div>

      {!activeGame && <BackButton to="/universe" label="Universe" />}
      {activeGame && (
        <button
          onClick={closeGame}
          className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full cursor-pointer"
        >
          ← Exit Game
        </button>
      )}

      <AnimatePresence>
        {selectedGame && (
          <RulesModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onStart={handleStartGame}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-6xl mx-auto px-6 py-20"
          >
            <div className="text-center mb-16">
              <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
                Cosmic Arcade
              </h1>
              <p className="text-soft-white/60 text-lg">Pick a challenge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              <GameCard
                id="catcher"
                title="Star Catcher"
                description="Catch 100 stars."
                icon="⭐"
                color="#ff6b9d"
                difficulty="Easy"
                isUnlocked={isGameUnlocked("catcher", stats)}
                hint={getGameUnlockHint("catcher")}
                onSelect={() => handleSelectGame("catcher")}
              />
              <GameCard
                id="sync"
                title="Heart Sync"
                description="Rhythm & Timing."
                icon="💓"
                color="#ff9ff3"
                difficulty="Easy"
                isUnlocked={isGameUnlocked("sync", stats)}
                hint={getGameUnlockHint("sync")}
                onSelect={() => handleSelectGame("sync")}
              />
              <GameCard
                id="jump"
                title="Moon Jump"
                description="Catch orbs with your rocket."
                icon="🌑"
                color="#7b68ee"
                difficulty="Medium"
                isUnlocked={isGameUnlocked("jump", stats)}
                hint={getGameUnlockHint("jump")}
                onSelect={() => handleSelectGame("jump")}
              />
              <GameCard
                id="cipher"
                title="Love Cipher"
                description="Unscramble words."
                icon="🧩"
                color="#feca57"
                difficulty="Medium"
                isUnlocked={isGameUnlocked("cipher", stats)}
                hint={getGameUnlockHint("cipher")}
                onSelect={() => handleSelectGame("cipher")}
              />
              <GameCard
                id="journey"
                title="Cosmic Journey"
                description="The ultimate test."
                icon="🚀"
                color="#4ecdc4"
                difficulty="Hard"
                isUnlocked={isGameUnlocked("journey", stats)}
                hint={getGameUnlockHint("journey")}
                onSelect={() => handleSelectGame("journey")}
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
            {(showVictory || showLose) && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-center p-8 glass-strong rounded-2xl max-w-sm"
                >
                  <div className="text-6xl mb-4">
                    {showVictory ? "🏆" : "💔"}
                  </div>
                  <h2 className="text-3xl font-serif text-white mb-2">
                    {showVictory ? "Victory!" : "Try Again"}
                  </h2>
                  <p className="text-white/50 mb-6">
                    {showVictory
                      ? "You've unlocked a secret letter."
                      : "Don't give up. The stars are waiting."}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={retryGame}
                      className="text-white/50 hover:text-white px-4 py-2"
                    >
                      Retry
                    </button>
                    <GlowButton onClick={closeGame} variant="gold" size="sm">
                      Back to Menu
                    </GlowButton>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="w-full h-full max-w-5xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
              {activeGame === "journey" && <GameCanvas onWin={handleWin} />}
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
