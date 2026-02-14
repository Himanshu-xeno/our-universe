"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterData } from "@/store/useAppStore";

interface LetterModalProps {
  letter: LetterData | null;
  isOpen: boolean;
  onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({
  letter,
  isOpen,
  onClose,
}) => {
  if (!letter) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-strong max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10
                         flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Decorative top element */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="text-3xl"
                >
                  ✦
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-2xl text-center text-nebula-pink text-glow mb-6"
              >
                {letter.title}
              </motion.h2>

              {/* Divider */}
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-nebula-pink/50 to-transparent mx-auto mb-6" />

              {/* Message content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-4"
              >
                {letter.message.split("\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={`
                      text-soft-white/80 leading-relaxed
                      ${paragraph.trim() === "" ? "h-4" : "font-serif text-base"}
                    `}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* Bottom decoration */}
              <div className="flex justify-center mt-8">
                <div className="w-2 h-2 rounded-full bg-nebula-pink/50 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(LetterModal);
