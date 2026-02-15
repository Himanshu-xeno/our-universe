"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Vec2 {
  x: number;
  y: number;
}

interface LevelConfig {
  timeLimit: number;
  obstacleCount: number;
  obstacleSpeedMul: number;
  collectiblesNeeded: number;
  playerSpeed: number;
  label: string;
  difficulty: Difficulty;
  description: string;
  trackPlayer: boolean;
}

const ALL_LEVELS: LevelConfig[] = [
  {
    timeLimit: 120,
    obstacleCount: 2,
    obstacleSpeedMul: 0.4,
    collectiblesNeeded: 2,
    playerSpeed: 5.5,
    label: "Dawn",
    difficulty: "Easy",
    description: "Collect 2 items. Few obstacles.",
    trackPlayer: false,
  },
  {
    timeLimit: 110,
    obstacleCount: 3,
    obstacleSpeedMul: 0.5,
    collectiblesNeeded: 3,
    playerSpeed: 5.2,
    label: "First Steps",
    difficulty: "Easy",
    description: "3 items, gentle obstacles.",
    trackPlayer: false,
  },
  {
    timeLimit: 100,
    obstacleCount: 4,
    obstacleSpeedMul: 0.6,
    collectiblesNeeded: 3,
    playerSpeed: 5,
    label: "Sunrise",
    difficulty: "Easy",
    description: "More obstacles appear.",
    trackPlayer: false,
  },
  {
    timeLimit: 90,
    obstacleCount: 5,
    obstacleSpeedMul: 0.8,
    collectiblesNeeded: 4,
    playerSpeed: 4.8,
    label: "Twilight",
    difficulty: "Medium",
    description: "Faster obstacles. 4 items.",
    trackPlayer: false,
  },
  {
    timeLimit: 80,
    obstacleCount: 6,
    obstacleSpeedMul: 1.0,
    collectiblesNeeded: 4,
    playerSpeed: 4.5,
    label: "Dusk",
    difficulty: "Medium",
    description: "Obstacles track you slightly.",
    trackPlayer: true,
  },
  {
    timeLimit: 70,
    obstacleCount: 7,
    obstacleSpeedMul: 1.1,
    collectiblesNeeded: 5,
    playerSpeed: 4.5,
    label: "Eclipse",
    difficulty: "Medium",
    description: "5 items. Smart obstacles.",
    trackPlayer: true,
  },
  {
    timeLimit: 60,
    obstacleCount: 8,
    obstacleSpeedMul: 1.3,
    collectiblesNeeded: 5,
    playerSpeed: 4.2,
    label: "Void",
    difficulty: "Hard",
    description: "The darkness closes in.",
    trackPlayer: true,
  },
  {
    timeLimit: 50,
    obstacleCount: 9,
    obstacleSpeedMul: 1.5,
    collectiblesNeeded: 5,
    playerSpeed: 4,
    label: "Black Hole",
    difficulty: "Hard",
    description: "Nearly impossible.",
    trackPlayer: true,
  },
  {
    timeLimit: 45,
    obstacleCount: 10,
    obstacleSpeedMul: 1.7,
    collectiblesNeeded: 5,
    playerSpeed: 3.8,
    label: "Singularity",
    difficulty: "Hard",
    description: "The ultimate journey.",
    trackPlayer: true,
  },
];

const OBS_LABELS = [
  "Doubt",
  "Fear",
  "Ego",
  "Anger",
  "Jealousy",
  "Anxiety",
  "Regret",
  "Spite",
  "Grief",
  "Pain",
];
const COL_LABELS = ["Trust", "Hope", "Love", "Joy", "Peace"];

interface PlayerEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  glow: number;
  trail: { x: number; y: number; alpha: number }[];
  invincible: number;
}
interface ObstacleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  label: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
}
interface CollectibleEntity {
  x: number;
  y: number;
  size: number;
  label: string;
  color: string;
  collected: boolean;
  pulsePhase: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
interface GoalEntity {
  x: number;
  y: number;
  size: number;
}
interface GameState {
  player: PlayerEntity;
  obstacles: ObstacleEntity[];
  collectibles: CollectibleEntity[];
  goal: GoalEntity;
  collectedCount: number;
  shakeAmount: number;
  gameOver: boolean;
  gameWon: boolean;
  time: number;
  timeLeft: number;
  particles: Particle[];
}

interface GameCanvasProps {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0a0e1a] to-[#1a0a2e]" />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">🚀</div>
          <h2 className="text-3xl font-serif text-white mb-2">
            Cosmic Journey
          </h2>
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
  timeRemaining: number;
  isLast: boolean;
  onNext: () => void;
  onMenu: () => void;
}> = ({
  levelNum,
  levelLabel,
  earnedStars,
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
      <div className="text-5xl mb-4">✨</div>
      <h3 className="text-2xl font-serif text-white mb-1">
        Level {levelNum} Complete!
      </h3>
      <p className="text-white/40 text-sm mb-2 font-mono">{levelLabel}</p>
      <p className="text-white/30 text-xs mb-4 font-mono">
        Time left: {Math.ceil(timeRemaining)}s
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
      <p className="text-nebula-pink/80 text-sm mb-6 italic font-serif">
        We always find each other.
      </p>
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
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95"
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
  onComplete: (stars: number, timeLeft: number) => void;
  onLose: () => void;
  onBack: () => void;
}> = ({ level, levelIndex, onComplete, onLose, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const endedRef = useRef(false);
  const touchRef = useRef<{ startX: number; startY: number; active: boolean }>({
    startX: 0,
    startY: 0,
    active: false,
  });
  const touchDirRef = useRef<Vec2>({ x: 0, y: 0 });
  const lastTRef = useRef(0);

  const [uiTime, setUiTime] = useState(level.timeLimit);
  const [uiCol, setUiCol] = useState(0);

  const initGame = useCallback(
    (w: number, h: number): GameState => {
      const pad = 60;
      const oc = level.obstacleCount;
      const cc = level.collectiblesNeeded;
      return {
        player: {
          x: w / 2,
          y: h - 80,
          vx: 0,
          vy: 0,
          size: 20,
          glow: 0,
          trail: [],
          invincible: 0,
        },
        obstacles: OBS_LABELS.slice(0, oc).map((label, i) => ({
          x: pad + ((i % 3) + 0.5) * ((w - pad * 2) / 3),
          y: h * 0.15 + Math.floor(i / 3) * (h * 0.13) + Math.random() * 30,
          vx: (Math.random() - 0.5) * 2 * level.obstacleSpeedMul,
          vy: (Math.random() - 0.5) * 1.5 * level.obstacleSpeedMul,
          width: 110,
          height: 42,
          label,
          color: `hsl(${i * 25}, 70%, 50%)`,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02 * level.obstacleSpeedMul,
        })),
        collectibles: COL_LABELS.slice(0, cc).map((label, i) => ({
          x: pad + 60 + Math.random() * (w - pad * 2 - 120),
          y: h * 0.12 + Math.random() * (h * 0.5),
          size: 22,
          label,
          color: ["#4ecdc4", "#ffd700", "#7b68ee", "#ff6b9d", "#00ff88"][i % 5],
          collected: false,
          pulsePhase: Math.random() * Math.PI * 2,
        })),
        goal: { x: w / 2, y: 50, size: 30 },
        collectedCount: 0,
        shakeAmount: 0,
        gameOver: false,
        gameWon: false,
        time: 0,
        timeLeft: level.timeLimit,
        particles: [],
      };
    },
    [level],
  );

  const spawnP = (
    state: GameState,
    x: number,
    y: number,
    color: string,
    n: number,
  ) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1 + Math.random() * 3;
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  };

  const gameLoop = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, ts: number) => {
      const state = gsRef.current;
      if (!state || state.gameWon || state.gameOver) return;
      if (lastTRef.current === 0) lastTRef.current = ts;
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
      lastTRef.current = ts;
      state.time += dt;
      state.timeLeft -= dt;

      if (state.player.invincible > 0) state.player.invincible -= dt;

      if (state.timeLeft <= 0 && !endedRef.current) {
        state.timeLeft = 0;
        state.gameOver = true;
        endedRef.current = true;
        onLose();
        return;
      }

      const spd = level.playerSpeed;
      let ax = 0,
        ay = 0;
      if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) ax -= 1;
      if (keysRef.current.has("arrowright") || keysRef.current.has("d"))
        ax += 1;
      if (keysRef.current.has("arrowup") || keysRef.current.has("w")) ay -= 1;
      if (keysRef.current.has("arrowdown") || keysRef.current.has("s")) ay += 1;
      if (touchRef.current.active) {
        ax += touchDirRef.current.x;
        ay += touchDirRef.current.y;
      }
      const mag = Math.sqrt(ax * ax + ay * ay);
      if (mag > 0) {
        ax /= mag;
        ay /= mag;
      }
      state.player.vx += ax * spd * 0.3;
      state.player.vy += ay * spd * 0.3;
      state.player.vx *= 0.85;
      state.player.vy *= 0.85;
      state.player.x = Math.max(
        state.player.size,
        Math.min(w - state.player.size, state.player.x + state.player.vx),
      );
      state.player.y = Math.max(
        state.player.size,
        Math.min(h - state.player.size, state.player.y + state.player.vy),
      );

      state.player.trail.push({
        x: state.player.x,
        y: state.player.y,
        alpha: 1,
      });
      if (state.player.trail.length > 15) state.player.trail.shift();
      state.player.trail.forEach((t) => (t.alpha *= 0.9));

      state.obstacles.forEach((obs) => {
        obs.x += obs.vx;
        obs.y += obs.vy;
        obs.rotation += obs.rotationSpeed;
        if (obs.x < 60 || obs.x > w - 60) obs.vx *= -1;
        if (obs.y < 40 || obs.y > h - 40) obs.vy *= -1;
        // Tracking
        if (level.trackPlayer) {
          const tdx = state.player.x - obs.x;
          const tdy = state.player.y - obs.y;
          const td = Math.sqrt(tdx * tdx + tdy * tdy);
          if (td > 0 && td < 250) {
            obs.vx += (tdx / td) * 0.03 * level.obstacleSpeedMul;
            obs.vy += (tdy / td) * 0.03 * level.obstacleSpeedMul;
          }
        }
        if (state.player.invincible <= 0) {
          const dx = state.player.x - obs.x,
            dy = state.player.y - obs.y;
          if (
            Math.sqrt(dx * dx + dy * dy) <
            state.player.size + obs.width / 2.5
          ) {
            state.shakeAmount = 15;
            spawnP(state, state.player.x, state.player.y, "#ff4444", 12);
            state.player.x = w / 2;
            state.player.y = h - 80;
            state.player.vx = 0;
            state.player.vy = 0;
            state.player.trail = [];
            state.player.invincible = 1.5;
          }
        }
      });

      state.collectibles.forEach((col) => {
        if (col.collected) return;
        col.pulsePhase += 0.05;
        if (
          Math.sqrt(
            (state.player.x - col.x) ** 2 + (state.player.y - col.y) ** 2,
          ) <
          state.player.size + col.size
        ) {
          col.collected = true;
          state.collectedCount += 1;
          spawnP(state, col.x, col.y, col.color, 15);
        }
      });

      if (state.collectedCount >= level.collectiblesNeeded) {
        if (
          Math.sqrt(
            (state.player.x - state.goal.x) ** 2 +
              (state.player.y - state.goal.y) ** 2,
          ) <
          state.player.size + state.goal.size
        ) {
          if (!endedRef.current) {
            state.gameWon = true;
            endedRef.current = true;
            spawnP(state, state.goal.x, state.goal.y, "#ff6b9d", 30);
            const pct = state.timeLeft / level.timeLimit;
            const earned = pct > 0.55 ? 3 : pct > 0.25 ? 2 : 1;
            setTimeout(() => onComplete(earned, state.timeLeft), 1500);
          }
          return;
        }
      }

      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 2;
        if (p.life <= 0) state.particles.splice(i, 1);
      }

      setUiTime(Math.ceil(state.timeLeft));
      setUiCol(state.collectedCount);

      // DRAW
      state.shakeAmount *= 0.9;
      ctx.save();
      if (state.shakeAmount > 0.5)
        ctx.translate(
          (Math.random() - 0.5) * state.shakeAmount,
          (Math.random() - 0.5) * state.shakeAmount,
        );
      const bgG = ctx.createLinearGradient(0, 0, 0, h);
      bgG.addColorStop(0, "#050816");
      bgG.addColorStop(0.5, "#0a0e1a");
      bgG.addColorStop(1, "#1a0a2e");
      ctx.fillStyle = bgG;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5 + state.time * 3) % w;
        const sy = (i * 97.3) % h;
        ctx.globalAlpha = (0.3 + 0.7 * Math.sin(state.time * 2 + i)) * 0.4;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + (i % 3) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      state.player.trail.forEach((t) => {
        ctx.globalAlpha = t.alpha * 0.3;
        ctx.fillStyle = "#ff6b9d";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      state.collectibles.forEach((col) => {
        if (col.collected) return;
        const pulse = Math.sin(col.pulsePhase) * 0.3 + 1;
        const r = col.size * pulse;
        const grd = ctx.createRadialGradient(
          col.x,
          col.y,
          r * 0.2,
          col.x,
          col.y,
          r * 2.5,
        );
        grd.addColorStop(0, col.color + "80");
        grd.addColorStop(1, col.color + "00");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(col.x, col.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = col.color;
        ctx.beginPath();
        ctx.arc(col.x, col.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(col.label, col.x, col.y + r + 16);
      });

      state.obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation);
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = obs.color + "30";
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 2;
        const rr = 8;
        ctx.beginPath();
        ctx.moveTo(-obs.width / 2 + rr, -obs.height / 2);
        ctx.lineTo(obs.width / 2 - rr, -obs.height / 2);
        ctx.quadraticCurveTo(
          obs.width / 2,
          -obs.height / 2,
          obs.width / 2,
          -obs.height / 2 + rr,
        );
        ctx.lineTo(obs.width / 2, obs.height / 2 - rr);
        ctx.quadraticCurveTo(
          obs.width / 2,
          obs.height / 2,
          obs.width / 2 - rr,
          obs.height / 2,
        );
        ctx.lineTo(-obs.width / 2 + rr, obs.height / 2);
        ctx.quadraticCurveTo(
          -obs.width / 2,
          obs.height / 2,
          -obs.width / 2,
          obs.height / 2 - rr,
        );
        ctx.lineTo(-obs.width / 2, -obs.height / 2 + rr);
        ctx.quadraticCurveTo(
          -obs.width / 2,
          -obs.height / 2,
          -obs.width / 2 + rr,
          -obs.height / 2,
        );
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obs.label, 0, 0);
        ctx.restore();
      });

      const goalReady = state.collectedCount >= level.collectiblesNeeded;
      const goalAlpha = goalReady ? 0.8 + Math.sin(state.time * 4) * 0.2 : 0.2;
      ctx.globalAlpha = goalAlpha;
      if (goalReady) {
        const gg = ctx.createRadialGradient(
          state.goal.x,
          state.goal.y,
          5,
          state.goal.x,
          state.goal.y,
          state.goal.size * 2,
        );
        gg.addColorStop(0, "#ff6b9d");
        gg.addColorStop(1, "transparent");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(
          state.goal.x,
          state.goal.y,
          state.goal.size * 2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.arc(state.goal.x, state.goal.y, state.goal.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        goalReady ? "GOAL ✨" : "Collect all first",
        state.goal.x,
        state.goal.y + state.goal.size + 16,
      );
      ctx.globalAlpha = 1;

      state.particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Player
      if (
        state.player.invincible > 0 &&
        Math.floor(state.time * 10) % 2 === 0
      ) {
        /* blink */
      } else {
        ctx.font = "34px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❤️", state.player.x, state.player.y);
      }
      ctx.restore();

      animRef.current = requestAnimationFrame((ts2) =>
        gameLoop(ctx, w, h, ts2),
      );
    },
    [level, onLose, onComplete],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    endedRef.current = false;
    lastTRef.current = 0;
    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const r = p.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      gsRef.current = initGame(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    if (ctx)
      animRef.current = requestAnimationFrame((ts) =>
        gameLoop(ctx, canvas.width, canvas.height, ts),
      );

    const kd = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const ku = (e: KeyboardEvent) =>
      keysRef.current.delete(e.key.toLowerCase());
    const ts = (e: TouchEvent) => {
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        active: true,
      };
    };
    const tm = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touchRef.current.startX;
      const dy = e.touches[0].clientY - touchRef.current.startY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 10) touchDirRef.current = { x: dx / d, y: dy / d };
    };
    const te = () => {
      touchRef.current.active = false;
      touchDirRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    canvas.addEventListener("touchstart", ts, { passive: false });
    canvas.addEventListener("touchmove", tm, { passive: false });
    canvas.addEventListener("touchend", te);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      canvas.removeEventListener("touchstart", ts);
      canvas.removeEventListener("touchmove", tm);
      canvas.removeEventListener("touchend", te);
    };
  }, [initGame, gameLoop]);

  const tColor = uiTime > 30 ? "#4ade80" : uiTime > 15 ? "#facc15" : "#ef4444";
  const diffColor =
    level.difficulty === "Easy"
      ? "border-green-400/40 text-green-400"
      : level.difficulty === "Medium"
        ? "border-yellow-400/40 text-yellow-400"
        : "border-red-400/40 text-red-400";

  return (
    <div className="relative w-full h-full">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-white/40 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
      >
        ← Levels
      </button>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/50 text-[10px] font-mono uppercase">
              Lvl {levelIndex + 1} — {level.label}
            </span>
            <span className="text-white font-bold text-xs font-mono">
              {uiCol} / {level.collectiblesNeeded}
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
            <span
              className="font-bold text-xs font-mono"
              style={{ color: tColor }}
            >
              {uiTime}s
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-white/20 text-xs font-mono">
          W/A/S/D or Arrow Keys • Collect items → Reach the goal
        </span>
      </div>
    </div>
  );
};

// ─── MAIN ───
const GameCanvas: React.FC<GameCanvasProps> = ({
  onWin,
  onLose,
  difficulty,
}) => {
  const STORAGE_KEY = "journey_progress";
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
  const allWonRef = useRef(false);

  useEffect(() => {
    setScreen("menu");
    allWonRef.current = false;
  }, [difficulty]);

  const handleSelect = (idx: number) => {
    setCurrentIdx(idx);
    setScreen("play");
  };
  const handleComplete = (earned: number, tl: number) => {
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
            <div className="w-full h-full absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0a0e1a] to-[#1a0a2e]" />
            <LevelComplete
              levelNum={currentIdx + 1}
              levelLabel={cur.label}
              earnedStars={cStars}
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

export default React.memo(GameCanvas);
