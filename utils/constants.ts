import { StarData, LetterData } from '@/store/useAppStore'

/** Star configuration data for the 3D galaxy */
export const STARS_DATA: StarData[] = [
  {
    id: 'star-1',
    title: 'The Day We Met',
    date: 'January 15, 2023',
    message: 'In a crowded room full of strangers, my eyes found yours. It was as if the entire universe had conspired to bring us to that exact moment in time. Your smile was the first star I ever truly noticed, and from that instant, my night sky was never dark again.',
    color: '#ff6b9d',
    position: [-4, 2, -3],
  },
  {
    id: 'star-2',
    title: 'Our First Conversation',
    date: 'January 20, 2023',
    message: 'We talked for hours that night, as if we had known each other in a thousand lifetimes before this one. Every word you spoke painted colors in my mind I had never seen. Time lost its meaning — minutes became hours, and hours became the foundation of everything we would become.',
    color: '#4ecdc4',
    position: [3, 3, -5],
  },
  {
    id: 'star-3',
    title: 'The First Time You Laughed',
    date: 'February 3, 2023',
    message: 'Your laughter is the most beautiful melody the universe has ever composed. It echoed through me like a symphony, filling spaces I did not know were empty. In that moment, I understood what poets meant when they wrote about sounds that could heal a soul.',
    color: '#ffd700',
    position: [-2, -1, -4],
  },
  {
    id: 'star-4',
    title: 'The Rainy Walk',
    date: 'March 12, 2023',
    message: 'The sky opened up and poured down on us, but neither of us wanted to find shelter. We danced between the raindrops, your hand in mine, and the whole city became our private ballroom. Every puddle reflected the lights above, and I saw our future in each shimmering ripple.',
    color: '#7b68ee',
    position: [5, -2, -6],
  },
  {
    id: 'star-5',
    title: 'When You Said My Name',
    date: 'April 8, 2023',
    message: 'No one has ever spoken my name the way you do. In your voice, it sounds like a prayer, a promise, a poem all at once. You gave meaning to syllables I had heard a million times, and now every time someone else says it, I only hear the echo of you.',
    color: '#ff9a56',
    position: [-5, -3, -5],
  },
  {
    id: 'star-6',
    title: 'The Midnight Promise',
    date: 'May 21, 2023',
    message: 'Under a canopy of stars, you whispered a promise that the night kept safe for us. "I will always find my way back to you," you said, and I believed every word because your eyes held more truth than the entire sky above us. That promise became my anchor in every storm.',
    color: '#e056ff',
    position: [1, 4, -7],
  },
  {
    id: 'star-7',
    title: 'Our Song Played',
    date: 'June 14, 2023',
    message: 'It came on unexpectedly — our song — in a place we had never been, at a time we did not plan. You looked at me, and I looked at you, and we both knew that the universe was reminding us: some connections are not accidents. They are destiny wearing the disguise of coincidence.',
    color: '#56c8ff',
    position: [4, 1, -3],
  },
]

/** Hidden star — only visible after progression requirements are met */
export const HIDDEN_STAR: StarData = {
  id: 'hidden-star',
  title: 'The Beginning of Forever',
  date: 'Today',
  message: 'Every star you have visited, every letter you have read, every obstacle you have overcome — they all led here. To this moment. To us. This is not the end of our story. This is where forever begins.',
  color: '#ffffff',
  position: [0, 6, -10],
}

/** Letter data for the letters page */
export const LETTERS_DATA: LetterData[] = [
  {
    id: 'letter-1',
    title: 'To the One Who Changed Everything',
    message: `My dearest,

Before you, I thought I understood what it meant to feel alive. I was wrong. You didn't just enter my life — you illuminated it. Every shadow I had grown comfortable in was suddenly flooded with a warmth I never knew existed.

I want you to know that loving you is not something I do. It is something I am. It is woven into every breath I take, every thought that crosses my mind, every dream I dare to dream.

You are not just my person. You are my proof that the universe knows exactly what it is doing.

Forever and then some,
Your person`,
    unlockType: 'progress',
    requiredStars: 3,
  },
  {
    id: 'letter-2',
    title: 'The Things I Never Say Enough',
    message: `My love,

There are words I carry with me every day that somehow never quite make it past my lips. So I am writing them here, where they can live forever:

Thank you for choosing me. Not just once, but every single day. Thank you for seeing the parts of me I try to hide and loving them anyway. Thank you for being my calm in chaos, my warmth in the cold, my home when the world feels too large.

I notice everything — the way you check on me without asking, the way you remember the little things, the way you make ordinary moments feel extraordinary.

You are my favorite everything.

With all that I am,
Yours always`,
    unlockType: 'progress',
    requiredStars: 5,
  },
  {
    id: 'letter-3',
    title: 'A Promise Written in Stars',
    message: `My universe,

I have a confession: I wrote our names in the stars long before I told you I loved you. I whispered it to the night sky, hoping the wind would carry it to you in your dreams.

Here is my promise, written not in ink that fades, but in the light of stars that will burn for billions of years:

I promise to be your shelter and your adventure.
I promise to hold your hand through the dark and dance with you in the light.
I promise to grow beside you, not apart from you.
I promise to choose us, every single time.

This is not just love. This is a covenant with the cosmos.

Until the last star burns out,
Your forever person`,
    unlockType: 'game',
    requiresGame: true,
  },
  {
    id: 'letter-4',
    title: 'For the Hard Days',
    message: `Hey you,

If you are reading this on a hard day, I need you to hear this:

You are enough. You have always been enough. The world may feel heavy right now, but you are not carrying it alone. I am right here. I have always been right here.

Your struggles do not make you less — they make you the incredible, resilient, beautiful person I fell in love with. Every scar tells a story of survival, and I am honored to know every single one of them.

On the days when you cannot see your own light, look at me. I will reflect it back to you until you can see it again.

You are my favorite person in any universe.

Holding you always,
Your safe place`,
    unlockType: 'progress',
    requiredStars: 4,
  },
]

/** Color palette for the application */
export const COLORS = {
  deepNavy: '#0a0e1a',
  cosmicPurple: '#1a0a2e',
  nebulaPink: '#ff6b9d',
  nebulaBlue: '#4ecdc4',
  starGold: '#ffd700',
  softWhite: '#e8e6f0',
  glassWhite: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
}

/** Game configuration constants */
export const GAME_CONFIG = {
  PLAYER_SIZE: 24,
  PLAYER_SPEED: 5,
  OBSTACLE_COUNT: 6,
  COLLECTIBLE_COUNT: 3,
  COLLECTIBLES_TO_WIN: 3,
  CANVAS_PADDING: 40,
  OBSTACLE_LABELS: ['Ego', 'Distance', 'Overthinking', 'Doubt', 'Fear', 'Silence'],
  COLLECTIBLE_LABELS: ['Trust', 'Patience', 'Communication'],
} as const