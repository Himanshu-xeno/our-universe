"use client";
import React, { useRef, useEffect, useCallback } from "react";

const StarCatcherCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    score: 0,
    playerX: 0,
    items: [] as any[],
    lastTime: 0,
    won: false,
  });

  const loop = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const state = stateRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.05)
        state.items.push({
          x: Math.random() * canvas.width,
          y: -30,
          speed: 2 + Math.random() * 2,
        });

      const playerY = canvas.height - 60;
      ctx.font = "40px serif";
      ctx.textAlign = "center";
      ctx.fillText("🧑‍🚀", state.playerX, playerY);

      state.items.forEach((item, i) => {
        item.y += item.speed;
        ctx.font = "30px serif";
        ctx.fillText("💖", item.x, item.y);
        if (Math.hypot(item.x - state.playerX, item.y - (playerY - 20)) < 40) {
          state.items.splice(i, 1);
          state.score += 5;
        } else if (item.y > canvas.height) state.items.splice(i, 1);
      });

      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Love: ${state.score}/100`, 20, 40);

      if (state.score >= 100 && !state.won) {
        state.won = true;
        onWin();
      }
      if (!state.won) requestAnimationFrame(loop);
    },
    [onWin],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = 600;
    stateRef.current.playerX = canvas.width / 2;
    const anim = requestAnimationFrame(loop);
    const move = (x: number) =>
      (stateRef.current.playerX = x - canvas.getBoundingClientRect().left);
    const onMove = (e: MouseEvent) => move(e.clientX);
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientX);
    };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, [loop]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-black/20 rounded-xl cursor-crosshair"
    />
  );
};
export default StarCatcherCanvas;
