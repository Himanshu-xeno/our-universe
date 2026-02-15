//New code

"use client";

import React, { useEffect, useRef, useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";

interface JumperCanvasProps {
  onWin: () => void;
  onLose: () => void;
  difficulty: Difficulty;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  speed: number;
  value: number;
  glow: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  twinkleOffset: number;
}

const TARGET_SCORE = 1000;

const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  {
    totalTime: number;
    spawnRate: number;
    orbSpeedMin: number;
    orbSpeedMax: number;
    orbValue: number;
    rocketLerp: number;
  }
> = {
  Easy: {
    totalTime: 55,
    spawnRate: 1.3,
    orbSpeedMin: 120,
    orbSpeedMax: 180,
    orbValue: 40,
    rocketLerp: 0.28,
  },
  Medium: {
    totalTime: 45,
    spawnRate: 1.1,
    orbSpeedMin: 150,
    orbSpeedMax: 210,
    orbValue: 35,
    rocketLerp: 0.25,
  },
  Hard: {
    totalTime: 35,
    spawnRate: 0.95,
    orbSpeedMin: 180,
    orbSpeedMax: 240,
    orbValue: 30,
    rocketLerp: 0.23,
  },
};

const JumperCanvas: React.FC<JumperCanvasProps> = ({
  onWin,
  onLose,
  difficulty,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const isGameOverRef = useRef(false);
  const isUnmountedRef = useRef(false);

  const rocketXRef = useRef(0);
  const rocketTargetXRef = useRef(0);
  const orbsRef = useRef<Orb[]>([]);
  const starsRef = useRef<Star[]>([]);

  const canvasWidthRef = useRef(0);
  const canvasHeightRef = useRef(0);

  const scoreRef = useRef(0);
  const timeLeftRef = useRef(0);

  const lastTimestampRef = useRef(0);
  const spawnAccumulatorRef = useRef(0);
  const uiLastUpdateRef = useRef(0);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  // ---------- RESIZE ----------
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
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      canvasWidthRef.current = rect.width;
      canvasHeightRef.current = rect.height;

      rocketXRef.current = rect.width / 2;
      rocketTargetXRef.current = rect.width / 2;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ---------- INPUT ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateTarget = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const xNorm = (clientX - rect.left) / rect.width;
      const x = xNorm * canvasWidthRef.current;
      rocketTargetXRef.current = x;
    };

    const handleMouseMove = (e: MouseEvent) => updateTarget(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateTarget(e.touches[0].clientX);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // ---------- MAIN GAME LOOP ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isGameOverRef.current = false;
    isUnmountedRef.current = false;
    orbsRef.current = [];
    spawnAccumulatorRef.current = 0;

    scoreRef.current = 0;
    timeLeftRef.current = settings.totalTime;
    setScore(0);
    setTimeLeft(settings.totalTime);

    // Init stars
    if (starsRef.current.length === 0) {
      const stars: Star[] = [];
      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          radius: Math.random() * 1.5 + 0.5,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    }

    lastTimestampRef.current = performance.now();
    uiLastUpdateRef.current = performance.now();

    const safeEndGame = (win: boolean) => {
      if (isGameOverRef.current || isUnmountedRef.current) return;
      isGameOverRef.current = true;
      if (animationFrameRef.current != null)
        cancelAnimationFrame(animationFrameRef.current);
      setTimeout(() => {
        if (isUnmountedRef.current) return;
        if (win) onWin();
        else onLose();
      }, 0);
    };

    const spawnOrb = () => {
      const w = canvasWidthRef.current;
      const radius = 10 + Math.random() * 10;
      const speed =
        settings.orbSpeedMin +
        Math.random() * (settings.orbSpeedMax - settings.orbSpeedMin);
      orbsRef.current.push({
        x: radius + Math.random() * (w - radius * 2),
        y: -radius - 10,
        radius,
        speed,
        value: settings.orbValue,
        glow: 0,
      });
    };

    const update = (dt: number, now: number) => {
      const width = canvasWidthRef.current;
      const height = canvasHeightRef.current;
      if (!width || !height) return;

      // Timer
      timeLeftRef.current -= dt;
      if (timeLeftRef.current <= 0) {
        timeLeftRef.current = 0;
        if (scoreRef.current >= TARGET_SCORE) safeEndGame(true);
        else safeEndGame(false);
        return;
      }

      // Stars drift
      for (const s of starsRef.current) {
        s.y += dt * 0.05;
        if (s.y > 1) s.y -= 1;
      }

      // Rocket movement
      const targetX = rocketTargetXRef.current || width / 2;
      const currentX = rocketXRef.current || width / 2;
      let nextX = currentX + (targetX - currentX) * settings.rocketLerp;
      const rocketBaseWidth = Math.max(40, width * 0.06);
      const margin = rocketBaseWidth * 0.6;
      nextX = Math.max(margin, Math.min(width - margin, nextX));
      rocketXRef.current = nextX;

      // Spawn orbs
      spawnAccumulatorRef.current += dt * settings.spawnRate;
      while (spawnAccumulatorRef.current >= 1) {
        spawnOrb();
        spawnAccumulatorRef.current -= 1;
      }

      // Orbs movement & collisions
      const orbs = orbsRef.current;
      const rocketWidth = rocketBaseWidth;
      const rocketHeight = rocketWidth * 1.8;
      const rocketX = rocketXRef.current;
      const rocketY = height - rocketHeight * 0.55 - 16;

      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.y += orb.speed * dt;

        if (orb.y - orb.radius > height + 40) {
          orbs.splice(i, 1);
          continue;
        }

        const nearestX = Math.max(
          rocketX - rocketWidth / 2,
          Math.min(orb.x, rocketX + rocketWidth / 2),
        );
        const nearestY = Math.max(
          rocketY - rocketHeight / 2,
          Math.min(orb.y, rocketY + rocketHeight / 2),
        );
        const dx = orb.x - nearestX;
        const dy = orb.y - nearestY;
        if (dx * dx + dy * dy < orb.radius * orb.radius) {
          scoreRef.current += orb.value;
          if (scoreRef.current > TARGET_SCORE) scoreRef.current = TARGET_SCORE;
          orbs.splice(i, 1);

          if (scoreRef.current >= TARGET_SCORE) {
            safeEndGame(true);
            return;
          }
        }
      }

      // Update React state periodically
      if (now - uiLastUpdateRef.current > 80) {
        uiLastUpdateRef.current = now;
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

      // Flame
      const flameH = h * 0.4;
      const gradient = ctx.createLinearGradient(0, h / 2, 0, h / 2 + flameH);
      gradient.addColorStop(0, "#ff6b35");
      gradient.addColorStop(0.5, "#ffa500");
      gradient.addColorStop(1, "rgba(255,165,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, h / 2);
      ctx.quadraticCurveTo(
        0,
        h / 2 + flameH * (0.8 + Math.random() * 0.4),
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

      // Nose cone
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

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#020617");
      bg.addColorStop(0.5, "#0f172a");
      bg.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.save();
      for (const star of starsRef.current) {
        const sx = star.x * width;
        const sy = star.y * height;
        const twinkle = 0.5 + 0.5 * Math.sin(now / 1000 + star.twinkleOffset);
        ctx.globalAlpha = 0.3 + 0.5 * twinkle;
        ctx.fillStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Orbs with glow
      ctx.save();
      for (const orb of orbsRef.current) {
        // Glow
        const grd = ctx.createRadialGradient(
          orb.x,
          orb.y,
          orb.radius * 0.2,
          orb.x,
          orb.y,
          orb.radius * 2,
        );
        grd.addColorStop(0, "rgba(250,204,21,0.6)");
        grd.addColorStop(1, "rgba(250,204,21,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(
          orb.x - orb.radius * 0.2,
          orb.y - orb.radius * 0.2,
          orb.radius * 0.4,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();

      // Rocket
      const rocketWidth = Math.max(40, width * 0.06);
      const rocketHeight = rocketWidth * 1.8;
      const rocketX = rocketXRef.current || width / 2;
      const rocketY = height - rocketHeight * 0.55 - 16;
      drawRocket(ctx, rocketX, rocketY, rocketWidth);
    };

    const loop = (now: number) => {
      if (isGameOverRef.current || isUnmountedRef.current) return;
      const last = lastTimestampRef.current || now;
      let dt = (now - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      lastTimestampRef.current = now;

      update(dt, now);
      draw(ctx, now);

      if (!isGameOverRef.current && !isUnmountedRef.current) {
        const id = requestAnimationFrame(loop);
        animationFrameRef.current = id;
      }
    };

    const id = requestAnimationFrame(loop);
    animationFrameRef.current = id;

    return () => {
      isUnmountedRef.current = true;
      if (animationFrameRef.current != null)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [difficulty, onWin, onLose, settings]);

  const totalTime = settings.totalTime;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const scorePercent = Math.max(0, Math.min(100, (score / TARGET_SCORE) * 100));
  const timeColor =
    timePercent > 50 ? "#4ade80" : timePercent > 25 ? "#facc15" : "#ef4444";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-transparent overflow-hidden rounded-3xl"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-3xl bg-transparent cursor-crosshair"
      />

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Score */}
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/60 text-xs font-mono uppercase tracking-wider">
              Score
            </span>
            <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${scorePercent}%`,
                  background: "linear-gradient(90deg, #facc15, #f59e0b)",
                }}
              />
            </div>
            <span className="text-white font-bold text-sm font-mono">
              {score} / {TARGET_SCORE}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                difficulty === "Easy"
                  ? "border-green-400/40 text-green-400"
                  : difficulty === "Medium"
                    ? "border-yellow-400/40 text-yellow-400"
                    : "border-red-400/40 text-red-400"
              }`}
            >
              {difficulty}
            </span>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-white/60 text-xs font-mono uppercase tracking-wider">
              Time
            </span>
            <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${timePercent}%`,
                  backgroundColor: timeColor,
                }}
              />
            </div>
            <span
              className="font-bold text-sm font-mono"
              style={{ color: timeColor }}
            >
              {Math.ceil(timeLeft)}s
            </span>
          </div>
        </div>
      </div>

      {/* Bottom instruction */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <span className="text-white/30 text-xs font-mono">
          Move mouse / finger to control the rocket
        </span>
      </div>
    </div>
  );
};

export default JumperCanvas;
