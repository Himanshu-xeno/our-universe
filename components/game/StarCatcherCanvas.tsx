// "use client";
// import React, { useRef, useEffect, useCallback } from "react";

// const StarCatcherCanvas: React.FC<{ onWin: () => void }> = ({ onWin }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const stateRef = useRef({
//     score: 0,
//     playerX: 0,
//     items: [] as any[],
//     lastTime: 0,
//     won: false,
//   });

//   const loop = useCallback(
//     (time: number) => {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;
//       const state = stateRef.current;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (Math.random() < 0.05)
//         state.items.push({
//           x: Math.random() * canvas.width,
//           y: -30,
//           speed: 2 + Math.random() * 2,
//         });

//       const playerY = canvas.height - 60;
//       ctx.font = "40px serif";
//       ctx.textAlign = "center";
//       ctx.fillText("🧑‍🚀", state.playerX, playerY);

//       state.items.forEach((item, i) => {
//         item.y += item.speed;
//         ctx.font = "30px serif";
//         ctx.fillText("💖", item.x, item.y);
//         if (Math.hypot(item.x - state.playerX, item.y - (playerY - 20)) < 40) {
//           state.items.splice(i, 1);
//           state.score += 5;
//         } else if (item.y > canvas.height) state.items.splice(i, 1);
//       });

//       ctx.fillStyle = "white";
//       ctx.font = "20px monospace";
//       ctx.textAlign = "left";
//       ctx.fillText(`Love: ${state.score}/100`, 20, 40);

//       if (state.score >= 100 && !state.won) {
//         state.won = true;
//         onWin();
//       }
//       if (!state.won) requestAnimationFrame(loop);
//     },
//     [onWin],
//   );

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     canvas.width = Math.min(800, window.innerWidth - 40);
//     canvas.height = 600;
//     stateRef.current.playerX = canvas.width / 2;
//     const anim = requestAnimationFrame(loop);
//     const move = (x: number) =>
//       (stateRef.current.playerX = x - canvas.getBoundingClientRect().left);
//     const onMove = (e: MouseEvent) => move(e.clientX);
//     const onTouch = (e: TouchEvent) => {
//       e.preventDefault();
//       move(e.touches[0].clientX);
//     };
//     window.addEventListener("mousemove", onMove);
//     canvas.addEventListener("touchmove", onTouch, { passive: false });
//     return () => {
//       cancelAnimationFrame(anim);
//       window.removeEventListener("mousemove", onMove);
//       canvas.removeEventListener("touchmove", onTouch);
//     };
//   }, [loop]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-full bg-black/20 rounded-xl cursor-crosshair"
//     />
//   );
// };
// export default StarCatcherCanvas;

"use client";
import React, { useRef, useEffect, useCallback } from "react";

// Accept difficulty prop
interface Props {
  onWin: () => void;
  onLose: () => void;
  difficulty: "Easy" | "Medium" | "Hard";
}

const StarCatcherCanvas: React.FC<Props> = ({ onWin, onLose, difficulty }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set time based on difficulty
  const initialTime =
    difficulty === "Easy" ? 60 : difficulty === "Medium" ? 40 : 20;

  const stateRef = useRef({
    score: 0,
    playerX: 0,
    items: [] as any[],
    lastTime: 0,
    timeLeft: initialTime,
    gameOver: false,
  });

  const loop = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const state = stateRef.current;

      // Delta time for timer
      if (state.lastTime === 0) state.lastTime = time;
      const deltaTime = (time - state.lastTime) / 1000;
      state.lastTime = time;

      if (!state.gameOver) {
        state.timeLeft -= deltaTime;
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          state.gameOver = true;
          onLose(); // Trigger lose
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn Stars
      if (Math.random() < 0.05)
        state.items.push({
          x: Math.random() * canvas.width,
          y: -30,
          speed: 3 + Math.random() * 2, // Slightly faster stars
        });

      // Draw Player
      const playerY = canvas.height - 60;
      ctx.font = "40px serif";
      ctx.textAlign = "center";
      ctx.fillText("🧑‍🚀", state.playerX, playerY);

      // Draw & Update Stars
      state.items.forEach((item, i) => {
        item.y += item.speed;
        ctx.font = "30px serif";
        ctx.fillText("⭐", item.x, item.y); // CHANGED TO STAR

        // Collision
        if (Math.hypot(item.x - state.playerX, item.y - (playerY - 20)) < 40) {
          state.items.splice(i, 1);
          state.score += 5;
        } else if (item.y > canvas.height) {
          state.items.splice(i, 1);
        }
      });

      // HUD
      ctx.fillStyle = "white";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Stars: ${state.score}/100`, 20, 40);

      // Timer Color
      ctx.fillStyle = state.timeLeft < 10 ? "#ff4444" : "#4ecdc4";
      ctx.textAlign = "right";
      ctx.fillText(
        `Time: ${Math.ceil(state.timeLeft)}s`,
        canvas.width - 20,
        40,
      );

      // Win Condition
      if (state.score >= 100 && !state.gameOver) {
        state.gameOver = true;
        onWin();
      }

      if (!state.gameOver) requestAnimationFrame(loop);
    },
    [onWin, onLose],
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
      className="w-full h-full bg-black/20 rounded-xl cursor-crosshair touch-none"
    />
  );
};
export default StarCatcherCanvas;
