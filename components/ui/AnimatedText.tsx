"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  texts: string[];
  typingSpeed?: number;
  delayBetween?: number;
  className?: string;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  texts,
  typingSpeed = 50,
  delayBetween = 2000,
  className = "",
  onComplete,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (currentTextIndex >= texts.length) {
      if (!hasCalledComplete.current && onComplete) {
        hasCalledComplete.current = true;
        setTimeout(() => {
          onComplete();
        }, 500);
      }
      return;
    }

    const currentText = texts[currentTextIndex];

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
          if (currentTextIndex < texts.length - 1) {
            setCurrentTextIndex((prev) => prev + 1);
            setDisplayedText("");
            setIsTyping(true);
          } else {
            setShowCursor(false);
          }
        }, delayBetween);
        return () => clearTimeout(timeout);
      }
    }
  }, [
    currentTextIndex,
    displayedText,
    isTyping,
    texts,
    typingSpeed,
    delayBetween,
    onComplete,
  ]);

  // Cursor blink effect
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <div className={`font-light text-white/80 ${className}`}>
      <span className="relative">
        {displayedText}
        {showCursor && (
          <motion.span
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.1 }}
            className="inline-block w-[2px] h-[1em] bg-white/60 ml-1 align-middle"
            style={{ marginBottom: "0.1em" }}
          />
        )}
      </span>
    </div>
  );
};

export default AnimatedText;
