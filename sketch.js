function setup() {
  createCanvas(windowWidth, windowHeight);
  mainCharacter = new MainCharacter(100, 100);
  setupLevel(1);
}

function setupLevel(level) {
  obstacles = [];
  companionPickups = [];
  itemPickups = [];
  doors = [];
  enemies = [];

  if (level === 1) {
    obstacles.push(new Obstacle(300, 200, 150, 40));
    obstacles.push(new Obstacle(500, 350, 50, 200));

    companionPickups.push(new CompanionPickup(250, 150, "Miséria", 10, 0, -5));
    companionPickups.push(new CompanionPickup(450, 400, "Faísca", -2, 60, 2));

    itemPickups.push(new ItemPickup(200, 300, "Poção de Vida", "heal", 50));

    doors.push(new Door(700, 150, 40, 60));

    enemies.push(new Enemy(500, 150, 'DOWN'));
  } else if (level === 2) {
    obstacles.push(new Obstacle(200, 200, 300, 30));

    doors.push(new Door(650, 400, 40, 60));

    enemies.push(new Enemy(200, 400, 'RIGHT'));
  }

  mainCharacter.isFrozen = false;
  gameState = STATE_PLAYING;
}

function resetGameToStart() {
  currentLevel = 1;
  mainCharacter.posX = 100;
  mainCharacter.posY = 100;
  mainCharacter.vx = 0;
  mainCharacter.vy = 0;
  mainCharacter.hp = mainCharacter.maxHp;
  inventory = [];
  companions = [];
  setupLevel(currentLevel);
}

function nextLevel() {
  currentLevel++;
  if (currentLevel > 2) {
    currentLevel = 1;
  }

  mainCharacter.posX = 100;
  mainCharacter.posY = 100;
  mainCharacter.vx = 0;
  mainCharacter.vy = 0;

  setupLevel(currentLevel);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#ffffff");

  let stats = mainCharacter.getStats();
  let barWidth = 200;
  let barHeight = 20;
  let barX = 20;
  let barY = 20;

  fill(100, 100, 100);
  noStroke();
  rect(barX, barY, barWidth, barHeight, 5);

  let hpPercent = Math.max(0, mainCharacter.hp) / stats.maxHp;
  fill(0, 255, 0);
  rect(barX, barY, barWidth * hpPercent, barHeight, 5);

  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(`HP: ${Math.max(0, mainCharacter.hp)} / ${stats.maxHp}`, barX + 10, barY + barHeight / 2);

  for (let obs of obstacles) {
    obs.draw();
  }

  if (gameState === STATE_PLAYING) {
    mainCharacter.move(obstacles);
  }

  for (let enemy of enemies) {
    if (gameState === STATE_PLAYING) {
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
    enemy.draw();
  }

  for (let door of doors) {
    door.draw();
    if (gameState === STATE_PLAYING && door.checkInteraction(mainCharacter)) {
      door.drawPrompt();
    }
  }

  for (let pickup of companionPickups) {
    if (!pickup.collected) {
      pickup.draw();
      if (gameState === STATE_PLAYING && pickup.checkCollision(mainCharacter)) {
        pickup.drawPrompt();
      }
    }
  }

  for (let pickup of itemPickups) {
    if (!pickup.collected) {
      pickup.draw();
      if (gameState === STATE_PLAYING && pickup.checkCollision(mainCharacter)) {
        pickup.drawPrompt();
      }
    }
  }

  mainCharacter.draw();

  if (gameState !== STATE_PLAYING) {
    if (gameState === STATE_BATTLE_TRANSITION) {
      fill(0);
      rect(0, 0, width, height);
    } else if (gameState === STATE_BATTLE) {
      drawBattleScreen();
    } else if (gameState === STATE_GAME_OVER) {
      drawGameOverScreen();
    } else {
      drawMenuOverlay();
    }
  }
}