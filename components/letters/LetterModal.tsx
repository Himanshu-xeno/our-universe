"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LetterData {
  id: string;
  title: string;
  message: string;
  condition: string;
}

interface LetterModalProps {
  letter: LetterData | null;
  isOpen: boolean;
  onClose: () => void;
}

function LetterModal({ letter, isOpen, onClose }: LetterModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
            className="fixed inset-0 z-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="max-w-lg w-full max-h-[85vh] overflow-y-auto pointer-events-auto relative rounded-3xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  "linear-gradient(160deg, rgba(20,10,35,0.95) 0%, rgba(10,5,20,0.98) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,107,157,0.12)",
                boxShadow:
                  "0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,107,157,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Decorative top gradient */}
              <div
                className="absolute top-0 left-0 right-0 h-32 rounded-t-3xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,107,157,0.06) 0%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="relative p-8 sm:p-10">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center
                           text-white/40 hover:text-white/80 transition-all duration-300
                           hover:bg-white/10 hover:rotate-90"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* Decorative star */}
                <div className="flex justify-center mb-6 pt-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="relative"
                  >
                    <span
                      className="text-2xl"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(255,107,157,0.4))",
                      }}
                    >
                      ✦
                    </span>
                  </motion.div>
                </div>

                {/* Letter icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex justify-center mb-6"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,107,157,0.15) 0%, rgba(167,139,250,0.1) 100%)",
                      border: "1px solid rgba(255,107,157,0.15)",
                      boxShadow: "0 8px 30px rgba(255,107,157,0.12)",
                    }}
                  >
                    <span className="text-3xl">💌</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-serif text-2xl sm:text-3xl text-center mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fda4af 50%, #f9a8d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                    filter: "drop-shadow(0 0 20px rgba(255,107,157,0.2))",
                  }}
                >
                  {letter.title}
                </motion.h2>

                {/* Decorative divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center justify-center gap-3 my-6"
                >
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-400/30" />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-pink-400/50"
                  />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-400/30" />
                </motion.div>

                {/* Message body */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-4"
                >
                  {letter.message.split("\n").map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                      className={`leading-relaxed ${
                        paragraph.trim() === ""
                          ? "h-3"
                          : "font-serif text-base text-white/70"
                      }`}
                      style={{
                        textShadow: "0 0 30px rgba(255,255,255,0.03)",
                      }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </motion.div>

                {/* Bottom decoration */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col items-center mt-10 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/10" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,107,157,0.6) 0%, transparent 100%)",
                        boxShadow: "0 0 8px rgba(255,107,157,0.3)",
                      }}
                    />
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/10" />
                  </div>

                  <span className="text-white/15 text-xs tracking-[0.2em] uppercase font-light">
                    with all my love
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LetterModal;
