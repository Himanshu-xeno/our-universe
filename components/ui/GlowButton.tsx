"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "glass" | "outline" | "pink";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.25)",
          hoverBg:
            "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
          glow: "rgba(255, 255, 255, 0.5)",
          text: "text-white",
        };
      case "pink":
        return {
          background:
            "linear-gradient(135deg, rgba(255,107,157,0.25) 0%, rgba(255,107,157,0.1) 100%)",
          border: "1px solid rgba(255,107,157,0.5)",
          hoverBg:
            "linear-gradient(135deg, rgba(255,107,157,0.4) 0%, rgba(255,107,157,0.2) 100%)",
          glow: "rgba(255, 107, 157, 0.7)",
          text: "text-white",
        };
      case "glass":
        return {
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          hoverBg: "rgba(255,255,255,0.1)",
          glow: "rgba(255, 255, 255, 0.3)",
          text: "text-white/80",
        };
      case "outline":
        return {
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          hoverBg: "rgba(255,255,255,0.05)",
          glow: "rgba(255, 255, 255, 0.3)",
          text: "text-white/90",
        };
      default:
        return {
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          hoverBg: "rgba(255,255,255,0.15)",
          glow: "rgba(255, 255, 255, 0.3)",
          text: "text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative overflow-hidden rounded-full
        ${sizeClasses[size]}
        ${styles.text}
        font-medium tracking-wide
        transition-all duration-300 ease-out
        backdrop-blur-xl
        cursor-pointer
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        background: isHovered ? styles.hoverBg : styles.background,
        border: styles.border,
        boxShadow: isHovered
          ? `0 0 40px ${styles.glow}, 0 0 80px ${styles.glow}40, inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 0 20px ${styles.glow}30, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Mouse follow glow */}
      {isHovered && !disabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: mousePos.x - 75,
            top: mousePos.y - 75,
            width: 150,
            height: 150,
            background: `radial-gradient(circle, ${styles.glow} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Shimmer effect */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={
          isHovered ? { x: "200%", opacity: 1 } : { x: "-100%", opacity: 0 }
        }
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          width: "50%",
        }}
      />

      {/* Top highlight line */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default GlowButton;
