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
      className={`
        glass rounded-2xl p-6
        ${hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
      whileHover={
        hoverable
          ? {
              scale: 1.02,
              boxShadow: `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }
          : {}
      }
      whileTap={hoverable ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default React.memo(GlassCard);
