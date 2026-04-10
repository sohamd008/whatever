// 5 Custom-built games — all run entirely on this site, each with an AI autonomous mode
export const gamesList = [
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/flappy-bird",
    thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=400&q=80",
    description: "Tap to flap through pipes. Toggle AI mode to watch the bot dodge endlessly.",
    tags: ["Arcade", "AI Mode"],
    featured: true
  },
  {
    id: "tetris",
    title: "Tetris",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/tetris",
    thumbnail: "https://images.unsplash.com/photo-1601614777551-7f9e8a719fc7?auto=format&fit=crop&w=400&q=80",
    description: "Classic block stacking. AI mode uses board evaluation to play optimally.",
    tags: ["Puzzle", "Classic", "AI Mode"],
    featured: true
  },
  {
    id: "pong",
    title: "Pong vs AI",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/pong",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
    description: "Classic pong against an adaptive AI opponent. Watch two AIs battle in autonomous mode.",
    tags: ["Arcade", "Sports", "AI Mode"],
    featured: true
  },
  {
    id: "2048",
    title: "2048",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/2048",
    thumbnail: "https://images.unsplash.com/photo-1580584473179-1ce556aa2a17?auto=format&fit=crop&w=400&q=80",
    description: "Slide and merge tiles to reach 2048. AI uses expectimax strategy to chase high scores.",
    tags: ["Logic", "Puzzle", "AI Mode"]
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/tic-tac-toe",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=400&q=80",
    description: "Play against an unbeatable minimax AI. Or let both sides play themselves.",
    tags: ["Strategy", "Classic", "AI Mode"]
  },
];
