// 25 Games exactly as promised: 3 Custom, 22 Embedded HTML5 Games
export const gamesList = [
  // CUSTOM BUILT GAMES (React/Three)
  {
    id: "void-runner",
    title: "Void Runner 3D",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/void-runner",
    thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
    description: "Endless neon 3D runner through a dark matter tunnel.",
    tags: ["3D", "Action", "React-Three"],
    featured: true
  },
  {
    id: "neon-breakout",
    title: "Neon Breakout",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/neon-breakout",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
    description: "Classic breakout with intense particle physics.",
    tags: ["2D", "Arcade", "Physics"],
    featured: true
  },
  {
    id: "blockchain-snake",
    title: "Crypto Snake",
    developer: "Soham Dandekar",
    type: "custom",
    path: "/games/snake",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    description: "Navigate the chain and collect nodes.",
    tags: ["Classic", "Logic"]
  },
  // EMBEDDED CURATED GAMES
  {
    id: "hextrix",
    title: "Hextrix",
    developer: "Logan Engstrom",
    type: "embed",
    url: "https://hextris.io/",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    description: "Fast-paced puzzle game. Match colors on a hexagon.",
    tags: ["Puzzle", "Addictive"]
  },
  {
    id: "2048",
    title: "2048",
    developer: "Gabriele Cirulli",
    type: "embed",
    url: "https://play2048.co/",
    thumbnail: "https://images.unsplash.com/photo-1580584473179-1ce556aa2a17?auto=format&fit=crop&w=400&q=80",
    description: "Math logic game. Join the numbers to reach 2048.",
    tags: ["Logic", "Classic"]
  },
  {
    id: "astray",
    title: "Astray",
    developer: "Rye Terrell",
    type: "embed",
    url: "https://www.crazygames.com/embed/astray",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    description: "A WebGL maze game.",
    tags: ["3D", "Maze"]
  },
  {
    id: "slow-roads",
    title: "Slow Roads",
    developer: "Anslo",
    type: "embed",
    url: "https://slowroads.io/",
    thumbnail: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80",
    description: "Endless driving zen simulator.",
    tags: ["3D", "Simulation"]
  },
  {
    id: "radius-raid",
    title: "Radius Raid",
    developer: "Jack Rugile",
    type: "embed",
    url: "https://jackrugile.com/radius-raid/",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
    description: "Space themed shoot 'em up.",
    tags: ["Arcade", "Action"]
  },
  {
    id: "pacman",
    title: "Pac-Man",
    developer: "Namco",
    type: "embed",
    url: "https://freepacman.org/game.html",
    thumbnail: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=400&q=80",
    description: "The retro classic.",
    tags: ["Classic", "Arcade"]
  },
  {
    id: "flappy",
    title: "Flappy Bird",
    developer: "Dong Nguyen",
    type: "embed",
    url: "https://flappybird.io/",
    thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=400&q=80",
    description: "Difficult tap-to-fly game.",
    tags: ["Frustrating", "Arcade"]
  },
  {
    id: "xibalba",
    title: "Xibalba",
    developer: "PhobosLab",
    type: "embed",
    url: "https://phoboslab.org/xibalba/",
    thumbnail: "https://images.unsplash.com/photo-1498736297812-3a08021f206f?auto=format&fit=crop&w=400&q=80",
    description: "A doom-clone first person shooter.",
    tags: ["3D", "Shooter"]
  },
  {
    id: "chrome-dino",
    title: "T-Rex Runner",
    developer: "Google",
    type: "embed",
    url: "https://chromedino.com/",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    description: "The classic offline game.",
    tags: ["Classic"]
  },
  {
    id: "mkjs",
    title: "Mortal Kombat JS",
    developer: "Mikanos",
    type: "embed",
    url: "https://mikanos.github.io/mkjs/",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
    description: "JavaScript clone of Mortal Kombat.",
    tags: ["Fighting", "Action"]
  },
  {
    id: "core-ball",
    title: "Core Ball",
    developer: "Coreball",
    type: "embed",
    url: "https://coreball.com/",
    thumbnail: "https://images.unsplash.com/photo-1554188248-986adbb56bed?auto=format&fit=crop&w=400&q=80",
    description: "Precision timing game.",
    tags: ["Logic"]
  },
  {
    id: "krunker",
    title: "Krunker",
    developer: "Yendis",
    type: "embed",
    url: "https://krunker.io/",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
    description: "Multiplayer blocky FPS.",
    tags: ["3D", "Multiplayer", "Shooter"]
  },
  {
    id: "z-type",
    title: "ZType",
    developer: "PhobosLab",
    type: "embed",
    url: "https://zty.pe/",
    thumbnail: "https://images.unsplash.com/photo-1627398225255-3b0366ebcb94?auto=format&fit=crop&w=400&q=80",
    description: "Type to shoot enemies.",
    tags: ["Typing", "Action"]
  },
  {
    id: "polycraft",
    title: "Polycraft",
    developer: "Wonderstruck",
    type: "embed",
    url: "https://polycraftapp.com/",
    thumbnail: "https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?auto=format&fit=crop&w=400&q=80",
    description: "3D survival and crafting game.",
    tags: ["3D", "Strategy"]
  },
  {
    id: "entanglement",
    title: "Entanglement",
    developer: "Gopherwood",
    type: "embed",
    url: "https://entanglement.gopherwoodstudios.com/",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    description: "Hexagonal puzzle game.",
    tags: ["Puzzle"]
  },
  {
    id: "little-alchemy",
    title: "Little Alchemy 2",
    developer: "Recloak",
    type: "embed",
    url: "https://littlealchemy2.com/",
    thumbnail: "https://images.unsplash.com/photo-1582046413488-66a96e57dbf5?auto=format&fit=crop&w=400&q=80",
    description: "Combine elements to create new ones.",
    tags: ["Simulation"]
  },
  {
    id: "slope",
    title: "Slope",
    developer: "Y8",
    type: "embed",
    url: "https://slopegame.io/",
    thumbnail: "https://images.unsplash.com/photo-1621360841013-c768310ba050?auto=format&fit=crop&w=400&q=80",
    description: "Endless 3D rolling game.",
    tags: ["3D", "Arcade"]
  },
  {
    id: "sandspiel",
    title: "Sandspiel",
    developer: "Max Bittker",
    type: "embed",
    url: "https://sandspiel.club/",
    thumbnail: "https://images.unsplash.com/photo-1550537687-c9a0c325cdef?auto=format&fit=crop&w=400&q=80",
    description: "Falling sand cellular automata.",
    tags: ["Simulation"]
  },
  {
    id: "tetris",
    title: "Tetris",
    developer: "Alexey",
    type: "embed",
    url: "https://tetris.com/play-tetris",
    thumbnail: "https://images.unsplash.com/photo-1601614777551-7f9e8a719fc7?auto=format&fit=crop&w=400&q=80",
    description: "The classic block puzzle.",
    tags: ["Classic", "Puzzle"]
  },
  {
    id: "run3",
    title: "Run 3",
    developer: "Joseph",
    type: "embed",
    url: "https://run3.io/",
    thumbnail: "https://images.unsplash.com/photo-1584444583196-857e2bb25867?auto=format&fit=crop&w=400&q=80",
    description: "Run and jump through a space tunnel.",
    tags: ["3D", "Arcade"]
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    developer: "Orteil",
    type: "embed",
    url: "https://orteil.dashnet.org/cookieclicker/",
    thumbnail: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80",
    description: "The original idle game.",
    tags: ["Idle"]
  },
  {
    id: "bouncing-dvd",
    title: "DVD Logo",
    developer: "Classic",
    type: "embed",
    url: "https://bouncingdvdlogo.com/",
    thumbnail: "https://images.unsplash.com/photo-1627993046777-622cd5a19cb2?auto=format&fit=crop&w=400&q=80",
    description: "Will it hit the corner?",
    tags: ["Zen"]
  }
];
