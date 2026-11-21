const HUD_COLORS = Object.freeze({
  background: "#111827",
  border: "#c9d1db",
  text: "#e8edf5",
  logText: "#aeb8c6",
  viewport: "#ffffff",
});

const HUD_REF = Object.freeze({
  w: 765,
  h: 347,
  game: { x: 73, y: 25, w: 621, h: 240 },
  log: { x: 73, y: 271, w: 458, h: 71 },
  stats: { x: 537, y: 271, w: 157, h: 71 },
  tab: { x: 339, y: 25, w: 98, h: 36, corner: 3 },
  panelRadius: 1.5,
  padX: 4,
  firstLine: 10.5,
  lineStep: 16.5,
  fontSize: 10,
  tabFontSize: 12,
  tabTextY: 13.5,
  cursorBlinkMs: 500,
});

const BATTLE_REF = Object.freeze({
  sprite: { x: 269, y: 75, w: 80, h: 85 },
  enemy: {
    icon: { x: 580, y: 8, size: 33 },
    bar: { x: 365, y: 7, w: 216, h: 19 },
    name: { x: 579, y: 31 },
  },
  player: {
    icon: { x: 200, y: 204, size: 33 },
    bar: { x: 234, y: 219, w: 215, h: 19 },
    name: { x: 236, y: 213 },
  },
  iconInset: 1.5,
  iconRadius: 1,
  barRadius: 1,
  nameFontSize: 8.5,
  menuFontSize: 12,
  hintFontSize: 5.5,
  barTrack: "#6b7280",
  menu: { padX: 8, firstLine: 14, lineStep: 17, hintY: 62, visibleLines: 2 },
  playerName: "Andarilho",
  hint: "W/S Navegar  Enter: Confirmar  ESC: Voltar",
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
  fullscreenScale: 0.75,
  overlayAlpha: 128,
  marginX: 48,
  title: { y: 210, size: 68 },
  subtitle: { y: 310, size: 56 },
  stats: { y: 367, size: 22 },
  options: { y: 463, step: 92, size: 56, selectedSize: 56 },
  list: { y: 463, step: 56, size: 30, selectedSize: 32 },
  hint: { bottom: 40, size: 18 },
});

let battleSprite = null;

function getHudLayout() {
  const scale = Math.max(0.1, Math.min(width / HUD_REF.w, height / HUD_REF.h));
  const originX = (width - HUD_REF.w * scale) / 2;
  const originY = (height - HUD_REF.h * scale) / 2;

  const place = r => {
    const x1 = Math.round(originX + r.x * scale);
    const y1 = Math.round(originY + r.y * scale);
    const x2 = Math.round(originX + (r.x + r.w) * scale);
    const y2 = Math.round(originY + (r.y + r.h) * scale);
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  };

  return {
    scale,
    stroke: Math.max(1, Math.round(scale)),
    game: place(HUD_REF.game),
    log: place(HUD_REF.log),
    stats: place(HUD_REF.stats),
    tab: { ...place(HUD_REF.tab), corner: HUD_REF.tab.corner * scale },
  };
}

function getGameViewport() {
  return getHudLayout().game;
}

function wrapText(content, maxWidth) {
  const lines = [];

  for (const paragraph of String(content).split("\n")) {
    let current = "";

    for (const word of paragraph.split(" ")) {
      const candidate = current ? `${current} ${word}` : word;

      if (textWidth(candidate) <= maxWidth) {
        current = candidate;
        continue;
      }

      if (current) lines.push(current);
      current = word;

      while (textWidth(current) > maxWidth && current.length > 1) {
        let cut = current.length - 1;
        while (cut > 1 && textWidth(current.slice(0, cut)) > maxWidth) cut--;
        lines.push(current.slice(0, cut));
        current = current.slice(cut);
      }
    }

    lines.push(current);
  }

  return lines;
}

function visibleLogLines(maxLines, maxWidth) {
  const result = [];

  for (let i = terminalLog.length - 1; i >= 0 && result.length < maxLines; i--) {
    result.unshift(...wrapText(terminalLog[i], maxWidth));
  }

  return result.slice(-maxLines);
}

function battleLogLines(maxLines, maxWidth) {
  return wrapText(battle.log, maxWidth).slice(-maxLines);
}

function isBattleActive() {
  return gameState === GameState.BATTLE && battle.enemy !== null;
}

function drawHudBackdrop() {
  const view = getGameViewport();

  push();
  noStroke();
  fill(HUD_COLORS.viewport);
  rect(view.x, view.y, view.w, view.h);
  pop();
}

function drawHudPanel(panel, layout) {
  stroke(HUD_COLORS.border);
  strokeWeight(layout.stroke);
  fill(HUD_COLORS.background);
  rect(panel.x, panel.y, panel.w, panel.h, HUD_REF.panelRadius * layout.scale);
}

function drawHudGameBorder(layout) {
  const game = layout.game;

  noFill();
  stroke(HUD_COLORS.border);
  strokeWeight(layout.stroke);
  rect(game.x, game.y, game.w, game.h);
}

function drawHudTab(layout) {
  const { x, y, w, h, corner } = layout.tab;
  const cover = layout.stroke;

  noStroke();
  fill(HUD_COLORS.background);
  beginShape();
  vertex(x, y - cover);
  vertex(x, y + h - corner);
  vertex(x + corner, y + h);
  vertex(x + w - corner, y + h);
  vertex(x + w, y + h - corner);
  vertex(x + w, y - cover);
  endShape(CLOSE);

  noFill();
  stroke(HUD_COLORS.border);
  strokeWeight(layout.stroke);
  strokeJoin(MITER);
  beginShape();
  vertex(x, y);
  vertex(x, y + h - corner);
  vertex(x + corner, y + h);
  vertex(x + w - corner, y + h);
  vertex(x + w, y + h - corner);
  vertex(x + w, y);
  endShape();

  noStroke();
  fill(HUD_COLORS.text);
  textAlign(CENTER, CENTER);
  textSize(HUD_REF.tabFontSize * layout.scale);
  text(`Nivel ${currentLevel}`, x + w / 2, y + HUD_REF.tabTextY * layout.scale);
}

function drawHudLog(layout, getLines = visibleLogLines) {
  const { scale, log } = layout;
  const padX = HUD_REF.padX * scale;
  const x = log.x + padX;
  const firstLineY = log.y + HUD_REF.firstLine * scale;
  const lineStep = HUD_REF.lineStep * scale;
  const maxLines = Math.max(
    1,
    Math.floor(
      (HUD_REF.log.h - HUD_REF.firstLine - HUD_REF.lineStep / 2 - 2) / HUD_REF.lineStep
    ) + 1
  );

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(HUD_REF.fontSize * scale);

  const lines = getLines(maxLines - 1, log.w - padX * 2);

  fill(HUD_COLORS.logText);
  lines.forEach((line, i) => text(line, x, firstLineY + i * lineStep));

  const promptY = firstLineY + lines.length * lineStep;

  fill(HUD_COLORS.text);
  text(">", x, promptY);

  if (Math.floor(millis() / HUD_REF.cursorBlinkMs) % 2 === 0) {
    text("_", x + textWidth(">"), promptY);
  }
}

function drawHudStats(layout) {
  const { scale, stats: panel } = layout;
  const stats = mainCharacter.getStats();
  const x = panel.x + HUD_REF.padX * scale;
  const firstLineY = panel.y + HUD_REF.firstLine * scale;
  const lineStep = HUD_REF.lineStep * scale;
  const lines = [
    `LFP: ${mainCharacter.displayHp}/${stats.maxHp}`,
    `EXP: ${mainCharacter.exp}/${mainCharacter.expToNext}`,
    `LVL: ${mainCharacter.level}`,
  ];

  noStroke();
  fill(HUD_COLORS.text);
  textAlign(LEFT, CENTER);
  textSize(HUD_REF.fontSize * scale);
  lines.forEach((line, i) => text(line, x, firstLineY + i * lineStep));
}

function battleRect(layout, r) {
  return {
    x: layout.game.x + r.x * layout.scale,
    y: layout.game.y + r.y * layout.scale,
    w: (r.w !== undefined ? r.w : r.size) * layout.scale,
    h: (r.h !== undefined ? r.h : r.size) * layout.scale,
  };
}

function drawBattleSprite(layout) {
  const box = battleRect(layout, BATTLE_REF.sprite);

  noStroke();

  if (!battleSprite) {
    fill(255);
    rect(box.x, box.y, box.w, box.h);
    return;
  }

  drawingContext.imageSmoothingEnabled = false;
  image(battleSprite, box.x, box.y, box.w, box.h);
  drawingContext.imageSmoothingEnabled = true;
}

function drawBattleIcon(layout, ref, color) {
  const box = battleRect(layout, ref);
  const inset = BATTLE_REF.iconInset * layout.scale;

  stroke(HUD_COLORS.border);
  strokeWeight(layout.stroke);
  fill(HUD_COLORS.background);
  rect(box.x, box.y, box.w, box.h, BATTLE_REF.iconRadius * layout.scale);

  noStroke();
  fill(color);
  rect(box.x + inset, box.y + inset, box.w - inset * 2, box.h - inset * 2);
}

function drawBattleBar(layout, ref, percent, anchorRight) {
  const box = battleRect(layout, ref);
  const fillWidth = box.w * Math.min(1, Math.max(0, percent));
  const x = anchorRight ? box.x + box.w - fillWidth : box.x;

  noStroke();
  fill(BATTLE_REF.barTrack);
  rect(box.x, box.y, box.w, box.h, BATTLE_REF.barRadius * layout.scale);

  if (fillWidth <= 0) return;

  fill(255);
  rect(x, box.y, fillWidth, box.h, BATTLE_REF.barRadius * layout.scale);
}

function drawBattleName(layout, ref, label, alignment) {
  const x = layout.game.x + ref.x * layout.scale;
  const y = layout.game.y + ref.y * layout.scale;

  noStroke();
  fill(HUD_COLORS.text);
  textAlign(alignment, CENTER);
  textSize(BATTLE_REF.nameFontSize * layout.scale);
  text(label, x, y);
}

function drawBattleArena() {
  const layout = getHudLayout();
  const enemy = battle.enemy;
  const stats = mainCharacter.getStats();

  push();
  noStroke();
  fill(HUD_COLORS.background);
  rect(layout.game.x, layout.game.y, layout.game.w, layout.game.h);

  drawBattleSprite(layout);

  drawBattleBar(layout, BATTLE_REF.enemy.bar, enemy.hp / enemy.maxHp, true);
  drawBattleIcon(layout, BATTLE_REF.enemy.icon, 255);
  drawBattleName(layout, BATTLE_REF.enemy.name, enemy.name, RIGHT);

  drawBattleBar(layout, BATTLE_REF.player.bar, mainCharacter.displayHp / stats.maxHp, false);
  drawBattleIcon(layout, BATTLE_REF.player.icon, COLORS.player);
  drawBattleName(layout, BATTLE_REF.player.name, BATTLE_REF.playerName, LEFT);
  pop();
}

function battleMenuEntries() {
  if (battle.state === BattleMenu.FIGHT) {
    return { labels: ["Ataque Forte", "Ataque Fraco"], selected: battle.subIndex };
  }

  if (battle.state === BattleMenu.BAG) {
    if (inventory.length === 0) return { labels: ["Bolsa vazia"], selected: -1 };
    return { labels: inventory.map(item => item.name), selected: battle.bagIndex };
  }

  return { labels: ["Atacar", "Bolsa"], selected: battle.selectedIndex };
}

function drawBattleMenuPanel(layout) {
  const { scale, stats: panel } = layout;
  const ref = BATTLE_REF.menu;
  const x = panel.x + ref.padX * scale;

  drawHudPanel(panel, layout);
  noStroke();
  textAlign(LEFT, CENTER);

  if (battle.isPlayerTurn && !battle.finished) {
    const { labels, selected } = battleMenuEntries();
    const start = Math.max(
      0,
      Math.min(selected - 1, labels.length - ref.visibleLines)
    );

    textSize(BATTLE_REF.menuFontSize * scale);
    labels.slice(start, start + ref.visibleLines).forEach((label, i) => {
      const isSelected = start + i === selected;
      fill(isSelected ? COLORS.highlight : 255);
      text(
        isSelected ? `> ${label} <` : label,
        x,
        panel.y + (ref.firstLine + i * ref.lineStep) * scale
      );
    });
  }

  if (battle.finished) return;

  const maxHintWidth = panel.w - ref.padX * scale * 2;
  let hintSize = BATTLE_REF.hintFontSize * scale;

  textSize(hintSize);
  while (textWidth(BATTLE_REF.hint) > maxHintWidth && hintSize > 1) {
    hintSize -= 0.25;
    textSize(hintSize);
  }

  fill(HUD_COLORS.text);
  text(BATTLE_REF.hint, x, panel.y + ref.hintY * scale);
}

function drawHudFrame() {
  const layout = getHudLayout();

  push();
  drawHudGameBorder(layout);

  if (isBattleActive()) {
    drawHudPanel(layout.log, layout);
    drawHudLog(layout, battleLogLines);
    drawBattleMenuPanel(layout);
  } else {
    drawHudTab(layout);
    drawHudPanel(layout.log, layout);
    drawHudPanel(layout.stats, layout);
    drawHudLog(layout);
    drawHudStats(layout);
  }

  pop();
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

function isFullscreenWindow() {
  return (
    Math.abs(window.innerWidth - screen.width) <= 2 &&
    Math.abs(window.innerHeight - screen.height) <= 2
  );
}

function menuScale() {
  const base = height / MENU_LAYOUT.referenceHeight;
  return isFullscreenWindow() ? base * MENU_LAYOUT.fullscreenScale : base;
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