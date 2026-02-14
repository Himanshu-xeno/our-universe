// "use client";

// import React, { useRef, useEffect, useCallback, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { GAME_CONFIG } from "@/utils/constants";

// // ===== GAME ENTITY TYPES =====
// interface Vec2 {
//   x: number;
//   y: number;
// }

// interface PlayerEntity {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   size: number;
//   glow: number;
// }

// interface ObstacleEntity {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   width: number;
//   height: number;
//   label: string;
//   color: string;
//   rotation: number;
//   rotationSpeed: number;
// }

// interface CollectibleEntity {
//   x: number;
//   y: number;
//   size: number;
//   label: string;
//   color: string;
//   collected: boolean;
//   pulsePhase: number;
// }

// interface GoalEntity {
//   x: number;
//   y: number;
//   size: number;
//   glow: number;
// }

// interface GameState {
//   player: PlayerEntity;
//   obstacles: ObstacleEntity[];
//   collectibles: CollectibleEntity[];
//   goal: GoalEntity;
//   collectedCount: number;
//   shakeAmount: number;
//   shakeDecay: number;
//   gameOver: boolean;
//   gameWon: boolean;
//   time: number;
// }

// interface GameCanvasProps {
//   onWin: () => void;
// }

// /**
//  * Full-screen 2D canvas game with realistic physics and effects.
//  * Uses requestAnimationFrame for the game loop — no React state for per-frame updates.
//  */
// const GameCanvas: React.FC<GameCanvasProps> = ({ onWin }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const gameStateRef = useRef<GameState | null>(null);
//   const keysRef = useRef<Set<string>>(new Set());
//   const animFrameRef = useRef<number>(0);
//   const [showWinMessage, setShowWinMessage] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const touchRef = useRef<{ startX: number; startY: number; active: boolean }>({
//     startX: 0,
//     startY: 0,
//     active: false,
//   });
//   const touchDirRef = useRef<Vec2>({ x: 0, y: 0 });

//   // Check if mobile
//   useEffect(() => {
//     setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
//   }, []);

//   /**
//    * Initialize game state based on canvas dimensions
//    */
//   const initGame = useCallback((width: number, height: number): GameState => {
//     const padding = GAME_CONFIG.CANVAS_PADDING;

//     // Player starts at bottom center
//     const player: PlayerEntity = {
//       x: width / 2,
//       y: height - 80,
//       vx: 0,
//       vy: 0,
//       size: GAME_CONFIG.PLAYER_SIZE,
//       glow: 0,
//     };

//     // Goal at top center
//     const goal: GoalEntity = {
//       x: width / 2,
//       y: 60,
//       size: 30,
//       glow: 0,
//     };

//     // Create obstacles in the middle area
//     const obstacles: ObstacleEntity[] = GAME_CONFIG.OBSTACLE_LABELS.map(
//       (label, i) => {
//         const row = Math.floor(i / 3);
//         const col = i % 3;
//         return {
//           x: padding + (col + 0.5) * ((width - padding * 2) / 3),
//           y: height * 0.3 + row * (height * 0.2),
//           vx: (Math.random() - 0.5) * 2,
//           vy: (Math.random() - 0.5) * 1.5,
//           width: 70 + Math.random() * 30,
//           height: 30,
//           label,
//           color: `hsl(${0 + i * 20}, 70%, 50%)`,
//           rotation: Math.random() * Math.PI * 2,
//           rotationSpeed: (Math.random() - 0.5) * 0.02,
//         };
//       },
//     );

//     // Create collectibles scattered around
//     const collectibles: CollectibleEntity[] =
//       GAME_CONFIG.COLLECTIBLE_LABELS.map((label, i) => ({
//         x: padding + 80 + Math.random() * (width - padding * 2 - 160),
//         y: height * 0.25 + Math.random() * (height * 0.45),
//         size: 18,
//         label,
//         color: ["#4ecdc4", "#ffd700", "#7b68ee"][i],
//         collected: false,
//         pulsePhase: Math.random() * Math.PI * 2,
//       }));

//     return {
//       player,
//       obstacles,
//       collectibles,
//       goal,
//       collectedCount: 0,
//       shakeAmount: 0,
//       shakeDecay: 0.9,
//       gameOver: false,
//       gameWon: false,
//       time: 0,
//     };
//   }, []);

//   /**
//    * Main game loop
//    */
//   const gameLoop = useCallback(
//     (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//       const state = gameStateRef.current;
//       if (!state || state.gameWon) return;

//       state.time += 1 / 60;

//       // ===== UPDATE PLAYER =====
//       const speed = GAME_CONFIG.PLAYER_SPEED;
//       let ax = 0;
//       let ay = 0;

//       // Keyboard input
//       if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) ax -= 1;
//       if (keysRef.current.has("ArrowRight") || keysRef.current.has("d"))
//         ax += 1;
//       if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) ay -= 1;
//       if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) ay += 1;

//       // Touch input
//       if (touchRef.current.active) {
//         ax += touchDirRef.current.x;
//         ay += touchDirRef.current.y;
//       }

//       // Normalize diagonal movement
//       const mag = Math.sqrt(ax * ax + ay * ay);
//       if (mag > 0) {
//         ax /= mag;
//         ay /= mag;
//       }

//       // Apply smooth velocity
//       state.player.vx += ax * speed * 0.3;
//       state.player.vy += ay * speed * 0.3;
//       state.player.vx *= 0.85; // friction
//       state.player.vy *= 0.85;

//       state.player.x += state.player.vx;
//       state.player.y += state.player.vy;

//       // Boundary clamping
//       state.player.x = Math.max(
//         state.player.size,
//         Math.min(width - state.player.size, state.player.x),
//       );
//       state.player.y = Math.max(
//         state.player.size,
//         Math.min(height - state.player.size, state.player.y),
//       );

//       // Player glow animation
//       state.player.glow = Math.sin(state.time * 3) * 0.3 + 0.7;

//       // ===== UPDATE OBSTACLES =====
//       state.obstacles.forEach((obs) => {
//         obs.x += obs.vx;
//         obs.y += obs.vy;
//         obs.rotation += obs.rotationSpeed;

//         // Bounce off walls
//         if (
//           obs.x < GAME_CONFIG.CANVAS_PADDING ||
//           obs.x > width - GAME_CONFIG.CANVAS_PADDING
//         ) {
//           obs.vx *= -1;
//           obs.x = Math.max(
//             GAME_CONFIG.CANVAS_PADDING,
//             Math.min(width - GAME_CONFIG.CANVAS_PADDING, obs.x),
//           );
//         }
//         if (
//           obs.y < GAME_CONFIG.CANVAS_PADDING ||
//           obs.y > height - GAME_CONFIG.CANVAS_PADDING
//         ) {
//           obs.vy *= -1;
//           obs.y = Math.max(
//             GAME_CONFIG.CANVAS_PADDING,
//             Math.min(height - GAME_CONFIG.CANVAS_PADDING, obs.y),
//           );
//         }
//       });

//       // ===== COLLISION DETECTION: OBSTACLES =====
//       state.obstacles.forEach((obs) => {
//         const dx = state.player.x - obs.x;
//         const dy = state.player.y - obs.y;
//         const dist = Math.sqrt(dx * dx + dy * dy);
//         const minDist = state.player.size + obs.width / 2;

//         if (dist < minDist) {
//           // Screen shake
//           state.shakeAmount = 15;

//           // Push player away
//           const pushAngle = Math.atan2(dy, dx);
//           state.player.x = width / 2;
//           state.player.y = height - 80;
//           state.player.vx = 0;
//           state.player.vy = 0;
//         }
//       });

//       // ===== COLLISION DETECTION: COLLECTIBLES =====
//       state.collectibles.forEach((col) => {
//         if (col.collected) return;
//         const dx = state.player.x - col.x;
//         const dy = state.player.y - col.y;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (dist < state.player.size + col.size) {
//           col.collected = true;
//           state.collectedCount += 1;
//         }

//         col.pulsePhase += 0.05;
//       });

//       // ===== CHECK WIN CONDITION =====
//       if (state.collectedCount >= GAME_CONFIG.COLLECTIBLES_TO_WIN) {
//         const dx = state.player.x - state.goal.x;
//         const dy = state.player.y - state.goal.y;
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         if (dist < state.player.size + state.goal.size) {
//           state.gameWon = true;
//           setShowWinMessage(true);
//           setTimeout(() => {
//             onWin();
//           }, 5000);
//           return;
//         }
//       }

//       state.goal.glow = Math.sin(state.time * 2) * 0.4 + 0.6;

//       // ===== SHAKE DECAY =====
//       state.shakeAmount *= state.shakeDecay;

//       // ===== RENDER =====
//       // Apply screen shake
//       ctx.save();
//       if (state.shakeAmount > 0.5) {
//         ctx.translate(
//           (Math.random() - 0.5) * state.shakeAmount,
//           (Math.random() - 0.5) * state.shakeAmount,
//         );
//       }

//       // Clear canvas
//       ctx.fillStyle = "#0a0e1a";
//       ctx.fillRect(0, 0, width, height);

//       // Draw subtle grid
//       ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
//       ctx.lineWidth = 1;
//       for (let x = 0; x < width; x += 40) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, height);
//         ctx.stroke();
//       }
//       for (let y = 0; y < height; y += 40) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(width, y);
//         ctx.stroke();
//       }

//       // Draw collectibles
//       state.collectibles.forEach((col) => {
//         if (col.collected) return;
//         const pulse = Math.sin(col.pulsePhase) * 0.3 + 1;

//         // Glow
//         ctx.save();
//         ctx.globalAlpha = 0.3;
//         ctx.shadowColor = col.color;
//         ctx.shadowBlur = 20;
//         ctx.fillStyle = col.color;
//         ctx.beginPath();
//         ctx.arc(col.x, col.y, col.size * pulse * 1.5, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();

//         // Core
//         ctx.fillStyle = col.color;
//         ctx.shadowColor = col.color;
//         ctx.shadowBlur = 15;
//         ctx.beginPath();
//         ctx.arc(col.x, col.y, col.size * pulse, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.shadowBlur = 0;

//         // Label
//         ctx.fillStyle = "#ffffff";
//         ctx.font = "10px Inter, sans-serif";
//         ctx.textAlign = "center";
//         ctx.fillText(col.label, col.x, col.y + col.size * pulse + 18);
//       });

//       // Draw obstacles
//       state.obstacles.forEach((obs) => {
//         ctx.save();
//         ctx.translate(obs.x, obs.y);
//         ctx.rotate(obs.rotation);

//         // Shadow/glow
//         ctx.shadowColor = obs.color;
//         ctx.shadowBlur = 10;
//         ctx.fillStyle = obs.color + "40";
//         ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);

//         // Border
//         ctx.strokeStyle = obs.color;
//         ctx.lineWidth = 1.5;
//         ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
//         ctx.shadowBlur = 0;

//         // Label
//         ctx.fillStyle = "#ffffff";
//         ctx.font = "bold 11px Inter, sans-serif";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(obs.label, 0, 0);

//         ctx.restore();
//       });

//       // Draw goal
//       const goalAlpha =
//         state.collectedCount >= GAME_CONFIG.COLLECTIBLES_TO_WIN ? 1 : 0.3;
//       ctx.save();
//       ctx.globalAlpha = goalAlpha;

//       // Goal glow
//       const goalGradient = ctx.createRadialGradient(
//         state.goal.x,
//         state.goal.y,
//         0,
//         state.goal.x,
//         state.goal.y,
//         state.goal.size * 2,
//       );
//       goalGradient.addColorStop(
//         0,
//         `rgba(255, 107, 157, ${0.3 * state.goal.glow})`,
//       );
//       goalGradient.addColorStop(1, "rgba(255, 107, 157, 0)");
//       ctx.fillStyle = goalGradient;
//       ctx.fillRect(
//         state.goal.x - state.goal.size * 2,
//         state.goal.y - state.goal.size * 2,
//         state.goal.size * 4,
//         state.goal.size * 4,
//       );

//       // Goal figure - simple silhouette
//       ctx.fillStyle = "#ff6b9d";
//       ctx.shadowColor = "#ff6b9d";
//       ctx.shadowBlur = 20;
//       // Head
//       ctx.beginPath();
//       ctx.arc(state.goal.x, state.goal.y - 12, 8, 0, Math.PI * 2);
//       ctx.fill();
//       // Body
//       ctx.beginPath();
//       ctx.moveTo(state.goal.x, state.goal.y - 4);
//       ctx.lineTo(state.goal.x - 10, state.goal.y + 15);
//       ctx.lineTo(state.goal.x + 10, state.goal.y + 15);
//       ctx.closePath();
//       ctx.fill();
//       ctx.shadowBlur = 0;
//       ctx.restore();

//       // Goal label
//       if (state.collectedCount < GAME_CONFIG.COLLECTIBLES_TO_WIN) {
//         ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
//         ctx.font = "10px Inter, sans-serif";
//         ctx.textAlign = "center";
//         ctx.fillText(
//           `Collect ${GAME_CONFIG.COLLECTIBLES_TO_WIN - state.collectedCount} more`,
//           state.goal.x,
//           state.goal.y + 35,
//         );
//       }

//       // Draw player (glowing heart)
//       const heartSize = state.player.size;
//       const heartX = state.player.x;
//       const heartY = state.player.y;

//       // Heart glow
//       const heartGradient = ctx.createRadialGradient(
//         heartX,
//         heartY,
//         0,
//         heartX,
//         heartY,
//         heartSize * 2,
//       );
//       heartGradient.addColorStop(
//         0,
//         `rgba(255, 107, 157, ${0.4 * state.player.glow})`,
//       );
//       heartGradient.addColorStop(1, "rgba(255, 107, 157, 0)");
//       ctx.fillStyle = heartGradient;
//       ctx.fillRect(
//         heartX - heartSize * 2,
//         heartY - heartSize * 2,
//         heartSize * 4,
//         heartSize * 4,
//       );

//       // Draw heart shape
//       ctx.save();
//       ctx.translate(heartX, heartY);
//       ctx.fillStyle = `rgba(255, 107, 157, ${state.player.glow})`;
//       ctx.shadowColor = "#ff6b9d";
//       ctx.shadowBlur = 20;

//       ctx.beginPath();
//       const hs = heartSize * 0.6;
//       ctx.moveTo(0, hs * 0.3);
//       ctx.bezierCurveTo(-hs, -hs * 0.3, -hs, -hs, 0, -hs * 0.5);
//       ctx.bezierCurveTo(hs, -hs, hs, -hs * 0.3, 0, hs * 0.3);
//       ctx.fill();
//       ctx.shadowBlur = 0;
//       ctx.restore();

//       // HUD - collection counter
//       ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
//       ctx.font = "14px Inter, sans-serif";
//       ctx.textAlign = "left";
//       ctx.fillText(
//         `Collected: ${state.collectedCount} / ${GAME_CONFIG.COLLECTIBLES_TO_WIN}`,
//         20,
//         30,
//       );

//       // Draw collected items indicator
//       GAME_CONFIG.COLLECTIBLE_LABELS.forEach((label, i) => {
//         const collected = i < state.collectedCount;
//         ctx.fillStyle = collected ? "#4ecdc4" : "rgba(255, 255, 255, 0.2)";
//         ctx.beginPath();
//         ctx.arc(30 + i * 25, 50, 6, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       ctx.restore();

//       // Continue loop
//       animFrameRef.current = requestAnimationFrame(() =>
//         gameLoop(ctx, width, height),
//       );
//     },
//     [onWin],
//   );

//   /**
//    * Initialize and start the game
//    */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       gameStateRef.current = initGame(canvas.width, canvas.height);
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     animFrameRef.current = requestAnimationFrame(() =>
//       gameLoop(ctx, canvas.width, canvas.height),
//     );

//     // Keyboard handlers
//     const onKeyDown = (e: KeyboardEvent) => {
//       keysRef.current.add(e.key.toLowerCase());
//       // Prevent arrow key scrolling
//       if (
//         ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
//           e.key.toLowerCase(),
//         )
//       ) {
//         e.preventDefault();
//       }
//     };
//     const onKeyUp = (e: KeyboardEvent) => {
//       keysRef.current.delete(e.key.toLowerCase());
//     };

//     // Touch handlers
//     const onTouchStart = (e: TouchEvent) => {
//       const touch = e.touches[0];
//       touchRef.current = {
//         startX: touch.clientX,
//         startY: touch.clientY,
//         active: true,
//       };
//     };
//     const onTouchMove = (e: TouchEvent) => {
//       e.preventDefault();
//       const touch = e.touches[0];
//       const dx = touch.clientX - touchRef.current.startX;
//       const dy = touch.clientY - touchRef.current.startY;
//       const dist = Math.sqrt(dx * dx + dy * dy);
//       if (dist > 10) {
//         touchDirRef.current = { x: dx / dist, y: dy / dist };
//       }
//     };
//     const onTouchEnd = () => {
//       touchRef.current.active = false;
//       touchDirRef.current = { x: 0, y: 0 };
//     };

//     window.addEventListener("keydown", onKeyDown);
//     window.addEventListener("keyup", onKeyUp);
//     canvas.addEventListener("touchstart", onTouchStart, { passive: false });
//     canvas.addEventListener("touchmove", onTouchMove, { passive: false });
//     canvas.addEventListener("touchend", onTouchEnd);

//     return () => {
//       cancelAnimationFrame(animFrameRef.current);
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("keydown", onKeyDown);
//       window.removeEventListener("keyup", onKeyUp);
//       canvas.removeEventListener("touchstart", onTouchStart);
//       canvas.removeEventListener("touchmove", onTouchMove);
//       canvas.removeEventListener("touchend", onTouchEnd);
//     };
//   }, [initGame, gameLoop]);

//   return (
//     <div className="relative w-full h-full">
//       <canvas ref={canvasRef} className="game-canvas" />

//       {/* Mobile touch hint */}
//       {isMobile && !showWinMessage && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full"
//         >
//           <p className="text-xs text-white/50">Drag to move</p>
//         </motion.div>
//       )}

//       {/* Win overlay */}
//       <AnimatePresence>
//         {showWinMessage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 2 }}
//             className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10"
//           >
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5, duration: 1 }}
//               className="font-serif text-2xl md:text-4xl text-soft-white text-center italic text-glow mb-4"
//             >
//               No matter what comes between us…
//             </motion.p>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 2, duration: 1 }}
//               className="font-serif text-2xl md:text-4xl text-nebula-pink text-center italic text-glow"
//             >
//               We always find each other.
//             </motion.p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default React.memo(GameCanvas);

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
        width: 70 + Math.random() * 30,
        height: 30,
        label,
        color: `hsl(${0 + i * 20}, 70%, 50%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })),
      collectibles: GAME_CONFIG.COLLECTIBLE_LABELS.map((label, i) => ({
        x: padding + 80 + Math.random() * (width - padding * 2 - 160),
        y: height * 0.25 + Math.random() * (height * 0.45),
        size: 18,
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

      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) ax -= 1;
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d"))
        ax += 1;
      if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) ay -= 1;
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) ay += 1;
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
        ctx.font = "10px sans-serif";
        ctx.fillText(col.label, col.x - 10, col.y + 25);
      });

      state.obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = obs.color + "40";
        ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.strokeStyle = obs.color;
        ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.fillStyle = "white";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(obs.label, 0, 4);
        ctx.restore();
      });

      const goalAlpha =
        state.collectedCount >= GAME_CONFIG.COLLECTIBLES_TO_WIN ? 1 : 0.3;
      ctx.globalAlpha = goalAlpha;
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.arc(state.goal.x, state.goal.y, state.goal.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = `rgba(255, 107, 157, ${state.player.glow})`;
      ctx.beginPath();
      ctx.arc(
        state.player.x,
        state.player.y,
        state.player.size,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(
        `Collected: ${state.collectedCount} / ${GAME_CONFIG.COLLECTIBLES_TO_WIN}`,
        20,
        30,
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
