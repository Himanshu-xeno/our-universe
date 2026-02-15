"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
  position?: "left" | "center";
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  href = "/",
  label = "Back",
  position = "left",
  className = "",
}) => {
  const router = useRouter();

  const positionClasses = {
    left: "left-6",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      onClick={() => router.push(href)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        fixed top-6 z-50
        ${positionClasses[position]}
        flex items-center gap-2
        px-5 py-3 rounded-full
        text-white/70 text-sm font-medium
        transition-all duration-300
        group
        ${className}
      `}
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Arrow with animation */}
      <motion.svg
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-4 h-4 text-white/60 group-hover:text-white transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </motion.svg>

      <span className="group-hover:text-white transition-colors">{label}</span>

      {/* Hover glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      />
    </motion.button>
  );
};

export default BackButton;
