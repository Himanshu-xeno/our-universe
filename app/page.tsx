// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import AnimatedText from "@/components/ui/AnimatedText";
// import GlowButton from "@/components/ui/GlowButton";
// import AudioPlayer from "@/components/ui/AudioPlayer";

// /**
//  * Canvas-based starfield background with parallax mouse tracking.
//  */
// const StarfieldCanvas: React.FC<{ mouseX: number; mouseY: number }> = ({
//   mouseX,
//   mouseY,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const starsRef = useRef<
//     { x: number; y: number; size: number; speed: number; opacity: number }[]
//   >([]);
//   const frameRef = useRef<number>(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;

//       // Initialize stars
//       starsRef.current = Array.from({ length: 200 }, () => ({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         size: Math.random() * 2 + 0.5,
//         speed: Math.random() * 0.5 + 0.1,
//         opacity: Math.random() * 0.8 + 0.2,
//       }));
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       starsRef.current.forEach((star) => {
//         // Parallax offset based on mouse
//         const parallaxX = (mouseX - 0.5) * star.speed * 30;
//         const parallaxY = (mouseY - 0.5) * star.speed * 30;

//         const drawX = star.x + parallaxX;
//         const drawY = star.y + parallaxY;

//         // Twinkle
//         const twinkle =
//           Math.sin(Date.now() * 0.003 * star.speed + star.x) * 0.3 + 0.7;

//         ctx.beginPath();
//         ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
//         ctx.fill();

//         // Subtle glow for larger stars
//         if (star.size > 1.5) {
//           ctx.beginPath();
//           ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(255, 255, 255, ${0.03 * twinkle})`;
//           ctx.fill();
//         }
//       });

//       frameRef.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(frameRef.current);
//       window.removeEventListener("resize", resize);
//     };
//   }, [mouseX, mouseY]);

//   return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
// };

// export default function LandingPage() {
//   const router = useRouter();
//   const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
//   const [textComplete, setTextComplete] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   // Track normalized mouse position for parallax
//   const handleMouseMove = useCallback((e: React.MouseEvent) => {
//     setMousePos({
//       x: e.clientX / window.innerWidth,
//       y: e.clientY / window.innerHeight,
//     });
//   }, []);

//   const handleEnter = useCallback(() => {
//     setIsTransitioning(true);
//     setTimeout(() => {
//       router.push("/universe");
//     }, 1200);
//   }, [router]);

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center overflow-hidden"
//       onMouseMove={handleMouseMove}
//     >
//       {/* Starfield background */}
//       <StarfieldCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

//       {/* Gradient overlays */}
//       <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-deep-navy/50 to-deep-navy pointer-events-none" />
//       <div
//         className="fixed inset-0 z-0 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse at center, rgba(26, 10, 46, 0.3) 0%, transparent 70%)",
//         }}
//       />

//       {/* Audio toggle */}
//       <AudioPlayer />

//       {/* Main content */}
//       <AnimatePresence>
//         {!isTransitioning && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.5 }}
//             className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl"
//           >
//             {/* Animated typewriter text */}
//             <AnimatedText
//               texts={["In a universe of billions...", "I found you."]}
//               typingSpeed={60}
//               delayBetween={2000}
//               className="mb-16"
//               onComplete={() => setTextComplete(true)}
//             />

//             {/* CTA Button — appears after text animation */}
//             <AnimatePresence>
//               {textComplete && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 1, ease: "easeOut" }}
//                 >
//                   <GlowButton onClick={handleEnter} variant="pink" size="lg">
//                     Enter Our Universe ✦
//                   </GlowButton>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Subtle scroll hint */}
//             {textComplete && (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 0.3 }}
//                 transition={{ delay: 2, duration: 1 }}
//                 className="mt-8 text-xs text-white/30"
//               >
//                 A journey awaits
//               </motion.p>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page transition overlay */}
//       <AnimatePresence>
//         {isTransitioning && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 z-50 bg-deep-navy"
//             transition={{ duration: 1.2 }}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import React, { useState, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, StarData } from "@/store/useAppStore";
import { useProgress } from "@/hooks/useProgress";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";

// Lazy load heavy 3D scene
const GalaxyScene = lazy(() => import("@/components/galaxy/GalaxyScene"));

/**
 * Star detail modal
 */
const StarModal: React.FC<{
  star: StarData | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ star, isOpen, onClose }) => {
  if (!star) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong max-w-md w-full p-8 pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10
                           flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${star.color}40, transparent)`,
                  boxShadow: `0 0 30px ${star.color}40`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: star.color }}
                />
              </div>

              <p className="text-center text-xs text-white/40 mb-2">
                {star.date}
              </p>

              <h2
                className="font-serif text-xl text-center mb-4 font-semibold"
                style={{ color: star.color }}
              >
                {star.title}
              </h2>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4" />

              <p className="text-soft-white/80 font-serif text-sm leading-relaxed text-center">
                {star.message}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function UniversePage() {
  const router = useRouter();

  // 🔥 Hydration guard
  const hasHydrated = useAppStore((s) => s._hasHydrated);

  const visitedStars = useAppStore((s) => s.visitedStars);
  const visitStar = useAppStore((s) => s.visitStar);
  const unlockReveal = useAppStore((s) => s.unlockReveal);

  const {
    canAccessLetters,
    canAccessGame,
    canSeeHiddenStar,
    progress,
    visitedStarsCount,
  } = useProgress();

  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleStarClick = useCallback(
    (star: StarData) => {
      visitStar(star.id);
      setSelectedStar(star);
      setModalOpen(true);
    },
    [visitStar],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedStar(null), 500);
  }, []);

  const handleHiddenStarClick = useCallback(() => {
    unlockReveal();
    router.push("/reveal");
  }, [unlockReveal, router]);

  // 🛑 Prevent render until Zustand rehydrates
  if (!hasHydrated) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-deep-navy">
      {/* 3D Galaxy */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-soft-white/50 font-serif text-lg"
              >
                Loading the universe...
              </motion.div>
            </div>
          }
        >
          <GalaxyScene
            visitedStars={visitedStars}
            showHiddenStar={canSeeHiddenStar}
            onStarClick={handleStarClick}
            onHiddenStarClick={handleHiddenStarClick}
          />
        </Suspense>
      </div>

      {/* Audio */}
      <AudioPlayer />

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed top-4 left-4 z-30 glass px-4 py-3 rounded-xl"
      >
        <p className="text-xs text-white/50 mb-1">Journey Progress</p>

        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-nebula-pink to-nebula-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <p className="text-xs text-white/30 mt-1">
          {visitedStarsCount} / 7 stars visited
        </p>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3"
      >
        <GlowButton
          onClick={() => router.push("/letters")}
          variant="blue"
          size="sm"
          disabled={!canAccessLetters}
        >
          {canAccessLetters
            ? "💌 Letters"
            : `🔒 Visit ${Math.max(0, 3 - visitedStarsCount)} more stars`}
        </GlowButton>

        <GlowButton
          onClick={() => router.push("/game")}
          variant="gold"
          size="sm"
          disabled={!canAccessGame}
        >
          {canAccessGame ? "🎮 Game" : "🔒 Open a letter first"}
        </GlowButton>
      </motion.div>

      {/* Star Modal */}
      <StarModal
        star={selectedStar}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.p
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-white/30 text-center"
        >
          Click on the glowing stars • Drag to rotate
        </motion.p>
      </motion.div>
    </div>
  );
}
