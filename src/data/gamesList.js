// 5 Custom-built games — each with unique SVG art and AI autonomous mode
export const gamesList = [
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/flappy-bird",
    thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=400&q=80",
    svgArt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#0a0a12"/><circle cx="60" cy="100" r="15" fill="#FFD600" opacity="0.8"/><rect x="120" y="0" width="30" height="70" fill="#EA580C" opacity="0.6"/><rect x="120" y="130" width="30" height="70" fill="#EA580C" opacity="0.6"/><g opacity="0.2"><circle cx="40" cy="40" r="2" fill="white"/><circle cx="160" cy="60" r="1.5" fill="white"/><circle cx="100" cy="150" r="1" fill="white"/></g></svg>`,
    description: "Tap to flap through pipes. Toggle AI mode to watch the bot dodge endlessly.",
    tags: ["Arcade", "AI Mode"],
    featured: true,
    color: "#FFD600"
  },
  {
    id: "tetris",
    title: "Tetris",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/tetris",
    thumbnail: "https://images.unsplash.com/photo-1601614777551-7f9e8a719fc7?auto=format&fit=crop&w=400&q=80",
    svgArt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#030304"/><rect x="40" y="140" width="30" height="30" fill="#06b6d4" opacity="0.7"/><rect x="70" y="140" width="30" height="30" fill="#06b6d4" opacity="0.7"/><rect x="100" y="140" width="30" height="30" fill="#06b6d4" opacity="0.7"/><rect x="130" y="140" width="30" height="30" fill="#06b6d4" opacity="0.7"/><rect x="85" y="80" width="30" height="30" fill="#a855f7" opacity="0.6"/><rect x="55" y="110" width="30" height="30" fill="#a855f7" opacity="0.6"/><rect x="85" y="110" width="30" height="30" fill="#a855f7" opacity="0.6"/><rect x="115" y="110" width="30" height="30" fill="#a855f7" opacity="0.6"/></svg>`,
    description: "Classic block stacking. AI mode uses board evaluation to play optimally.",
    tags: ["Puzzle", "Classic", "AI Mode"],
    featured: true,
    color: "#a855f7"
  },
  {
    id: "pong",
    title: "Pong vs AI",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/pong",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
    svgArt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#030304"/><rect x="10" y="70" width="8" height="60" fill="#06b6d4" opacity="0.8"/><rect x="182" y="50" width="8" height="60" fill="#F7931A" opacity="0.8"/><circle cx="100" cy="100" r="6" fill="white" opacity="0.9"/><line x1="100" y1="0" x2="100" y2="200" stroke="white" stroke-width="1" stroke-dasharray="5,5" opacity="0.1"/></svg>`,
    description: "Classic pong against an adaptive AI opponent. Watch two AIs battle in autonomous mode.",
    tags: ["Arcade", "Sports", "AI Mode"],
    featured: true,
    color: "#06b6d4"
  },
  {
    id: "2048",
    title: "2048",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/2048",
    thumbnail: "https://images.unsplash.com/photo-1580584473179-1ce556aa2a17?auto=format&fit=crop&w=400&q=80",
    svgArt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#030304"/><rect x="25" y="25" width="70" height="70" rx="8" fill="#white" opacity="0.1"/><rect x="105" y="25" width="70" height="70" rx="8" fill="#white" opacity="0.05"/><rect x="25" y="105" width="70" height="70" rx="8" fill="#white" opacity="0.05"/><rect x="105" y="105" width="70" height="70" rx="8" fill="#F7931A" opacity="0.4"/><text x="45" y="70" font-family="monospace" font-weight="bold" fill="white" font-size="24" opacity="0.5">2</text><text x="120" y="150" font-family="monospace" font-weight="bold" fill="white" font-size="24" opacity="0.8">2048</text></svg>`,
    description: "Slide and merge tiles to reach 2048. AI uses expectimax strategy to chase high scores.",
    tags: ["Logic", "Puzzle", "AI Mode"],
    color: "#F7931A"
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/tic-tac-toe",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=400&q=80",
    svgArt: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#030304"/><line x1="66" y1="20" x2="66" y2="180" stroke="white" stroke-width="2" opacity="0.1"/><line x1="133" y1="20" x2="133" y2="180" stroke="white" stroke-width="2" opacity="0.1"/><line x1="20" y1="66" x2="180" y2="66" stroke="white" stroke-width="2" opacity="0.1"/><line x1="20" y1="133" x2="180" y2="133" stroke="white" stroke-width="2" opacity="0.1"/><circle cx="100" cy="100" r="20" fill="none" stroke="#F7931A" stroke-width="4" opacity="0.6"/><path d="M30 30 L55 55 M55 30 L30 55" stroke="#06b6d4" stroke-width="4" opacity="0.6"/></svg>`,
    description: "Play against an unbeatable minimax AI. Or let both sides play themselves.",
    tags: ["Strategy", "Classic", "AI Mode"],
    color: "#06b6d4"
  },
];
