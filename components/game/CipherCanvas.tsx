// "use client";
// import React, { useRef, useEffect } from "react";

// const CipherCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const WORD = "ETERNITY";
//   const stateRef = useRef({ bubbles: [] as any[], progress: 0, won: false });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     canvas.width = Math.min(600, window.innerWidth - 30);
//     canvas.height = 400;

//     stateRef.current.bubbles = WORD.split("")
//       .sort(() => Math.random() - 0.5)
//       .map((char) => ({
//         char,
//         x: Math.random() * (canvas.width - 60) + 30,
//         y: Math.random() * (canvas.height - 60) + 30,
//         r: 25,
//         vx: (Math.random() - 0.5) * 1.5,
//         vy: (Math.random() - 0.5) * 1.5,
//         active: true,
//       }));

//     const render = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       const slotW = 40,
//         startX = (canvas.width - WORD.length * slotW) / 2;
//       for (let i = 0; i < WORD.length; i++) {
//         ctx.fillStyle = "rgba(255,255,255,0.3)";
//         ctx.fillRect(startX + i * slotW + 5, 80, slotW - 10, 2);
//         if (i < stateRef.current.progress) {
//           ctx.fillStyle = "#4ecdc4";
//           ctx.font = "bold 24px monospace";
//           ctx.textAlign = "center";
//           ctx.fillText(WORD[i], startX + i * slotW + slotW / 2, 70);
//         }
//       }
//       stateRef.current.bubbles.forEach((b) => {
//         if (!b.active) return;
//         b.x += b.vx;
//         b.y += b.vy;
//         if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
//         if (b.y < 100 || b.y > canvas.height - b.r) b.vy *= -1;
//         ctx.beginPath();
//         ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
//         ctx.fillStyle = "rgba(255,255,255,0.1)";
//         ctx.fill();
//         ctx.strokeStyle = "#feca57";
//         ctx.stroke();
//         ctx.fillStyle = "white";
//         ctx.font = "20px sans-serif";
//         ctx.textBaseline = "middle";
//         ctx.fillText(b.char, b.x, b.y);
//       });
//       if (!stateRef.current.won) requestAnimationFrame(render);
//     };
//     render();

//     const click = (e: MouseEvent | TouchEvent) => {
//       if (stateRef.current.won) return;
//       const rect = canvas.getBoundingClientRect();
//       const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
//       const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
//       const x = clientX - rect.left,
//         y = clientY - rect.top;

//       const target = WORD[stateRef.current.progress];
//       stateRef.current.bubbles.forEach((b) => {
//         if (
//           b.active &&
//           Math.hypot(x - b.x, y - b.y) < b.r &&
//           b.char === target
//         ) {
//           b.active = false;
//           if (++stateRef.current.progress === WORD.length) {
//             stateRef.current.won = true;
//             onWin();
//           }
//         }
//       });
//     };
//     canvas.addEventListener("mousedown", click);
//     canvas.addEventListener("touchstart", click);
//     return () => {
//       canvas.removeEventListener("mousedown", click);
//       canvas.removeEventListener("touchstart", click);
//     };
//   }, [onWin]);

//   return (
//     <canvas ref={canvasRef} className="w-full h-full bg-black/20 rounded-xl" />
//   );
// };
// export default CipherCanvas;

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onWin: () => void;
}

const WORDS = [
  { word: "ETERNITY", hint: "It implies forever, like us." },
  { word: "GALAXY", hint: "A system of millions of stars." },
  { word: "DESTINY", hint: "Something that was meant to be." },
  { word: "STARDUST", hint: "We are all made of this." },
];

const CipherCanvas: React.FC<Props> = ({ onWin }) => {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("");
  const [shuffled, setScuffled] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (level < WORDS.length) {
      const w = WORDS[level].word;
      // Simple shuffle
      setScuffled(
        w
          .split("")
          .sort(() => Math.random() - 0.5)
          .join(""),
      );
      setInput("");
    } else {
      onWin();
    }
  }, [level, onWin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase() === WORDS[level].word) {
      setLevel((l) => l + 1);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (level >= WORDS.length)
    return <div className="text-white text-2xl">Decrypting...</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black/30 rounded-xl">
      <div className="mb-8 text-center">
        <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
          Level {level + 1} / {WORDS.length}
        </p>
        <motion.h2
          key={shuffled}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-mono text-nebula-blue font-bold tracking-widest"
        >
          {shuffled}
        </motion.h2>
        <p className="mt-4 text-white/70 italic text-sm bg-white/5 inline-block px-4 py-1 rounded-full">
          Hint: {WORDS[level].hint}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word..."
          className={`
            w-full bg-transparent border-b-2 text-center text-2xl py-2 text-white outline-none transition-colors
            ${error ? "border-red-500 text-red-200" : "border-white/30 focus:border-nebula-pink"}
          `}
          autoFocus
        />
        <button
          type="submit"
          className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all active:scale-95"
        >
          Decrypt
        </button>
      </form>
    </div>
  );
};

export default CipherCanvas;
