// "use client";
// import React, { useRef, useEffect } from "react";

// const SyncCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const stateRef = useRef({
//     size: 0,
//     growing: true,
//     hits: 0,
//     color: "#ff9ff3",
//     won: false,
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     canvas.width = 300;
//     canvas.height = 300;
//     const cx = 150,
//       cy = 150;

//     const render = () => {
//       ctx.clearRect(0, 0, 300, 300);
//       stateRef.current.size += stateRef.current.growing ? 2 : -2;
//       if (stateRef.current.size >= 140) stateRef.current.growing = false;
//       if (stateRef.current.size <= 20) stateRef.current.growing = true;

//       ctx.beginPath();
//       ctx.arc(cx, cy, 50, 0, Math.PI * 2);
//       ctx.strokeStyle = "rgba(255,255,255,0.3)";
//       ctx.lineWidth = 10;
//       ctx.stroke();
//       ctx.beginPath();
//       ctx.arc(cx, cy, stateRef.current.size / 2, 0, Math.PI * 2);
//       ctx.strokeStyle = stateRef.current.color;
//       ctx.lineWidth = 5;
//       ctx.stroke();
//       ctx.fillStyle = "white";
//       ctx.font = "16px sans-serif";
//       ctx.textAlign = "center";
//       ctx.fillText(`${stateRef.current.hits} / 5`, cx, cy + 130);
//       if (!stateRef.current.won) requestAnimationFrame(render);
//     };
//     render();

//     const click = () => {
//       if (stateRef.current.won) return;
//       if (Math.abs(stateRef.current.size - 100) < 20) {
//         stateRef.current.color = "#00ff00";
//         setTimeout(() => (stateRef.current.color = "#ff9ff3"), 200);
//         if (++stateRef.current.hits >= 5) {
//           stateRef.current.won = true;
//           onWin();
//         }
//       } else {
//         stateRef.current.hits = 0;
//         stateRef.current.color = "#ff0000";
//         setTimeout(() => (stateRef.current.color = "#ff9ff3"), 200);
//       }
//     };
//     canvas.addEventListener("mousedown", click);
//     canvas.addEventListener("touchstart", click);
//     return () => {
//       canvas.removeEventListener("mousedown", click);
//       canvas.removeEventListener("touchstart", click);
//     };
//   }, [onWin]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-full bg-transparent rounded-full cursor-pointer"
//     />
//   );
// };
// export default SyncCanvas;

"use client";
import React, { useRef, useEffect } from "react";

const SyncCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    size: 20,
    growing: true,
    hits: 0,
    color: "#ff9ff3",
    won: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 300;
    canvas.height = 300;
    const cx = 150,
      cy = 150;

    const render = () => {
      ctx.clearRect(0, 0, 300, 300);

      // CHANGED: Slowed down speed from 2 to 0.5 for easier gameplay
      if (stateRef.current.growing) {
        stateRef.current.size += 0.5;
        if (stateRef.current.size >= 140) stateRef.current.growing = false;
      } else {
        stateRef.current.size -= 0.5;
        if (stateRef.current.size <= 20) stateRef.current.growing = true;
      }

      // Target Ring
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2); // Target is roughly size 100 (radius 50)
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 8;
      ctx.stroke();

      // Moving Ring
      ctx.beginPath();
      ctx.arc(cx, cy, stateRef.current.size / 2, 0, Math.PI * 2);
      ctx.strokeStyle = stateRef.current.color;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Text
      ctx.fillStyle = "white";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${stateRef.current.hits} / 5 Syncs`, cx, cy + 130);

      if (!stateRef.current.won) requestAnimationFrame(render);
    };
    render();

    const click = () => {
      if (stateRef.current.won) return;

      // Target diameter is 100. We check if current diameter is close.
      // Tolerance increased slightly for better UX
      if (Math.abs(stateRef.current.size - 100) < 25) {
        stateRef.current.color = "#00ff00"; // Green hit
        setTimeout(() => (stateRef.current.color = "#ff9ff3"), 300);
        if (++stateRef.current.hits >= 5) {
          stateRef.current.won = true;
          onWin();
        }
      } else {
        stateRef.current.hits = 0; // Reset on miss
        stateRef.current.color = "#ff0000"; // Red miss
        setTimeout(() => (stateRef.current.color = "#ff9ff3"), 300);
      }
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
      className="w-full h-full bg-transparent rounded-full cursor-pointer touch-none"
    />
  );
};
export default SyncCanvas;
