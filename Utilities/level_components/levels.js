const WORLD_LIMIT = 100000;

function area(x1, y1, x2, y2) {
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

const DEFAULT_SECTIONS = [
  [area(-WORLD_LIMIT, -WORLD_LIMIT, WORLD_LIMIT, WORLD_LIMIT)],
];

const RAW_LEVELS = [
  {
    obstacles: [
      { x: -60, y: -147, w: 123, h: 21 },
      { x: 180, y: -147, w: 120, h: 21 },
      { x: -60, y: -126, w: 30, h: 297 },
      { x: 270, y: -126, w: 30, h: 297 },
      { x: 90, y: -6, w: 60, h: 60 },
      { x: -60, y: 171, w: 360, h: 30 },
      { x: 90, y: -6, w: 60, h: 60 },
    ],
    doors: [
      { x: 63, y: -147, w: 117, h: 21, returnSpawn: { x: 100, y: -100 }, type: DoorType.TRIGGER },
    ],
  },
  {
    sections: [
      [area(33, -162, 207, 186)],
      [area(33, -606, 474, -339), area(63, -339, 474, -162)],
      [area(-561, -339, 63, -162)],
      [area(-561, -696, -381, -339)],
      [area(-561, -162, -381, 195)],
      [area(264, -960, 441, -606)],
      [area(474, -606, 852, -423)],
      [area(33, -981, 207, -606)],
      [area(63, -1530, 207, -981), area(33, -1350, 63, -981)],
      [area(-441, -1530, 63, -1350)],
      [area(-441, -1350, -261, -996)],
    ],
    obstacles: [
      { x: -441, y: -1530, w: 648, h: 30 },
      { x: -441, y: -1500, w: 30, h: 474 },
      { x: 9, y: -1500, w: 54, h: 66 },
      { x: 177, y: -1500, w: 30, h: 894 },
      { x: -291, y: -1380, w: 354, h: 30 },
      { x: -291, y: -1350, w: 30, h: 324 },
      { x: 33, y: -1350, w: 30, h: 1011 },
      { x: -441, y: -1026, w: 180, h: 30 },
      { x: 264, y: -960, w: 177, h: 30 },
      { x: 264, y: -930, w: 30, h: 324 },
      { x: 411, y: -930, w: 30, h: 390 },
      { x: -561, y: -696, w: 180, h: 30 },
      { x: -561, y: -666, w: 30, h: 831 },
      { x: -411, y: -666, w: 30, h: 327 },
      { x: 177, y: -606, w: 117, h: 30 },
      { x: 444, y: -606, w: 408, h: 30 },
      { x: 444, y: -576, w: 30, h: 36 },
      { x: 822, y: -576, w: 30, h: 123 },
      { x: 411, y: -540, w: 63, h: 30 },
      { x: 177, y: -453, w: 675, h: 30 },
      { x: 177, y: -423, w: 30, h: 588 },
      { x: -411, y: -339, w: 474, h: 30 },
      { x: -411, y: -192, w: 474, h: 30 },
      { x: -411, y: -162, w: 30, h: 327 },
      { x: 33, y: -162, w: 30, h: 327 },
      { x: -561, y: 165, w: 180, h: 30 },
      { x: 33, y: 165, w: 45, h: 21 },
      { x: 162, y: 165, w: 45, h: 21 },
    ],
    companions: [
      { x: 768, y: -522, name: "Miséria", attackBonus: 10, hpBonus: 0, luckBonus: -5 },
    ],
    items: [
      { x: 338, y: -898, name: "Poção de Vida", effectType: ItemEffect.HEAL, effectValue: 50 },
      { x: -498, y: -621, name: "Chave Enforcada", effectType: ItemEffect.KEY, effectValue: 0, lockId: "chave_enforcada" },
    ],
    doors: [
      { x: -315, y: -1113, w: 24, h: 30, type: DoorType.INTERACT, returnSpawn: { x: -375, y: -1113 } },
      { x: 63, y: -981, w: 114, h: 24, type: DoorType.LOCKED, lockId: "chave_enforcada" },
      { x: 78, y: 165, w: 84, h: 21, type: DoorType.TRIGGER, direction: DoorDirection.PREVIOUS },
      { ...area(63, -192, 177, -132), type: DoorType.TRIGGER, link: [0, 1] },
      { ...area(33, -309, 93, -192), type: DoorType.TRIGGER, link: [1, 2] },
      { ...area(-531, -369, -411, -309), type: DoorType.TRIGGER, link: [2, 3] },
      { ...area(-531, -192, -411, -132), type: DoorType.TRIGGER, link: [2, 4] },
      { ...area(294, -636, 411, -576), type: DoorType.TRIGGER, link: [1, 5] },
      { ...area(444, -510, 504, -453), type: DoorType.TRIGGER, link: [1, 6] },
      { ...area(63, -636, 177, -576), type: DoorType.TRIGGER, link: [1, 7] },
      { ...area(63, -1011, 177, -981), type: DoorType.TRIGGER, link: [7, 8] },
      { ...area(33, -1434, 93, -1380), type: DoorType.TRIGGER, link: [8, 9] },
      { ...area(-411, -1380, -291, -1320), type: DoorType.TRIGGER, link: [9, 10] },
    ],
    enemies: [
      { x: -50, y: -1484, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
      { x: -488, y: -504, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
      { x: -164, y: -296, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
      { x: 496, y: -558, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
    ],
  },
  {
    sections: [
      [area(-27, -345, WORLD_LIMIT, WORLD_LIMIT)],
      [area(-WORLD_LIMIT, -345, -27, WORLD_LIMIT)],
      [area(-WORLD_LIMIT, -660, -27, -345)],
      [area(-WORLD_LIMIT, -WORLD_LIMIT, -27, -660)],
      [area(-27, -WORLD_LIMIT, 267, -345), area(267, -600, WORLD_LIMIT, -345)],
      [area(267, -WORLD_LIMIT, WORLD_LIMIT, -600)],
    ],
    obstacles: [
      { x: -141, y: -921, w: 408, h: 30 },
      { x: 321, y: -909, w: 270, h: 18 },
      { x: 711, y: -909, w: 30, h: 252 },
      { x: -141, y: -891, w: 30, h: 114 },
      { x: 237, y: -891, w: 30, h: 84 },
      { x: 321, y: -891, w: 30, h: 84 },
      { x: 456, y: -822, w: 114, h: 114 },
      { x: 237, y: -807, w: 114, h: 30 },
      { x: -141, y: -777, w: 144, h: 30 },
      { x: -27, y: -747, w: 30, h: 318 },
      { x: 237, y: -657, w: 504, h: 30 },
      { x: 237, y: -627, w: 30, h: 804 },
      { x: -498, y: -579, w: 288, h: 30 },
      { x: -498, y: -549, w: 30, h: 468 },
      { x: -240, y: -549, w: 30, h: 120 },
      { x: -354, y: -429, w: 144, h: 30 },
      { x: -27, y: -429, w: 147, h: 30 },
      { x: -354, y: -399, w: 30, h: 54 },
      { x: 90, y: -399, w: 30, h: 54 },
      { x: -354, y: -345, w: 474, h: 30 },
      { x: -408, y: -252, w: 114, h: 114 },
      { x: -111, y: -225, w: 114, h: 30 },
      { x: -111, y: -195, w: 30, h: 114 },
      { x: -27, y: -195, w: 30, h: 372 },
      { x: -498, y: -81, w: 417, h: 30 },
      { x: -27, y: 177, w: 294, h: 30 },
      { x: 456, y: -822, w: 114, h: 114 },
      { x: -408, y: -252, w: 114, h: 114 },
    ],
    companions: [
      { x: -292, y: -504, name: "Faísca", attackBonus: -2, hpBonus: 60, luckBonus: 2 },
    ],
    items: [
      { x: -78, y: -838, name: "Poção de Vida", effectType: ItemEffect.HEAL, effectValue: 50 },
    ],
    doors: [
      { x: 591, y: -909, w: 120, h: 18, type: DoorType.TRIGGER, returnSpawn: { x: 630, y: -860 } },
      { ...area(-57, -891, 3, -777), type: DoorType.TRIGGER, link: [3, 4] },
      { ...area(237, -777, 297, -657), type: DoorType.TRIGGER, link: [4, 5] },
      { ...area(-57, -315, 3, -225), type: DoorType.TRIGGER, link: [0, 1] },
      { ...area(-468, -375, -354, -315), type: DoorType.TRIGGER, link: [1, 2] },
      { ...area(120, -375, 237, -315), type: DoorType.TRIGGER, link: [0, 4] },
    ],
    enemies: [
      { x: 382, y: -876, name: "Inimigo Sombrio", maxHp: 50, direction: 'DOWN' },
      { x: 30, y: -498, name: "Inimigo Sombrio", maxHp: 50, direction: 'RIGHT' },
      { x: -168, y: -218, name: "Inimigo Sombrio", maxHp: 50, direction: 'UP' },
    ],
  },
  {
    obstacles: [
      { x: -30, y: -924, w: 297, h: 30 },
      { x: -30, y: -894, w: 30, h: 252 },
      { x: 237, y: -894, w: 30, h: 363 },
      { x: -30, y: -642, w: 183, h: 54 },
      { x: -30, y: -588, w: 30, h: 357 },
      { x: 84, y: -531, w: 183, h: 54 },
      { x: 237, y: -477, w: 30, h: 354 },
      { x: 69, y: -408, w: 99, h: 54 },
      { x: -30, y: -231, w: 183, h: 54 },
      { x: -30, y: -177, w: 30, h: 351 },
      { x: 84, y: -123, w: 183, h: 54 },
      { x: 237, y: -69, w: 30, h: 243 },
      { x: -30, y: 174, w: 87, h: 24 },
      { x: 177, y: 174, w: 90, h: 24 },
      { x: 69, y: -408, w: 99, h: 54 },
    ],
    doors: [
      { x: 57, y: 174, w: 120, h: 24, type: DoorType.TRIGGER, direction: DoorDirection.PREVIOUS },
    ],
    enemies: [
      { x: 106, y: -822, name: "Chefão", maxHp: 120, direction: 'DOWN' },
    ],
  },
];

const MAP_SCALE = 2;

function scaleCoordinate(value, origin) {
  return Math.round(origin + (value - origin) * MAP_SCALE);
}

function scalePosition(entry) {
  return {
    ...entry,
    x: scaleCoordinate(entry.x, PLAYER_START.x),
    y: scaleCoordinate(entry.y, PLAYER_START.y),
  };
}

function scaleRect(entry) {
  return {
    ...scalePosition(entry),
    w: Math.round(entry.w * MAP_SCALE),
    h: Math.round(entry.h * MAP_SCALE),
  };
}

function scaleDoor(entry) {
  const door = scaleRect(entry);
  if (entry.returnSpawn) door.returnSpawn = scalePosition(entry.returnSpawn);
  return door;
}

function scaleLevel(level) {
  return {
    sections: (level.sections || DEFAULT_SECTIONS).map(zone => zone.map(scaleRect)),
    obstacles: (level.obstacles || []).map(scaleRect),
    doors: (level.doors || []).map(scaleDoor),
    companions: (level.companions || []).map(scalePosition),
    items: (level.items || []).map(scalePosition),
    enemies: (level.enemies || []).map(scalePosition),
  };
}

const LEVELS = RAW_LEVELS.map(scaleLevel);