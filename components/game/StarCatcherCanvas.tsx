"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Props {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
}

interface LevelConfig {
  speedMin: number;
  speedMax: number;
  spawnRate: number;
  timeLimit: number;
  target: number;
  label: string;
  difficulty: Difficulty;
  description: string;
}

const ALL_LEVELS: LevelConfig[] = [
  {
    speedMin: 1.5,
    speedMax: 3,
    spawnRate: 0.05,
    timeLimit: 60,
    target: 50,
    label: "First Light",
    difficulty: "Easy",
    description: "Catch 50 stars. Take your time.",
  },
  {
    speedMin: 2,
    speedMax: 3.5,
    spawnRate: 0.055,
    timeLimit: 55,
    target: 65,
    label: "Starfall",
    difficulty: "Easy",
    description: "Stars fall a bit faster now.",
  },
  {
    speedMin: 2,
    speedMax: 4,
    spawnRate: 0.06,
    timeLimit: 50,
    target: 80,
    label: "Cosmic Rain",
    difficulty: "Easy",
    description: "80 stars in under a minute.",
  },
  {
    speedMin: 2.5,
    speedMax: 4.5,
    spawnRate: 0.065,
    timeLimit: 45,
    target: 80,
    label: "Solar Wind",
    difficulty: "Medium",
    description: "The wind picks up speed.",
  },
  {
    speedMin: 3,
    speedMax: 5,
    spawnRate: 0.07,
    timeLimit: 42,
    target: 90,
    label: "Meteor Shower",
    difficulty: "Medium",
    description: "Fast and furious.",
  },
  {
    speedMin: 3.5,
    speedMax: 5.5,
    spawnRate: 0.075,
    timeLimit: 38,
    target: 100,
    label: "Aurora Storm",
    difficulty: "Medium",
    description: "100 stars, tight timer.",
  },
  {
    speedMin: 4,
    speedMax: 6,
    spawnRate: 0.08,
    timeLimit: 32,
    target: 100,
    label: "Nebula Blitz",
    difficulty: "Hard",
    description: "Blazing speed. Stay sharp.",
  },
  {
    speedMin: 4.5,
    speedMax: 6.5,
    spawnRate: 0.085,
    timeLimit: 28,
    target: 110,
    label: "Supernova",
    difficulty: "Hard",
    description: "Near impossible catch rate.",
  },
  {
    speedMin: 5,
    speedMax: 7.5,
    spawnRate: 0.09,
    timeLimit: 25,
    target: 120,
    label: "Cosmic Blaze",
    difficulty: "Hard",
    description: "The ultimate star catcher.",
  },
];

interface FallingStar {
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  type: "normal" | "bonus";
}

interface Sparkle {
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
  onSelect: (idx: number) => void;
}> = ({ unlockedLevel, stars, onSelect }) => {
  const sections = [
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
          <div className="text-5xl mb-3">⭐</div>
          <h2 className="text-3xl font-serif text-white mb-2">Star Catcher</h2>
          <p className="text-white/50 text-sm">Choose your level</p>
          <p className="text-white/20 text-xs font-mono mt-2">
            Stars: {stars.reduce((a, b) => a + b, 0)} / {ALL_LEVELS.length * 3}
          </p>
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
              {section.levels.map((idx) => {
                const unlocked = idx <= unlockedLevel;
                const lvl = ALL_LEVELS[idx];
                const s = stars[idx] || 0;
                return (
                  <motion.button
                    key={idx}
                    whileHover={unlocked ? { scale: 1.06 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    onClick={() => unlocked && onSelect(idx)}
                    className={`rounded-xl p-3 flex flex-col items-center border-2 transition-all ${unlocked ? "cursor-pointer bg-white/5 hover:bg-white/10" : "cursor-not-allowed bg-white/[0.02] opacity-40"}`}
                    style={{
                      borderColor: unlocked
                        ? section.color + "50"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {unlocked ? (
                      <>
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: section.color }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-[9px] text-white/40 font-mono mt-0.5 truncate w-full text-center">
                          {lvl.label}
                        </span>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3].map((v) => (
                            <span
                              key={v}
                              className={`text-[10px] ${v <= s ? "text-yellow-400" : "text-white/15"}`}
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

// ─── LEVEL COMPLETE ───
const LevelComplete: React.FC<{
  levelNum: number;
  levelLabel: string;
  earnedStars: number;
  score: number;
  target: number;
  timeRemaining: number;
  isLast: boolean;
  onNext: () => void;
  onMenu: () => void;
}> = ({
  levelNum,
  levelLabel,
  earnedStars,
  score,
  target,
  timeRemaining,
  isLast,
  onNext,
  onMenu,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
    >
      <div className="text-5xl mb-4">🌟</div>
      <h3 className="text-2xl font-serif text-white mb-1">
        Level {levelNum} Complete!
      </h3>
      <p className="text-white/40 text-sm mb-2 font-mono">{levelLabel}</p>
      <p className="text-white/30 text-xs mb-4 font-mono">
        Caught: {score} / {target} • Time left: {Math.ceil(timeRemaining)}s
      </p>
      <div className="flex justify-center gap-3 mb-6">
        {[1, 2, 3].map((s) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: 1,
              scale: s <= earnedStars ? 1.3 : 0.8,
              rotate: 0,
            }}
            transition={{ delay: 0.3 + s * 0.18, type: "spring" }}
            className={`text-3xl ${s <= earnedStars ? "text-yellow-400" : "text-white/10"}`}
          >
            ★
          </motion.span>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onMenu}
          className="px-4 py-2 text-white/50 hover:text-white border border-white/20 rounded-lg text-sm transition-all hover:border-white/40"
        >
          Levels
        </button>
        {!isLast && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          >
            Next Level →
          </button>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// ─── GAMEPLAY ───
const GameplayScreen: React.FC<{
  level: LevelConfig;
  levelIndex: number;
  onComplete: (stars: number, timeLeft: number, score: number) => void;
  onLose: () => void;
  onBack: () => void;
}> = ({ level, levelIndex, onComplete, onLose, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const gameOverRef = useRef(false);
  const completedRef = useRef(false);

  const stateRef = useRef({
    score: 0,
    playerX: 0,
    stars: [] as FallingStar[],
    sparkles: [] as Sparkle[],
    lastTime: 0,
    timeLeft: level.timeLimit,
    bgStars: [] as { x: number; y: number; r: number; tw: number }[],
    combo: 0,
    lastCatchTime: 0,
  });

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [combo, setCombo] = useState(0);

  const drawStarShape = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rotation: number,
  ) => {
    const spikes = 5;
    const outer = size;
    const inner = size * 0.4;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const loop = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const state = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (state.lastTime === 0) state.lastTime = time;
      const dt = (time - state.lastTime) / 1000;
      state.lastTime = time;

      if (!gameOverRef.current && !completedRef.current) {
        state.timeLeft -= dt;
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          gameOverRef.current = true;
          onLose();
          return;
        }
      }

      // Combo decay
      if (time - state.lastCatchTime > 1500) {
        state.combo = 0;
      }

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#020617");
      bgGrad.addColorStop(0.6, "#0f172a");
      bgGrad.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // BG stars
      if (state.bgStars.length === 0) {
        for (let i = 0; i < 70; i++) {
          state.bgStars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.5,
            tw: Math.random() * Math.PI * 2,
          });
        }
      }
      state.bgStars.forEach((s) => {
        const twinkle = 0.3 + 0.5 * Math.sin(time / 1000 + s.tw);
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Spawn
      if (Math.random() < level.spawnRate) {
        const size = 12 + Math.random() * 10;
        const isBonus = Math.random() < 0.12;
        state.stars.push({
          x: size + Math.random() * (w - size * 2),
          y: -size - 10,
          speed:
            level.speedMin + Math.random() * (level.speedMax - level.speedMin),
          size: isBonus ? size * 1.3 : size,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.05,
          type: isBonus ? "bonus" : "normal",
        });
      }

      // Player
      const playerY = h - 55;
      ctx.font = "44px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🧑‍🚀", state.playerX, playerY);

      // Stars
      for (let i = state.stars.length - 1; i >= 0; i--) {
        const star = state.stars[i];
        star.y += star.speed;
        star.rotation += star.rotSpeed;

        // Glow
        const glowColor =
          star.type === "bonus"
            ? "rgba(96,165,250,0.4)"
            : "rgba(250,204,21,0.4)";
        const glowColorEnd =
          star.type === "bonus" ? "rgba(96,165,250,0)" : "rgba(250,204,21,0)";
        const grd = ctx.createRadialGradient(
          star.x,
          star.y,
          star.size * 0.3,
          star.x,
          star.y,
          star.size * 2,
        );
        grd.addColorStop(0, glowColor);
        grd.addColorStop(1, glowColorEnd);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = star.type === "bonus" ? "#60a5fa" : "#facc15";
        drawStarShape(ctx, star.x, star.y, star.size, star.rotation);

        // Collision
        if (Math.hypot(star.x - state.playerX, star.y - playerY) < 42) {
          state.stars.splice(i, 1);
          const multiplier = Math.min(3, 1 + Math.floor(state.combo / 3));
          const points = (star.type === "bonus" ? 15 : 5) * multiplier;
          state.score += points;
          state.combo += 1;
          state.lastCatchTime = time;

          for (let j = 0; j < 8; j++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 1 + Math.random() * 3;
            state.sparkles.push({
              x: star.x,
              y: star.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 1,
              color:
                star.type === "bonus"
                  ? "#60a5fa"
                  : Math.random() > 0.5
                    ? "#facc15"
                    : "#ffd700",
              size: 2 + Math.random() * 3,
            });
          }
        } else if (star.y > h + 30) {
          state.stars.splice(i, 1);
        }
      }

      // Sparkles
      for (let i = state.sparkles.length - 1; i >= 0; i--) {
        const s = state.sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= dt * 3;
        if (s.life <= 0) {
          state.sparkles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Combo text
      if (state.combo >= 3) {
        const mul = Math.min(3, 1 + Math.floor(state.combo / 3));
        ctx.fillStyle = mul >= 3 ? "#ef4444" : mul >= 2 ? "#facc15" : "#4ade80";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${mul}x COMBO! (${state.combo})`, w / 2, h - 90);
      }

      // Win
      if (
        state.score >= level.target &&
        !gameOverRef.current &&
        !completedRef.current
      ) {
        completedRef.current = true;
        gameOverRef.current = true;
        const pct = state.timeLeft / level.timeLimit;
        const earned = pct > 0.55 ? 3 : pct > 0.25 ? 2 : 1;
        setTimeout(() => onComplete(earned, state.timeLeft, state.score), 400);
        return;
      }

      setScore(state.score);
      setTimeLeft(state.timeLeft);
      setCombo(state.combo);

      if (!gameOverRef.current) animRef.current = requestAnimationFrame(loop);
    },
    [level, onLose, onComplete],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    gameOverRef.current = false;
    completedRef.current = false;
    const state = stateRef.current;
    state.score = 0;
    state.timeLeft = level.timeLimit;
    state.stars = [];
    state.sparkles = [];
    state.lastTime = 0;
    state.bgStars = [];
    state.combo = 0;
    state.lastCatchTime = 0;
    setScore(0);
    setTimeLeft(level.timeLimit);
    setCombo(0);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      state.playerX = canvas.width / 2;
    };
    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(loop);

    const move = (cx: number) => {
      const rect = canvas.getBoundingClientRect();
      state.playerX = cx - rect.left;
    };
    const onMM = (e: MouseEvent) => move(e.clientX);
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMM);
    canvas.addEventListener("touchmove", onTM, { passive: false });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMM);
      canvas.removeEventListener("touchmove", onTM);
    };
  }, [loop, level]);

  const timePct = Math.max(0, (timeLeft / level.timeLimit) * 100);
  const scorePct = Math.max(0, Math.min(100, (score / level.target) * 100));
  const tColor =
    timePct > 50 ? "#4ade80" : timePct > 25 ? "#facc15" : "#ef4444";
  const diffColor =
    level.difficulty === "Easy"
      ? "border-green-400/40 text-green-400"
      : level.difficulty === "Medium"
        ? "border-yellow-400/40 text-yellow-400"
        : "border-red-400/40 text-red-400";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-transparent overflow-hidden rounded-3xl"
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-white/40 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
      >
        ← Levels
      </button>
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-3xl bg-transparent cursor-crosshair touch-none"
      />
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/50 text-[10px] font-mono uppercase">
              Lvl {levelIndex + 1} — {level.label}
            </span>
            <div className="w-28 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${scorePct}%`,
                  background: "linear-gradient(90deg, #facc15, #f59e0b)",
                }}
              />
            </div>
            <span className="text-white font-bold text-xs font-mono">
              {score} / {level.target}
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
            <div className="w-28 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{ width: `${timePct}%`, backgroundColor: tColor }}
              />
            </div>
            <span
              className="font-bold text-xs font-mono"
              style={{ color: tColor }}
            >
              {Math.ceil(timeLeft)}s
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-white/20 text-xs font-mono">
          Move mouse / finger to catch stars • Blue stars = bonus points
        </span>
      </div>
    </div>
  );
};

// ─── MAIN ───
const StarCatcherCanvas: React.FC<Props> = ({ onWin, onLose, difficulty }) => {
  const STORAGE_KEY = "starcatcher_progress";
  const loadProgress = () => {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      if (r) return JSON.parse(r);
    } catch {}
    return { unlockedLevel: 0, stars: Array(ALL_LEVELS.length).fill(0) };
  };
  const saveProgress = (u: number, s: number[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ unlockedLevel: u, stars: s }),
      );
    } catch {}
  };

  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState<"menu" | "play" | "complete">("menu");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [cStars, setCStars] = useState(0);
  const [cTime, setCTime] = useState(0);
  const [cScore, setCScore] = useState(0);
  const allWonRef = useRef(false);

  useEffect(() => {
    setScreen("menu");
    allWonRef.current = false;
  }, [difficulty]);

  const handleSelect = (idx: number) => {
    setCurrentIdx(idx);
    setScreen("play");
  };

  const handleComplete = (
    earned: number,
    timeRem: number,
    finalScore: number,
  ) => {
    const ns = [...progress.stars];
    ns[currentIdx] = Math.max(ns[currentIdx], earned);
    const nu = Math.min(
      Math.max(progress.unlockedLevel, currentIdx + 1),
      ALL_LEVELS.length - 1,
    );
    const np = { unlockedLevel: nu, stars: ns };
    setProgress(np);
    saveProgress(nu, ns);
    setCStars(earned);
    setCTime(timeRem);
    setCScore(finalScore);
    setScreen("complete");
    if (ns.every((s) => s > 0) && !allWonRef.current) {
      allWonRef.current = true;
      setTimeout(() => onWin(), 2500);
    }
  };

  const cur = ALL_LEVELS[currentIdx];

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
              onSelect={handleSelect}
            />
          </motion.div>
        )}
        {screen === "play" && cur && (
          <motion.div
            key={`play-${currentIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <GameplayScreen
              level={cur}
              levelIndex={currentIdx}
              onComplete={handleComplete}
              onLose={onLose}
              onBack={() => setScreen("menu")}
            />
          </motion.div>
        )}
        {screen === "complete" && cur && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
            <LevelComplete
              levelNum={currentIdx + 1}
              levelLabel={cur.label}
              earnedStars={cStars}
              score={cScore}
              target={cur.target}
              timeRemaining={cTime}
              isLast={currentIdx >= ALL_LEVELS.length - 1}
              onNext={() => {
                setCurrentIdx((i) => i + 1);
                setScreen("play");
              }}
              onMenu={() => setScreen("menu")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarCatcherCanvas;
