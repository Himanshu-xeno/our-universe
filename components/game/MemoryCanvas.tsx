"use client";
import React, { useRef, useEffect } from "react";

const MemoryCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    cards: [] as any[],
    flippedIndices: [] as number[],
    matches: 0,
  });
  const ICONS = ["🌟", "🌙", "🪐", "☄️", "🛸", "🌍", "☀️", "🔭"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = Math.min(600, window.innerWidth - 30);
    canvas.height = 600;

    const cols = 4,
      rows = 4,
      gap = 10,
      cw = (canvas.width - gap * 5) / 4,
      ch = (canvas.height - gap * 5) / 4;
    stateRef.current.cards = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((val, i) => ({
        val,
        x: gap + (i % 4) * (cw + gap),
        y: gap + Math.floor(i / 4) * (ch + gap),
        w: cw,
        h: ch,
        flipped: false,
        matched: false,
        scale: 1,
      }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stateRef.current.cards.forEach((c) => {
        const cx = c.x + c.w / 2;
        ctx.save();
        ctx.translate(cx, c.y);
        ctx.scale(c.scale, 1);
        ctx.fillStyle = c.flipped || c.matched ? "white" : "#7b68ee";
        ctx.fillRect(-c.w / 2, 0, c.w, c.h);
        if (c.flipped || c.matched) {
          ctx.fillStyle = "black";
          ctx.font = `${Math.min(c.w, c.h) * 0.5}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(c.val, 0, c.h / 2);
        }
        ctx.restore();
        if ((c.flipped || c.matched) && c.scale < 1) c.scale += 0.1;
      });
      requestAnimationFrame(render);
    };
    render();

    const click = (e: MouseEvent | TouchEvent) => {
      if (stateRef.current.flippedIndices.length >= 2) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left,
        y = clientY - rect.top;

      stateRef.current.cards.forEach((c, i) => {
        if (
          x > c.x &&
          x < c.x + c.w &&
          y > c.y &&
          y < c.y + c.h &&
          !c.flipped &&
          !c.matched
        ) {
          c.flipped = true;
          c.scale = 0;
          stateRef.current.flippedIndices.push(i);
          if (stateRef.current.flippedIndices.length === 2) {
            const [i1, i2] = stateRef.current.flippedIndices;
            if (
              stateRef.current.cards[i1].val === stateRef.current.cards[i2].val
            ) {
              stateRef.current.cards[i1].matched = stateRef.current.cards[
                i2
              ].matched = true;
              stateRef.current.flippedIndices = [];
              if (++stateRef.current.matches === 8) onWin();
            } else
              setTimeout(() => {
                stateRef.current.cards[i1].flipped = stateRef.current.cards[
                  i2
                ].flipped = false;
                stateRef.current.flippedIndices = [];
              }, 1000);
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
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-transparent rounded-xl"
    />
  );
};
export default MemoryCanvas;
