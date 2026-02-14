// import { StarData, LetterData } from '@/store/useAppStore'

// const generateRandomPosition = (): [number, number, number] => {
//   return [
//     Math.random() * 40 - 20,  // X: -20 to +20
//     Math.random() * 20 - 10,  // Y: -10 to +10
//     Math.random() * -40,      // Z: 0 to -40 (depth)
//   ]
// }


// /** Star configuration data for the 3D galaxy */
// export const STARS_DATA: StarData[] = [
//   {
//     id: 'star-1',
//     title: 'The Day We Met',
//     date: 'January 15, 2023',
//     message: 'In a crowded room full of strangers, my eyes found yours. It was as if the entire universe had conspired to bring us to that exact moment in time. Your smile was the first star I ever truly noticed, and from that instant, my night sky was never dark again.',
//     color: '#ff6b9d',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-2',
//     title: 'Our First Conversation',
//     date: 'January 20, 2023',
//     message: 'We talked for hours that night, as if we had known each other in a thousand lifetimes before this one. Every word you spoke painted colors in my mind I had never seen. Time lost its meaning — minutes became hours, and hours became the foundation of everything we would become.',
//     color: '#4ecdc4',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-3',
//     title: 'The First Time You Laughed',
//     date: 'February 3, 2023',
//     message: 'Your laughter is the most beautiful melody the universe has ever composed. It echoed through me like a symphony, filling spaces I did not know were empty. In that moment, I understood what poets meant when they wrote about sounds that could heal a soul.',
//     color: '#ffd700',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-4',
//     title: 'The Rainy Walk',
//     date: 'March 12, 2023',
//     message: 'The sky opened up and poured down on us, but neither of us wanted to find shelter. We danced between the raindrops, your hand in mine, and the whole city became our private ballroom. Every puddle reflected the lights above, and I saw our future in each shimmering ripple.',
//     color: '#7b68ee',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-5',
//     title: 'When You Said My Name',
//     date: 'April 8, 2023',
//     message: 'No one has ever spoken my name the way you do. In your voice, it sounds like a prayer, a promise, a poem all at once. You gave meaning to syllables I had heard a million times, and now every time someone else says it, I only hear the echo of you.',
//     color: '#ff9a56',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-6',
//     title: 'The Midnight Promise',
//     date: 'May 21, 2023',
//     message: 'Under a canopy of stars, you whispered a promise that the night kept safe for us. "I will always find my way back to you," you said, and I believed every word because your eyes held more truth than the entire sky above us. That promise became my anchor in every storm.',
//     color: '#e056ff',
//     position: generateRandomPosition(),
//   },
//   {
//     id: 'star-7',
//     title: 'Our Song Played',
//     date: 'June 14, 2023',
//     message: 'It came on unexpectedly — our song — in a place we had never been, at a time we did not plan. You looked at me, and I looked at you, and we both knew that the universe was reminding us: some connections are not accidents. They are destiny wearing the disguise of coincidence.',
//     color: '#56c8ff',
//     position: generateRandomPosition(),
//   },
//   {
//   id: 'star-8',
//   title: 'The Unexpected Hug',
//   date: 'July 2, 2023',
//   message: 'In that quiet moment, when words were not enough, you hugged me — and everything made sense.',
//   color: '#ff9ff3',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-9',
//   title: 'The Long Call',
//   date: 'July 18, 2023',
//   message: 'We stayed awake until 3AM, talking about dreams and fears like children mapping constellations.',
//   color: '#48dbfb',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-10',
//   title: 'The Comfort Silence',
//   date: 'August 4, 2023',
//   message: 'We sat without speaking, yet it felt like the loudest expression of love.',
//   color: '#feca57',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-11',
//   title: 'The Apology',
//   date: 'August 20, 2023',
//   message: 'Not because we were wrong — but because we valued us more than our pride.',
//   color: '#a29bfe',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-12',
//   title: 'The Surprise Visit',
//   date: 'September 10, 2023',
//   message: 'You showed up without telling me — and it became one of my favorite memories.',
//   color: '#ff7675',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-13',
//   title: 'The Shared Dream',
//   date: 'October 1, 2023',
//   message: 'We talked about our future as if it was already written in the stars.',
//   color: '#55efc4',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-14',
//   title: 'The Inside Joke',
//   date: 'October 18, 2023',
//   message: 'One word. One look. And we were laughing for five minutes straight.',
//   color: '#fd79a8',
//   position: generateRandomPosition(),
// },
// {
//   id: 'star-15',
//   title: 'The Quiet Goodbye',
//   date: 'November 2, 2023',
//   message: 'Even goodbye felt softer when it came from you.',
//   color: '#00cec9',
//   position: generateRandomPosition(),
// },
// ]

// /** Hidden star — only visible after progression requirements are met */
// export const HIDDEN_STAR: StarData = {
//   id: 'hidden-star',
//   title: 'The Beginning of Forever',
//   date: 'Today',
//   message: 'Every star you have visited, every letter you have read, every obstacle you have overcome — they all led here. To this moment. To us. This is not the end of our story. This is where forever begins.',
//   color: '#ffffff',
//   position: [0, 6, -10],
// }

// /** Letter data for the letters page */
// export const LETTERS_DATA: LetterData[] = [
//   {
//     id: 'letter-1',
//     title: 'To the One Who Changed Everything',
//     message: `My dearest,

// Before you, I thought I understood what it meant to feel alive. I was wrong. You didn't just enter my life — you illuminated it. Every shadow I had grown comfortable in was suddenly flooded with a warmth I never knew existed.

// I want you to know that loving you is not something I do. It is something I am. It is woven into every breath I take, every thought that crosses my mind, every dream I dare to dream.

// You are not just my person. You are my proof that the universe knows exactly what it is doing.

// Forever and then some,
// Your person`,
//     unlockType: 'progress',
//     requiredStars: 3,
//   },
//   {
//     id: 'letter-2',
//     title: 'The Things I Never Say Enough',
//     message: `My love,

// There are words I carry with me every day that somehow never quite make it past my lips. So I am writing them here, where they can live forever:

// Thank you for choosing me. Not just once, but every single day. Thank you for seeing the parts of me I try to hide and loving them anyway. Thank you for being my calm in chaos, my warmth in the cold, my home when the world feels too large.

// I notice everything — the way you check on me without asking, the way you remember the little things, the way you make ordinary moments feel extraordinary.

// You are my favorite everything.

// With all that I am,
// Yours always`,
//     unlockType: 'progress',
//     requiredStars: 5,
//   },
//   {
//     id: 'letter-3',
//     title: 'A Promise Written in Stars',
//     message: `My universe,

// I have a confession: I wrote our names in the stars long before I told you I loved you. I whispered it to the night sky, hoping the wind would carry it to you in your dreams.

// Here is my promise, written not in ink that fades, but in the light of stars that will burn for billions of years:

// I promise to be your shelter and your adventure.
// I promise to hold your hand through the dark and dance with you in the light.
// I promise to grow beside you, not apart from you.
// I promise to choose us, every single time.

// This is not just love. This is a covenant with the cosmos.

// Until the last star burns out,
// Your forever person`,
//     unlockType: 'game',
//     requiresGame: true,
//   },
//   {
//     id: 'letter-4',
//     title: 'For the Hard Days',
//     message: `Hey you,

// If you are reading this on a hard day, I need you to hear this:

// You are enough. You have always been enough. The world may feel heavy right now, but you are not carrying it alone. I am right here. I have always been right here.

// Your struggles do not make you less — they make you the incredible, resilient, beautiful person I fell in love with. Every scar tells a story of survival, and I am honored to know every single one of them.

// On the days when you cannot see your own light, look at me. I will reflect it back to you until you can see it again.

// You are my favorite person in any universe.

// Holding you always,
// Your safe place`,
//     unlockType: 'progress',
//     requiredStars: 4,
//   },
// ]

// /** Color palette for the application */
// export const COLORS = {
//   deepNavy: '#0a0e1a',
//   cosmicPurple: '#1a0a2e',
//   nebulaPink: '#ff6b9d',
//   nebulaBlue: '#4ecdc4',
//   starGold: '#ffd700',
//   softWhite: '#e8e6f0',
//   glassWhite: 'rgba(255, 255, 255, 0.08)',
//   glassBorder: 'rgba(255, 255, 255, 0.12)',
// }

// /** Game configuration constants */
// export const GAME_CONFIG = {
//   PLAYER_SIZE: 24,
//   PLAYER_SPEED: 0.8,
//   OBSTACLE_COUNT: 6,
//   COLLECTIBLE_COUNT: 5,
//   COLLECTIBLES_TO_WIN: 5,
//   CANVAS_PADDING: 40,
//   OBSTACLE_LABELS: ['Ego', 'Distance', 'Overthinking', 'Doubt', 'Fear', 'Silence'],
//   COLLECTIBLE_LABELS: ["Trust", "Hope", "Joy", "Care", "Time"],
// } as const

import { StarData, LetterData } from '@/store/useAppStore'

// Helper: generate random positions for stars
const generateRandomPosition = (): [number, number, number] => [
  Math.random() * 40 - 20, // X: -20 to +20
  Math.random() * 20 - 10, // Y: -10 to +10
  Math.random() * -40,     // Z: 0 to -40 (depth)
]

// =======================
// STARS DATA
// =======================
export const STARS_DATA: StarData[] = [
  {
    id: 'star-1',
    title: 'The Day We Met',
    date: 'January 15, 2023',
    message: 'In a crowded room full of strangers, my eyes found yours. It was as if the entire universe had conspired to bring us to that exact moment in time. Your smile was the first star I ever truly noticed, and from that instant, my night sky was never dark again.',
    color: '#ff6b9d',
    position: generateRandomPosition(),
  },
  {
    id: 'star-2',
    title: 'Our First Conversation',
    date: 'January 20, 2023',
    message: 'We talked for hours that night, as if we had known each other in a thousand lifetimes before this one. Every word you spoke painted colors in my mind I had never seen. Time lost its meaning — minutes became hours, and hours became the foundation of everything we would become.',
    color: '#4ecdc4',
    position: generateRandomPosition(),
  },
  {
    id: 'star-3',
    title: 'The First Time You Laughed',
    date: 'February 3, 2023',
    message: 'Your laughter is the most beautiful melody the universe has ever composed. It echoed through me like a symphony, filling spaces I did not know were empty. In that moment, I understood what poets meant when they wrote about sounds that could heal a soul.',
    color: '#ffd700',
    position: generateRandomPosition(),
  },
  {
    id: 'star-4',
    title: 'The Rainy Walk',
    date: 'March 12, 2023',
    message: 'The sky opened up and poured down on us, but neither of us wanted to find shelter. We danced between the raindrops, your hand in mine, and the whole city became our private ballroom. Every puddle reflected the lights above, and I saw our future in each shimmering ripple.',
    color: '#7b68ee',
    position: generateRandomPosition(),
  },
  {
    id: 'star-5',
    title: 'When You Said My Name',
    date: 'April 8, 2023',
    message: 'No one has ever spoken my name the way you do. In your voice, it sounds like a prayer, a promise, a poem all at once. You gave meaning to syllables I had heard a million times, and now every time someone else says it, I only hear the echo of you.',
    color: '#ff9a56',
    position: generateRandomPosition(),
  },
  {
    id: 'star-6',
    title: 'The Midnight Promise',
    date: 'May 21, 2023',
    message: 'Under a canopy of stars, you whispered a promise that the night kept safe for us. "I will always find my way back to you," you said, and I believed every word because your eyes held more truth than the entire sky above us. That promise became my anchor in every storm.',
    color: '#e056ff',
    position: generateRandomPosition(),
  },
  {
    id: 'star-7',
    title: 'Our Song Played',
    date: 'June 14, 2023',
    message: 'It came on unexpectedly — our song — in a place we had never been, at a time we did not plan. You looked at me, and I looked at you, and we both knew that the universe was reminding us: some connections are not accidents. They are destiny wearing the disguise of coincidence.',
    color: '#56c8ff',
    position: generateRandomPosition(),
  },
  {
    id: 'star-8',
    title: 'The Unexpected Hug',
    date: 'July 2, 2023',
    message: 'In that quiet moment, when words were not enough, you hugged me — and everything made sense.',
    color: '#ff9ff3',
    position: generateRandomPosition(),
  },
  {
    id: 'star-9',
    title: 'The Long Call',
    date: 'July 18, 2023',
    message: 'We stayed awake until 3AM, talking about dreams and fears like children mapping constellations.',
    color: '#48dbfb',
    position: generateRandomPosition(),
  },
  {
    id: 'star-10',
    title: 'The Comfort Silence',
    date: 'August 4, 2023',
    message: 'We sat without speaking, yet it felt like the loudest expression of love.',
    color: '#feca57',
    position: generateRandomPosition(),
  },
  {
    id: 'star-11',
    title: 'The Apology',
    date: 'August 20, 2023',
    message: 'Not because we were wrong — but because we valued us more than our pride.',
    color: '#a29bfe',
    position: generateRandomPosition(),
  },
  {
    id: 'star-12',
    title: 'The Surprise Visit',
    date: 'September 10, 2023',
    message: 'You showed up without telling me — and it became one of my favorite memories.',
    color: '#ff7675',
    position: generateRandomPosition(),
  },
  {
    id: 'star-13',
    title: 'The Shared Dream',
    date: 'October 1, 2023',
    message: 'We talked about our future as if it was already written in the stars.',
    color: '#55efc4',
    position: generateRandomPosition(),
  },
  {
    id: 'star-14',
    title: 'The Inside Joke',
    date: 'October 18, 2023',
    message: 'One word. One look. And we were laughing for five minutes straight.',
    color: '#fd79a8',
    position: generateRandomPosition(),
  },
  {
    id: 'star-15',
    title: 'The Quiet Goodbye',
    date: 'November 2, 2023',
    message: 'Even goodbye felt softer when it came from you.',
    color: '#00cec9',
    position: generateRandomPosition(),
  },
]

// Hidden star
export const HIDDEN_STAR: StarData = {
  id: 'hidden-star',
  title: 'The Beginning of Forever',
  date: 'Today',
  message: 'You found the secret. This is where forever begins.',
  color: '#ffffff',
  position: [0, 6, -10],
}

// =======================
// LETTERS DATA
// =======================
export const LETTERS_DATA: LetterData[] = [
  {
    id: 'l1',
    title: 'To the One Who Changed Everything',
    message: `My dearest,\n\nBefore you, I thought I understood what it meant to feel alive. I was wrong. You didn't just enter my life — you illuminated it.\n\nWelcome to your galaxy.`,
    condition: 'default',
  },
  {
    id: 'l2',
    title: 'Starlight Memories',
    message: `My love,\n\nEvery star you click represents a memory we've shared. The laughter, the quiet moments, the adventures. They shine specifically for you.`,
    condition: 'visit_3_stars',
  },
  {
    id: 'l3',
    title: 'For the Hard Days',
    message: `Hey you,\n\nIf you are reading this on a hard day: You are enough. You have always been enough. I am right here holding your hand.`,
    condition: 'visit_5_stars',
  },
  {
    id: 'l4',
    title: 'Cosmic Connection',
    message: `You have seen every star in this sky.\n\nIt proves that no distance is too great for us. You are the center of my orbit, now and forever.`,
    condition: 'visit_all_stars',
  },
  {
    id: 'l5',
    title: "The Gamer's Reward",
    message: `I see you found the Arcade!\n\nI love your playful side. Life with you is never boring. Let's keep playing together, level after level.`,
    condition: 'play_1_game',
  },
  {
    id: 'l6',
    title: 'Victory Lap',
    message: `Winner! 🏆\n\nYou've mastered the games, just like you've mastered the art of making me smile. I'm so proud of you.`,
    condition: 'win_3_games',
  },
  {
    id: 'l7',
    title: 'Secret Whisper',
    message: `You found the hidden star!\n\nYou look deeper than most. You see the things that others miss. That is why I love you.`,
    condition: 'find_hidden_star',
  },
  {
    id: 'l8',
    title: 'Timeless Vow',
    message: `You've read so many of my words now.\n\nKnow this: I promise to stand by you through black holes and supernovas. My vow to you is timeless.`,
    condition: 'open_5_letters',
  },
]

// =======================
// GAME CONFIG
// =======================
export const GAME_CONFIG = {
  PLAYER_SIZE: 24,
  PLAYER_SPEED: 0.8,
  OBSTACLE_LABELS: ['Ego', 'Distance', 'Doubt', 'Fear', 'Silence', 'Anger'],
  COLLECTIBLE_LABELS: ["Trust", "Hope", "Joy", "Care", "Time"],
  COLLECTIBLES_TO_WIN: 5,
  CANVAS_PADDING: 40,
} as const
