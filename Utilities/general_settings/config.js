const GameState = Object.freeze({
  PLAYING: "PLAYING",
  MENU_MAIN: "MENU_MAIN",
  INVENTORY: "INVENTORY",
  COMPANIONS: "COMPANIONS",
  BATTLE_TRANSITION: "BATTLE_TRANSITION",
  BATTLE: "BATTLE",
  GAME_OVER: "GAME_OVER",
});

const BattleMenu = Object.freeze({
  MAIN: "BATTLE_MAIN",
  FIGHT: "BATTLE_FIGHT",
  BAG: "BATTLE_BAG",
});

const DoorType = Object.freeze({
  INTERACT: "INTERACT",
  TRIGGER: "TRIGGER",
  LOCKED: "LOCKED",
});

const DoorDirection = Object.freeze({
  NEXT: "NEXT",
  PREVIOUS: "PREVIOUS",
});

const ItemEffect = Object.freeze({
  HEAL: "heal",
  KEY: "key",
});

const COLORS = Object.freeze({
  player: "#ff0000",
  enemy: "#800080",
  door: "#f39200",
  lockedDoor: "#8b4513",
  companionPickup: "#00ff66",
  itemPickup: "#ff0000",
  keyPickup: "#d4a017",
  obstacle: "#333333",
  highlight: "#ffcc00",
});

const FONT_FAMILY = "AtemporalPixel";

const PLAYER_START = Object.freeze({ x: 100, y: 100 });
const ENEMY_TURN_DELAY_MS = 800;
const LUCK_HIT_BONUS = 0.01;
const ENEMY_LUCK_DODGE_BONUS = 0.005;
const MIN_HIT_CHANCE = 1 / 9;
const SECTION_COLLISION_MARGIN = 30;
const TERMINAL_LOG_LIMIT = 50;

const MENU_SLIDE = Object.freeze({
  durationMs: 250,
  offsetRatio: 0.30,
});

const BATTLE_BALANCE = Object.freeze({
  playerStrongAttack: { minHitChance: 1 / 9, maxHitChance: 0.3, attackMultiplier: 2.5, flatDamage: 10 },
  playerWeakAttack: { hitChance: 0.85, attackMultiplier: 1.2 },
  enemyStrongAttack: { label: "ATAQUE FORTE", hitChance: 0.6, damage: 18 },
  enemyWeakAttack: { label: "ATAQUE FRACO", hitChance: 0.9, damage: 8 },
});

const PROGRESSION = Object.freeze({
  baseExp: 10,
  expGrowth: 1.5,
  attackPerLevel: 2,
  hpPerLevel: 15,
  healOnLevelUp: true,
  expPerEnemyHp: 0.2,
  minEnemyExp: 1,
});

function expRequiredForLevel(level) {
  return Math.round(PROGRESSION.baseExp * Math.pow(PROGRESSION.expGrowth, level - 1));
}

const MENU_OPTIONS = ["Suprimentos", "Companheiros", "Sair"];

let gameState = GameState.PLAYING;

const menu = {
  selectedIndex: 0,
  subIndex: 0,
};

const menuSlide = {
  progress: 0,
  eased: 0,
};

const battle = {
  state: BattleMenu.MAIN,
  selectedIndex: 0,
  subIndex: 0,
  bagIndex: 0,
  enemy: null,
  log: "Um inimigo apareceu!",
  isPlayerTurn: true,
  finished: false,
  levelUpMessage: "",
};

const terminalLog = [];

const unlockedLocks = new Set();

let mainCharacter;
let currentLevel = 1;
let currentSection = 0;
let levelSections = [];
let inventory = [];
let companions = [];
let obstacles = [];
let companionPickups = [];
let itemPickups = [];
let doors = [];
let collisionBodies = [];
let enemies = [];