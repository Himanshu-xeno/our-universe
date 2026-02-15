
import { StarData, LetterData } from '@/store/useAppStore'

// Helper: generate random positions
const generateRandomPosition = (): [number, number, number] => [
  Math.random() * 40 - 20,
  Math.random() * 20 - 10,
  Math.random() * -40,
]

// =======================
// STARS DATA (15 Stars)
// =======================
export const STARS_DATA: StarData[] = [
  {
    id: 'star-1',
    title: 'The Day We Met',
    date: 'January 15, 2023',
    message: 'In a crowded room full of strangers, my eyes found yours...',
    color: '#ff6b9d',
    position: generateRandomPosition(),
  },
  {
    id: 'star-2',
    title: 'Our First Conversation',
    date: 'January 20, 2023',
    message: 'We talked for hours that night...',
    color: '#4ecdc4',
    position: generateRandomPosition(),
  },
  {
    id: 'star-3',
    title: 'The First Time You Laughed',
    date: 'February 3, 2023',
    message: 'Your laughter is the most beautiful melody...',
    color: '#ffd700',
    position: generateRandomPosition(),
  },
  {
    id: 'star-4',
    title: 'The Rainy Walk',
    date: 'March 12, 2023',
    message: 'The sky opened up and poured down on us...',
    color: '#7b68ee',
    position: generateRandomPosition(),
  },
  {
    id: 'star-5',
    title: 'When You Said My Name',
    date: 'April 8, 2023',
    message: 'No one has ever spoken my name the way you do...',
    color: '#ff9a56',
    position: generateRandomPosition(),
  },
  {
    id: 'star-6',
    title: 'The Midnight Promise',
    date: 'May 21, 2023',
    message: 'Under a canopy of stars, you whispered a promise...',
    color: '#e056ff',
    position: generateRandomPosition(),
  },
  {
    id: 'star-7',
    title: 'Our Song Played',
    date: 'June 14, 2023',
    message: 'It came on unexpectedly — our song...',
    color: '#56c8ff',
    position: generateRandomPosition(),
  },
  {
    id: 'star-8',
    title: 'The Unexpected Hug',
    date: 'July 2, 2023',
    message: 'In that quiet moment, when words were not enough...',
    color: '#ff9ff3',
    position: generateRandomPosition(),
  },
  {
    id: 'star-9',
    title: 'The Long Call',
    date: 'July 18, 2023',
    message: 'We stayed awake until 3AM...',
    color: '#48dbfb',
    position: generateRandomPosition(),
  },
  {
    id: 'star-10',
    title: 'The Comfort Silence',
    date: 'August 4, 2023',
    message: 'We sat without speaking...',
    color: '#feca57',
    position: generateRandomPosition(),
  },
  {
    id: 'star-11',
    title: 'The Apology',
    date: 'August 20, 2023',
    message: 'Not because we were wrong...',
    color: '#a29bfe',
    position: generateRandomPosition(),
  },
  {
    id: 'star-12',
    title: 'The Surprise Visit',
    date: 'September 10, 2023',
    message: 'You showed up without telling me...',
    color: '#ff7675',
    position: generateRandomPosition(),
  },
  {
    id: 'star-13',
    title: 'The Shared Dream',
    date: 'October 1, 2023',
    message: 'We talked about our future...',
    color: '#55efc4',
    position: generateRandomPosition(),
  },
  {
    id: 'star-14',
    title: 'The Inside Joke',
    date: 'October 18, 2023',
    message: 'One word. One look...',
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

// =======================
// HIDDEN STAR
// =======================
export const HIDDEN_STAR: StarData = {
  id: 'hidden-star',
  title: 'The Beginning of Forever',
  date: 'Today',
  message: 'You found the secret. This is where forever begins.',
  color: '#ffffff',
  position: [0, 6, -10],
}

// // =======================
// // LETTERS DATA
// // =======================
// export const LETTERS_DATA: LetterData[] = [
//   {
//     id: 'l1',
//     title: 'To the One Who Changed Everything',
//     message: `My dearest,\n\nBefore you, I thought I understood what it meant to feel alive. I was wrong. You didn't just enter my life — you illuminated it.\n\nWelcome to your galaxy.`,
//     condition: 'default',
//   },
//   {
//     id: 'l2',
//     title: 'Starlight Memories',
//     message: `My love,\n\nEvery star you click represents a memory we've shared. The laughter, the quiet moments, the adventures. They shine specifically for you.`,
//     condition: 'visit_3_stars',
//   },
//   {
//     id: 'l3',
//     title: 'For the Hard Days',
//     message: `Hey you,\n\nIf you are reading this on a hard day: You are enough. You have always been enough. I am right here holding your hand.`,
//     condition: 'visit_5_stars',
//   },
//   {
//     id: 'l4',
//     title: 'Cosmic Connection',
//     message: `You have seen every star in this sky.\n\nIt proves that no distance is too great for us. You are the center of my orbit, now and forever.`,
//     condition: 'visit_all_stars',
//   },
//   {
//     id: 'l5',
//     title: "The Gamer's Reward",
//     message: `I see you found the Arcade!\n\nI love your playful side. Life with you is never boring. Let's keep playing together, level after level.`,
//     condition: 'play_1_game',
//   },
//   {
//     id: 'l6',
//     title: 'Victory Lap',
//     message: `Winner! 🏆\n\nYou've mastered the games, just like you've mastered the art of making me smile. I'm so proud of you.`,
//     condition: 'win_3_games',
//   },
//   {
//     id: 'l7',
//     title: 'Secret Whisper',
//     message: `You found the hidden star!\n\nYou look deeper than most. You see the things that others miss. That is why I love you.`,
//     condition: 'find_hidden_star',
//   },
//   {
//     id: 'l8',
//     title: 'Timeless Vow',
//     message: `You've read so many of my words now.\n\nKnow this: I promise to stand by you through black holes and supernovas. My vow to you is timeless.`,
//     condition: 'open_5_letters',
//   },
// ]

// // =======================
// // GAME CONFIG
// // =======================
// export const GAME_CONFIG = {
//   PLAYER_SIZE: 24,
//   PLAYER_SPEED: 0.8,
//   OBSTACLE_LABELS: ['Ego', 'Distance', 'Doubt', 'Fear', 'Silence', 'Anger'],
//   COLLECTIBLE_LABELS: ["Trust", "Hope", "Joy", "Care", "Time"],
//   COLLECTIBLES_TO_WIN: 5,
//   CANVAS_PADDING: 40,
// } as const

// === THE LOCKING CONDITIONS ARE HERE ===
export const LETTERS_DATA: LetterData[] = [
  {
    id: 'l1',
    title: 'The Beginning',
    message: `My dearest,\n\nBefore you, I thought I understood what it meant to feel alive...`,
    condition: 'default',
  },
  {
    id: 'l2',
    title: 'Starlight Memories',
    message: `My love,\n\nEvery star you click represents a memory we've shared...`,
    condition: 'visit_3_stars',
  },
  {
    id: 'l3',
    title: 'For the Hard Days',
    message: `Hey you,\n\nIf you are reading this on a hard day: You are enough...`,
    condition: 'visit_5_stars',
  },
  {
    id: 'l4',
    title: 'Cosmic Connection',
    message: `You have seen every star in this sky...`,
    condition: 'visit_all_stars',
  },
  {
    id: 'l5',
    title: "The Gamer's Reward",
    message: `I see you found the Arcade!\n\nI love your playful side...`,
    condition: 'play_1_game',
  },
  {
    id: 'l6',
    title: 'Victory Lap',
    message: `Winner! 🏆\n\nYou've mastered the games...`,
    condition: 'win_3_games',
  },
  {
    id: 'l7',
    title: 'Secret Whisper',
    message: `You found the hidden star!\n\nYou look deeper than most...`,
    condition: 'find_hidden_star',
  },
  {
    id: 'l8',
    title: 'Timeless Vow',
    message: `You've read so many of my words now...`,
    condition: 'open_5_letters',
  },
]

export const GAME_CONFIG = {
  PLAYER_SIZE: 24,
  PLAYER_SPEED: 0.8,
  OBSTACLE_LABELS: ['Ego', 'Distance', 'Doubt', 'Fear', 'Silence', 'Anger'],
  COLLECTIBLE_LABELS: ["Trust", "Hope", "Joy", "Care", "Time"],
  COLLECTIBLES_TO_WIN: 5,
  CANVAS_PADDING: 40,
} as const