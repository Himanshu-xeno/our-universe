// components/ui/BackButton.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  to: string;
  label?: string;
  position?: "left" | "center" | "right";
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = "Back",
  position = "left",
}) => {
  const router = useRouter();

  const positionClasses = {
    left: "left-4",
    center: "left-1/2 -translate-x-1/2",
    right: "right-4",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      onClick={() => router.push(to)}
      className={`fixed top-4 z-50 flex items-center gap-2 px-4 py-2.5
                 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08]
                 rounded-full text-white/70 text-sm font-medium
                 hover:bg-white/[0.12] hover:border-white/[0.18] hover:text-white
                 transition-all duration-500 cursor-pointer
                 shadow-[0_0_20px_rgba(255,255,255,0.03)]
                 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]
                 group ${positionClasses[position]}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span className="tracking-wide">{label}</span>

      {/* Subtle glow ring on hover */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
};

export default BackButton;
