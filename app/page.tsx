"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";

/* ───────────────────────────────────────────
   STARFIELD CANVAS - Performance Optimized
   ─────────────────────────────────────────── */

interface Star {
  x: number;
  y: number;
  baseSize: number;
  speed: number;
  opacity: number;
  twinkleOffset: number;
  layer: number; // 0=far, 1=mid, 2=near
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const StarfieldCanvas: React.FC<{ mouseX: number; mouseY: number }> = ({
  mouseX,
  mouseY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // 3-layer star system: far (small, slow), mid, near (big, fast)
      const stars: Star[] = [];
      const totalStars = 120;

      for (let i = 0; i < totalStars; i++) {
        const layer = i < 50 ? 0 : i < 90 ? 1 : 2;
        const sizeRange =
          layer === 0 ? [0.4, 1] : layer === 1 ? [0.8, 1.6] : [1.4, 2.5];
        const speedRange =
          layer === 0 ? [0.05, 0.15] : layer === 1 ? [0.15, 0.35] : [0.35, 0.6];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseSize:
            sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
          speed:
            speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
          opacity:
            (layer === 0 ? 0.3 : layer === 1 ? 0.5 : 0.7) + Math.random() * 0.3,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer,
        });
      }

      starsRef.current = stars;
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const elapsed = (now - startTimeRef.current) / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Draw stars
      const mx = mouseX - 0.5;
      const my = mouseY - 0.5;

      for (const star of starsRef.current) {
        const parallaxMul = [10, 22, 38][star.layer];
        const drawX = star.x + mx * star.speed * parallaxMul;
        const drawY = star.y + my * star.speed * parallaxMul;

        const twinkle =
          Math.sin(elapsed * (1.5 + star.speed * 2) + star.twinkleOffset) *
            0.3 +
          0.7;
        const alpha = star.opacity * twinkle;
        const size = star.baseSize;

        // Core
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow for near stars
        if (star.layer === 2) {
          ctx.globalAlpha = alpha * 0.08;
          ctx.beginPath();
          ctx.arc(drawX, drawY, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Shooting stars
      if (Math.random() < 0.003 && shootingRef.current.length < 2) {
        const startX = Math.random() * w * 0.8;
        const angle = Math.PI * 0.2 + Math.random() * Math.PI * 0.15;
        shootingRef.current.push({
          x: startX,
          y: -10,
          vx: Math.cos(angle) * (200 + Math.random() * 150),
          vy: Math.sin(angle) * (200 + Math.random() * 150),
          life: 1,
          maxLife: 1,
          size: 1.5 + Math.random() * 1,
        });
      }

      const dt = 1 / 60;
      for (let i = shootingRef.current.length - 1; i >= 0; i--) {
        const ss = shootingRef.current[i];
        ss.x += ss.vx * dt;
        ss.y += ss.vy * dt;
        ss.life -= dt * 1.2;

        if (ss.life <= 0 || ss.x > w + 50 || ss.y > h + 50) {
          shootingRef.current.splice(i, 1);
          continue;
        }

        const tailLen = 40 * ss.life;
        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen,
          ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen,
        );
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * ss.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size * ss.life;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        const normX = ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
        const normY = ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
        ctx.lineTo(ss.x - normX * tailLen, ss.y - normY * tailLen);
        ctx.stroke();

        // Head glow
        ctx.globalAlpha = ss.life * 0.6;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ willChange: "transform" }}
    />
  );
};

/* ───────────────────────────────────────────
   LANDING PAGE
   ─────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [textComplete, setTextComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | null>(null);

  useRefreshRedirect();

  // Throttled mouse tracking via RAF
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePosRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ ...mousePosRef.current });
        rafRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEnter = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/universe");
    }, 1400);
  }, [router]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]"
      onMouseMove={handleMouseMove}
    >
      {/* Starfield */}
      <StarfieldCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Gradient overlays */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-[#020617]/30 to-[#020617]/80" />

      {/* Nebula accents */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(123,104,238,0.25) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.14, 0.08],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,157,0.2) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7,
          }}
          className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Audio */}
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
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mb-8"
            >
              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-16 h-px mx-auto mb-6"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 tracking-tight leading-tight">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="block"
                  style={{
                    textShadow:
                      "0 0 40px rgba(123,104,238,0.3), 0 0 80px rgba(123,104,238,0.1)",
                  }}
                >
                  Our Universe
                </motion.span>
              </h1>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="w-24 h-px mx-auto mt-6"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,107,157,0.4), transparent)",
                }}
              />
            </motion.div>

            {/* Animated typewriter text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mb-14"
            >
              <AnimatedText
                texts={["In a universe of billions...", "I found you."]}
                typingSpeed={55}
                delayBetween={2000}
                className=""
                onComplete={() => setTextComplete(true)}
              />
            </motion.div>

            {/* CTA Button */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Pulse ring behind button */}
                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.15, 0, 0.15],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-white/20"
                    style={{
                      margin: "-12px",
                    }}
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.1, 0, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute inset-0 rounded-full border border-white/10"
                    style={{
                      margin: "-20px",
                    }}
                  />

                  <GlowButton onClick={handleEnter} variant="pink" size="lg">
                    Enter Our Universe ✦
                  </GlowButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1.2 }}
                  className="mt-12 flex items-center gap-3"
                >
                  <motion.span
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-white/20 text-xs"
                  >
                    ✧
                  </motion.span>
                  <span className="text-white/20 text-xs tracking-[0.25em] uppercase font-mono">
                    A journey awaits
                  </span>
                  <motion.span
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 1,
                    }}
                    className="text-white/20 text-xs"
                  >
                    ✧
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll indicator */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 1 }}
                  className="mt-16"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-px h-6 bg-gradient-to-b from-transparent to-white/15" />
                    <div className="w-1 h-1 rounded-full bg-white/15" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page transition - expanding circle wipe */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Center flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.6 }}
              className="fixed inset-0 z-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(123,104,238,0.3) 0%, transparent 60%)",
              }}
            />

            {/* Expanding circle */}
            <motion.div
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 bg-[#020617]"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
