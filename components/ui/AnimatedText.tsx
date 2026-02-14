"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  delayBetween?: number;
  onComplete?: () => void;
}

/**
 * Typewriter-style animated text that displays lines sequentially.
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({
  texts,
  className = "",
  typingSpeed = 50,
  delayBetween = 1500,
  onComplete,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    if (currentLineIndex >= texts.length) {
      onComplete?.();
      return;
    }

    const fullText = texts[currentLineIndex];

    if (isTyping) {
      if (currentText.length < fullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Line finished typing — wait then move to next
        setIsTyping(false);
        const timer = setTimeout(() => {
          setCompletedLines((prev) => [...prev, fullText]);
          setCurrentText("");
          setCurrentLineIndex((prev) => prev + 1);
          setIsTyping(true);
        }, delayBetween);
        return () => clearTimeout(timer);
      }
    }
  }, [
    currentText,
    currentLineIndex,
    isTyping,
    texts,
    typingSpeed,
    delayBetween,
    onComplete,
  ]);

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="wait">
        {completedLines.map((line, index) => (
          <motion.p
            key={`completed-${index}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.6 }}
            className="text-soft-white/60 font-serif text-xl md:text-3xl italic"
          >
            {line}
          </motion.p>
        ))}
      </AnimatePresence>

      {currentLineIndex < texts.length && (
        <motion.p
          key={`typing-${currentLineIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-soft-white font-serif text-xl md:text-3xl italic text-glow"
        >
          {currentText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-[2px] h-6 md:h-8 bg-nebula-pink ml-1 align-middle"
          />
        </motion.p>
      )}
    </div>
  );
};

export default React.memo(AnimatedText);
