// // "use client";

// // import React, { useCallback, useEffect, useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useRouter } from "next/navigation";
// // import { useAppStore } from "@/store/useAppStore";
// // import GameCanvas from "@/components/game/GameCanvas";

// // export default function GamePage() {
// //   const router = useRouter();
// //   const completeGame = useAppStore((s) => s.completeGame);
// //   const canAccessGame = useAppStore((s) => s.canAccessGame);
// //   const [showIntro, setShowIntro] = useState(true);

// //   // Redirect if not yet unlocked
// //   useEffect(() => {
// //     if (!canAccessGame()) {
// //       router.push("/universe");
// //     }
// //   }, [canAccessGame, router]);

// //   const handleWin = useCallback(() => {
// //     completeGame();
// //     setTimeout(() => {
// //       router.push("/universe");
// //     }, 1000);
// //   }, [completeGame, router]);

// //   const startGame = useCallback(() => {
// //     setShowIntro(false);
// //   }, []);

// //   return (
// //     <div className="w-screen h-screen bg-deep-navy overflow-hidden relative">
// //       {/* Game intro overlay */}
// //       <AnimatePresence>
// //         {showIntro && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             transition={{ duration: 0.8 }}
// //             className="absolute inset-0 z-30 bg-deep-navy/95 flex flex-col items-center justify-center px-6 text-center"
// //           >
// //             <motion.h1
// //               initial={{ y: 20, opacity: 0 }}
// //               animate={{ y: 0, opacity: 1 }}
// //               transition={{ delay: 0.3 }}
// //               className="font-serif text-3xl md:text-5xl text-glow mb-6"
// //             >
// //               🎮 The Journey
// //             </motion.h1>

// //             <motion.div
// //               initial={{ y: 20, opacity: 0 }}
// //               animate={{ y: 0, opacity: 1 }}
// //               transition={{ delay: 0.6 }}
// //               className="glass max-w-md p-6 rounded-2xl mb-8"
// //             >
// //               <p className="text-soft-white/70 mb-4 font-serif italic">
// //                 "Love is not a destination — it is the courage to keep moving
// //                 toward each other."
// //               </p>
// //               <div className="space-y-2 text-left text-sm text-white/50">
// //                 <p>💕 Guide the heart to reach your person</p>
// //                 <p>
// //                   ✨ Collect <span className="text-nebula-blue">Trust</span>,{" "}
// //                   <span className="text-star-gold">Patience</span>, and{" "}
// //                   <span className="text-purple-400">Communication</span>
// //                 </p>
// //                 <p>
// //                   🚫 Avoid <span className="text-red-400">Ego</span>,{" "}
// //                   <span className="text-red-400">Distance</span>, and{" "}
// //                   <span className="text-red-400">Overthinking</span>
// //                 </p>
// //                 <p className="mt-3 text-white/40">
// //                   {typeof window !== "undefined" && "ontouchstart" in window
// //                     ? "Drag to move"
// //                     : "Arrow keys or WASD to move"}
// //                 </p>
// //               </div>
// //             </motion.div>

// //             <motion.div
// //               initial={{ y: 20, opacity: 0 }}
// //               animate={{ y: 0, opacity: 1 }}
// //               transition={{ delay: 0.9 }}
// //             >
// //               <button
// //                 onClick={startGame}
// //                 className="bg-gradient-to-r from-pink-600 to-rose-500 px-10 py-4 rounded-full
// //                            text-white font-medium text-lg
// //                            hover:shadow-[0_0_30px_rgba(255,107,157,0.5)] transition-shadow
// //                            active:scale-95 transform"
// //               >
// //                 Begin ✦
// //               </button>
// //             </motion.div>

// //             <motion.button
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 0.3 }}
// //               transition={{ delay: 1.2 }}
// //               onClick={() => router.push("/universe")}
// //               className="mt-6 text-xs text-white/30 hover:text-white/50 transition-colors"
// //             >
// //               ← Back to universe
// //             </motion.button>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       {/* Game canvas */}
// //       {!showIntro && <GameCanvas onWin={handleWin} />}
// //     </div>
// //   );
// // }

// // app/game/page.tsx
// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/store/useAppStore";
// import { LETTERS_DATA } from "@/utils/constants";
// import { isLetterUnlocked } from "@/utils/unlockLogic";
// import LetterCard from "@/components/letters/LetterCard";
// import LetterModal from "@/components/letters/LetterModal";
// import GlowButton from "@/components/ui/GlowButton";
// import AudioPlayer from "@/components/ui/AudioPlayer";
// import BackButton from "@/components/ui/BackButton";
// import type { LetterData } from "@/store/useAppStore";

// export default function LettersPage() {
//   const router = useRouter();
//   const visitedStars = useAppStore((s) => s.visitedStars);
//   const openedLetters = useAppStore((s) => s.openedLetters);
//   const gameCompleted = useAppStore((s) => s.gameCompleted);
//   const openLetter = useAppStore((s) => s.openLetter);
//   const canAccessLetters = useAppStore((s) => s.canAccessLetters);

//   const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   // Redirect if not yet unlocked
//   useEffect(() => {
//     if (!canAccessLetters()) {
//       router.push("/universe");
//     }
//   }, [canAccessLetters, router]);

//   const handleLetterClick = useCallback(
//     (letter: LetterData) => {
//       openLetter(letter.id);
//       setSelectedLetter(letter);
//       setModalOpen(true);
//     },
//     [openLetter],
//   );

//   const handleCloseModal = useCallback(() => {
//     setModalOpen(false);
//     setTimeout(() => setSelectedLetter(null), 500);
//   }, []);

//   return (
//     <div className="min-h-screen bg-deep-navy relative overflow-hidden">
//       {/* Ambient background */}
//       <div className="fixed inset-0 bg-gradient-to-b from-cosmic-purple/30 via-deep-navy to-deep-navy pointer-events-none" />
//       <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-nebula-pink/5 rounded-full blur-3xl pointer-events-none" />
//       <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-nebula-blue/5 rounded-full blur-3xl pointer-events-none" />

//       <AudioPlayer />

//       {/* Back to Universe */}
//       <BackButton to="/universe" label="Universe" />

//       <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-12"
//         >
//           <h1 className="font-serif text-4xl md:text-5xl text-glow mb-4">
//             💌 Letters
//           </h1>
//           <p className="text-soft-white/50 font-serif italic">
//             Words written in starlight, meant only for you
//           </p>
//           <div className="w-20 h-px bg-gradient-to-r from-transparent via-nebula-pink/50 to-transparent mx-auto mt-4" />
//         </motion.div>

//         {/* Letter cards */}
//         <div className="space-y-4 mb-12">
//           {LETTERS_DATA.map((letter, index) => {
//             const unlocked = isLetterUnlocked(
//               letter,
//               visitedStars,
//               gameCompleted,
//             );
//             const opened = openedLetters.includes(letter.id);

//             return (
//               <LetterCard
//                 key={letter.id}
//                 letter={letter}
//                 isUnlocked={unlocked}
//                 isOpened={opened}
//                 onClick={() => handleLetterClick(letter)}
//                 index={index}
//               />
//             );
//           })}
//         </div>

//         {/* Bottom back button */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="text-center"
//         >
//           <GlowButton
//             onClick={() => router.push("/universe")}
//             variant="blue"
//             size="sm"
//           >
//             ← Back to Universe
//           </GlowButton>
//         </motion.div>
//       </div>

//       {/* Letter modal */}
//       <LetterModal
//         letter={selectedLetter}
//         isOpen={modalOpen}
//         onClose={handleCloseModal}
//       />
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect, useRef /*useCallback*/ } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/store/useAppStore";
// //import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
// import AudioPlayer from "@/components/ui/AudioPlayer";
// import BackButton from "@/components/ui/BackButton";
// import GlowButton from "@/components/ui/GlowButton";

// // Import your existing complex game
// // MAKE SURE YOUR FILE IS SAVED AT THIS PATH:
// import GameCanvas from "@/components/game/GameCanvas";

// // --- TYPES ---
// type GameType = "journey" | "catcher" | "memory" | "cipher" | "sync" | null;

// interface GameCardProps {
//   title: string;
//   description: string;
//   icon: string;
//   color: string;
//   onPlay: () => void;
//   difficulty: "Easy" | "Medium" | "Hard";
// }

// // ==========================================
// // 1. COMPONENT: GAME CARD (The Hub UI)
// // ==========================================
// const GameCard: React.FC<GameCardProps> = ({
//   title,
//   description,
//   icon,
//   color,
//   onPlay,
//   difficulty,
// }) => (
//   <motion.div
//     whileHover={{ y: -5, scale: 1.02 }}
//     className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group cursor-pointer"
//     onClick={onPlay}
//   >
//     <div
//       className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
//       style={{
//         background: `radial-gradient(circle at center, ${color}, transparent)`,
//       }}
//     />
//     <div className="relative z-10 flex flex-col h-full">
//       <div className="flex justify-between items-start mb-4">
//         <div className="text-4xl">{icon}</div>
//         <span
//           className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${
//             difficulty === "Easy"
//               ? "text-green-400"
//               : difficulty === "Medium"
//                 ? "text-yellow-400"
//                 : "text-red-400"
//           }`}
//         >
//           {difficulty}
//         </span>
//       </div>
//       <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
//       <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
//       <button
//         className="w-full py-2 rounded-lg font-medium text-sm transition-all"
//         style={{ backgroundColor: `${color}40`, border: `1px solid ${color}` }}
//       >
//         Play Game
//       </button>
//     </div>
//   </motion.div>
// );

// // ==========================================
// // 2. MINI-GAME: STAR CATCHER
// // ==========================================
// const StarCatcherGame = ({
//   onWin,
//   onBack,
// }: {
//   onWin: () => void;
//   onBack: () => void;
// }) => {
//   const [score, setScore] = useState(0);
//   const [playerX, setPlayerX] = useState(50);
//   const [items, setItems] = useState<{ id: number; x: number; y: number }[]>(
//     [],
//   );
//   const gameLoopRef = useRef<number>();

//   // Simple game loop
//   useEffect(() => {
//     const loop = () => {
//       setItems((prev) => {
//         // Spawn
//         const newItem =
//           Math.random() < 0.05
//             ? [{ id: Math.random(), x: Math.random() * 90, y: 0 }]
//             : [];
//         // Move & Filter
//         return [...prev, ...newItem]
//           .map((i) => ({ ...i, y: i.y + 1.5 }))
//           .filter((i) => i.y < 100);
//       });
//       gameLoopRef.current = requestAnimationFrame(loop);
//     };
//     loop();
//     return () => cancelAnimationFrame(gameLoopRef.current!);
//   }, []);

//   // Collision
//   useEffect(() => {
//     setItems((prev) => {
//       const caught = prev.find(
//         (i) => i.y > 85 && i.y < 95 && Math.abs(i.x - playerX) < 10,
//       );
//       if (caught) {
//         setScore((s) => s + 10);
//         return prev.filter((i) => i !== caught);
//       }
//       return prev;
//     });
//   }, [playerX]);

//   useEffect(() => {
//     if (score >= 100) onWin();
//   }, [score, onWin]);

//   return (
//     <div
//       className="relative w-full h-full bg-black/50 rounded-xl overflow-hidden touch-none"
//       onMouseMove={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         setPlayerX(((e.clientX - rect.left) / rect.width) * 100);
//       }}
//       onTouchMove={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         setPlayerX(((e.touches[0].clientX - rect.left) / rect.width) * 100);
//       }}
//     >
//       <div className="absolute top-4 right-4 text-white font-mono">
//         Score: {score}/100
//       </div>
//       {items.map((i) => (
//         <div
//           key={i.id}
//           className="absolute text-2xl"
//           style={{ left: `${i.x}%`, top: `${i.y}%` }}
//         >
//           💖
//         </div>
//       ))}
//       <div
//         className="absolute bottom-4 text-4xl transform -translate-x-1/2 transition-all duration-75"
//         style={{ left: `${playerX}%` }}
//       >
//         🧑‍🚀
//       </div>
//     </div>
//   );
// };

// // ==========================================
// // 3. MINI-GAME: MEMORY CONSTELLATIONS
// // ==========================================
// const MemoryGame = ({ onWin }: { onWin: () => void }) => {
//   const ICONS = ["🌟", "🌙", "🪐", "☄️", "🛸", "🌍"];
//   const [cards, setCards] = useState(() =>
//     [...ICONS, ...ICONS]
//       .sort(() => Math.random() - 0.5)
//       .map((icon, id) => ({ id, icon, flipped: false, matched: false })),
//   );
//   const [flipped, setFlipped] = useState<number[]>([]);

//   const handleFlip = (index: number) => {
//     if (flipped.length === 2 || cards[index].flipped || cards[index].matched)
//       return;

//     const newCards = [...cards];
//     newCards[index].flipped = true;
//     setCards(newCards);

//     const newFlipped = [...flipped, index];
//     setFlipped(newFlipped);

//     if (newFlipped.length === 2) {
//       if (newCards[newFlipped[0]].icon === newCards[newFlipped[1]].icon) {
//         newCards[newFlipped[0]].matched = true;
//         newCards[newFlipped[1]].matched = true;
//         setCards(newCards);
//         setFlipped([]);
//         if (newCards.every((c) => c.matched)) onWin();
//       } else {
//         setTimeout(() => {
//           newCards[newFlipped[0]].flipped = false;
//           newCards[newFlipped[1]].flipped = false;
//           setCards([...newCards]);
//           setFlipped([]);
//         }, 1000);
//       }
//     }
//   };

//   return (
//     <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mt-10">
//       {cards.map((card, i) => (
//         <motion.button
//           key={i}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => handleFlip(i)}
//           className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-500 transform ${
//             card.flipped || card.matched
//               ? "bg-white text-black rotate-y-180"
//               : "bg-white/10 text-transparent"
//           }`}
//         >
//           {card.flipped || card.matched ? card.icon : "?"}
//         </motion.button>
//       ))}
//     </div>
//   );
// };

// // ==========================================
// // 4. MINI-GAME: LOVE CIPHER
// // ==========================================
// const CipherGame = ({ onWin }: { onWin: () => void }) => {
//   const WORDS = ["UNIVERSE", "FOREVER", "STARDUST", "DESTINY"];
//   const [level, setLevel] = useState(0);
//   const [input, setInput] = useState("");

//   const currentWord = WORDS[level];
//   const scrambled = React.useMemo(
//     () =>
//       currentWord
//         .split("")
//         .sort(() => Math.random() - 0.5)
//         .join(""),
//     [currentWord],
//   );

//   const check = () => {
//     if (input.toUpperCase() === currentWord) {
//       if (level === WORDS.length - 1) onWin();
//       else {
//         setLevel((l) => l + 1);
//         setInput("");
//       }
//     } else {
//       setInput(""); // Wrong guess
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-full space-y-8">
//       <div className="text-center">
//         <p className="text-white/50 mb-2">
//           Level {level + 1}/{WORDS.length}
//         </p>
//         <h3 className="text-4xl font-mono tracking-widest text-nebula-blue mb-8">
//           {scrambled}
//         </h3>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="bg-transparent border-b-2 border-white/20 text-center text-2xl text-white outline-none w-48 mb-6 pb-2 focus:border-nebula-pink"
//           placeholder="Unscramble..."
//         />
//         <br />
//         <GlowButton onClick={check} variant="gold" size="sm">
//           Submit
//         </GlowButton>
//       </div>
//     </div>
//   );
// };

// // ==========================================
// // 5. MINI-GAME: HEART SYNC
// // ==========================================
// const SyncGame = ({ onWin }: { onWin: () => void }) => {
//   const [hits, setHits] = useState(0);
//   const [size, setSize] = useState(100);
//   const [growing, setGrowing] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSize((s) => {
//         if (s <= 20) setGrowing(true);
//         if (s >= 100) setGrowing(false);
//         return growing ? s + 2 : s - 2;
//       });
//     }, 20);
//     return () => clearInterval(interval);
//   }, [growing]);

//   const handleClick = () => {
//     // Target zone is between 40 and 60
//     if (size > 40 && size < 60) {
//       setHits((h) => {
//         const newHits = h + 1;
//         if (newHits >= 5) onWin();
//         return newHits;
//       });
//     } else {
//       setHits(0); // Reset on miss
//     }
//   };

//   return (
//     <div
//       className="flex flex-col items-center justify-center h-full"
//       onClick={handleClick}
//     >
//       <p className="text-white/50 mb-8">
//         Tap when the circles match! ({hits}/5)
//       </p>
//       <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer">
//         {/* Target Ring */}
//         <div className="absolute border-2 border-green-400 rounded-full w-[50px] h-[50px]" />
//         {/* Moving Ring */}
//         <div
//           className="absolute border-2 border-pink-500 rounded-full"
//           style={{ width: `${size}px`, height: `${size}px` }}
//         />
//       </div>
//     </div>
//   );
// };

// // ==========================================
// // MAIN PAGE COMPONENT
// // ==========================================
// export default function GameHubPage() {
//   const router = useRouter();

//   // Refresh redirect hook
//   //useRefreshRedirect();

//   const { canAccessGame, completeGame } = useAppStore();
//   const [activeGame, setActiveGame] = useState<GameType>(null);
//   const [gameWon, setGameWon] = useState(false);

//   // Access check
//   useEffect(() => {
//     if (!canAccessGame()) router.push("/universe");
//   }, [canAccessGame, router]);

//   const handleWin = () => {
//     setGameWon(true);
//     completeGame(); // Unlock reward
//   };

//   const handleBackToHub = () => {
//     setActiveGame(null);
//     setGameWon(false);
//   };

//   return (
//     <div className="min-h-screen bg-deep-navy relative overflow-hidden">
//       <AudioPlayer />

//       {/* Background Ambience */}
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
//         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//       </div>

//       {/* Navigation */}
//       {activeGame ? (
//         <button
//           onClick={handleBackToHub}
//           className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full"
//         >
//           ← Exit Game
//         </button>
//       ) : (
//         <BackButton to="/universe" label="Universe" />
//       )}

//       {/* --- HUB VIEW --- */}
//       <AnimatePresence mode="wait">
//         {!activeGame && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="relative z-10 max-w-6xl mx-auto px-6 py-20"
//           >
//             <div className="text-center mb-16">
//               <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
//                 Cosmic Arcade
//               </h1>
//               <p className="text-soft-white/60 text-lg">
//                 Five challenges. One journey. Infinite love.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <GameCard
//                 title="Cosmic Journey"
//                 description="Guide your heart through the asteroid field. Avoid obstacles and collect trust."
//                 icon="🚀"
//                 color="#4ecdc4"
//                 difficulty="Hard"
//                 onPlay={() => setActiveGame("journey")}
//               />
//               <GameCard
//                 title="Star Catcher"
//                 description="A relaxing game. Catch 100 falling hearts to fill the love meter."
//                 icon="💖"
//                 color="#ff6b9d"
//                 difficulty="Easy"
//                 onPlay={() => setActiveGame("catcher")}
//               />
//               <GameCard
//                 title="Memory of Us"
//                 description="Flip cards to find matching celestial pairs. Test your memory."
//                 icon="🎴"
//                 color="#7b68ee"
//                 difficulty="Medium"
//                 onPlay={() => setActiveGame("memory")}
//               />
//               <GameCard
//                 title="Love Cipher"
//                 description="Unscramble the romantic words hidden in the stars."
//                 icon="🧩"
//                 color="#feca57"
//                 difficulty="Medium"
//                 onPlay={() => setActiveGame("cipher")}
//               />
//               <GameCard
//                 title="Heart Sync"
//                 description="Test your rhythm. Tap exactly when the heartbeats align."
//                 icon="💓"
//                 color="#ff9ff3"
//                 difficulty="Easy"
//                 onPlay={() => setActiveGame("sync")}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* --- ACTIVE GAME VIEW --- */}
//       <AnimatePresence>
//         {activeGame && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-4 md:p-8"
//           >
//             {/* Victory Overlay */}
//             {gameWon && (
//               <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
//                 <motion.div
//                   initial={{ scale: 0.5, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="text-center"
//                 >
//                   <div className="text-6xl mb-4">🏆</div>
//                   <h2 className="text-3xl font-serif text-white mb-2">
//                     Challenge Complete!
//                   </h2>
//                   <p className="text-white/50 mb-6">
//                     You've unlocked a secret letter.
//                   </p>
//                   <div className="flex gap-4 justify-center">
//                     <GlowButton
//                       onClick={handleBackToHub}
//                       variant="gold"
//                       size="sm"
//                     >
//                       Play Another
//                     </GlowButton>
//                     <GlowButton
//                       onClick={() => router.push("/letters")}
//                       variant="blue"
//                       size="sm"
//                     >
//                       Read Letter
//                     </GlowButton>
//                   </div>
//                 </motion.div>
//               </div>
//             )}

//             {/* Game Container */}
//             <div className="w-full h-full max-w-4xl max-h-[800px] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5">
//               {/* RENDER THE SELECTED GAME */}
//               {activeGame === "journey" && (
//                 // Your existing complex canvas game
//                 <GameCanvas onWin={handleWin} />
//               )}

//               {activeGame === "catcher" && (
//                 <StarCatcherGame onWin={handleWin} onBack={handleBackToHub} />
//               )}

//               {activeGame === "memory" && (
//                 <div className="w-full h-full flex items-center justify-center bg-black/40">
//                   <MemoryGame onWin={handleWin} />
//                 </div>
//               )}

//               {activeGame === "cipher" && <CipherGame onWin={handleWin} />}

//               {activeGame === "sync" && <SyncGame onWin={handleWin} />}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/store/useAppStore";
// import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
// import { isGameUnlocked, getGameUnlockHint } from "@/utils/unlockLogic";
// import AudioPlayer from "@/components/ui/AudioPlayer";
// import BackButton from "@/components/ui/BackButton";
// import GlowButton from "@/components/ui/GlowButton";

// import GameCanvas from "@/components/game/GameCanvas";
// import StarCatcherCanvas from "@/components/game/StarCatcherCanvas";
// import CipherCanvas from "@/components/game/CipherCanvas";
// import SyncCanvas from "@/components/game/SyncCanvas";

// type GameType = "journey" | "catcher" | "memory" | "cipher" | "sync" | null;

// const GameCard: React.FC<{
//   title: string;
//   description: string;
//   icon: string;
//   color: string;
//   difficulty: string;
//   isUnlocked: boolean;
//   hint: string;
//   onPlay: () => void;
// }> = ({
//   title,
//   description,
//   icon,
//   color,
//   difficulty,
//   isUnlocked,
//   hint,
//   onPlay,
// }) => (
//   <motion.div
//     whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
//     className={`glass p-6 rounded-2xl border relative overflow-hidden group h-full flex flex-col
//       ${isUnlocked ? "border-white/10 cursor-pointer" : "border-white/5 opacity-60 grayscale"}`}
//     onClick={isUnlocked ? onPlay : undefined}
//   >
//     {isUnlocked && (
//       <div
//         className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
//         style={{
//           background: `radial-gradient(circle at center, ${color}, transparent)`,
//         }}
//       />
//     )}
//     <div className="relative z-10 flex flex-col h-full">
//       <div className="flex justify-between items-start mb-4">
//         <div className="text-4xl">{icon}</div>
//         {isUnlocked ? (
//           <span
//             className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${difficulty === "Easy" ? "text-green-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}
//           >
//             {difficulty}
//           </span>
//         ) : (
//           <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/40">
//             Locked 🔒
//           </span>
//         )}
//       </div>
//       <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
//       {isUnlocked ? (
//         <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
//       ) : (
//         <p className="text-sm text-nebula-pink/80 mb-6 flex-grow italic">
//           {hint}
//         </p>
//       )}
//       <button
//         disabled={!isUnlocked}
//         className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${isUnlocked ? "" : "cursor-not-allowed bg-white/5 text-white/20"}`}
//         style={
//           isUnlocked
//             ? { backgroundColor: `${color}40`, border: `1px solid ${color}` }
//             : {}
//         }
//       >
//         {isUnlocked ? "Play Game" : "Locked"}
//       </button>
//     </div>
//   </motion.div>
// );

// export default function GameHubPage() {
//   const router = useRouter();
//   useRefreshRedirect();
//   const {
//     visitedStars,
//     openedLetters,
//     gamesPlayed,
//     wonGameIds,
//     revealUnlocked,
//     canAccessGame,
//     incrementGamesPlayed,
//     recordGameWin,
//   } = useAppStore();
//   const [activeGame, setActiveGame] = useState<GameType>(null);
//   const [showVictory, setShowVictory] = useState(false);

//   // Stats object for logic
//   const stats = {
//     visitedStars,
//     openedLetters,
//     gamesPlayed,
//     wonGameIds,
//     revealUnlocked,
//   };

//   useEffect(() => {
//     if (!canAccessGame()) router.push("/universe");
//   }, [canAccessGame, router]);

//   const handlePlay = (game: GameType) => {
//     incrementGamesPlayed();
//     setActiveGame(game);
//   };

//   const handleWin = () => {
//     if (activeGame) recordGameWin(activeGame);
//     setShowVictory(true);
//   };

//   const closeGame = () => {
//     setActiveGame(null);
//     setShowVictory(false);
//   };

//   return (
//     <div className="min-h-screen bg-deep-navy relative overflow-hidden">
//       <AudioPlayer />
//       {!activeGame && <BackButton to="/universe" label="Universe" />}
//       {activeGame && (
//         <button
//           onClick={closeGame}
//           className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full cursor-pointer"
//         >
//           ← Exit Game
//         </button>
//       )}

//       <AnimatePresence mode="wait">
//         {!activeGame && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="relative z-10 max-w-6xl mx-auto px-6 py-20"
//           >
//             <div className="text-center mb-16">
//               <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
//                 Cosmic Arcade
//               </h1>
//               <p className="text-soft-white/60 text-lg">
//                 Play games to unlock letters.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
//               <GameCard
//                 id="catcher"
//                 title="Star Catcher"
//                 description="Catch 100 hearts."
//                 icon="💖"
//                 color="#ff6b9d"
//                 difficulty="Easy"
//                 isUnlocked={isGameUnlocked("catcher", stats)}
//                 hint={getGameUnlockHint("catcher")}
//                 onPlay={() => handlePlay("catcher")}
//               />
//               <GameCard
//                 id="sync"
//                 title="Heart Sync"
//                 description="Rhythm & Timing."
//                 icon="💓"
//                 color="#ff9ff3"
//                 difficulty="Easy"
//                 isUnlocked={isGameUnlocked("sync", stats)}
//                 hint={getGameUnlockHint("sync")}
//                 onPlay={() => handlePlay("sync")}
//               />
//               <GameCard
//                 id="memory"
//                 title="Memory of Us"
//                 description="Match celestial pairs."
//                 icon="🎴"
//                 color="#7b68ee"
//                 difficulty="Medium"
//                 isUnlocked={isGameUnlocked("memory", stats)}
//                 hint={getGameUnlockHint("memory")}
//                 onPlay={() => handlePlay("memory")}
//               />
//               <GameCard
//                 id="cipher"
//                 title="Love Cipher"
//                 description="Unscramble words."
//                 icon="🧩"
//                 color="#feca57"
//                 difficulty="Medium"
//                 isUnlocked={isGameUnlocked("cipher", stats)}
//                 hint={getGameUnlockHint("cipher")}
//                 onPlay={() => handlePlay("cipher")}
//               />
//               <GameCard
//                 id="journey"
//                 title="Cosmic Journey"
//                 description="Physics challenge."
//                 icon="🚀"
//                 color="#4ecdc4"
//                 difficulty="Hard"
//                 isUnlocked={isGameUnlocked("journey", stats)}
//                 hint={getGameUnlockHint("journey")}
//                 onPlay={() => handlePlay("journey")}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {activeGame && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-4"
//           >
//             {showVictory && (
//               <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
//                 <motion.div
//                   initial={{ scale: 0.5 }}
//                   animate={{ scale: 1 }}
//                   className="text-center p-8 glass-strong rounded-2xl"
//                 >
//                   <div className="text-6xl mb-4">🏆</div>
//                   <h2 className="text-3xl font-serif text-white mb-2">
//                     Victory!
//                   </h2>
//                   <p className="text-white/50 mb-6">
//                     Win recorded. Check for new letters!
//                   </p>
//                   <GlowButton onClick={closeGame} variant="gold" size="sm">
//                     Back to Menu
//                   </GlowButton>
//                 </motion.div>
//               </div>
//             )}
//             <div className="w-full h-full max-w-5xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
//               {activeGame === "journey" && <GameCanvas onWin={handleWin} />}
//               {activeGame === "catcher" && (
//                 <StarCatcherCanvas onWin={handleWin} />
//               )}
//               {activeGame === "memory" && <MemoryCanvas onWin={handleWin} />}
//               {activeGame === "cipher" && <CipherCanvas onWin={handleWin} />}
//               {activeGame === "sync" && (
//                 <div className="w-[300px] h-[300px]">
//                   <SyncCanvas onWin={handleWin} />
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/store/useAppStore";
// import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
// import { isGameUnlocked, getGameUnlockHint } from "@/utils/unlockLogic";
// import AudioPlayer from "@/components/ui/AudioPlayer";
// import BackButton from "@/components/ui/BackButton";
// import GlowButton from "@/components/ui/GlowButton";

// import GameCanvas from "@/components/game/GameCanvas";
// import StarCatcherCanvas from "@/components/game/StarCatcherCanvas";
// import JumperCanvas from "@/components/game/JumperCanvas"; // NEW IMPORT
// import CipherCanvas from "@/components/game/CipherCanvas";
// import SyncCanvas from "@/components/game/SyncCanvas";

// type GameType = "journey" | "catcher" | "jump" | "cipher" | "sync" | null; // UPDATED TYPE
// type Difficulty = "Easy" | "Medium" | "Hard";

// // --- GAME DATA FOR MODALS ---
// const GAME_DETAILS = {
//   journey: {
//     title: "Cosmic Journey",
//     desc: "Navigate through the asteroid field of doubts and fears. Collect trust and hope.",
//     rules:
//       "1. Use Arrow Keys or Drag to move.\n2. Avoid the Obstacles (gray boxes).\n3. Collect 5 items (Trust, Hope...).\n4. Reach the top to win.",
//     difficulty: "Hard",
//     icon: "🚀",
//     hasDiff: false,
//   },
//   catcher: {
//     title: "Star Catcher",
//     desc: "Catch the falling stars before time runs out!",
//     rules:
//       "1. Drag or Move mouse to control the Astronaut.\n2. Catch 100 Stars to fill the meter.\n3. Watch the Timer! Higher difficulty = less time.",
//     difficulty: "Easy",
//     icon: "⭐",
//     hasDiff: true,
//   },
//   jump: {
//     // NEW GAME DETAILS
//     title: "Moon Jump",
//     desc: "Bounce on clouds to reach the moon.",
//     rules:
//       "1. Move mouse/finger Left or Right.\n2. Bounce on clouds to go higher.\n3. Don't fall!\n4. Reach Altitude 2000 to win.",
//     difficulty: "Medium",
//     icon: "🌑",
//     hasDiff: false,
//   },
//   cipher: {
//     title: "Love Cipher",
//     desc: "Unscramble the romantic words.",
//     rules:
//       "1. Look at the scrambled letters.\n2. Type the correct word.\n3. Use the hint if you are stuck.\n4. Solve 4 levels to win.",
//     difficulty: "Medium",
//     icon: "🧩",
//     hasDiff: false,
//   },
//   sync: {
//     title: "Heart Sync",
//     desc: "Align your heartbeat with the universe.",
//     rules:
//       "1. A ring will expand and contract.\n2. Tap ANYWHERE when the moving ring overlaps the static white ring.\n3. Sync 5 times perfectly to win.",
//     difficulty: "Easy",
//     icon: "💓",
//     hasDiff: false,
//   },
// };

// // --- MODAL COMPONENT ---
// const RulesModal: React.FC<{
//   game: GameType;
//   onClose: () => void;
//   onStart: (diff?: Difficulty) => void;
// }> = ({ game, onClose, onStart }) => {
//   if (!game) return null;
//   const details = GAME_DETAILS[game];
//   const [diff, setDiff] = useState<Difficulty>("Easy");

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
//     >
//       <div className="glass-strong max-w-md w-full p-8 rounded-2xl relative border border-white/10">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/50 hover:text-white"
//         >
//           ✕
//         </button>

//         <div className="text-center mb-6">
//           <div className="text-5xl mb-4">{details.icon}</div>
//           <h2 className="text-2xl font-serif text-white mb-2">
//             {details.title}
//           </h2>
//           <p className="text-white/60 text-sm">{details.desc}</p>
//         </div>

//         <div className="bg-white/5 p-4 rounded-xl mb-6">
//           <h3 className="text-nebula-blue font-bold mb-2 text-sm uppercase">
//             How to Play
//           </h3>
//           <ul className="text-white/70 text-sm space-y-2 text-left list-disc list-inside">
//             {details.rules.split("\n").map((r, i) => (
//               <li key={i}>{r}</li>
//             ))}
//           </ul>
//         </div>

//         {details.hasDiff && (
//           <div className="mb-6">
//             <p className="text-white/50 text-xs uppercase mb-2 text-center">
//               Select Difficulty
//             </p>
//             <div className="flex gap-2 justify-center">
//               {["Easy", "Medium", "Hard"].map((d) => (
//                 <button
//                   key={d}
//                   onClick={() => setDiff(d as Difficulty)}
//                   className={`px-3 py-1 rounded-full text-xs border ${diff === d ? "bg-nebula-pink border-nebula-pink text-white" : "border-white/20 text-white/50"}`}
//                 >
//                   {d}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="flex justify-center">
//           <GlowButton onClick={() => onStart(diff)} variant="gold" size="lg">
//             Start Game
//           </GlowButton>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const GameCard: React.FC<{
//   id: string;
//   title: string;
//   description: string;
//   icon: string;
//   color: string;
//   difficulty: string;
//   isUnlocked: boolean;
//   hint: string;
//   onSelect: () => void;
// }> = ({
//   title,
//   description,
//   icon,
//   color,
//   difficulty,
//   isUnlocked,
//   hint,
//   onSelect,
// }) => (
//   <motion.div
//     whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
//     className={`glass p-6 rounded-2xl border relative overflow-hidden group h-full flex flex-col
//       ${isUnlocked ? "border-white/10 cursor-pointer" : "border-white/5 opacity-60 grayscale"}`}
//     onClick={isUnlocked ? onSelect : undefined}
//   >
//     {isUnlocked && (
//       <div
//         className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
//         style={{
//           background: `radial-gradient(circle at center, ${color}, transparent)`,
//         }}
//       />
//     )}
//     <div className="relative z-10 flex flex-col h-full">
//       <div className="flex justify-between items-start mb-4">
//         <div className="text-4xl">{icon}</div>
//         {isUnlocked ? (
//           <span
//             className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${difficulty === "Easy" ? "text-green-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}
//           >
//             {difficulty}
//           </span>
//         ) : (
//           <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/40">
//             Locked 🔒
//           </span>
//         )}
//       </div>
//       <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
//       {isUnlocked ? (
//         <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
//       ) : (
//         <p className="text-sm text-nebula-pink/80 mb-6 flex-grow italic">
//           {hint}
//         </p>
//       )}
//       <button
//         disabled={!isUnlocked}
//         className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${isUnlocked ? "" : "cursor-not-allowed bg-white/5 text-white/20"}`}
//         style={
//           isUnlocked
//             ? { backgroundColor: `${color}40`, border: `1px solid ${color}` }
//             : {}
//         }
//       >
//         {isUnlocked ? "View Rules" : "Locked"}
//       </button>
//     </div>
//   </motion.div>
// );

// export default function GameHubPage() {
//   const router = useRouter();
//   useRefreshRedirect();

//   const {
//     visitedStars,
//     openedLetters,
//     gamesPlayed,
//     wonGameIds,
//     revealUnlocked,
//     canAccessGame,
//     incrementGamesPlayed,
//     recordGameWin,
//   } = useAppStore();
//   const _hasHydrated = useAppStore((s) => s._hasHydrated);

//   const [selectedGame, setSelectedGame] = useState<GameType>(null);
//   const [activeGame, setActiveGame] = useState<GameType>(null);
//   const [gameDifficulty, setGameDifficulty] = useState<Difficulty>("Easy");
//   const [showVictory, setShowVictory] = useState(false);
//   const [showLose, setShowLose] = useState(false);

//   const stats = {
//     visitedStars,
//     openedLetters,
//     gamesPlayed,
//     wonGameIds,
//     revealUnlocked,
//   };

//   useEffect(() => {
//     if (_hasHydrated && !canAccessGame()) router.push("/universe");
//   }, [_hasHydrated, canAccessGame, router]);

//   const handleSelectGame = (game: GameType) => {
//     setSelectedGame(game);
//   };

//   const handleStartGame = (diff: Difficulty = "Easy") => {
//     setGameDifficulty(diff);
//     incrementGamesPlayed();
//     setActiveGame(selectedGame);
//     setSelectedGame(null);
//   };

//   const handleWin = () => {
//     if (activeGame) recordGameWin(activeGame);
//     setShowVictory(true);
//   };

//   const handleLose = () => {
//     setShowLose(true);
//   };

//   const closeGame = () => {
//     setActiveGame(null);
//     setShowVictory(false);
//     setShowLose(false);
//   };

//   const retryGame = () => {
//     setShowVictory(false);
//     setShowLose(false);
//     const currentGame = activeGame;
//     setActiveGame(null);
//     setTimeout(() => setActiveGame(currentGame), 10);
//   };

//   if (!_hasHydrated) return null;

//   return (
//     <div className="min-h-screen bg-deep-navy relative overflow-hidden">
//       <AudioPlayer />
//       <div className="fixed inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
//       </div>

//       {!activeGame && <BackButton to="/universe" label="Universe" />}
//       {activeGame && (
//         <button
//           onClick={closeGame}
//           className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full cursor-pointer"
//         >
//           ← Exit Game
//         </button>
//       )}

//       {/* MODAL FOR RULES */}
//       <AnimatePresence>
//         {selectedGame && (
//           <RulesModal
//             game={selectedGame}
//             onClose={() => setSelectedGame(null)}
//             onStart={handleStartGame}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence mode="wait">
//         {!activeGame && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="relative z-10 max-w-6xl mx-auto px-6 py-20"
//           >
//             <div className="text-center mb-16">
//               <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
//                 Cosmic Arcade
//               </h1>
//               <p className="text-soft-white/60 text-lg">Pick a challenge.</p>
//               {/* <div className="mt-4 flex gap-4 justify-center text-xs text-white/30 font-mono">
//                 <span>Played: {gamesPlayed}</span>
//                 <span>Won: {wonGameIds.length}</span>
//               </div> */}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
//               <GameCard
//                 id="catcher"
//                 title="Star Catcher"
//                 description="Catch 100 stars."
//                 icon="⭐"
//                 color="#ff6b9d"
//                 difficulty="Easy"
//                 isUnlocked={isGameUnlocked("catcher", stats)}
//                 hint={getGameUnlockHint("catcher")}
//                 onSelect={() => handleSelectGame("catcher")}
//               />
//               <GameCard
//                 id="sync"
//                 title="Heart Sync"
//                 description="Rhythm & Timing."
//                 icon="💓"
//                 color="#ff9ff3"
//                 difficulty="Easy"
//                 isUnlocked={isGameUnlocked("sync", stats)}
//                 hint={getGameUnlockHint("sync")}
//                 onSelect={() => handleSelectGame("sync")}
//               />
//               <GameCard
//                 id="jump" // NEW GAME ID
//                 title="Moon Jump"
//                 description="Bounce to the moon."
//                 icon="🌑"
//                 color="#7b68ee"
//                 difficulty="Medium"
//                 isUnlocked={isGameUnlocked("jump", stats)}
//                 hint={getGameUnlockHint("jump")}
//                 onSelect={() => handleSelectGame("jump")}
//               />
//               <GameCard
//                 id="cipher"
//                 title="Love Cipher"
//                 description="Unscramble words."
//                 icon="🧩"
//                 color="#feca57"
//                 difficulty="Medium"
//                 isUnlocked={isGameUnlocked("cipher", stats)}
//                 hint={getGameUnlockHint("cipher")}
//                 onSelect={() => handleSelectGame("cipher")}
//               />
//               <GameCard
//                 id="journey"
//                 title="Cosmic Journey"
//                 description="The ultimate test."
//                 icon="🚀"
//                 color="#4ecdc4"
//                 difficulty="Hard"
//                 isUnlocked={isGameUnlocked("journey", stats)}
//                 hint={getGameUnlockHint("journey")}
//                 onSelect={() => handleSelectGame("journey")}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {activeGame && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-4 md:p-8"
//           >
//             {/* RESULT OVERLAYS */}
//             {(showVictory || showLose) && (
//               <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
//                 <motion.div
//                   initial={{ scale: 0.5 }}
//                   animate={{ scale: 1 }}
//                   className="text-center p-8 glass-strong rounded-2xl max-w-sm"
//                 >
//                   <div className="text-6xl mb-4">
//                     {showVictory ? "🏆" : "💔"}
//                   </div>
//                   <h2 className="text-3xl font-serif text-white mb-2">
//                     {showVictory ? "Victory!" : "Try Again"}
//                   </h2>
//                   <p className="text-white/50 mb-6">
//                     {showVictory
//                       ? "You've unlocked a secret letter."
//                       : "Don't give up. The stars are waiting."}
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <button
//                       onClick={retryGame}
//                       className="text-white/50 hover:text-white px-4 py-2"
//                     >
//                       Retry
//                     </button>
//                     <GlowButton onClick={closeGame} variant="gold" size="sm">
//                       Back to Menu
//                     </GlowButton>
//                   </div>
//                 </motion.div>
//               </div>
//             )}

//             <div className="w-full h-full max-w-5xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
//               {activeGame === "journey" && <GameCanvas onWin={handleWin} />}
//               {activeGame === "catcher" && (
//                 <StarCatcherCanvas
//                   onWin={handleWin}
//                   onLose={handleLose}
//                   difficulty={gameDifficulty}
//                 />
//               )}
//               {/* {activeGame === "jump" && <JumperCanvas onWin={handleWin} />} */}
//               {activeGame === "journey" && (
//                 <JumperCanvas
//                   onWin={handleWin}
//                   onLose={handleLose}
//                   difficulty={gameDifficulty}
//                 />
//               )}
//               {activeGame === "cipher" && <CipherCanvas onWin={handleWin} />}
//               {activeGame === "sync" && (
//                 <div className="w-[300px] h-[300px]">
//                   <SyncCanvas onWin={handleWin} />
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

//New code
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useRefreshRedirect } from "@/hooks/useRefreshRedirect";
import { isGameUnlocked, getGameUnlockHint } from "@/utils/unlockLogic";
import AudioPlayer from "@/components/ui/AudioPlayer";
import BackButton from "@/components/ui/BackButton";
import GlowButton from "@/components/ui/GlowButton";

import GameCanvas from "@/components/game/GameCanvas";
import StarCatcherCanvas from "@/components/game/StarCatcherCanvas";
import JumperCanvas from "@/components/game/JumperCanvas";
import CipherCanvas from "@/components/game/CipherCanvas";
import SyncCanvas from "@/components/game/SyncCanvas";

type GameType = "journey" | "catcher" | "jump" | "cipher" | "sync" | null;
type Difficulty = "Easy" | "Medium" | "Hard";

const GAME_DETAILS = {
  journey: {
    title: "Cosmic Journey",
    desc: "Navigate through the asteroid field of doubts and fears. Collect trust and hope.",
    rules:
      "1. Use Arrow Keys or Drag to move.\n2. Avoid the Obstacles (gray boxes).\n3. Collect 5 items (Trust, Hope...).\n4. Reach the top to win.",
    difficulty: "Hard",
    icon: "🚀",
    hasDiff: false,
  },
  catcher: {
    title: "Star Catcher",
    desc: "Catch the falling stars before time runs out!",
    rules:
      "1. Drag or Move mouse to control the Astronaut.\n2. Catch 100 Stars to fill the meter.\n3. Watch the Timer! Higher difficulty = less time.",
    difficulty: "Easy",
    icon: "⭐",
    hasDiff: true,
  },
  jump: {
    title: "Moon Jump",
    desc: "Bounce on clouds to reach the moon.",
    rules:
      "1. Move mouse/finger Left or Right.\n2. Catch falling orbs with your rocket.\n3. Collect 1000 points before time runs out.\n4. Higher difficulty = less time.",
    difficulty: "Medium",
    icon: "🌑",
    hasDiff: true,
  },
  cipher: {
    title: "Love Cipher",
    desc: "Unscramble the romantic words.",
    rules:
      "1. Look at the scrambled letters.\n2. Type the correct word.\n3. Use the hint if you are stuck.\n4. Solve 4 levels to win.",
    difficulty: "Medium",
    icon: "🧩",
    hasDiff: false,
  },
  sync: {
    title: "Heart Sync",
    desc: "Align your heartbeat with the universe.",
    rules:
      "1. A ring will expand and contract.\n2. Tap ANYWHERE when the moving ring overlaps the static white ring.\n3. Sync 5 times perfectly to win.",
    difficulty: "Easy",
    icon: "💓",
    hasDiff: false,
  },
};

const RulesModal: React.FC<{
  game: GameType;
  onClose: () => void;
  onStart: (diff?: Difficulty) => void;
}> = ({ game, onClose, onStart }) => {
  if (!game) return null;
  const details = GAME_DETAILS[game];
  const [diff, setDiff] = useState<Difficulty>("Easy");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="glass-strong max-w-md w-full p-8 rounded-2xl relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{details.icon}</div>
          <h2 className="text-2xl font-serif text-white mb-2">
            {details.title}
          </h2>
          <p className="text-white/60 text-sm">{details.desc}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-nebula-blue font-bold mb-2 text-sm uppercase">
            How to Play
          </h3>
          <ul className="text-white/70 text-sm space-y-2 text-left list-disc list-inside">
            {details.rules.split("\n").map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {details.hasDiff && (
          <div className="mb-6">
            <p className="text-white/50 text-xs uppercase mb-2 text-center">
              Select Difficulty
            </p>
            <div className="flex gap-2 justify-center">
              {["Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d as Difficulty)}
                  className={`px-3 py-1 rounded-full text-xs border ${diff === d ? "bg-nebula-pink border-nebula-pink text-white" : "border-white/20 text-white/50"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <GlowButton onClick={() => onStart(diff)} variant="gold" size="lg">
            Start Game
          </GlowButton>
        </div>
      </div>
    </motion.div>
  );
};

const GameCard: React.FC<{
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  isUnlocked: boolean;
  hint: string;
  onSelect: () => void;
}> = ({
  title,
  description,
  icon,
  color,
  difficulty,
  isUnlocked,
  hint,
  onSelect,
}) => (
  <motion.div
    whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
    className={`glass p-6 rounded-2xl border relative overflow-hidden group h-full flex flex-col
      ${isUnlocked ? "border-white/10 cursor-pointer" : "border-white/5 opacity-60 grayscale"}`}
    onClick={isUnlocked ? onSelect : undefined}
  >
    {isUnlocked && (
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent)`,
        }}
      />
    )}
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{icon}</div>
        {isUnlocked ? (
          <span
            className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${difficulty === "Easy" ? "text-green-400" : difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}
          >
            {difficulty}
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/40">
            Locked 🔒
          </span>
        )}
      </div>
      <h3 className="font-serif text-xl font-bold text-white mb-2">{title}</h3>
      {isUnlocked ? (
        <p className="text-sm text-white/50 mb-6 flex-grow">{description}</p>
      ) : (
        <p className="text-sm text-nebula-pink/80 mb-6 flex-grow italic">
          {hint}
        </p>
      )}
      <button
        disabled={!isUnlocked}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${isUnlocked ? "" : "cursor-not-allowed bg-white/5 text-white/20"}`}
        style={
          isUnlocked
            ? { backgroundColor: `${color}40`, border: `1px solid ${color}` }
            : {}
        }
      >
        {isUnlocked ? "View Rules" : "Locked"}
      </button>
    </div>
  </motion.div>
);

export default function GameHubPage() {
  const router = useRouter();
  useRefreshRedirect();

  const {
    visitedStars,
    openedLetters,
    gamesPlayed,
    wonGameIds,
    revealUnlocked,
    canAccessGame,
    incrementGamesPlayed,
    recordGameWin,
  } = useAppStore();
  const _hasHydrated = useAppStore((s) => s._hasHydrated);

  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>("Easy");
  const [showVictory, setShowVictory] = useState(false);
  const [showLose, setShowLose] = useState(false);

  const stats = {
    visitedStars,
    openedLetters,
    gamesPlayed,
    wonGameIds,
    revealUnlocked,
  };

  useEffect(() => {
    if (_hasHydrated && !canAccessGame()) router.push("/universe");
  }, [_hasHydrated, canAccessGame, router]);

  const handleSelectGame = (game: GameType) => {
    setSelectedGame(game);
  };

  const handleStartGame = (diff: Difficulty = "Easy") => {
    setGameDifficulty(diff);
    incrementGamesPlayed();
    setActiveGame(selectedGame);
    setSelectedGame(null);
  };

  const handleWin = () => {
    if (activeGame) recordGameWin(activeGame);
    setShowVictory(true);
  };

  const handleLose = () => {
    setShowLose(true);
  };

  const closeGame = () => {
    setActiveGame(null);
    setShowVictory(false);
    setShowLose(false);
  };

  const retryGame = () => {
    setShowVictory(false);
    setShowLose(false);
    const currentGame = activeGame;
    setActiveGame(null);
    setTimeout(() => setActiveGame(currentGame), 10);
  };

  if (!_hasHydrated) return null;

  return (
    <div className="min-h-screen bg-deep-navy relative overflow-hidden">
      <AudioPlayer />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/20 via-deep-navy to-deep-navy" />
      </div>

      {!activeGame && <BackButton to="/universe" label="Universe" />}
      {activeGame && (
        <button
          onClick={closeGame}
          className="fixed top-6 left-6 z-50 text-white/50 hover:text-white flex items-center gap-2 glass px-4 py-2 rounded-full cursor-pointer"
        >
          ← Exit Game
        </button>
      )}

      <AnimatePresence>
        {selectedGame && (
          <RulesModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onStart={handleStartGame}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-6xl mx-auto px-6 py-20"
          >
            <div className="text-center mb-16">
              <h1 className="font-serif text-5xl md:text-6xl text-glow mb-4">
                Cosmic Arcade
              </h1>
              <p className="text-soft-white/60 text-lg">Pick a challenge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              <GameCard
                id="catcher"
                title="Star Catcher"
                description="Catch 100 stars."
                icon="⭐"
                color="#ff6b9d"
                difficulty="Easy"
                isUnlocked={isGameUnlocked("catcher", stats)}
                hint={getGameUnlockHint("catcher")}
                onSelect={() => handleSelectGame("catcher")}
              />
              <GameCard
                id="sync"
                title="Heart Sync"
                description="Rhythm & Timing."
                icon="💓"
                color="#ff9ff3"
                difficulty="Easy"
                isUnlocked={isGameUnlocked("sync", stats)}
                hint={getGameUnlockHint("sync")}
                onSelect={() => handleSelectGame("sync")}
              />
              <GameCard
                id="jump"
                title="Moon Jump"
                description="Catch orbs with your rocket."
                icon="🌑"
                color="#7b68ee"
                difficulty="Medium"
                isUnlocked={isGameUnlocked("jump", stats)}
                hint={getGameUnlockHint("jump")}
                onSelect={() => handleSelectGame("jump")}
              />
              <GameCard
                id="cipher"
                title="Love Cipher"
                description="Unscramble words."
                icon="🧩"
                color="#feca57"
                difficulty="Medium"
                isUnlocked={isGameUnlocked("cipher", stats)}
                hint={getGameUnlockHint("cipher")}
                onSelect={() => handleSelectGame("cipher")}
              />
              <GameCard
                id="journey"
                title="Cosmic Journey"
                description="The ultimate test."
                icon="🚀"
                color="#4ecdc4"
                difficulty="Hard"
                isUnlocked={isGameUnlocked("journey", stats)}
                hint={getGameUnlockHint("journey")}
                onSelect={() => handleSelectGame("journey")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-deep-navy flex items-center justify-center p-4 md:p-8"
          >
            {(showVictory || showLose) && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-center p-8 glass-strong rounded-2xl max-w-sm"
                >
                  <div className="text-6xl mb-4">
                    {showVictory ? "🏆" : "💔"}
                  </div>
                  <h2 className="text-3xl font-serif text-white mb-2">
                    {showVictory ? "Victory!" : "Try Again"}
                  </h2>
                  <p className="text-white/50 mb-6">
                    {showVictory
                      ? "You've unlocked a secret letter."
                      : "Don't give up. The stars are waiting."}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={retryGame}
                      className="text-white/50 hover:text-white px-4 py-2"
                    >
                      Retry
                    </button>
                    <GlowButton onClick={closeGame} variant="gold" size="sm">
                      Back to Menu
                    </GlowButton>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="w-full h-full max-w-5xl max-h-[80vh] glass-strong rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
              {activeGame === "journey" && <GameCanvas onWin={handleWin} />}
              {activeGame === "catcher" && (
                <StarCatcherCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "jump" && (
                <JumperCanvas
                  onWin={handleWin}
                  onLose={handleLose}
                  difficulty={gameDifficulty}
                />
              )}
              {activeGame === "cipher" && <CipherCanvas onWin={handleWin} />}
              {activeGame === "sync" && (
                <div className="w-[300px] h-[300px]">
                  <SyncCanvas onWin={handleWin} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
