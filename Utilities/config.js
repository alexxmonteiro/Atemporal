const STATE_PLAYING = "PLAYING";
const STATE_MENU_MAIN = "MENU_MAIN";
const STATE_INVENTORY = "INVENTORY";
const STATE_COMPANIONS = "COMPANIONS";

let gameState = STATE_PLAYING;

const menuOptions = ["Inventário", "Companheiros", "Sair"];
let selectedIndex = 0;
let subSelectedIndex = 0;

let inventory = [];
let companions = [];
let companionPickups = [];
let itemPickups = [];

let mainCharacter;
let obstacles = [];