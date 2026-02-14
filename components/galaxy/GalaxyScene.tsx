"use client";

import React, { useRef, useMemo, Suspense, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import Star from "./Star";
import HiddenStar from "./HiddenStar";
import { StarData } from "@/store/useAppStore";
import { STARS_DATA } from "@/utils/constants";

interface GalaxySceneProps {
  visitedStars: string[];
  showHiddenStar: boolean;
  onStarClick: (star: StarData) => void;
  onHiddenStarClick: () => void;
}

/* ===== SPACE DUST — thousands of tiny faint particles ===== */
const SpaceDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#aabbcc"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ===== DISTANT GALAXIES — soft glowing spheres far away ===== */
const DistantGalaxies: React.FC = () => {
  const galaxies = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const radius = 40 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ),
        color: [
          "#ff6b9d",
          "#4ecdc4",
          "#7b68ee",
          "#ffd700",
          "#ff9a56",
          "#e056ff",
        ][i % 6],
        scale: 2 + Math.random() * 4,
        opacity: 0.015 + Math.random() * 0.02,
      };
    });
  }, []);

  return (
    <group>
      {galaxies.map((g, i) => (
        <mesh key={i} position={g.position}>
          <sphereGeometry args={[g.scale, 16, 16]} />
          <meshBasicMaterial
            color={g.color}
            transparent
            opacity={g.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ===== SHOOTING STARS — random meteors streaking across ===== */
const ShootingStars: React.FC = () => {
  const meteorsRef = useRef<
    {
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
    }[]
  >([]);

  // Initialize meteor slots
  useMemo(() => {
    meteorsRef.current = Array.from({ length: 8 }, () => ({
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
  }, []);

  const linesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const meteors = meteorsRef.current;

    meteors.forEach((m, i) => {
      if (!m.active) {
        // Randomly spawn — about 1 every 3 seconds
        if (Math.random() < 0.005) {
          m.active = true;
          m.life = 0;
          m.maxLife = 0.6 + Math.random() * 0.5;

          // Start from a random position in the upper area
          m.x = (Math.random() - 0.5) * 40;
          m.y = 10 + Math.random() * 15;
          m.z = -5 - Math.random() * 25;

          // Move diagonally downward
          const speed = 20 + Math.random() * 25;
          const angle = -0.3 - Math.random() * 0.5;
          m.vx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
          m.vy = -speed * Math.abs(Math.sin(angle));
          m.vz = (Math.random() - 0.5) * 5;

          m.tailX = m.x;
          m.tailY = m.y;
          m.tailZ = m.z;
        }
      } else {
        const dt = 1 / 60;
        m.life += dt;

        if (m.life >= m.maxLife) {
          m.active = false;
        } else {
          // Save tail position (previous position)
          m.tailX = m.x - m.vx * dt * 3;
          m.tailY = m.y - m.vy * dt * 3;
          m.tailZ = m.z - m.vz * dt * 3;

          // Update position
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
          (line.material as THREE.LineBasicMaterial).opacity = fade * 0.7;
          line.visible = true;
        } else {
          line.visible = false;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {Array.from({ length: 8 }, (_, i) => (
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

/* ===== CAMERA CONTROLLER — smooth zoom to clicked star ===== */
const CameraController: React.FC<{
  target: THREE.Vector3 | null;
  zooming: boolean;
}> = ({ target, zooming }) => {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 12), []);

  useFrame(() => {
    if (zooming && target) {
      const zoomTarget = new THREE.Vector3(
        target.x * 0.7,
        target.y * 0.7,
        target.z + 5,
      );
      camera.position.lerp(zoomTarget, 0.03);
    } else {
      camera.position.lerp(defaultPos, 0.02);
    }
  });

  return null;
};

/* ===== MAIN 3D SCENE ===== */
const GalaxyInner: React.FC<GalaxySceneProps> = ({
  visitedStars,
  showHiddenStar,
  onStarClick,
  onHiddenStarClick,
}) => {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const handleStarClick = useCallback(
    (star: StarData) => {
      setZoomTarget(new THREE.Vector3(...star.position));
      setIsZooming(true);
      setTimeout(() => {
        onStarClick(star);
        setTimeout(() => setIsZooming(false), 500);
      }, 800);
    },
    [onStarClick],
  );

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight
        position={[30, 20, -40]}
        intensity={0.15}
        color="#ff6b9d"
        distance={100}
      />
      <pointLight
        position={[-30, -15, -50]}
        intensity={0.1}
        color="#4ecdc4"
        distance={100}
      />
      <pointLight
        position={[0, 30, -60]}
        intensity={0.1}
        color="#7b68ee"
        distance={100}
      />

      <CameraController target={zoomTarget} zooming={isZooming} />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.15}
        minDistance={3}
        maxDistance={80}
        rotateSpeed={0.5}
        zoomSpeed={1.2}
        panSpeed={0.5}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />

      {/* Deep background — 8000 tiny stars */}
      <Stars
        radius={100}
        depth={100}
        count={8000}
        factor={3}
        saturation={0.1}
        fade
        speed={0.3}
      />

      {/* Mid layer — 3000 stars */}
      <Stars
        radius={50}
        depth={50}
        count={3000}
        factor={2}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <SpaceDust />
      <DistantGalaxies />
      <ShootingStars />

      {/* 20 interactive stars */}
      {STARS_DATA.map((star) => (
        <Star
          key={star.id}
          star={star}
          isVisited={visitedStars.includes(star.id)}
          onClick={handleStarClick}
        />
      ))}

      <HiddenStar visible={showHiddenStar} onClick={onHiddenStarClick} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={1.2}
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
};

/* ===== CANVAS WRAPPER ===== */
const GalaxyScene: React.FC<GalaxySceneProps> = (props) => {
  return (
    <div className="w-full h-full" style={{ touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#000000" }}
      >
        <Suspense fallback={null}>
          <GalaxyInner {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default React.memo(GalaxyScene);
