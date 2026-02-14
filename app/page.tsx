"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";

/**
 * Canvas-based starfield background with parallax mouse tracking.
 */
const StarfieldCanvas: React.FC<{ mouseX: number; mouseY: number }> = ({
  mouseX,
  mouseY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<
    { x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Initialize stars
      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Parallax offset based on mouse
        const parallaxX = (mouseX - 0.5) * star.speed * 30;
        const parallaxY = (mouseY - 0.5) * star.speed * 30;

        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

        // Twinkle
        const twinkle =
          Math.sin(Date.now() * 0.003 * star.speed + star.x) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        // Subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.03 * twinkle})`;
          ctx.fill();
        }
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mouseX, mouseY]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default function LandingPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [textComplete, setTextComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track normalized mouse position for parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  const handleEnter = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/universe");
    }, 1200);
  }, [router]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Starfield background */}
      <StarfieldCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Gradient overlays */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-deep-navy/50 to-deep-navy pointer-events-none" />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26, 10, 46, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Audio toggle */}
      <AudioPlayer />

      {/* Main content */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl"
          >
            {/* Animated typewriter text */}
            <AnimatedText
              texts={["In a universe of billions...", "I found you."]}
              typingSpeed={60}
              delayBetween={2000}
              className="mb-16"
              onComplete={() => setTextComplete(true)}
            />

            {/* CTA Button — appears after text animation */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <GlowButton onClick={handleEnter} variant="pink" size="lg">
                    Enter Our Universe ✦
                  </GlowButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle scroll hint */}
            {textComplete && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-8 text-xs text-white/30"
              >
                A journey awaits
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-deep-navy"
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
