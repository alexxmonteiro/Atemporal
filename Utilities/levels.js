const LEVELS = [
  {
    obstacles: [
      { x: 300, y: 200, w: 150, h: 40 },
      { x: 500, y: 350, w: 50, h: 200 },
    ],
    companions: [
      { x: 250, y: 150, name: "Miséria", attackBonus: 10, hpBonus: 0, luckBonus: -5 },
      { x: 450, y: 400, name: "Faísca", attackBonus: -2, hpBonus: 60, luckBonus: 2 },
    ],
    items: [
      { x: 200, y: 300, name: "Poção de Vida", effectType: "heal", effectValue: 50 },
    ],
    doors: [
      { x: 700, y: 150, w: 40, h: 60 },
    ],
    enemies: [
      { x: 500, y: 150, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
    ],
  },
  {
    obstacles: [
      { x: 200, y: 200, w: 300, h: 30 },
    ],
    doors: [
      { x: 650, y: 400, w: 40, h: 60 },
    ],
    enemies: [
      { x: 200, y: 400, name: "Cavaleiro Corrompido", maxHp: 80, direction: 'RIGHT' },
    ],
  },
];