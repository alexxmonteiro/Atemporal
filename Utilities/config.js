const STATE_PLAYING = "PLAYING";
const STATE_MENU_MAIN = "MENU_MAIN";
const STATE_INVENTORY = "INVENTORY";
const STATE_COMPANIONS = "COMPANIONS";
const STATE_BATTLE_TRANSITION = "BATTLE_TRANSITION";
const STATE_BATTLE = "BATTLE";
const STATE_GAME_OVER = "GAME_OVER";

const BATTLE_MENU_MAIN = "BATTLE_MAIN";
const BATTLE_MENU_FIGHT = "BATTLE_FIGHT";
const BATTLE_MENU_BAG = "BATTLE_BAG";

let gameState = STATE_PLAYING;

const menuOptions = ["Inventário", "Companheiros", "Sair"];
let selectedIndex = 0;
let subSelectedIndex = 0;

let battleState = BATTLE_MENU_MAIN;
let battleSelectedIndex = 0;
let battleSubIndex = 0;
let battleBagIndex = 0;
let currentEnemy = null;
let battleLog = "Um inimigo apareceu!";
let isPlayerTurn = true;
let battleFinished = false;

let inventory = [];
let companions = [];
let companionPickups = [];
let itemPickups = [];
let doors = [];
let enemies = [];
let currentLevel = 1;

let mainCharacter;
let obstacles = [];