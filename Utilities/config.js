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

const COLORS = Object.freeze({
  player: "#ff0000",
  enemy: "#800080",
  door: "#f39200",
  companionPickup: "#00ff66",
  itemPickup: "#ff0000",
  obstacle: "#333333",
  highlight: "#ffcc00",
});

const PLAYER_START = Object.freeze({ x: 100, y: 100 });
const ENEMY_TURN_DELAY_MS = 800;
const LUCK_HIT_BONUS = 0.01;

const BATTLE_BALANCE = Object.freeze({
  playerStrongAttack: { selfDamage: 15, hitChance: 0.2, attackMultiplier: 1.8, flatDamage: 10 },
  playerWeakAttack: { hitChance: 0.85, attackMultiplier: 0.7 },
  enemyStrongAttack: { label: "ATAQUE FORTE", hitChance: 0.5, damage: 25 },
  enemyWeakAttack: { label: "ATAQUE FRACO", hitChance: 0.8, damage: 10 },
});

const MENU_OPTIONS = ["Inventário", "Companheiros", "Sair"];

let gameState = GameState.PLAYING;

const menu = {
  selectedIndex: 0,
  subIndex: 0,
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
};

let mainCharacter;
let currentLevel = 1;
let inventory = [];
let companions = [];
let obstacles = [];
let companionPickups = [];
let itemPickups = [];
let doors = [];
let enemies = [];