"use client";

import React from "react";
import { motion } from "framer-motion";

interface LetterData {
  id: string;
  title: string;
  message: string;
  condition: string;
}

interface LetterCardProps {
  letter: LetterData;
  isUnlocked: boolean;
  isOpened: boolean;
  onClick: () => void;
  index: number;
  customHint?: string;
}

function LetterCard({
  letter,
  isUnlocked,
  isOpened,
  onClick,
  index,
  customHint,
}: LetterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      onClick={isUnlocked ? onClick : undefined}
      className={`relative group overflow-hidden rounded-2xl transition-all duration-500
        ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
      whileHover={isUnlocked ? { scale: 1.015, y: -2 } : {}}
      whileTap={isUnlocked ? { scale: 0.985 } : {}}
    >
      {/* Card Background with layered glassmorphism */}
      <div
        className={`relative p-6 rounded-2xl transition-all duration-500 ${
          isUnlocked ? "opacity-100" : "opacity-50"
        }`}
        style={{
          background: isOpened
            ? "linear-gradient(135deg, rgba(255,107,157,0.08) 0%, rgba(167,139,250,0.06) 50%, rgba(255,107,157,0.04) 100%)"
            : isUnlocked
              ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
              : "rgba(255,255,255,0.02)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isOpened
            ? "1px solid rgba(255,107,157,0.25)"
            : isUnlocked
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.04)",
          boxShadow: isOpened
            ? "0 8px 40px rgba(255,107,157,0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Shimmer effect on hover for unlocked cards */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
            }}
          />
        )}

        <div className="flex items-center gap-5">
          {/* Icon Container */}
          <div className="relative flex-shrink-0">
            {/* Glow ring behind icon */}
            {isUnlocked && !isOpened && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,107,157,0.3) 0%, transparent 70%)",
                  margin: "-4px",
                }}
              />
            )}

            <div
              className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500`}
              style={{
                background: isUnlocked
                  ? isOpened
                    ? "linear-gradient(135deg, rgba(255,107,157,0.2) 0%, rgba(167,139,250,0.15) 100%)"
                    : "linear-gradient(135deg, rgba(255,107,157,0.15) 0%, rgba(236,72,153,0.1) 100%)"
                  : "rgba(255,255,255,0.03)",
                border: isUnlocked
                  ? "1px solid rgba(255,107,157,0.15)"
                  : "1px solid rgba(255,255,255,0.05)",
                boxShadow: isOpened
                  ? "0 4px 20px rgba(255,107,157,0.15)"
                  : "none",
              }}
            >
              {isUnlocked ? (
                <motion.span
                  className="text-2xl"
                  animate={
                    isOpened
                      ? { scale: [1, 1.05, 1] }
                      : { rotateY: [0, 180, 360] }
                  }
                  transition={{
                    duration: isOpened ? 4 : 3,
                    repeat: Infinity,
                    repeatDelay: isOpened ? 5 : 4,
                    ease: "easeInOut",
                  }}
                >
                  {isOpened ? "💌" : "✉️"}
                </motion.span>
              ) : (
                <motion.span
                  className="text-xl"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🔒
                </motion.span>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-serif text-lg mb-1.5 transition-colors duration-300 ${
                isUnlocked
                  ? isOpened
                    ? "text-white/90"
                    : "text-white/80 group-hover:text-white/95"
                  : "text-white/30"
              }`}
              style={{
                textShadow: isOpened
                  ? "0 0 20px rgba(255,107,157,0.2)"
                  : "none",
              }}
            >
              {letter.title}
            </h3>

            {isUnlocked ? (
              <div className="flex items-center gap-2">
                {isOpened ? (
                  <>
                    <motion.span
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-pink-400/60 text-xs"
                    >
                      ✦
                    </motion.span>
                    <span className="text-sm text-pink-300/50 font-light">
                      Read again
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-white/40 font-light">
                      Tap to open
                    </span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-white/30 text-xs"
                    >
                      →
                    </motion.span>
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-white/25 italic font-light">
                {customHint || "Keep exploring to unlock..."}
              </p>
            )}
          </div>

          {/* Right side indicator */}
          <div className="flex-shrink-0">
            {isOpened && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,107,157,0.8) 0%, rgba(255,107,157,0.3) 100%)",
                  boxShadow: "0 0 10px rgba(255,107,157,0.4)",
                }}
              />
            )}
            {isUnlocked && !isOpened && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-white/20"
              />
            )}
          </div>
        </div>

        {/* Bottom accent line for unlocked unread */}
        {isUnlocked && !isOpened && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,107,157,0.4) 30%, rgba(167,139,250,0.3) 70%, transparent 100%)",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default LetterCard;
