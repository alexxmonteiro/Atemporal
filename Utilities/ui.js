const HUD_BAR = Object.freeze({ x: 20, y: 20, w: 200, h: 20 });

const BATTLE_PANEL_COLORS = Object.freeze({
  info: [45, 45, 65],
  log: [25, 25, 35],
  menu: [35, 35, 50],
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

function drawHud() {
  const stats = mainCharacter.getStats();
  const { x, y, w, h } = HUD_BAR;

  noStroke();
  drawBar(x, y, w, h, mainCharacter.displayHp / stats.maxHp, [0, 255, 0]);

  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(`HP: ${mainCharacter.displayHp} / ${stats.maxHp}`, x + 10, y + h / 2);
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
  text("Jogador", 70, height - 245);

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
      [menuOption("Atacar"), menuOption("Bolsa")],
      battle.selectedIndex,
      "W/S: Navegar | ENTER: Selecionar"
    );
  } else if (battle.state === BattleMenu.FIGHT) {
    drawBattleOptionList(
      [
        menuOption("Ataque Forte (-15 HP, Risco)"),
        menuOption("Ataque Fraco (Seguro)"),
      ],
      battle.subIndex,
      "W/S: Mudar | ENTER: Atacar | ESC: Voltar"
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
  text(`> ${item.name} (${item.effectType}: +${item.effectValue})`, width - 350, height - 110);

  fill(150);
  textSize(11);
  text("W/S: Navegar | ENTER: Usar | ESC: Voltar", width - 350, height - 50);
}

function drawMenuOverlay() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(40);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 240, height / 2 - 200, 480, 400, 10);
  noStroke();

  textAlign(CENTER, CENTER);

  if (gameState === GameState.MENU_MAIN) {
    drawMainMenu();
  } else if (gameState === GameState.INVENTORY || gameState === GameState.COMPANIONS) {
    drawListMenu();
  }
}

function drawMainMenu() {
  const stats = mainCharacter.getStats();

  fill(255);
  textSize(22);
  text("MENU DE OPÇÕES", width / 2, height / 2 - 150);

  textSize(13);
  fill(200);
  text(
    `HP: ${mainCharacter.hp}/${stats.maxHp} | ATK: ${stats.attack} | SORTE: ${stats.luck}`,
    width / 2,
    height / 2 - 110
  );

  MENU_OPTIONS.forEach((option, i) => {
    const y = height / 2 - 30 + i * 50;
    if (i === menu.selectedIndex) {
      fill(COLORS.highlight);
      textSize(20);
      text(`> ${option} <`, width / 2, y);
    } else {
      fill(200);
      textSize(18);
      text(option, width / 2, y);
    }
  });

  fill(150);
  textSize(12);
  text("W/S: Navegar | ENTER: Confirmar", width / 2, height / 2 + 160);
}

function formatListEntryDetails(entry, isInventory) {
  if (isInventory) {
    return ` (${entry.effectType}: +${entry.effectValue})`;
  }

  const status = entry.equipped ? " [EQUIPADO]" : "";
  return ` (ATK: ${formatSigned(entry.attackBonus)}, HP: +${entry.hpBonus}, SORTE: ${formatSigned(entry.luckBonus)})${status}`;
}

function drawListMenu() {
  const isInventory = gameState === GameState.INVENTORY;
  const title = isInventory ? "INVENTÁRIO (USO ÚNICO)" : "COMPANHEIROS";
  const list = isInventory ? inventory : companions;
  const hint = isInventory
    ? "ENTER: Usar Item | ESC: Voltar"
    : "ENTER: Equipar/Desequipar | ESC: Voltar";

  fill(255);
  textSize(20);
  text(title, width / 2, height / 2 - 150);

  list.forEach((entry, i) => {
    const y = height / 2 - 70 + i * 45;
    const label = entry.name + formatListEntryDetails(entry, isInventory);

    if (i === menu.subIndex) {
      fill(COLORS.highlight);
      textSize(15);
      text(`> ${label} <`, width / 2, y);
    } else {
      fill(200);
      textSize(14);
      text(label, width / 2, y);
    }
  });

  if (list.length === 0) {
    fill(150);
    textSize(16);
    text("Vazio", width / 2, height / 2);
  }

  fill(150);
  textSize(12);
  text(hint, width / 2, height / 2 + 160);
}