"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ───────────────────────────────────────────
   INLINE ANIMATED TEXT - OPTIMIZED
─────────────────────────────────────────── */

const InlineAnimatedText = memo<{
  texts: string[];
  typingSpeed?: number;
  delayBetween?: number;
  onComplete?: () => void;
}>(({ texts, typingSpeed = 40, delayBetween = 800, onComplete }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const completeCalled = useRef(false);

  useEffect(() => {
    if (isComplete) return;

    const currentFullText = texts[currentTextIndex];

    if (displayedText.length < currentFullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      if (currentTextIndex < texts.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentTextIndex((prev) => prev + 1);
          setDisplayedText("");
        }, delayBetween);
        return () => clearTimeout(timeout);
      } else {
        setIsComplete(true);
        if (!completeCalled.current) {
          completeCalled.current = true;
          const timeout = setTimeout(() => {
            onComplete?.();
          }, 400);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [
    displayedText,
    currentTextIndex,
    texts,
    typingSpeed,
    delayBetween,
    isComplete,
    onComplete,
  ]);

  return (
    <div className="min-h-[3.5rem] flex flex-col items-center justify-center">
      {texts.slice(0, currentTextIndex).map((text, i) => (
        <span
          key={i}
          className="block text-white/60 text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {text}
        </span>
      ))}
      <span
        className="block text-white/70 text-lg sm:text-xl md:text-2xl font-light tracking-wide"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {displayedText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block ml-0.5 text-white/50"
          >
            |
          </motion.span>
        )}
      </span>
    </div>
  );
});

InlineAnimatedText.displayName = "InlineAnimatedText";

/* ───────────────────────────────────────────
   INLINE GLOW BUTTON - OPTIMIZED
─────────────────────────────────────────── */

const InlineGlowButton = memo<{
  onClick: () => void;
  children: React.ReactNode;
}>(({ onClick, children }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div
        className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur-lg transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,157,0.4), rgba(123,104,238,0.4))",
        }}
      />
      <div
        className="relative px-8 py-4 rounded-full border border-white/20 backdrop-blur-sm
                    text-white text-base sm:text-lg tracking-wider font-light
                    transition-all duration-200
                    group-hover:border-white/40 group-hover:shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,157,0.15), rgba(123,104,238,0.15))",
          textShadow: "0 0 20px rgba(255,255,255,0.3)",
        }}
      >
        {children}
      </div>
    </motion.button>
  );
});

InlineGlowButton.displayName = "InlineGlowButton";

/* ───────────────────────────────────────────
   STARFIELD CANVAS - PERFORMANCE OPTIMIZED
─────────────────────────────────────────── */

interface Star {
  x: number;
  y: number;
  baseSize: number;
  speed: number;
  opacity: number;
  twinkleOffset: number;
  layer: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const StarfieldCanvas = memo<{ mouseX: number; mouseY: number }>(
  ({ mouseX, mouseY }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const shootingRef = useRef<ShootingStar[]>([]);
    const frameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const mouseRef = useRef({ x: mouseX, y: mouseY });

    // Update mouse ref without re-running effect
    mouseRef.current = { x: mouseX, y: mouseY };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const stars: Star[] = [];
        // Reduced star count for better performance
        const totalStars = 90;

        for (let i = 0; i < totalStars; i++) {
          const layer = i < 35 ? 0 : i < 65 ? 1 : 2;
          const sizeRange =
            layer === 0 ? [0.4, 1] : layer === 1 ? [0.8, 1.6] : [1.4, 2.5];
          const speedRange =
            layer === 0
              ? [0.05, 0.15]
              : layer === 1
                ? [0.15, 0.35]
                : [0.35, 0.6];

          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            baseSize:
              sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
            speed:
              speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
            opacity:
              (layer === 0 ? 0.3 : layer === 1 ? 0.5 : 0.7) +
              Math.random() * 0.3,
            twinkleOffset: Math.random() * Math.PI * 2,
            layer,
          });
        }

        starsRef.current = stars;
      };

      resize();
      window.addEventListener("resize", resize);

      startTimeRef.current = performance.now();
      const parallaxMuls = [10, 22, 38];

      const animate = (now: number) => {
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const elapsed = (now - startTimeRef.current) / 1000;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const mx = mouseRef.current.x - 0.5;
        const my = mouseRef.current.y - 0.5;

        // Batch star rendering
        ctx.fillStyle = "#ffffff";

        for (let i = 0, len = starsRef.current.length; i < len; i++) {
          const star = starsRef.current[i];
          const parallaxMul = parallaxMuls[star.layer];
          const drawX = star.x + mx * star.speed * parallaxMul;
          const drawY = star.y + my * star.speed * parallaxMul;

          const twinkle =
            Math.sin(elapsed * (1.5 + star.speed * 2) + star.twinkleOffset) *
              0.3 +
            0.7;
          const alpha = star.opacity * twinkle;

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.baseSize, 0, Math.PI * 2);
          ctx.fill();

          // Only glow for near layer stars
          if (star.layer === 2) {
            ctx.globalAlpha = alpha * 0.06;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.baseSize * 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Shooting stars - reduced frequency
        if (Math.random() < 0.002 && shootingRef.current.length < 1) {
          const startX = Math.random() * w * 0.8;
          const angle = Math.PI * 0.2 + Math.random() * Math.PI * 0.15;
          const speed = 250 + Math.random() * 100;
          shootingRef.current.push({
            x: startX,
            y: -10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: 1.5 + Math.random() * 0.8,
          });
        }

        const dt = 1 / 60;
        for (let i = shootingRef.current.length - 1; i >= 0; i--) {
          const ss = shootingRef.current[i];
          ss.x += ss.vx * dt;
          ss.y += ss.vy * dt;
          ss.life -= dt * 1.4;

          if (ss.life <= 0 || ss.x > w + 50 || ss.y > h + 50) {
            shootingRef.current.splice(i, 1);
            continue;
          }

          const tailLen = 35 * ss.life;
          const mag = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
          const normX = ss.vx / mag;
          const normY = ss.vy / mag;

          const grad = ctx.createLinearGradient(
            ss.x,
            ss.y,
            ss.x - normX * tailLen,
            ss.y - normY * tailLen,
          );
          grad.addColorStop(0, `rgba(255,255,255,${0.8 * ss.life})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");

          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = ss.size * ss.life;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - normX * tailLen, ss.y - normY * tailLen);
          ctx.stroke();

          ctx.globalAlpha = ss.life * 0.5;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2);
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
      // Empty dependency - mouse tracked via ref
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ willChange: "transform" }}
      />
    );
  },
);

StarfieldCanvas.displayName = "StarfieldCanvas";

/* ───────────────────────────────────────────
   LANDING PAGE - FAST & SMOOTH
─────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [textComplete, setTextComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | null>(null);

  // Prefetch universe page immediately for instant navigation
  useEffect(() => {
    router.prefetch("/universe");
  }, [router]);

  // FAILSAFE: Force button after 8 seconds
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setTextComplete(true);
    }, 8000);
    return () => clearTimeout(failsafe);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
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
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  const handleEnter = useCallback(() => {
    setIsTransitioning(true);
    // Navigate faster - 700ms instead of 1400ms
    setTimeout(() => {
      router.push("/universe");
    }, 700);
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Starfield */}
      <StarfieldCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-[#020617]/30 to-[#020617]/80" />

      {/* Nebula accents - simplified, fewer elements */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(123,104,238,0.25) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
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
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block"
                  style={{
                    textShadow:
                      "0 0 40px rgba(123,104,238,0.3), 0 0 80px rgba(123,104,238,0.1)",
                  }}
                >
                  Our Universe
                </motion.span>
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-24 h-px mx-auto mt-6"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,107,157,0.4), transparent)",
                }}
              />
            </motion.div>

            {/* Animated typewriter text - faster speeds */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-14"
            >
              <InlineAnimatedText
                texts={["In a universe of billions...", "I found you."]}
                typingSpeed={40}
                delayBetween={800}
                onComplete={() => setTextComplete(true)}
              />
            </motion.div>

            {/* CTA Button */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Single pulse ring */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0, 0.15] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-white/20"
                    style={{ margin: "-12px" }}
                  />

                  <InlineGlowButton onClick={handleEnter}>
                    Enter Our Universe ✦
                  </InlineGlowButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {textComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
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
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
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
                  transition={{ delay: 1.5, duration: 0.8 }}
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

      {/* Page transition - FASTER */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(123,104,238,0.3) 0%, transparent 60%)",
              }}
            />
            <motion.div
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-50 bg-[#020617]"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
