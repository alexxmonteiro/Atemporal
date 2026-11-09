function setup() {
  createCanvas(windowWidth, windowHeight);
  mainCharacter = new MainCharacter(PLAYER_START.x, PLAYER_START.y);
  gameCamera = new Camera(CAMERA_SMOOTHING);
  setupLevel(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setupLevel(level) {
  const data = LEVELS[level - 1] || {};

  obstacles = (data.obstacles || []).map(o => new Obstacle(o.x, o.y, o.w, o.h));
  companionPickups = (data.companions || []).map(
    c => new CompanionPickup(c.x, c.y, c.name, c.attackBonus, c.hpBonus, c.luckBonus)
  );
  itemPickups = (data.items || []).map(
    i => new ItemPickup(i.x, i.y, i.name, i.effectType, i.effectValue)
  );
  doors = (data.doors || []).map(d => new Door(d.x, d.y, d.w, d.h));
  enemies = (data.enemies || []).map(
    e => new Enemy(e.x, e.y, e.name, e.maxHp, e.direction)
  );

  mainCharacter.isFrozen = false;
  gameCamera.snapTo(mainCharacter);
  gameState = GameState.PLAYING;
}

function resetGameToStart() {
  currentLevel = 1;
  mainCharacter.resetPosition(PLAYER_START.x, PLAYER_START.y);
  mainCharacter.hp = mainCharacter.maxHp;
  inventory = [];
  companions = [];
  setupLevel(currentLevel);
}

function nextLevel() {
  currentLevel++;
  if (currentLevel > LEVELS.length) {
    currentLevel = 1;
  }

  mainCharacter.resetPosition(PLAYER_START.x, PLAYER_START.y);
  setupLevel(currentLevel);
}

function updateEnemy(enemy) {
  enemy.update(mainCharacter);

  if (enemy.checkVision(mainCharacter)) {
    mainCharacter.isFrozen = true;
  }

  if (enemy.checkCollision(mainCharacter)) {
    mainCharacter.isFrozen = true;
    enemy.defeated = true;
    startBattle(enemy);
  }
}

function updateAndDrawEnemies() {
  for (const enemy of enemies) {
    if (gameState === GameState.PLAYING) updateEnemy(enemy);
    enemy.draw();
  }
}

function drawDoors() {
  for (const door of doors) {
    door.draw();
    if (gameState === GameState.PLAYING && door.checkInteraction(mainCharacter)) {
      door.drawPrompt();
    }
  }
}

function drawPickups(pickups) {
  for (const pickup of pickups) {
    if (pickup.collected) continue;
    pickup.draw();
    if (gameState === GameState.PLAYING && pickup.checkCollision(mainCharacter)) {
      pickup.drawPrompt();
    }
  }
}

function drawStateOverlay() {
  if (gameState === GameState.PLAYING) return;

  if (gameState === GameState.BATTLE_TRANSITION) {
    fill(0);
    rect(0, 0, width, height);
  } else if (gameState === GameState.BATTLE) {
    drawBattleScreen();
  } else if (gameState === GameState.GAME_OVER) {
    drawGameOverScreen();
  } else {
    drawMenuOverlay();
  }
}

function draw() {
  background("#ffffff");

  if (gameState === GameState.PLAYING) {
    mainCharacter.move(obstacles);
  }

  gameCamera.follow(mainCharacter);

  push();
  gameCamera.apply();
  for (const obstacle of obstacles) {
    obstacle.draw();
  }
  updateAndDrawEnemies();
  drawDoors();
  drawPickups(companionPickups);
  drawPickups(itemPickups);
  mainCharacter.draw();
  pop();

  drawHud();
  drawStateOverlay();
}