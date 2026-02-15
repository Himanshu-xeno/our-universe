"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_CONFIG } from "@/utils/constants";

interface Vec2 {
  x: number;
  y: number;
}
interface PlayerEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  glow: number;
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
interface GoalEntity {
  x: number;
  y: number;
  size: number;
  glow: number;
}
interface GameState {
  player: PlayerEntity;
  obstacles: ObstacleEntity[];
  collectibles: CollectibleEntity[];
  goal: GoalEntity;
  collectedCount: number;
  shakeAmount: number;
  shakeDecay: number;
  gameOver: boolean;
  gameWon: boolean;
  time: number;
}

interface GameCanvasProps {
  onWin: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchRef = useRef<{ startX: number; startY: number; active: boolean }>({
    startX: 0,
    startY: 0,
    active: false,
  });
  const touchDirRef = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const initGame = useCallback((width: number, height: number): GameState => {
    const padding = GAME_CONFIG.CANVAS_PADDING;
    return {
      player: {
        x: width / 2,
        y: height - 80,
        vx: 0,
        vy: 0,
        size: GAME_CONFIG.PLAYER_SIZE,
        glow: 0,
      },
      obstacles: GAME_CONFIG.OBSTACLE_LABELS.map((label, i) => ({
        x: padding + ((i % 3) + 0.5) * ((width - padding * 2) / 3),
        y: height * 0.3 + Math.floor(i / 3) * (height * 0.2),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.5,
        width: 120,
        height: 45, // Wider obstacles
        label,
        color: `hsl(${0 + i * 20}, 70%, 50%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })),
      collectibles: GAME_CONFIG.COLLECTIBLE_LABELS.map((label, i) => ({
        x: padding + 80 + Math.random() * (width - padding * 2 - 160),
        y: height * 0.25 + Math.random() * (height * 0.45),
        size: 24,
        label,
        color: ["#4ecdc4", "#ffd700", "#7b68ee"][i % 3],
        collected: false,
        pulsePhase: Math.random() * Math.PI * 2,
      })),
      goal: { x: width / 2, y: 60, size: 30, glow: 0 },
      collectedCount: 0,
      shakeAmount: 0,
      shakeDecay: 0.9,
      gameOver: false,
      gameWon: false,
      time: 0,
    };
  }, []);

  const gameLoop = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const state = gameStateRef.current;
      if (!state || state.gameWon) return;

      state.time += 1 / 60;
      const speed = GAME_CONFIG.PLAYER_SPEED;
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
      state.player.vx += ax * speed * 0.3;
      state.player.vy += ay * speed * 0.3;
      state.player.vx *= 0.85;
      state.player.vy *= 0.85;

      state.player.x = Math.max(
        state.player.size,
        Math.min(width - state.player.size, state.player.x + state.player.vx),
      );
      state.player.y = Math.max(
        state.player.size,
        Math.min(height - state.player.size, state.player.y + state.player.vy),
      );
      state.player.glow = Math.sin(state.time * 3) * 0.3 + 0.7;

      state.obstacles.forEach((obs) => {
        obs.x += obs.vx;
        obs.y += obs.vy;
        obs.rotation += obs.rotationSpeed;
        if (obs.x < 40 || obs.x > width - 40) obs.vx *= -1;
        if (obs.y < 40 || obs.y > height - 40) obs.vy *= -1;
        const dx = state.player.x - obs.x,
          dy = state.player.y - obs.y;
        if (Math.sqrt(dx * dx + dy * dy) < state.player.size + obs.width / 2) {
          state.shakeAmount = 15;
          state.player.x = width / 2;
          state.player.y = height - 80;
          state.player.vx = 0;
          state.player.vy = 0;
        }
      });

      state.collectibles.forEach((col) => {
        if (col.collected) return;
        if (
          Math.sqrt(
            (state.player.x - col.x) ** 2 + (state.player.y - col.y) ** 2,
          ) <
          state.player.size + col.size
        ) {
          col.collected = true;
          state.collectedCount += 1;
        }
        col.pulsePhase += 0.05;
      });

      if (state.collectedCount >= GAME_CONFIG.COLLECTIBLES_TO_WIN) {
        if (
          Math.sqrt(
            (state.player.x - state.goal.x) ** 2 +
              (state.player.y - state.goal.y) ** 2,
          ) <
          state.player.size + state.goal.size
        ) {
          state.gameWon = true;
          setShowWinMessage(true);
          setTimeout(() => onWin(), 3000);
          return;
        }
      }

      state.shakeAmount *= state.shakeDecay;
      ctx.save();
      if (state.shakeAmount > 0.5)
        ctx.translate(
          (Math.random() - 0.5) * state.shakeAmount,
          (Math.random() - 0.5) * state.shakeAmount,
        );
      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, width, height);

      // Draw Collectibles
      state.collectibles.forEach((col) => {
        if (col.collected) return;
        ctx.fillStyle = col.color;
        ctx.beginPath();
        ctx.arc(
          col.x,
          col.y,
          col.size * (Math.sin(col.pulsePhase) * 0.3 + 1),
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif"; // INCREASED FONT
        ctx.fillText(col.label, col.x - 20, col.y + 40);
      });

      // Draw Obstacles
      state.obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = obs.color + "40";
        ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.strokeStyle = obs.color;
        ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 25px sans-serif"; // INCREASED FONT
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obs.label, 0, 0);
        ctx.restore();
      });

      // Goal
      const goalAlpha =
        state.collectedCount >= GAME_CONFIG.COLLECTIBLES_TO_WIN ? 1 : 0.3;
      ctx.globalAlpha = goalAlpha;
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.arc(state.goal.x, state.goal.y, state.goal.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw Player (HEART EMOJI)
      ctx.font = "40px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("❤️", state.player.x, state.player.y);

      // HUD Tracker - INCREASED FONT SIZE
      ctx.fillStyle = "white";
      ctx.font = "bold 24px monospace";
      const hudMargin = 20; // 20px from the left
      ctx.textAlign = "left"; // align text to the left edge
      ctx.fillText(
        `Collected: ${state.collectedCount} / ${GAME_CONFIG.COLLECTIBLES_TO_WIN}`,
        hudMargin,
        40,
      );

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(() =>
        gameLoop(ctx, width, height),
      );
    },
    [onWin],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gameStateRef.current = initGame(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    if (ctx)
      animFrameRef.current = requestAnimationFrame(() =>
        gameLoop(ctx, canvas.width, canvas.height),
      );

    const onKeyDown = (e: KeyboardEvent) =>
      keysRef.current.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) =>
      keysRef.current.delete(e.key.toLowerCase());
    const onTouchStart = (e: TouchEvent) => {
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        active: true,
      };
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touchRef.current.startX;
      const dy = e.touches[0].clientY - touchRef.current.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) touchDirRef.current = { x: dx / dist, y: dy / dist };
    };
    const onTouchEnd = () => {
      touchRef.current.active = false;
      touchDirRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [initGame, gameLoop]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <AnimatePresence>
        {showWinMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10"
          >
            <p className="text-3xl text-nebula-pink text-glow">
              We always find each other.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default React.memo(GameCanvas);
