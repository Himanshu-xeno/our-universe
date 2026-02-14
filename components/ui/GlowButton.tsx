"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "pink" | "blue" | "gold";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  pink: {
    bg: "bg-gradient-to-r from-pink-600/80 to-rose-500/80",
    glow: "rgba(255, 107, 157, 0.4)",
    glowHover: "rgba(255, 107, 157, 0.7)",
    border: "border-pink-400/30",
  },
  blue: {
    bg: "bg-gradient-to-r from-cyan-600/80 to-teal-500/80",
    glow: "rgba(78, 205, 196, 0.4)",
    glowHover: "rgba(78, 205, 196, 0.7)",
    border: "border-cyan-400/30",
  },
  gold: {
    bg: "bg-gradient-to-r from-yellow-600/80 to-amber-500/80",
    glow: "rgba(255, 215, 0, 0.4)",
    glowHover: "rgba(255, 215, 0, 0.7)",
    border: "border-yellow-400/30",
  },
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-12 py-4 text-lg",
};

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "pink",
  size = "md",
}) => {
  const style = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative ${style.bg} ${style.border} border
        ${sizeStyles[size]}
        rounded-full font-medium tracking-wide
        text-white/90 backdrop-blur-sm
        transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer select-none
        ${className}
      `}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.05,
              boxShadow: `0 0 30px ${style.glowHover}, 0 0 60px ${style.glow}`,
            }
      }
      whileTap={disabled ? {} : { scale: 0.97 }}
      initial={{
        boxShadow: `0 0 15px ${style.glow}`,
      }}
      animate={{
        boxShadow: [
          `0 0 15px ${style.glow}`,
          `0 0 25px ${style.glow}`,
          `0 0 15px ${style.glow}`,
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {children}
    </motion.button>
  );
};

export default React.memo(GlowButton);
