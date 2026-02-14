"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  delayBetween?: number;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  texts,
  className = "",
  typingSpeed = 50,
  delayBetween = 1500,
  onComplete,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);

  // Store onComplete in a ref so it never causes re-renders
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Store texts in a ref to avoid dependency issues
  const textsRef = useRef(texts);
  textsRef.current = texts;

  useEffect(() => {
    // Already finished everything
    if (allDone) return;

    // All lines have been typed
    if (currentLineIndex >= textsRef.current.length) {
      setAllDone(true);
      onCompleteRef.current?.();
      return;
    }

    const fullText = textsRef.current[currentLineIndex];

    // Still typing current line
    if (currentText.length < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    // Current line finished — wait, then move to next line
    const timer = setTimeout(() => {
      setCompletedLines((prev) => [...prev, fullText]);
      setCurrentText("");
      setCurrentLineIndex((prev) => prev + 1);
    }, delayBetween);

    return () => clearTimeout(timer);
  }, [currentText, currentLineIndex, allDone, typingSpeed, delayBetween]);
  // NOTE: onComplete and texts are intentionally excluded — stored in refs

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Lines that finished typing — shown dimmer */}
      {completedLines.map((line, index) => (
        <motion.p
          key={`done-${index}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.6 }}
          className="text-soft-white/60 font-serif text-xl md:text-3xl italic"
        >
          {line}
        </motion.p>
      ))}

      {/* Line currently being typed */}
      {currentLineIndex < texts.length && !allDone && (
        <motion.p
          key={`typing-${currentLineIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-soft-white font-serif text-xl md:text-3xl italic text-glow"
        >
          {currentText}
          {/* Blinking cursor */}
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
