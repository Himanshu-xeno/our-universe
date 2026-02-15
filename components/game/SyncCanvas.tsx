"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Props {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
}

interface LevelConfig {
  speed: number;
  tolerance: number;
  timeLimit: number;
  hitsNeeded: number;
  label: string;
  difficulty: Difficulty;
  ringColor: string;
  description: string;
}

const ALL_LEVELS: LevelConfig[] = [
  // Easy 1-3
  {
    speed: 0.25,
    tolerance: 35,
    timeLimit: 60,
    hitsNeeded: 3,
    label: "First Beat",
    difficulty: "Easy",
    ringColor: "#ff9ff3",
    description: "Feel the rhythm. Sync 3 times.",
  },
  {
    speed: 0.32,
    tolerance: 30,
    timeLimit: 55,
    hitsNeeded: 4,
    label: "Gentle Pulse",
    difficulty: "Easy",
    ringColor: "#a29bfe",
    description: "A bit faster. Sync 4 times.",
  },
  {
    speed: 0.38,
    tolerance: 28,
    timeLimit: 50,
    hitsNeeded: 5,
    label: "Steady Heart",
    difficulty: "Easy",
    ringColor: "#74b9ff",
    description: "Find your flow. Sync 5 times.",
  },
  // Medium 4-6
  {
    speed: 0.5,
    tolerance: 24,
    timeLimit: 45,
    hitsNeeded: 5,
    label: "Rising Tempo",
    difficulty: "Medium",
    ringColor: "#ffeaa7",
    description: "The beat quickens. Stay focused.",
  },
  {
    speed: 0.6,
    tolerance: 22,
    timeLimit: 42,
    hitsNeeded: 6,
    label: "Double Time",
    difficulty: "Medium",
    ringColor: "#fdcb6e",
    description: "Faster ring. 6 syncs needed.",
  },
  {
    speed: 0.7,
    tolerance: 20,
    timeLimit: 38,
    hitsNeeded: 6,
    label: "Heartstrings",
    difficulty: "Medium",
    ringColor: "#e17055",
    description: "Tighter window. Don't blink.",
  },
  // Hard 7-9
  {
    speed: 0.8,
    tolerance: 17,
    timeLimit: 35,
    hitsNeeded: 7,
    label: "Cosmic Rush",
    difficulty: "Hard",
    ringColor: "#ff6b6b",
    description: "Blazing speed. 7 perfect syncs.",
  },
  {
    speed: 0.9,
    tolerance: 15,
    timeLimit: 30,
    hitsNeeded: 7,
    label: "Supernova",
    difficulty: "Hard",
    ringColor: "#ee5a24",
    description: "Near impossible timing.",
  },
  {
    speed: 1.0,
    tolerance: 12,
    timeLimit: 28,
    hitsNeeded: 8,
    label: "Eternal Sync",
    difficulty: "Hard",
    ringColor: "#ff4757",
    description: "The ultimate heartbeat. 8 syncs.",
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

// ─── LEVEL SELECTOR ───
const LevelSelector: React.FC<{
  unlockedLevel: number;
  stars: number[];
  onSelect: (levelIndex: number) => void;
}> = ({ unlockedLevel, stars, onSelect }) => {
  const sections: { label: string; color: string; levels: number[] }[] = [
    { label: "Easy", color: "#4ade80", levels: [0, 1, 2] },
    { label: "Medium", color: "#facc15", levels: [3, 4, 5] },
    { label: "Hard", color: "#ef4444", levels: [6, 7, 8] },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">💓</div>
          <h2 className="text-3xl font-serif text-white mb-2">Heart Sync</h2>
          <p className="text-white/50 text-sm">Choose your level</p>
        </motion.div>

        {sections.map((section, si) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: si * 0.12 }}
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

            <div className="grid grid-cols-3 gap-3">
              {section.levels.map((levelIdx) => {
                const isUnlocked = levelIdx <= unlockedLevel;
                const levelStars = stars[levelIdx] || 0;
                const lvl = ALL_LEVELS[levelIdx];

                return (
                  <motion.button
                    key={levelIdx}
                    whileHover={isUnlocked ? { scale: 1.06 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && onSelect(levelIdx)}
                    className={`relative rounded-xl p-3 flex flex-col items-center justify-center border-2 transition-all ${
                      isUnlocked
                        ? "cursor-pointer bg-white/5 hover:bg-white/10"
                        : "cursor-not-allowed bg-white/[0.02] opacity-40"
                    }`}
                    style={{
                      borderColor: isUnlocked
                        ? section.color + "50"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: section.color }}
                        >
                          {levelIdx + 1}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono mt-0.5 truncate w-full text-center">
                          {lvl.label}
                        </span>
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

        {/* Total stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-4"
        >
          <span className="text-white/20 text-xs font-mono">
            Total Stars: {stars.reduce((a, b) => a + b, 0)} /{" "}
            {ALL_LEVELS.length * 3}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

// ─── LEVEL COMPLETE ───
const LevelComplete: React.FC<{
  levelNum: number;
  levelLabel: string;
  earnedStars: number;
  timeRemaining: number;
  isLastLevel: boolean;
  onNext: () => void;
  onMenu: () => void;
}> = ({
  levelNum,
  levelLabel,
  earnedStars,
  timeRemaining,
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
          💫
        </motion.div>

        <h3 className="text-2xl font-serif text-white mb-1">
          Level {levelNum} Complete!
        </h3>
        <p className="text-white/40 text-sm mb-4 font-mono">{levelLabel}</p>

        <div className="flex justify-center gap-3 mb-4">
          {[1, 2, 3].map((s) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: 1,
                scale: s <= earnedStars ? 1.3 : 0.8,
                rotate: 0,
              }}
              transition={{ delay: 0.4 + s * 0.18, type: "spring" }}
              className={`text-3xl ${
                s <= earnedStars ? "text-yellow-400" : "text-white/10"
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>

        <p className="text-white/30 text-xs mb-6 font-mono">
          Time remaining: {Math.ceil(timeRemaining)}s
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
  level: LevelConfig;
  levelIndex: number;
  onComplete: (starsEarned: number, timeRemaining: number) => void;
  onLose: () => void;
  onBack: () => void;
}> = ({ level, levelIndex, onComplete, onLose, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const gameOverRef = useRef(false);
  const completedRef = useRef(false);

  const stateRef = useRef({
    size: 20,
    growing: true,
    hits: 0,
    feedbackColor: "",
    feedbackTimer: 0,
    timeLeft: level.timeLimit,
    lastTime: 0,
    particles: [] as Particle[],
    pulseRings: [] as { size: number; alpha: number; color: string }[],
  });

  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [feedback, setFeedback] = useState<"hit" | "miss" | "">("");

  const canvasWidth = useRef(300);
  const canvasHeight = useRef(300);

  const spawnParticles = useCallback(
    (cx: number, cy: number, color: string, count: number) => {
      const particles = stateRef.current.particles;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    },
    [],
  );

  // Resize
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height - 120, 380);
      canvas.width = size;
      canvas.height = size;
      canvasWidth.current = size;
      canvasHeight.current = size;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gameOverRef.current = false;
    completedRef.current = false;
    const state = stateRef.current;
    state.hits = 0;
    state.timeLeft = level.timeLimit;
    state.lastTime = 0;
    state.size = 20;
    state.growing = true;
    state.particles = [];
    state.pulseRings = [];
    state.feedbackColor = "";
    state.feedbackTimer = 0;
    setHits(0);
    setTimeLeft(level.timeLimit);
    setFeedback("");

    const render = (time: number) => {
      if (gameOverRef.current) return;

      const w = canvasWidth.current;
      const h = canvasHeight.current;
      const cx = w / 2;
      const cy = h / 2;

      if (state.lastTime === 0) state.lastTime = time;
      const dt = Math.min((time - state.lastTime) / 1000, 0.05);
      state.lastTime = time;

      // Timer
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        if (!gameOverRef.current) {
          gameOverRef.current = true;
          onLose();
        }
        return;
      }

      // Ring movement
      if (state.growing) {
        state.size += level.speed * 60 * dt;
        if (state.size >= 200) state.growing = false;
      } else {
        state.size -= level.speed * 60 * dt;
        if (state.size <= 20) state.growing = true;
      }

      // Feedback timer
      if (state.feedbackTimer > 0) {
        state.feedbackTimer -= dt;
        if (state.feedbackTimer <= 0) {
          state.feedbackColor = "";
          state.feedbackTimer = 0;
        }
      }

      // Pulse rings
      for (let i = state.pulseRings.length - 1; i >= 0; i--) {
        const ring = state.pulseRings[i];
        ring.size += 80 * dt;
        ring.alpha -= dt * 2;
        if (ring.alpha <= 0) state.pulseRings.splice(i, 1);
      }

      // Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 2.5;
        if (p.life <= 0) state.particles.splice(i, 1);
      }

      // ---- DRAW ----
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w);
      bgGrad.addColorStop(0, "#1e1b4b");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Background circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, i * 25 + 15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,0.025)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Pulse rings
      state.pulseRings.forEach((ring) => {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Target ring
      const targetRadius = 50;

      // Target glow (outer)
      ctx.beginPath();
      ctx.arc(cx, cy, targetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 28;
      ctx.stroke();

      // Target ring
      ctx.beginPath();
      ctx.arc(cx, cy, targetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 10;
      ctx.stroke();

      // "Sweet zone" indicator
      const inZone = Math.abs(state.size - 100) < level.tolerance;
      if (inZone && !state.feedbackColor) {
        ctx.beginPath();
        ctx.arc(cx, cy, targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,136,0.15)";
        ctx.lineWidth = 20;
        ctx.stroke();
      }

      // Moving ring
      const movingRadius = state.size / 2;
      const ringColor =
        state.feedbackColor || (inZone ? "#88ff88" : level.ringColor);

      // Moving ring glow
      ctx.beginPath();
      ctx.arc(cx, cy, movingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor + "30";
      ctx.lineWidth = 14;
      ctx.stroke();

      // Moving ring core
      ctx.beginPath();
      ctx.arc(cx, cy, movingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Center heart
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💓", cx, cy);

      // Particles
      state.particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Update React state
      setTimeLeft(state.timeLeft);
      setHits(state.hits);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [level, onLose]);

  // Click handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const click = (e: Event) => {
      e.preventDefault();
      if (gameOverRef.current || completedRef.current) return;
      const state = stateRef.current;
      const w = canvasWidth.current;
      const h = canvasHeight.current;
      const cx = w / 2;
      const cy = h / 2;

      if (Math.abs(state.size - 100) < level.tolerance) {
        // HIT
        state.feedbackColor = "#00ff00";
        state.feedbackTimer = 0.3;
        state.hits += 1;
        setFeedback("hit");
        setTimeout(() => setFeedback(""), 400);

        spawnParticles(cx, cy, "#00ff88", 15);
        state.pulseRings.push({
          size: state.size,
          alpha: 0.6,
          color: "rgba(0,255,136,0.3)",
        });

        if (state.hits >= level.hitsNeeded && !completedRef.current) {
          completedRef.current = true;
          gameOverRef.current = true;
          cancelAnimationFrame(animRef.current);

          // Calculate stars
          const timePercent = state.timeLeft / level.timeLimit;
          let earnedStars = 1;
          if (timePercent > 0.55) earnedStars = 3;
          else if (timePercent > 0.25) earnedStars = 2;

          setTimeout(() => onComplete(earnedStars, state.timeLeft), 500);
        }
      } else {
        // MISS
        const isEasyLevel = level.difficulty === "Easy";
        if (isEasyLevel) {
          state.hits = Math.max(0, state.hits - 1);
        } else {
          state.hits = 0;
        }

        state.feedbackColor = "#ff0000";
        state.feedbackTimer = 0.3;
        setFeedback("miss");
        setTimeout(() => setFeedback(""), 400);

        spawnParticles(cx, cy, "#ff4444", 8);
        state.pulseRings.push({
          size: state.size,
          alpha: 0.4,
          color: "rgba(255,0,0,0.3)",
        });
      }
    };

    canvas.addEventListener("mousedown", click);
    canvas.addEventListener("touchstart", click, { passive: false });
    return () => {
      canvas.removeEventListener("mousedown", click);
      canvas.removeEventListener("touchstart", click);
    };
  }, [level, onComplete, spawnParticles]);

  const timePercent = Math.max(0, (timeLeft / level.timeLimit) * 100);
  const timeColor =
    timePercent > 50 ? "#4ade80" : timePercent > 25 ? "#facc15" : "#ef4444";

  const diffColor =
    level.difficulty === "Easy"
      ? "border-green-400/40 text-green-400"
      : level.difficulty === "Medium"
        ? "border-yellow-400/40 text-yellow-400"
        : "border-red-400/40 text-red-400";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-white/40 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
      >
        ← Levels
      </button>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/50 text-[10px] font-mono uppercase">
              Level {levelIndex + 1} — {level.label}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: level.hitsNeeded }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                    i < hits
                      ? "bg-green-400 border-green-400 scale-110"
                      : "bg-transparent border-white/20"
                  }`}
                />
              ))}
            </div>
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
                style={{ width: `${timePercent}%`, backgroundColor: timeColor }}
              />
            </div>
            <span
              className="font-bold text-xs font-mono"
              style={{ color: timeColor }}
            >
              {Math.ceil(timeLeft)}s
            </span>
          </div>
        </div>
      </div>

      {/* Level description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[72px] text-white/20 text-[11px] font-mono z-10 pointer-events-none"
      >
        {level.description}
      </motion.p>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`absolute top-24 z-20 text-lg font-bold font-mono ${
              feedback === "hit" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback === "hit"
              ? "✓ SYNCED!"
              : level.difficulty === "Easy"
                ? "✗ MISS - Lost 1!"
                : "✗ MISS - Reset!"}
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className="rounded-full cursor-pointer touch-none"
        style={{ maxWidth: "100%", maxHeight: "55vh" }}
      />

      {/* Hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-white/20 text-xs font-mono">
          Tap when the rings align
          {level.difficulty !== "Easy" && " • Missing resets your streak"}
        </span>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───
const SyncCanvas: React.FC<Props> = ({ onWin, onLose, difficulty }) => {
  const STORAGE_KEY = "sync_progress";

  const loadProgress = (): { unlockedLevel: number; stars: number[] } => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { unlockedLevel: 0, stars: Array(ALL_LEVELS.length).fill(0) };
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

  useEffect(() => {
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

    // All levels done?
    const allDone = newStars.every((s) => s > 0);
    if (allDone && !allWonRef.current) {
      allWonRef.current = true;
      setTimeout(() => onWin(), 2500);
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
            <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
            <LevelComplete
              levelNum={currentLevelIndex + 1}
              levelLabel={currentLevel.label}
              earnedStars={completedStars}
              timeRemaining={completedTime}
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

export default SyncCanvas;
