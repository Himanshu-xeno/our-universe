//New code
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Props {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
}

interface LevelData {
  word: string;
  hint: string;
  category: string;
  timeLimit: number;
  difficulty: Difficulty;
}

const ALL_LEVELS: LevelData[] = [
  // EASY (Levels 1-4): Short words, generous time
  {
    word: "LOVE",
    hint: "The most powerful force in the universe.",
    category: "Emotion",
    timeLimit: 45,
    difficulty: "Easy",
  },
  {
    word: "STAR",
    hint: "It twinkles in the night sky.",
    category: "Space",
    timeLimit: 45,
    difficulty: "Easy",
  },
  {
    word: "HOPE",
    hint: "What keeps us going when things are dark.",
    category: "Emotion",
    timeLimit: 40,
    difficulty: "Easy",
  },
  {
    word: "MOON",
    hint: "Earth's loyal companion in orbit.",
    category: "Space",
    timeLimit: 40,
    difficulty: "Easy",
  },

  // MEDIUM (Levels 5-8): Medium words, moderate time
  {
    word: "GALAXY",
    hint: "A system of millions of stars.",
    category: "Space",
    timeLimit: 40,
    difficulty: "Medium",
  },
  {
    word: "DESIRE",
    hint: "A strong feeling of wanting something.",
    category: "Emotion",
    timeLimit: 38,
    difficulty: "Medium",
  },
  {
    word: "NEBULA",
    hint: "A cloud where new stars are born.",
    category: "Space",
    timeLimit: 35,
    difficulty: "Medium",
  },
  {
    word: "SOLACE",
    hint: "Comfort found in a time of sadness.",
    category: "Philosophy",
    timeLimit: 35,
    difficulty: "Medium",
  },

  // HARD (Levels 9-12): Long words, tight time
  {
    word: "ETERNITY",
    hint: "It implies forever, like us.",
    category: "Philosophy",
    timeLimit: 35,
    difficulty: "Hard",
  },
  {
    word: "STARDUST",
    hint: "We are all made of this cosmic material.",
    category: "Space",
    timeLimit: 32,
    difficulty: "Hard",
  },
  {
    word: "DEVOTION",
    hint: "Deep love and unwavering commitment.",
    category: "Emotion",
    timeLimit: 30,
    difficulty: "Hard",
  },
  {
    word: "EUPHORIA",
    hint: "An overwhelming feeling of pure happiness.",
    category: "Philosophy",
    timeLimit: 28,
    difficulty: "Hard",
  },
];

function shuffleWord(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  if (result === word && word.length > 1) return shuffleWord(word);
  return result;
}

// ─── LEVEL SELECTOR ───
const LevelSelector: React.FC<{
  unlockedLevel: number;
  stars: number[];
  onSelect: (levelIndex: number) => void;
}> = ({ unlockedLevel, stars, onSelect }) => {
  const sections: { label: string; color: string; levels: number[] }[] = [
    { label: "Easy", color: "#4ade80", levels: [0, 1, 2, 3] },
    { label: "Medium", color: "#facc15", levels: [4, 5, 6, 7] },
    { label: "Hard", color: "#ef4444", levels: [8, 9, 10, 11] },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">🧩</div>
          <h2 className="text-3xl font-serif text-white mb-2">Love Cipher</h2>
          <p className="text-white/50 text-sm">Choose a level to decrypt</p>
        </motion.div>

        {sections.map((section, si) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: si * 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: section.color }}
              />
              <span
                className="text-sm font-mono font-bold uppercase tracking-wider"
                style={{ color: section.color }}
              >
                {section.label}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {section.levels.map((levelIdx) => {
                const isUnlocked = levelIdx <= unlockedLevel;
                const levelStars = stars[levelIdx] || 0;
                const levelNum = levelIdx + 1;

                return (
                  <motion.button
                    key={levelIdx}
                    whileHover={isUnlocked ? { scale: 1.08 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && onSelect(levelIdx)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                      isUnlocked
                        ? "cursor-pointer bg-white/5 hover:bg-white/10"
                        : "cursor-not-allowed bg-white/[0.02] opacity-40"
                    }`}
                    style={{
                      borderColor: isUnlocked
                        ? section.color + "60"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <span
                          className="text-xl font-bold font-mono"
                          style={{ color: section.color }}
                        >
                          {levelNum}
                        </span>
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3].map((s) => (
                            <span
                              key={s}
                              className={`text-[10px] ${
                                s <= levelStars
                                  ? "text-yellow-400"
                                  : "text-white/15"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="text-white/20 text-lg">🔒</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── LEVEL COMPLETE OVERLAY ───
const LevelComplete: React.FC<{
  levelNum: number;
  earnedStars: number;
  timeRemaining: number;
  word: string;
  isLastLevel: boolean;
  onNext: () => void;
  onMenu: () => void;
}> = ({
  levelNum,
  earnedStars,
  timeRemaining,
  word,
  isLastLevel,
  onNext,
  onMenu,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl mb-4"
        >
          🎉
        </motion.div>

        <h3 className="text-2xl font-serif text-white mb-1">
          Level {levelNum} Complete!
        </h3>
        <p className="text-white/40 text-sm mb-4 font-mono">
          Decrypted: <span className="text-green-400">{word}</span>
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: 1,
                scale: s <= earnedStars ? 1.2 : 0.8,
                rotate: 0,
              }}
              transition={{ delay: 0.4 + s * 0.15, type: "spring" }}
              className={`text-3xl ${
                s <= earnedStars ? "text-yellow-400" : "text-white/10"
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>

        <p className="text-white/30 text-xs mb-6 font-mono">
          Time remaining: {timeRemaining}s
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onMenu}
            className="px-4 py-2 text-white/50 hover:text-white border border-white/20 rounded-lg text-sm transition-all hover:border-white/40"
          >
            Level Menu
          </button>
          {!isLastLevel && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            >
              Next Level →
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── GAMEPLAY SCREEN ───
const GameplayScreen: React.FC<{
  level: LevelData;
  levelIndex: number;
  onComplete: (starsEarned: number, timeRemaining: number) => void;
  onLose: () => void;
  onBack: () => void;
}> = ({ level, levelIndex, onComplete, onLose, onBack }) => {
  const [shuffled, setShuffled] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [attempts, setAttempts] = useState(0);
  const gameOverRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShuffled(shuffleWord(level.word));
    setInput("");
    setError(false);
    setCorrect(false);
    setShowHint(false);
    setTimeLeft(level.timeLimit);
    setAttempts(0);
    gameOverRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [level]);

  // Timer
  useEffect(() => {
    if (gameOverRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!gameOverRef.current) {
            gameOverRef.current = true;
            clearInterval(timerRef.current!);
            onLose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onLose, level]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (gameOverRef.current || correct) return;

      setAttempts((a) => a + 1);

      if (input.toUpperCase().trim() === level.word) {
        setCorrect(true);
        gameOverRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate stars
        const timePercent = timeLeft / level.timeLimit;
        let stars = 1;
        if (timePercent > 0.6) stars = 3;
        else if (timePercent > 0.3) stars = 2;

        setTimeout(() => onComplete(stars, timeLeft), 800);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
    },
    [input, level, correct, timeLeft, onComplete],
  );

  const handleReshuffle = () => {
    setShuffled(shuffleWord(level.word));
  };

  const timePercent = (timeLeft / level.timeLimit) * 100;
  const timeColor =
    timePercent > 50 ? "#4ade80" : timePercent > 25 ? "#facc15" : "#ef4444";
  const diffColor =
    level.difficulty === "Easy"
      ? "border-green-400/40 text-green-400"
      : level.difficulty === "Medium"
        ? "border-yellow-400/40 text-yellow-400"
        : "border-red-400/40 text-red-400";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-white/40 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
      >
        ← Levels
      </button>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/60 text-xs font-mono uppercase">
              Level {levelIndex + 1}
            </span>
            <span className="text-white/30 text-[10px] font-mono">
              Attempts: {attempts}
            </span>
          </div>

          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-mono ${diffColor}`}
          >
            {level.difficulty}
          </span>

          <div className="flex flex-col items-end gap-1">
            <span className="text-white/60 text-xs font-mono uppercase">
              Time
            </span>
            <div className="w-20 h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${timePercent}%`,
                  backgroundColor: timeColor,
                }}
              />
            </div>
            <span
              className="font-bold text-xs font-mono"
              style={{ color: timeColor }}
            >
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
        {/* Category */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/30 uppercase tracking-widest mb-1 font-mono"
        >
          {level.category}
        </motion.span>

        <p className="text-white/20 text-[11px] font-mono mb-6">
          {level.word.length} letters
        </p>

        {/* Scrambled tiles */}
        <AnimatePresence mode="wait">
          <motion.div
            key={shuffled}
            initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex gap-2 mb-4 flex-wrap justify-center"
          >
            {shuffled.split("").map((letter, i) => (
              <motion.div
                key={`${shuffled}-${i}`}
                initial={{ opacity: 0, y: 20, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`w-11 h-14 md:w-12 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-2xl font-mono font-bold border-2 transition-colors duration-200 ${
                  correct
                    ? "bg-green-500/20 border-green-400 text-green-300"
                    : error
                      ? "bg-red-500/20 border-red-400 text-red-300 animate-pulse"
                      : "bg-white/5 border-white/20 text-white"
                }`}
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Reshuffle button */}
        <button
          onClick={handleReshuffle}
          className="text-white/20 hover:text-white/50 text-xs font-mono mb-6 transition-colors flex items-center gap-1"
        >
          🔀 Reshuffle letters
        </button>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white/60 italic text-sm bg-white/5 px-4 py-2 rounded-full mb-4 text-center border border-white/10"
            >
              💡 {level.hint}
            </motion.p>
          )}
        </AnimatePresence>

        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-white/30 hover:text-white/60 text-xs mb-4 transition-colors font-mono underline underline-offset-4"
          >
            Need a hint?
          </button>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs flex flex-col gap-3"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the word..."
              maxLength={level.word.length + 2}
              className={`w-full bg-transparent border-b-2 text-center text-2xl py-3 text-white outline-none transition-colors font-mono tracking-widest ${
                error
                  ? "border-red-500 text-red-200"
                  : correct
                    ? "border-green-500 text-green-200"
                    : "border-white/30 focus:border-purple-400"
              }`}
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
              disabled={correct}
            />
            {input.length > 0 && !correct && (
              <span
                className={`absolute right-0 bottom-4 text-xs font-mono ${
                  input.length === level.word.length
                    ? "text-green-400"
                    : "text-white/30"
                }`}
              >
                {input.length}/{level.word.length}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={correct || input.length === 0}
            className={`py-3 rounded-lg font-medium transition-all active:scale-95 font-mono tracking-wider border ${
              correct
                ? "bg-green-500/20 border-green-400 text-green-300"
                : "bg-white/10 hover:bg-white/20 text-white border-white/10"
            }`}
          >
            {correct ? "✓ Decrypted!" : "✦ Decrypt ✦"}
          </button>
        </form>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <span className="text-white/15 text-xs font-mono">
          Unscramble the letters • Type your answer • Press Enter
        </span>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───
const CipherCanvas: React.FC<Props> = ({ onWin, onLose, difficulty }) => {
  const STORAGE_KEY = "cipher_progress";

  const loadProgress = (): { unlockedLevel: number; stars: number[] } => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { unlockedLevel: 0, stars: Array(12).fill(0) };
  };

  const saveProgress = (unlockedLevel: number, stars: number[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ unlockedLevel, stars }),
      );
    } catch {}
  };

  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState<"menu" | "play" | "complete">("menu");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completedStars, setCompletedStars] = useState(0);
  const [completedTime, setCompletedTime] = useState(0);
  const allWonRef = useRef(false);

  // When difficulty is passed, optionally jump to appropriate section
  useEffect(() => {
    // Just show menu, user picks level
    setScreen("menu");
    allWonRef.current = false;
  }, [difficulty]);

  const handleSelectLevel = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setScreen("play");
  };

  const handleLevelComplete = (starsEarned: number, timeRemaining: number) => {
    const newStars = [...progress.stars];
    newStars[currentLevelIndex] = Math.max(
      newStars[currentLevelIndex],
      starsEarned,
    );

    const newUnlocked = Math.max(progress.unlockedLevel, currentLevelIndex + 1);

    const newProgress = {
      unlockedLevel: Math.min(newUnlocked, ALL_LEVELS.length - 1),
      stars: newStars,
    };
    setProgress(newProgress);
    saveProgress(newProgress.unlockedLevel, newProgress.stars);

    setCompletedStars(starsEarned);
    setCompletedTime(timeRemaining);
    setScreen("complete");

    // Check if all 12 levels done
    const allDone = newStars.every((s) => s > 0);
    if (allDone && !allWonRef.current) {
      allWonRef.current = true;
      // Delay to show complete screen first, then trigger game win
      setTimeout(() => onWin(), 2000);
    }
  };

  const handleNextLevel = () => {
    const next = currentLevelIndex + 1;
    if (next < ALL_LEVELS.length) {
      setCurrentLevelIndex(next);
      setScreen("play");
    } else {
      setScreen("menu");
    }
  };

  const handleBackToMenu = () => {
    setScreen("menu");
  };

  const handleLevelLose = () => {
    onLose();
  };

  const currentLevel = ALL_LEVELS[currentLevelIndex];
  const isLastLevel = currentLevelIndex >= ALL_LEVELS.length - 1;

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        {screen === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LevelSelector
              unlockedLevel={progress.unlockedLevel}
              stars={progress.stars}
              onSelect={handleSelectLevel}
            />
          </motion.div>
        )}

        {screen === "play" && currentLevel && (
          <motion.div
            key={`play-${currentLevelIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <GameplayScreen
              level={currentLevel}
              levelIndex={currentLevelIndex}
              onComplete={handleLevelComplete}
              onLose={handleLevelLose}
              onBack={handleBackToMenu}
            />
          </motion.div>
        )}

        {screen === "complete" && currentLevel && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            {/* Show gameplay behind the overlay */}
            <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
            <LevelComplete
              levelNum={currentLevelIndex + 1}
              earnedStars={completedStars}
              timeRemaining={completedTime}
              word={currentLevel.word}
              isLastLevel={isLastLevel}
              onNext={handleNextLevel}
              onMenu={handleBackToMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CipherCanvas;
