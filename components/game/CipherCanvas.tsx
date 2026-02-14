"use client";
import React, { useRef, useEffect } from "react";

const CipherCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const WORD = "ETERNITY";
  const stateRef = useRef({ bubbles: [] as any[], progress: 0, won: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = Math.min(600, window.innerWidth - 30);
    canvas.height = 400;

    stateRef.current.bubbles = WORD.split("")
      .sort(() => Math.random() - 0.5)
      .map((char) => ({
        char,
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        r: 25,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        active: true,
      }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const slotW = 40,
        startX = (canvas.width - WORD.length * slotW) / 2;
      for (let i = 0; i < WORD.length; i++) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(startX + i * slotW + 5, 80, slotW - 10, 2);
        if (i < stateRef.current.progress) {
          ctx.fillStyle = "#4ecdc4";
          ctx.font = "bold 24px monospace";
          ctx.textAlign = "center";
          ctx.fillText(WORD[i], startX + i * slotW + slotW / 2, 70);
        }
      }
      stateRef.current.bubbles.forEach((b) => {
        if (!b.active) return;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
        if (b.y < 100 || b.y > canvas.height - b.r) b.vy *= -1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();
        ctx.strokeStyle = "#feca57";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(b.char, b.x, b.y);
      });
      if (!stateRef.current.won) requestAnimationFrame(render);
    };
    render();

    const click = (e: MouseEvent | TouchEvent) => {
      if (stateRef.current.won) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left,
        y = clientY - rect.top;

      const target = WORD[stateRef.current.progress];
      stateRef.current.bubbles.forEach((b) => {
        if (
          b.active &&
          Math.hypot(x - b.x, y - b.y) < b.r &&
          b.char === target
        ) {
          b.active = false;
          if (++stateRef.current.progress === WORD.length) {
            stateRef.current.won = true;
            onWin();
          }
        }
      });
    };
    canvas.addEventListener("mousedown", click);
    canvas.addEventListener("touchstart", click);
    return () => {
      canvas.removeEventListener("mousedown", click);
      canvas.removeEventListener("touchstart", click);
    };
  }, [onWin]);

  return (
    <canvas ref={canvasRef} className="w-full h-full bg-black/20 rounded-xl" />
  );
};
export default CipherCanvas;
