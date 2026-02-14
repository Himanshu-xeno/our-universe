"use client";

import React from "react";
import { motion } from "framer-motion";
import { LetterData } from "@/store/useAppStore";
import { getUnlockHint } from "@/utils/unlockLogic";

interface LetterCardProps {
  letter: LetterData;
  isUnlocked: boolean;
  isOpened: boolean;
  onClick: () => void;
  index: number;
}

const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  isUnlocked,
  isOpened,
  onClick,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      onClick={isUnlocked ? onClick : undefined}
      className={`
        glass rounded-2xl p-6 relative overflow-hidden
        transition-all duration-500
        ${isUnlocked ? "cursor-pointer hover:bg-white/10" : "opacity-60 cursor-not-allowed"}
        ${isOpened ? "border-nebula-pink/30" : ""}
      `}
      whileHover={isUnlocked ? { scale: 1.03, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      style={{
        animation: isUnlocked ? "float 6s ease-in-out infinite" : undefined,
        animationDelay: `${index * 0.5}s`,
      }}
    >
      {/* Envelope icon */}
      <div className="flex items-start gap-4">
        <div
          className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${
            isUnlocked
              ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20"
              : "bg-white/5"
          }
        `}
        >
          {isUnlocked ? (
            <motion.span
              className="text-2xl"
              animate={isOpened ? {} : { rotateY: [0, 180, 0] }}
              transition={{
                duration: 2,
                repeat: isOpened ? 0 : Infinity,
                repeatDelay: 3,
              }}
            >
              {isOpened ? "💌" : "✉️"}
            </motion.span>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/30"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
            font-serif text-lg font-semibold mb-1
            ${isUnlocked ? "text-soft-white" : "text-white/40"}
          `}
          >
            {letter.title}
          </h3>

          {isUnlocked ? (
            <p className="text-sm text-white/50">
              {isOpened ? "Read again ✦" : "Tap to open"}
            </p>
          ) : (
            <p className="text-xs text-white/30 italic">
              {getUnlockHint(letter)}
            </p>
          )}
        </div>
      </div>

      {/* Visited indicator */}
      {isOpened && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-nebula-pink animate-pulse" />
        </div>
      )}

      {/* Bottom glow for unlocked cards */}
      {isUnlocked && !isOpened && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-nebula-pink/50 to-transparent" />
      )}
    </motion.div>
  );
};

export default React.memo(LetterCard);
