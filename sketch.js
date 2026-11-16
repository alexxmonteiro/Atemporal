function setup() {
  createCanvas(windowWidth, windowHeight);
  mainCharacter = new MainCharacter(PLAYER_START.x, PLAYER_START.y);
  gameCamera = new Camera(CAMERA_SMOOTHING);
  setupLevel(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createSection(zone, obstacleRects) {
  return {
    zone,
    visibleObstacles: clipRectsToZone(obstacleRects, zone).map(
      r => new Obstacle(r.x, r.y, r.w, r.h)
    ),
    solidRects: clipRectsToZone(obstacleRects, zone, SECTION_COLLISION_MARGIN),
    companionPickups: [],
    itemPickups: [],
    doors: [],
    enemies: [],
  };
}

function findSectionIndex(x, y) {
  return levelSections.findIndex(section => zoneContainsPoint(section.zone, x, y));
}

function sectionIndexOf(point) {
  return Math.max(0, findSectionIndex(point.x, point.y));
}

function placeDoor(door) {
  if (door.link) {
    for (const index of door.link) levelSections[index].doors.push(door);
    return;
  }

  levelSections[sectionIndexOf(boxCenter(door))].doors.push(door);
}

function rebuildCollisionBodies() {
  collisionBodies = [
    ...levelSections[currentSection].solidRects,
    ...doors.filter(door => door.isSolid),
  ];
}

function activateSection(index) {
  const section = levelSections[index];

  currentSection = index;
  obstacles = section.visibleObstacles;
  companionPickups = section.companionPickups.filter(pickup => !pickup.collected);
  itemPickups = section.itemPickups.filter(pickup => !pickup.collected);
  enemies = section.enemies.filter(enemy => !enemy.defeated);
  doors = section.doors;

  rebuildCollisionBodies();
}

function setupLevel(level) {
  const data = LEVELS[level - 1] || scaleLevel({});

  levelSections = data.sections.map(zone => createSection(zone, data.obstacles));

  for (const c of data.companions) {
    const pickup = new CompanionPickup(c.x, c.y, c.name, c.attackBonus, c.hpBonus, c.luckBonus);
    levelSections[sectionIndexOf(boxCenter(pickup))].companionPickups.push(pickup);
  }

  for (const i of data.items) {
    if (i.effectType === ItemEffect.KEY && unlockedLocks.has(i.lockId)) continue;
    const pickup = new ItemPickup(i.x, i.y, i.name, i.effectType, i.effectValue, i.lockId);
    levelSections[sectionIndexOf(boxCenter(pickup))].itemPickups.push(pickup);
  }

  for (const d of data.doors) {
    const door = new Door(d.x, d.y, d.w, d.h, d.type, d.direction, {
      link: d.link,
      lockId: d.lockId,
    });
    if (door.type === DoorType.LOCKED && unlockedLocks.has(door.lockId)) door.unlock();
    placeDoor(door);
  }

  for (const e of data.enemies) {
    const enemy = new Enemy(e.x, e.y, e.name, e.maxHp, e.direction);
    levelSections[sectionIndexOf(boxCenter(enemy))].enemies.push(enemy);
  }

  mainCharacter.isFrozen = false;
  activateSection(sectionIndexOf(mainCharacter.center));
  gameCamera.snapTo(mainCharacter);
  gameState = GameState.PLAYING;
}

function resetGameToStart() {
  currentLevel = 1;
  mainCharacter.resetPosition(PLAYER_START.x, PLAYER_START.y);
  mainCharacter.hp = mainCharacter.maxHp;
  inventory = [];
  companions = [];
  unlockedLocks.clear();
  notice.expiresAt = 0;
  setupLevel(currentLevel);
}

function findReturnSpawn(levelIndex) {
  const exit = (LEVELS[levelIndex].doors || []).find(
    door => door.returnSpawn && door.direction !== DoorDirection.PREVIOUS
  );
  return exit ? exit.returnSpawn : PLAYER_START;
}

function changeLevel(direction) {
  const isGoingBack = direction === DoorDirection.PREVIOUS;
  let targetLevel = isGoingBack ? currentLevel - 1 : currentLevel + 1;

  if (targetLevel < 1) return;
  if (targetLevel > LEVELS.length) targetLevel = 1;

  const spawn = isGoingBack ? findReturnSpawn(targetLevel - 1) : PLAYER_START;

  currentLevel = targetLevel;
  mainCharacter.resetPosition(spawn.x, spawn.y);
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

function checkTriggerDoors() {
  const door = doors.find(d => !d.isSectionLink && d.checkTrigger(mainCharacter));
  if (door) changeLevel(door.direction);
}

function checkSectionTransitions() {
  const door = doors.find(d => d.isSectionLink && d.checkTrigger(mainCharacter));
  if (!door) return;

  const center = mainCharacter.center;
  const target = door.link.find(index =>
    zoneContainsPoint(levelSections[index].zone, center.x, center.y)
  );

  if (target !== undefined && target !== currentSection) activateSection(target);
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
    mainCharacter.move(collisionBodies);
    checkTriggerDoors();
    checkSectionTransitions();
  }

  gameCamera.follow(mainCharacter);

  push();
  gameCamera.apply();
  noStroke();
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
  drawNotice();
}