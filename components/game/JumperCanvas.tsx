"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface JumperCanvasProps {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
}

interface LevelConfig {
  totalTime: number;
  spawnRate: number;
  orbSpeedMin: number;
  orbSpeedMax: number;
  orbValue: number;
  rocketLerp: number;
  target: number;
  label: string;
  difficulty: Difficulty;
  description: string;
  hasBombs: boolean;
}

const ALL_LEVELS: LevelConfig[] = [
  {
    totalTime: 60,
    spawnRate: 1.2,
    orbSpeedMin: 80,
    orbSpeedMax: 140,
    orbValue: 40,
    rocketLerp: 0.3,
    target: 400,
    label: "Liftoff",
    difficulty: "Easy",
    description: "Collect 400 points. Nice and easy.",
    hasBombs: false,
  },
  {
    totalTime: 55,
    spawnRate: 1.3,
    orbSpeedMin: 100,
    orbSpeedMax: 160,
    orbValue: 35,
    rocketLerp: 0.28,
    target: 500,
    label: "Low Orbit",
    difficulty: "Easy",
    description: "500 points. A bit faster now.",
    hasBombs: false,
  },
  {
    totalTime: 50,
    spawnRate: 1.35,
    orbSpeedMin: 110,
    orbSpeedMax: 175,
    orbValue: 35,
    rocketLerp: 0.27,
    target: 600,
    label: "Stratosphere",
    difficulty: "Easy",
    description: "600 points. Gaining altitude.",
    hasBombs: false,
  },
  {
    totalTime: 45,
    spawnRate: 1.1,
    orbSpeedMin: 130,
    orbSpeedMax: 195,
    orbValue: 35,
    rocketLerp: 0.26,
    target: 700,
    label: "Asteroid Belt",
    difficulty: "Medium",
    description: "Watch for red bombs!",
    hasBombs: true,
  },
  {
    totalTime: 42,
    spawnRate: 1.15,
    orbSpeedMin: 145,
    orbSpeedMax: 210,
    orbValue: 30,
    rocketLerp: 0.25,
    target: 800,
    label: "Deep Space",
    difficulty: "Medium",
    description: "800 points. Getting intense.",
    hasBombs: true,
  },
  {
    totalTime: 38,
    spawnRate: 1.2,
    orbSpeedMin: 155,
    orbSpeedMax: 225,
    orbValue: 30,
    rocketLerp: 0.24,
    target: 900,
    label: "Warp Speed",
    difficulty: "Medium",
    description: "900 points with bombs.",
    hasBombs: true,
  },
  {
    totalTime: 35,
    spawnRate: 1.0,
    orbSpeedMin: 170,
    orbSpeedMax: 240,
    orbValue: 30,
    rocketLerp: 0.23,
    target: 1000,
    label: "Event Horizon",
    difficulty: "Hard",
    description: "1000 points. Extreme speed.",
    hasBombs: true,
  },
  {
    totalTime: 30,
    spawnRate: 1.05,
    orbSpeedMin: 185,
    orbSpeedMax: 255,
    orbValue: 28,
    rocketLerp: 0.22,
    target: 1100,
    label: "Singularity",
    difficulty: "Hard",
    description: "1100 points. Nearly impossible.",
    hasBombs: true,
  },
  {
    totalTime: 28,
    spawnRate: 1.1,
    orbSpeedMin: 200,
    orbSpeedMax: 270,
    orbValue: 25,
    rocketLerp: 0.21,
    target: 1200,
    label: "Big Bang",
    difficulty: "Hard",
    description: "The ultimate challenge.",
    hasBombs: true,
  },
];

interface Orb {
  x: number;
  y: number;
  radius: number;
  speed: number;
  value: number;
  type: "normal" | "bonus" | "bomb";
}

interface BgStar {
  x: number;
  y: number;
  radius: number;
  twinkleOffset: number;
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
          <div className="text-5xl mb-3">🌑</div>
          <h2 className="text-3xl font-serif text-white mb-2">Moon Jump</h2>
          <p className="text-white/50 text-sm">Choose your level</p>
          <p className="text-white/20 text-xs font-mono mt-2">
            Stars: {stars.reduce((a, b) => a + b, 0)} / {ALL_LEVELS.length * 3}
          </p>
        </motion.div>
        {sections.map((sec, si) => (
          <motion.div
            key={sec.label}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: si * 0.12 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sec.color }}
              />
              <span
                className="text-sm font-mono font-bold uppercase tracking-wider"
                style={{ color: sec.color }}
              >
                {sec.label}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sec.levels.map((idx) => {
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
                        ? sec.color + "50"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {unlocked ? (
                      <>
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: sec.color }}
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
      transition={{ type: "spring" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
    >
      <div className="text-5xl mb-4">🚀</div>
      <h3 className="text-2xl font-serif text-white mb-1">
        Level {levelNum} Complete!
      </h3>
      <p className="text-white/40 text-sm mb-2 font-mono">{levelLabel}</p>
      <p className="text-white/30 text-xs mb-4 font-mono">
        Score: {score} / {target} • Time: {Math.ceil(timeRemaining)}s
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
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95"
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const isGameOverRef = useRef(false);
  const isUnmountedRef = useRef(false);
  const completedRef = useRef(false);

  const rocketXRef = useRef(0);
  const rocketTargetXRef = useRef(0);
  const orbsRef = useRef<Orb[]>([]);
  const bgStarsRef = useRef<BgStar[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const canvasWidthRef = useRef(0);
  const canvasHeightRef = useRef(0);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(0);
  const lastTsRef = useRef(0);
  const spawnAccRef = useRef(0);
  const uiUpdateRef = useRef(0);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Resize
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasWidthRef.current = rect.width;
      canvasHeightRef.current = rect.height;
      rocketXRef.current = rect.width / 2;
      rocketTargetXRef.current = rect.width / 2;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Input
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateTarget = (cx: number) => {
      const rect = canvas.getBoundingClientRect();
      rocketTargetXRef.current =
        ((cx - rect.left) / rect.width) * canvasWidthRef.current;
    };
    const onMM = (e: MouseEvent) => updateTarget(e.clientX);
    const onTM = (e: TouchEvent) => {
      if (e.touches[0]) updateTarget(e.touches[0].clientX);
    };
    canvas.addEventListener("mousemove", onMM);
    canvas.addEventListener("touchmove", onTM, { passive: true });
    return () => {
      canvas.removeEventListener("mousemove", onMM);
      canvas.removeEventListener("touchmove", onTM);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isGameOverRef.current = false;
    isUnmountedRef.current = false;
    completedRef.current = false;
    orbsRef.current = [];
    sparklesRef.current = [];
    spawnAccRef.current = 0;
    scoreRef.current = 0;
    timeLeftRef.current = level.totalTime;
    setScore(0);
    setTimeLeft(level.totalTime);

    if (bgStarsRef.current.length === 0) {
      for (let i = 0; i < 80; i++)
        bgStarsRef.current.push({
          x: Math.random(),
          y: Math.random(),
          radius: Math.random() * 1.5 + 0.5,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
    }
    lastTsRef.current = performance.now();
    uiUpdateRef.current = performance.now();

    const endGame = (win: boolean) => {
      if (isGameOverRef.current || isUnmountedRef.current) return;
      isGameOverRef.current = true;
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      if (win) {
        const pct = timeLeftRef.current / level.totalTime;
        const earned = pct > 0.55 ? 3 : pct > 0.25 ? 2 : 1;
        setTimeout(() => {
          if (!isUnmountedRef.current)
            onComplete(earned, timeLeftRef.current, scoreRef.current);
        }, 200);
      } else {
        setTimeout(() => {
          if (!isUnmountedRef.current) onLose();
        }, 0);
      }
    };

    const spawnOrb = () => {
      const w = canvasWidthRef.current;
      const radius = 10 + Math.random() * 10;
      const speed =
        level.orbSpeedMin +
        Math.random() * (level.orbSpeedMax - level.orbSpeedMin);
      let type: "normal" | "bonus" | "bomb" = "normal";
      const roll = Math.random();
      if (level.hasBombs && roll < 0.1) type = "bomb";
      else if (roll < 0.2) type = "bonus";
      orbsRef.current.push({
        x: radius + Math.random() * (w - radius * 2),
        y: -radius - 10,
        radius:
          type === "bomb"
            ? radius * 0.9
            : type === "bonus"
              ? radius * 1.2
              : radius,
        speed,
        value:
          type === "bomb"
            ? -50
            : type === "bonus"
              ? level.orbValue * 2
              : level.orbValue,
        type,
      });
    };

    const update = (dt: number, now: number) => {
      const width = canvasWidthRef.current;
      const height = canvasHeightRef.current;
      if (!width || !height) return;

      timeLeftRef.current -= dt;
      if (timeLeftRef.current <= 0) {
        timeLeftRef.current = 0;
        endGame(scoreRef.current >= level.target);
        return;
      }

      for (const s of bgStarsRef.current) {
        s.y += dt * 0.05;
        if (s.y > 1) s.y -= 1;
      }

      const targetX = rocketTargetXRef.current || width / 2;
      let nextX =
        rocketXRef.current + (targetX - rocketXRef.current) * level.rocketLerp;
      const rw = Math.max(40, width * 0.06);
      const margin = rw * 0.6;
      nextX = Math.max(margin, Math.min(width - margin, nextX));
      rocketXRef.current = nextX;

      spawnAccRef.current += dt * level.spawnRate;
      while (spawnAccRef.current >= 1) {
        spawnOrb();
        spawnAccRef.current -= 1;
      }

      const rocketWidth = rw;
      const rocketHeight = rw * 1.8;
      const rocketX = rocketXRef.current;
      const rocketY = height - rocketHeight * 0.55 - 16;

      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i];
        orb.y += orb.speed * dt;
        if (orb.y - orb.radius > height + 40) {
          orbsRef.current.splice(i, 1);
          continue;
        }
        const nx = Math.max(
          rocketX - rocketWidth / 2,
          Math.min(orb.x, rocketX + rocketWidth / 2),
        );
        const ny = Math.max(
          rocketY - rocketHeight / 2,
          Math.min(orb.y, rocketY + rocketHeight / 2),
        );
        const ddx = orb.x - nx;
        const ddy = orb.y - ny;
        if (ddx * ddx + ddy * ddy < orb.radius * orb.radius) {
          scoreRef.current = Math.max(0, scoreRef.current + orb.value);
          if (scoreRef.current > level.target) scoreRef.current = level.target;
          const color =
            orb.type === "bomb"
              ? "#ef4444"
              : orb.type === "bonus"
                ? "#60a5fa"
                : "#facc15";
          for (let j = 0; j < 6; j++) {
            const a = Math.random() * Math.PI * 2;
            sparklesRef.current.push({
              x: orb.x,
              y: orb.y,
              vx: Math.cos(a) * 2,
              vy: Math.sin(a) * 2,
              life: 1,
              color,
              size: 3,
            });
          }
          orbsRef.current.splice(i, 1);
          if (scoreRef.current >= level.target) {
            endGame(true);
            return;
          }
        }
      }

      for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
        const s = sparklesRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= dt * 3;
        if (s.life <= 0) sparklesRef.current.splice(i, 1);
      }

      if (now - uiUpdateRef.current > 80) {
        uiUpdateRef.current = now;
        setScore(scoreRef.current);
        setTimeLeft(timeLeftRef.current);
      }
    };

    const drawRocket = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
    ) => {
      const h = w * 1.8;
      ctx.save();
      ctx.translate(x, y);
      // Tilt
      const tilt = (rocketTargetXRef.current - x) * 0.003;
      ctx.rotate(Math.max(-0.3, Math.min(0.3, tilt)));
      // Flame
      const fh = h * 0.4;
      const fg = ctx.createLinearGradient(0, h / 2, 0, h / 2 + fh);
      fg.addColorStop(0, "#ff6b35");
      fg.addColorStop(0.5, "#ffa500");
      fg.addColorStop(1, "rgba(255,165,0,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, h / 2);
      ctx.quadraticCurveTo(
        0,
        h / 2 + fh * (0.8 + Math.random() * 0.4),
        w * 0.25,
        h / 2,
      );
      ctx.fill();
      // Body
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 4, w / 2, h / 4);
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 4);
      ctx.quadraticCurveTo(-w / 2, -h / 4, 0, -h / 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.quadraticCurveTo(w * 0.3, -h / 3, w * 0.2, -h / 5);
      ctx.lineTo(-w * 0.2, -h / 5);
      ctx.quadraticCurveTo(-w * 0.3, -h / 3, 0, -h / 2);
      ctx.fill();
      // Window
      ctx.fillStyle = "#60a5fa";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -h * 0.05, w * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Fins
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(-w / 2, h / 3);
      ctx.lineTo(-w * 0.8, h / 2 + 4);
      ctx.lineTo(-w / 2, h / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 3);
      ctx.lineTo(w * 0.8, h / 2 + 4);
      ctx.lineTo(w / 2, h / 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = (ctx: CanvasRenderingContext2D, now: number) => {
      const width = canvasWidthRef.current;
      const height = canvasHeightRef.current;
      if (!width || !height) return;
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#020617");
      bg.addColorStop(0.5, "#0f172a");
      bg.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      for (const star of bgStarsRef.current) {
        const sx = star.x * width;
        const sy = star.y * height;
        const tw = 0.5 + 0.5 * Math.sin(now / 1000 + star.twinkleOffset);
        ctx.globalAlpha = 0.3 + 0.5 * tw;
        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Orbs
      ctx.save();
      for (const orb of orbsRef.current) {
        const colors: Record<string, { core: string; glow: string }> = {
          normal: { core: "#facc15", glow: "rgba(250,204,21," },
          bonus: { core: "#60a5fa", glow: "rgba(96,165,250," },
          bomb: { core: "#ef4444", glow: "rgba(239,68,68," },
        };
        const c = colors[orb.type];
        const grd = ctx.createRadialGradient(
          orb.x,
          orb.y,
          orb.radius * 0.2,
          orb.x,
          orb.y,
          orb.radius * 2,
        );
        grd.addColorStop(0, c.glow + "0.5)");
        grd.addColorStop(1, c.glow + "0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.core;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        if (orb.type === "bomb") {
          ctx.fillStyle = "white";
          ctx.font = `${orb.radius}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💥", orb.x, orb.y);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.beginPath();
          ctx.arc(
            orb.x - orb.radius * 0.2,
            orb.y - orb.radius * 0.2,
            orb.radius * 0.35,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.restore();

      // Sparkles
      for (const s of sparklesRef.current) {
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const rw = Math.max(40, width * 0.06);
      const rh = rw * 1.8;
      const rx = rocketXRef.current || width / 2;
      const ry = height - rh * 0.55 - 16;
      drawRocket(ctx, rx, ry, rw);
    };

    const loop = (now: number) => {
      if (isGameOverRef.current || isUnmountedRef.current) return;
      const last = lastTsRef.current || now;
      let dt = (now - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      lastTsRef.current = now;
      update(dt, now);
      draw(ctx, now);
      if (!isGameOverRef.current && !isUnmountedRef.current)
        animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      isUnmountedRef.current = true;
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    };
  }, [level, onLose, onComplete]);

  const timePct = Math.max(
    0,
    Math.min(100, (timeLeft / level.totalTime) * 100),
  );
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
        className="w-full h-full block rounded-3xl bg-transparent cursor-crosshair"
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
          Move mouse/finger to steer
          {level.hasBombs ? " • Avoid 💥 bombs!" : " • Catch golden orbs"}
        </span>
      </div>
    </div>
  );
};

// ─── MAIN ───
const JumperCanvas: React.FC<JumperCanvasProps> = ({
  onWin,
  onLose,
  difficulty,
}) => {
  const STORAGE_KEY = "jumper_progress";
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
  const handleComplete = (earned: number, tl: number, sc: number) => {
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
    setCTime(tl);
    setCScore(sc);
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

export default JumperCanvas;
