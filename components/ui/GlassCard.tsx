"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glowColor?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = false,
  glowColor = "rgba(255, 107, 157, 0.15)",
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`relative group overflow-hidden rounded-2xl p-6
        ${hoverable ? "cursor-pointer" : ""}
        ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      whileHover={
        hoverable
          ? {
              scale: 1.015,
              y: -2,
            }
          : {}
      }
      whileTap={hoverable ? { scale: 0.985 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Hover glow effect */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Shimmer on hover */}
      {hoverable && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)",
          }}
        />
      )}

      {/* Hover border glow */}
      {hoverable && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            border: `1px solid rgba(255,255,255,0.15)`,
            boxShadow: `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default React.memo(GlassCard);
