const HUD_BAR = Object.freeze({ x: 20, y: 20, w: 200, h: 20 });

const BATTLE_PANEL_COLORS = Object.freeze({
  info: [45, 45, 65],
  log: [25, 25, 35],
  menu: [35, 35, 50],
});

const MENU_TEXT = Object.freeze({
  title: "4TEMP<>RAL;",
  main: "EQUIPS",
  inventory: "SUPRIMENTOS",
  companions: "COMPANHEIROS",
  empty: "Vazio",
});

const MENU_STATS_LABELS = Object.freeze({
  level: "LVL",
  exp: "EXP",
  hp: "LFP",
  attack: "ATK",
  luck: "LUK",
});

const MENU_LAYOUT = Object.freeze({
  referenceHeight: 854,
  overlayAlpha: 128,
  marginX: 48,
  title: { y: 210, size: 68 },
  subtitle: { y: 310, size: 56 },
  stats: { y: 367, size: 22 },
  options: { y: 463, step: 92, size: 56, selectedSize: 56 },
  list: { y: 463, step: 56, size: 30, selectedSize: 32 },
  hint: { bottom: 40, size: 18 },
});

function drawBar(x, y, w, h, percent, color) {
  fill(100);
  rect(x, y, w, h, 5);
  fill(...color);
  rect(x, y, w * percent, h, 5);
}

function drawBattlePanel(x, y, w, h, color) {
  fill(...color);
  stroke(200);
  strokeWeight(2);
  rect(x, y, w, h, 10);
  noStroke();
}

function menuOption(label, idleLabel = label) {
  return { selected: `> ${label}`, idle: `  ${idleLabel}` };
}

function isMenuState() {
  return (
    gameState === GameState.MENU_MAIN ||
    gameState === GameState.INVENTORY ||
    gameState === GameState.COMPANIONS
  );
}

function updateMenuSlide() {
  const step = deltaTime / MENU_SLIDE.durationMs;
  const next = menuSlide.progress + (isMenuState() ? step : -step);

  menuSlide.progress = Math.min(1, Math.max(0, next));
  menuSlide.eased = 1 - Math.pow(1 - menuSlide.progress, 3);
}

function menuWorldOffset() {
  return width * MENU_SLIDE.offsetRatio * menuSlide.eased;
}

function drawMenuDim() {
  if (menuSlide.eased <= 0) return;

  push();
  noStroke();
  fill(0, 0, 0, MENU_LAYOUT.overlayAlpha * menuSlide.eased);
  rect(0, 0, width, height);
  pop();
}

function drawHud() {
  if (isMenuState()) return;

  const stats = mainCharacter.getStats();
  const { x, y, w, h } = HUD_BAR;

  noStroke();
  drawBar(x, y, w, h, mainCharacter.displayHp / stats.maxHp, [0, 255, 0]);

  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(`HP: ${mainCharacter.displayHp} / ${stats.maxHp}`, x + 10, y + h / 2);

  const expY = y + h + 8;
  const expH = 14;

  drawBar(x, expY, w, expH, mainCharacter.expProgress, [255, 200, 0]);

  fill(0);
  textSize(11);
  textAlign(LEFT, CENTER);
  text(
    `NV ${mainCharacter.level}  |  EXP: ${mainCharacter.exp} / ${mainCharacter.expToNext}`,
    x + 10,
    expY + expH / 2
  );
}

function drawNotice() {
  if (
    gameState === GameState.BATTLE ||
    gameState === GameState.GAME_OVER ||
    gameState === GameState.BATTLE_TRANSITION
  ) {
    return;
  }

  if (millis() >= notice.expiresAt) return;

  push();
  textSize(16);
  textAlign(CENTER, CENTER);

  const boxWidth = textWidth(notice.text) + 40;

  fill(0, 0, 0, 200);
  stroke(COLORS.highlight);
  strokeWeight(2);
  rect(width / 2 - boxWidth / 2, height - 90, boxWidth, 44, 8);

  noStroke();
  fill(255);
  text(notice.text, width / 2, height - 68);
  pop();
}

function drawGameOverScreen() {
  background(0);

  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Você Morreu!", width / 2, height / 2 - 40);

  fill(255);
  textSize(20);
  text("Aperte R para reviver", width / 2, height / 2 + 30);
}

function drawBattleScreen() {
  background(20, 20, 35);
  drawBattleEnemySprite();
  drawBattleEnemyPanel();
  drawBattlePlayerPanel();
  drawBattleLog();
  drawBattleMenuPanel();
}

function drawBattleEnemySprite() {
  fill(COLORS.enemy);
  noStroke();
  rect(width / 2 - 40, height / 2 - 90, 80, 80, 10);

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(battle.enemy.name, width / 2, height / 2 - 115);
}

function drawBattleEnemyPanel() {
  const enemy = battle.enemy;
  const hp = Math.max(0, enemy.hp);

  drawBattlePanel(width - 400, 40, 350, 110, BATTLE_PANEL_COLORS.info);

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(enemy.name, width - 380, 55);

  textSize(14);
  text(`HP: ${hp} / ${enemy.maxHp}`, width - 380, 85);

  drawBar(width - 380, 110, 300, 15, hp / enemy.maxHp, [0, 220, 100]);
}

function drawBattlePlayerPanel() {
  const stats = mainCharacter.getStats();

  drawBattlePanel(50, height - 260, 350, 110, BATTLE_PANEL_COLORS.info);

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Jogador  NV ${mainCharacter.level}`, 70, height - 245);

  textSize(14);
  text(`HP: ${mainCharacter.displayHp} / ${stats.maxHp}  |  SORTE: ${stats.luck}`, 70, height - 215);

  drawBar(70, height - 190, 300, 15, mainCharacter.displayHp / stats.maxHp, [0, 150, 255]);
}

function drawBattleLog() {
  drawBattlePanel(50, height - 130, width - 450, 90, BATTLE_PANEL_COLORS.log);

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(battle.log, 70, height - 110);
}

function drawBattleMenuPanel() {
  const centerX = width - 380 + 165;
  const centerY = height - 130 + 45;

  drawBattlePanel(width - 380, height - 130, 330, 90, BATTLE_PANEL_COLORS.menu);
  textSize(18);

  if (battle.finished) {
    fill(255, 200, 0);
    textAlign(CENTER, CENTER);
    text("Pressione ENTER para continuar", centerX, centerY);
  } else if (!battle.isPlayerTurn) {
    fill(200, 200, 200);
    textAlign(CENTER, CENTER);
    text("Turno do Inimigo...", centerX, centerY);
  } else {
    textAlign(LEFT, TOP);
    drawBattleMenuOptions();
  }
}

function drawBattleOptionList(options, selectedIndex, hint) {
  options.forEach((option, i) => {
    const isSelected = i === selectedIndex;
    fill(isSelected ? COLORS.highlight : 255);
    text(isSelected ? option.selected : option.idle, width - 350, height - 110 + i * 30);
  });

  fill(150);
  textSize(11);
  text(hint, width - 350, height - 50);
}

function drawBattleMenuOptions() {
  if (battle.state === BattleMenu.MAIN) {
    drawBattleOptionList(
      [menuOption("Atacar"), menuOption("Suprimentos")],
      battle.selectedIndex,
      "W/S: Navegar  ENTER: Selecionar"
    );
  } else if (battle.state === BattleMenu.FIGHT) {
    drawBattleOptionList(
      [
        menuOption("Ataque Forte (Arriscado)"),
        menuOption("Ataque Fraco (Seguro)"),
      ],
      battle.subIndex,
      "W/S: Mudar  ENTER: Atacar  ESC: Voltar"
    );
  } else if (battle.state === BattleMenu.BAG) {
    drawBattleBag();
  }
}

function drawBattleBag() {
  if (inventory.length === 0) {
    fill(255);
    textSize(16);
    text("A bolsa está vazia!", width - 350, height - 110);
    return;
  }

  const item = inventory[battle.bagIndex];

  fill(COLORS.highlight);
  text(`> ${item.name}${formatItemDetails(item)}`, width - 350, height - 110);

  fill(150);
  textSize(11);
  text("W/S: Navegar  ENTER: Usar  ESC: Voltar", width - 350, height - 50);
}

function menuScale() {
  return height / MENU_LAYOUT.referenceHeight;
}

function drawMenuOverlay() {
  push();
  noStroke();
  textAlign(LEFT, CENTER);

  if (gameState === GameState.MENU_MAIN) {
    drawMainMenu();
  } else if (gameState === GameState.INVENTORY || gameState === GameState.COMPANIONS) {
    drawListMenu();
  }
  pop();
}

function drawMenuHeader(subtitle) {
  const scale = menuScale();
  const x = MENU_LAYOUT.marginX * scale;
  const stats = mainCharacter.getStats();
  const labels = MENU_STATS_LABELS;

  fill(COLORS.highlight);
  textSize(MENU_LAYOUT.title.size * scale);
  text(MENU_TEXT.title, x, MENU_LAYOUT.title.y * scale);

  fill(255);
  textSize(MENU_LAYOUT.subtitle.size * scale);
  text(subtitle, x, MENU_LAYOUT.subtitle.y * scale);

  textSize(MENU_LAYOUT.stats.size * scale);
  text(
    `${labels.level}: ${mainCharacter.level}  ` +
      `${labels.exp}: ${mainCharacter.exp}/${mainCharacter.expToNext}  ` +
      `${labels.hp}: ${mainCharacter.displayHp}/${stats.maxHp}  ` +
      `${labels.attack}: ${stats.attack}  ` +
      `${labels.luck}: ${stats.luck}`,
    x,
    MENU_LAYOUT.stats.y * scale
  );
}

function drawMenuHint(hint) {
  const scale = menuScale();

  fill(200);
  textSize(MENU_LAYOUT.hint.size * scale);
  text(hint, MENU_LAYOUT.marginX * scale, height - MENU_LAYOUT.hint.bottom * scale);
}

function drawMenuEntries(labels, selectedIndex, layout) {
  const scale = menuScale();
  const x = MENU_LAYOUT.marginX * scale;

  labels.forEach((label, i) => {
    const y = (layout.y + i * layout.step) * scale;

    if (i === selectedIndex) {
      fill(COLORS.highlight);
      textSize(layout.selectedSize * scale);
      text(`> ${label} <`, x, y);
    } else {
      fill(255);
      textSize(layout.size * scale);
      text(label, x, y);
    }
  });
}

function drawMainMenu() {
  drawMenuHeader(MENU_TEXT.main);
  drawMenuEntries(MENU_OPTIONS, menu.selectedIndex, MENU_LAYOUT.options);
  drawMenuHint("W/S: Navegar  ENTER: Confirmar");
}

function formatListEntryDetails(entry, isInventory) {
  if (isInventory) {
    return formatItemDetails(entry);
  }

  const status = entry.equipped ? " [EQUIPADO]" : "";
  return ` (ATK: ${formatSigned(entry.attackBonus)}, HP: +${entry.hpBonus}, SORTE: ${formatSigned(entry.luckBonus)})${status}`;
}

function drawListMenu() {
  const isInventory = gameState === GameState.INVENTORY;
  const list = isInventory ? inventory : companions;
  const subtitle = isInventory ? MENU_TEXT.inventory : MENU_TEXT.companions;
  const hint = isInventory
    ? "ENTER: Usar Item | ESC: Voltar"
    : "ENTER: Equipar/Desequipar | ESC: Voltar";

  drawMenuHeader(subtitle);

  if (list.length === 0) {
    const scale = menuScale();

    fill(200);
    textSize(MENU_LAYOUT.list.selectedSize * scale);
    text(MENU_TEXT.empty, MENU_LAYOUT.marginX * scale, MENU_LAYOUT.list.y * scale);
  } else {
    const labels = list.map(entry => entry.name + formatListEntryDetails(entry, isInventory));
    drawMenuEntries(labels, menu.subIndex, MENU_LAYOUT.list);
  }

  drawMenuHint(hint);
}