import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber"; // ← useFrame comes from here
import * as THREE from "three";

/* ===== SHOOTING STARS — dynamic meteors streaking across the galaxy ===== */
interface Meteor {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  tailX: number;
  tailY: number;
  tailZ: number;
}

interface ShootingStarsProps {
  meteorCount?: number; // optional, default 12
  spawnRate?: number; // optional, default 0.01
}

const ShootingStars: React.FC<ShootingStarsProps> = ({
  meteorCount = 12,
  spawnRate = 0.01,
}) => {
  const meteorsRef = useRef<Meteor[]>([]);
  const linesRef = useRef<THREE.Group>(null);

  // Initialize meteor slots
  useMemo(() => {
    meteorsRef.current = Array.from({ length: meteorCount }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: -20,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      tailX: 0,
      tailY: 0,
      tailZ: 0,
    }));
  }, [meteorCount]);

  useFrame(() => {
    const dt = 1 / 60;
    const meteors = meteorsRef.current;

    meteors.forEach((m) => {
      if (!m.active) {
        // Random spawn
        if (Math.random() < spawnRate) {
          m.active = true;
          m.life = 0;
          m.maxLife = 0.5 + Math.random() * 0.8; // lifespan
          // Start position randomly in upper part
          m.x = (Math.random() - 0.5) * 60;
          m.y = 10 + Math.random() * 20;
          m.z = -10 - Math.random() * 40;
          // Velocity (diagonal downward)
          const speed = 20 + Math.random() * 30;
          const angle = -0.3 - Math.random() * 0.5;
          m.vx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
          m.vy = -speed * Math.abs(Math.sin(angle));
          m.vz = (Math.random() - 0.5) * 5;
          // Tail initial
          m.tailX = m.x;
          m.tailY = m.y;
          m.tailZ = m.z;
        }
      } else {
        // Active meteors move
        m.life += dt;
        if (m.life >= m.maxLife) {
          m.active = false;
        } else {
          // Tail = previous position
          m.tailX = m.x - m.vx * dt * 4;
          m.tailY = m.y - m.vy * dt * 4;
          m.tailZ = m.z - m.vz * dt * 4;
          // Move meteor
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.z += m.vz * dt;
        }
      }
    });

    // Update line geometries
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const line = child as THREE.Line;
        const m = meteors[i];
        if (m.active) {
          const fade = 1 - m.life / m.maxLife;
          const positions = new Float32Array([
            m.tailX,
            m.tailY,
            m.tailZ,
            m.x,
            m.y,
            m.z,
          ]);
          line.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
          );
          line.geometry.attributes.position.needsUpdate = true;
          (line.material as THREE.LineBasicMaterial).opacity = fade * 0.8;
          line.visible = true;
        } else {
          line.visible = false;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {Array.from({ length: meteorCount }, (_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, 0, 0, 0, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

export default ShootingStars;
