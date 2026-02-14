"use client";

import React, { useRef, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HIDDEN_STAR } from "@/utils/constants";

interface HiddenStarProps {
  visible: boolean;
  onClick: () => void;
}

/**
 * The hidden star that only appears when progression requirements are met.
 * Features a dramatic fade-in and unique visual effects.
 */
const HiddenStar: React.FC<HiddenStarProps> = ({ visible, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const fadeProgress = useRef(0);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth fade in
    if (visible && fadeProgress.current < 1) {
      fadeProgress.current = Math.min(1, fadeProgress.current + 0.005);
    }

    groupRef.current.visible = fadeProgress.current > 0.01;

    if (coreRef.current) {
      // Ethereal rotation
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;

      const pulse = 1 + Math.sin(t * 1.5) * 0.15;
      const hover = hovered ? 1.6 : 1;
      coreRef.current.scale.setScalar(pulse * hover * fadeProgress.current);
    }

    // Update opacity of all children based on fade
    groupRef.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity =
            mat.userData.baseOpacity *
            fadeProgress.current *
            (hovered ? 1.5 : 1);
        }
      }
    });
  });

  const handlePointerOver = useCallback(() => {
    if (!visible) return;
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, [visible]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  return (
    <group ref={groupRef} position={HIDDEN_STAR.position} visible={false}>
      {/* Multi-layered glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          userData={{ baseOpacity: 0.05 }}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          userData={{ baseOpacity: 0.1 }}
        />
      </mesh>

      {/* Core */}
      <mesh
        ref={coreRef}
        onClick={visible ? onClick : undefined}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <icosahedronGeometry args={[0.2, 2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 64]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          userData={{ baseOpacity: 0.15 }}
        />
      </mesh>

      {hovered && visible && (
        <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="glass-strong px-4 py-2 rounded-xl text-center whitespace-nowrap">
            <p className="text-sm text-star-gold font-semibold text-glow-gold">
              ✦ {HIDDEN_STAR.title} ✦
            </p>
            <p className="text-xs text-white/60 mt-1">Click to discover</p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default React.memo(HiddenStar);
