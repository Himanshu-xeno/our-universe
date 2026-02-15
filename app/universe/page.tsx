"use client";

import React, { useState, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, StarData } from "@/store/useAppStore";
import { useProgress } from "@/hooks/useProgress";
import GlowButton from "@/components/ui/GlowButton";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import { STARS_DATA } from "@/utils/constants";

// Lazy load the heavy 3D component
const GalaxyScene = lazy(() => import("@/components/galaxy/GalaxyScene"));

// ============================================================================
// ERROR BOUNDARY FOR 3D SCENE
// ============================================================================
class GalaxyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Galaxy scene error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ============================================================================
// FALLBACK 2D STARFIELD (if 3D fails)
// ============================================================================
const Fallback2DStarfield: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface FallbackStar {
      x: number;
      y: number;
      size: number;
      brightness: number;
      speed: number;
    }

    let stars: FallbackStar[] = [];
    let frameId: number;
    let time = 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.5 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      time += 0.016;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff";
      for (const star of stars) {
        const twinkle = Math.sin(time * star.speed) * 0.3 + 0.7;
        ctx.globalAlpha = star.brightness * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================
const LoadingScreen: React.FC = () => (
  <div className="w-screen h-screen bg-[#020617] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-white/50 font-serif text-lg"
      >
        ✨ Preparing your universe...
      </motion.div>
    </motion.div>
  </div>
);

// ============================================================================
// GALAXY LOADING FALLBACK
// ============================================================================
const GalaxyLoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#020617]">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-white/50 font-serif text-lg"
    >
      Loading the stars...
    </motion.div>
  </div>
);

// ============================================================================
// 3D SCENE CRASH FALLBACK UI
// ============================================================================
const GalaxyCrashFallback: React.FC<{
  visitedStars: string[];
  onStarClick: (star: StarData) => void;
}> = ({ visitedStars, onStarClick }) => (
  <div className="absolute inset-0 z-0 bg-[#020617]">
    <Fallback2DStarfield />

    {/* Clickable star cards as fallback */}
    <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/40 text-sm mb-8"
        >
          ✨ Tap on stars to explore memories
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-2">
          {STARS_DATA.map((star, i) => {
            const isVisited = visitedStars.includes(star.id);
            return (
              <motion.button
                key={star.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onStarClick(star)}
                className="relative p-4 rounded-2xl text-center transition-all duration-300 group"
                style={{
                  background: isVisited
                    ? `linear-gradient(135deg, ${star.color}15, ${star.color}08)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isVisited ? star.color + "30" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{
                    backgroundColor: star.color,
                    boxShadow: `0 0 12px ${star.color}60`,
                  }}
                />
                <p
                  className="text-xs font-serif truncate"
                  style={{
                    color: isVisited ? star.color : "rgba(255,255,255,0.4)",
                  }}
                >
                  {star.title}
                </p>
                {isVisited && (
                  <div
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: star.color }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// STAR MODAL COMPONENT
// ============================================================================
interface StarModalProps {
  star: StarData | null;
  isOpen: boolean;
  onClose: () => void;
}

const StarModal: React.FC<StarModalProps> = ({ star, isOpen, onClose }) => {
  if (!star) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="star-modal-title"
          >
            <div
              className="max-w-md w-full pointer-events-auto relative rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  "linear-gradient(160deg, rgba(15,10,30,0.95) 0%, rgba(8,5,18,0.98) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: `1px solid ${star.color}20`,
                boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${star.color}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, ${star.color}12 0%, transparent 100%)`,
                }}
              />

              <div className="relative p-8 sm:p-10">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center
                           text-white/40 hover:text-white/80 transition-all duration-300
                           hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>

                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.15, 0.3, 0.15],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${star.color}40 0%, transparent 70%)`,
                        margin: "-12px",
                      }}
                    />
                    <div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${star.color}60, ${star.color}20)`,
                        boxShadow: `0 0 30px ${star.color}30`,
                        border: `1px solid ${star.color}30`,
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-5 h-5 rounded-full"
                        style={{
                          backgroundColor: star.color,
                          boxShadow: `0 0 15px ${star.color}80`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-white/35 mb-3 tracking-wider uppercase">
                  {star.date}
                </p>

                <h2
                  id="star-modal-title"
                  className="font-serif text-2xl text-center mb-2 font-medium"
                  style={{
                    color: star.color,
                    textShadow: `0 0 25px ${star.color}40`,
                  }}
                >
                  {star.title}
                </h2>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center justify-center gap-3 my-6"
                >
                  <div
                    className="h-px w-10"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${star.color}40)`,
                    }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: star.color,
                      opacity: 0.5,
                      boxShadow: `0 0 6px ${star.color}60`,
                    }}
                  />
                  <div
                    className="h-px w-10"
                    style={{
                      background: `linear-gradient(90deg, ${star.color}40, transparent)`,
                    }}
                  />
                </motion.div>

                <p className="text-white/70 font-serif text-base leading-relaxed text-center">
                  {star.message}
                </p>

                <div className="flex justify-center mt-8">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${star.color}80 0%, transparent 100%)`,
                      boxShadow: `0 0 10px ${star.color}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================
interface ProgressIndicatorProps {
  progress: number;
  visitedStarsCount: number;
  totalStars: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  visitedStarsCount,
  totalStars,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
    className="fixed top-4 left-4 z-30 px-4 py-3 rounded-xl"
    style={{
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    }}
  >
    <p className="text-xs text-white/50 mb-1">Journey Progress</p>
    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <p className="text-xs text-white/30 mt-1">
      {visitedStarsCount} / {totalStars} stars visited
    </p>
  </motion.div>
);

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================
interface BottomNavigationProps {
  canAccessLetters: boolean;
  canAccessGame: boolean;
  visitedStarsCount: number;
  onLettersClick: () => void;
  onGameClick: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  canAccessLetters,
  canAccessGame,
  visitedStarsCount,
  onLettersClick,
  onGameClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3"
  >
    <GlowButton
      onClick={onLettersClick}
      variant="pink"
      size="sm"
      disabled={!canAccessLetters}
    >
      {canAccessLetters
        ? "💌 Letters"
        : `🔒 Visit ${Math.max(0, 3 - visitedStarsCount)} more stars`}
    </GlowButton>

    <GlowButton
      onClick={onGameClick}
      variant="glass"
      size="sm"
      disabled={!canAccessGame}
    >
      {canAccessGame ? "🎮 Game" : "🔒 Open a letter first"}
    </GlowButton>
  </motion.div>
);

// ============================================================================
// INTERACTION HINT
// ============================================================================
const InteractionHint: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    transition={{ delay: 3 }}
    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20"
  >
    <motion.p
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-xs text-white/30 text-center"
    >
      Click on the glowing stars • Drag to rotate
    </motion.p>
  </motion.div>
);

// ============================================================================
// MAIN UNIVERSE PAGE
// ============================================================================
export default function UniversePage() {
  const router = useRouter();

  const _hasHydrated = useAppStore((s) => s._hasHydrated);
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

  const handleLettersClick = useCallback(() => {
    try {
      sessionStorage.setItem("universeSessionActive", "true");
      sessionStorage.setItem("universeTransitioning", "true");
    } catch (e) {
      console.warn(e);
    }
    router.push("/letters");
  }, [router]);

  const handleGameClick = useCallback(() => {
    try {
      sessionStorage.setItem("universeSessionActive", "true");
      sessionStorage.setItem("universeTransitioning", "true");
    } catch (e) {
      console.warn(e);
    }
    router.push("/game");
  }, [router]);

  if (!_hasHydrated) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617]">
      {/* 3D Galaxy Scene with Error Boundary */}
      <div className="absolute inset-0 z-0">
        <GalaxyErrorBoundary
          fallback={
            <GalaxyCrashFallback
              visitedStars={visitedStars}
              onStarClick={handleStarClick}
            />
          }
        >
          <Suspense fallback={<GalaxyLoadingFallback />}>
            <GalaxyScene
              visitedStars={visitedStars}
              showHiddenStar={canSeeHiddenStar}
              onStarClick={handleStarClick}
              onHiddenStarClick={handleHiddenStarClick}
            />
          </Suspense>
        </GalaxyErrorBoundary>
      </div>

      {/* Audio Player */}
      <AudioPlayer />

      {/* Back Button */}
      <BackButton href="/" label="Home" position="center" />

      {/* Progress Indicator */}
      <ProgressIndicator
        progress={progress}
        visitedStarsCount={visitedStarsCount}
        totalStars={STARS_DATA.length}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        canAccessLetters={canAccessLetters}
        canAccessGame={canAccessGame}
        visitedStarsCount={visitedStarsCount}
        onLettersClick={handleLettersClick}
        onGameClick={handleGameClick}
      />

      {/* Star Detail Modal */}
      <StarModal
        star={selectedStar}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Interaction Hint */}
      <InteractionHint />
    </div>
  );
}
