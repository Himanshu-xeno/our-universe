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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={isUnlocked ? onClick : undefined}
      className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-500 
        ${isUnlocked ? "cursor-pointer hover:bg-white/10" : "opacity-60 cursor-not-allowed"} 
        ${isOpened ? "border border-nebula-pink/30" : "border border-transparent"}`}
      whileHover={isUnlocked ? { scale: 1.02, y: -3 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
            ${isUnlocked ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20" : "bg-white/5"}`}
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
            <span className="text-white/30 text-xl">🔒</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-serif text-lg font-semibold mb-1 
              ${isUnlocked ? "text-soft-white" : "text-white/40"}`}
          >
            {letter.title}
          </h3>

          {isUnlocked ? (
            <p className="text-sm text-white/50">
              {isOpened ? "Read again ✦" : "Tap to open"}
            </p>
          ) : (
            <p className="text-xs text-white/30 italic">
              {customHint || "Locked"}
            </p>
          )}
        </div>
      </div>

      {isOpened && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-nebula-pink animate-pulse" />
        </div>
      )}

      {isUnlocked && !isOpened && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-nebula-pink/50 to-transparent" />
      )}
    </motion.div>
  );
}

export default LetterCard;
