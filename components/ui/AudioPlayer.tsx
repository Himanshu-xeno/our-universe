"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

/**
 * Minimal audio toggle player. Creates audio context on first user interaction.
 * Uses a simple Web Audio API oscillator for ambient drone when no audio file is provided.
 */
const AudioPlayer: React.FC = () => {
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const toggleAudio = useAppStore((s) => s.toggleAudio);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAmbientDrone = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    audioContextRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
    gain.connect(ctx.destination);
    gainRef.current = gain;

    // Create a soft ambient drone with multiple oscillators
    const freqs = [55, 82.5, 110, 165];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.008, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
    });
  }, []);

  const stopAmbientDrone = useCallback(() => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(
        0,
        audioContextRef.current.currentTime + 1,
      );
      setTimeout(() => {
        audioContextRef.current?.close();
        audioContextRef.current = null;
        gainRef.current = null;
      }, 1200);
    }
  }, []);

  useEffect(() => {
    if (audioEnabled) {
      startAmbientDrone();
    } else {
      stopAmbientDrone();
    }

    return () => {
      stopAmbientDrone();
    };
  }, [audioEnabled, startAmbientDrone, stopAmbientDrone]);

  return (
    <motion.button
      onClick={toggleAudio}
      className="fixed top-4 right-4 z-50 glass rounded-full w-12 h-12 flex items-center justify-center
                 hover:bg-white/10 transition-colors cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={audioEnabled ? "Mute audio" : "Enable audio"}
    >
      {audioEnabled ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  );
};

export default React.memo(AudioPlayer);
