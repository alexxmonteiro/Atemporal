const GAME_OVER_TIMING = Object.freeze({
  deadFps: 8,
  retryFps: 4,
  titleDelayMs: 900,
  secondaryDelayMs: 300,
  retryHoldMs: 900,
  fadeMs: 600,
});

const GAME_OVER_TEXT = Object.freeze({
  title: "GAME OVER",
  promptBefore: "aperte",
  promptKey: " 'R' ",
  promptAfter: "  para tentar de novo",
  secondary: "NÃO EXISTE fuga na morte",
});

const GAME_OVER_REFERENCE = Object.freeze({ width: 1568, height: 711 });

const GAME_OVER_DEFAULT_BOUNDS = Object.freeze({ x: 0.25, y: 0.25, w: 0.5, h: 0.5 });

const gameOverAssets = {
  dead: null,
  retry: null,
};

const gameOverRuntime = {
  startedAt: 0,
  lastDrawFrame: -10,
  retrying: false,
  retryStartedAt: 0,
  bounds: null,
};

async function loadGameOverAssets() {
  try {
    gameOverAssets.dead = await loadImage("../assets/sprites/dead-sprite.png");
  } catch (error) {
    gameOverAssets.dead = null;
  }

  try {
    gameOverAssets.retry = await loadImage("../assets/sprites/dead-sprite-retry.png");
  } catch (error) {
    gameOverAssets.retry = null;
  }

  gameOverRuntime.bounds = null;
}

function requestGameOverRetry() {
  if (gameState !== GameState.GAME_OVER || gameOverRuntime.retrying) return;
  gameOverRuntime.retrying = true;
  gameOverRuntime.retryStartedAt = millis();
}

function gameOverFrameCount(sheet) {
  return Math.max(1, Math.round(sheet.width / sheet.height));
}

function gameOverFade(elapsed, delay) {
  return constrain((elapsed - delay) / GAME_OVER_TIMING.fadeMs, 0, 1) * 255;
}

function gameOverRetryDuration() {
  const retry = gameOverAssets.retry;
  const animationMs = retry
    ? (gameOverFrameCount(retry) / GAME_OVER_TIMING.retryFps) * 1000
    : 0;
  return animationMs + GAME_OVER_TIMING.retryHoldMs;
}

function measureSheetBounds(sheet) {
  const frameSize = sheet.height;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  sheet.loadPixels();

  for (let y = 0; y < sheet.height; y++) {
    for (let x = 0; x < sheet.width; x++) {
      const i = (y * sheet.width + x) * 4;
      const alpha = sheet.pixels[i + 3];
      const brightness = sheet.pixels[i] + sheet.pixels[i + 1] + sheet.pixels[i + 2];

      if (alpha > 10 && brightness > 60) {
        const fx = x % frameSize;
        if (fx < minX) minX = fx;
        if (fx > maxX) maxX = fx;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX === Infinity) return null;

  return {
    left: minX / frameSize,
    top: minY / frameSize,
    right: (maxX + 1) / frameSize,
    bottom: (maxY + 1) / frameSize,
  };
}

function getGameOverBounds() {
  if (gameOverRuntime.bounds) return gameOverRuntime.bounds;

  const measured = [gameOverAssets.dead, gameOverAssets.retry]
    .filter(sheet => sheet)
    .map(measureSheetBounds)
    .filter(bounds => bounds);

  if (measured.length === 0) {
    gameOverRuntime.bounds = GAME_OVER_DEFAULT_BOUNDS;
    return gameOverRuntime.bounds;
  }

  const left = Math.min(...measured.map(b => b.left));
  const top = Math.min(...measured.map(b => b.top));
  const right = Math.max(...measured.map(b => b.right));
  const bottom = Math.max(...measured.map(b => b.bottom));

  gameOverRuntime.bounds = { x: left, y: top, w: right - left, h: bottom - top };
  return gameOverRuntime.bounds;
}

function drawSheetFrame(sheet, frameIndex, centerX, centerY, size) {
  const frameSize = sheet.height;
  const count = gameOverFrameCount(sheet);
  const index = constrain(frameIndex, 0, count - 1);

  imageMode(CENTER);
  image(
    sheet,
    centerX,
    centerY,
    size,
    size,
    index * frameSize,
    0,
    frameSize,
    frameSize
  );
}

function drawGameOverSkull(elapsed, retryElapsed, centerX, centerY, size) {
  const dead = gameOverAssets.dead;
  const retry = gameOverAssets.retry;

  if (gameOverRuntime.retrying && retry) {
    const retryFrame = Math.floor((retryElapsed / 1000) * GAME_OVER_TIMING.retryFps);
    drawSheetFrame(retry, retryFrame, centerX, centerY, size);
    return;
  }

  if (dead) {
    const deadFrame = Math.floor((elapsed / 1000) * GAME_OVER_TIMING.deadFps);
    drawSheetFrame(dead, deadFrame, centerX, centerY, size);
  }
}

function drawGameOverPrompt(centerX, centerY, alpha) {
  const parts = [
    { text: GAME_OVER_TEXT.promptBefore, color: [255, 255, 255] },
    { text: GAME_OVER_TEXT.promptKey, color: [255, 204, 0] },
    { text: GAME_OVER_TEXT.promptAfter, color: [255, 255, 255] },
  ];

  const widths = parts.map(part => textWidth(part.text));
  const totalWidth = widths.reduce((sum, w) => sum + w, 0);
  let cursor = centerX - totalWidth / 2;

  textAlign(LEFT, CENTER);
  parts.forEach((part, i) => {
    fill(part.color[0], part.color[1], part.color[2], alpha);
    text(part.text, cursor, centerY);
    cursor += widths[i];
  });
}

function drawGameOverScreen() {
  if (frameCount - gameOverRuntime.lastDrawFrame > 1) {
    gameOverRuntime.startedAt = millis();
    gameOverRuntime.retrying = false;
  }
  gameOverRuntime.lastDrawFrame = frameCount;

  const now = millis();
  const elapsed = now - gameOverRuntime.startedAt;
  const retryElapsed = gameOverRuntime.retrying
    ? now - gameOverRuntime.retryStartedAt
    : 0;

  const scale = Math.min(
    width / GAME_OVER_REFERENCE.width,
    height / GAME_OVER_REFERENCE.height
  );

  const bounds = getGameOverBounds();
  const frameDrawSize = 420 * scale;
  const skullVisibleHeight = bounds.h * frameDrawSize;

  const titleSize = 64 * scale;
  const promptSize = 28 * scale;
  const secondarySize = 28 * scale;

  const gapSkullTitle = 14 * scale;
  const gapTitlePrompt = 22 * scale;

  const blockHeight =
    skullVisibleHeight +
    gapSkullTitle +
    titleSize +
    gapTitlePrompt +
    promptSize;

  const top = (height - blockHeight) / 2;
  const centerX = width / 2;

  const skullVisibleCenterY = top + skullVisibleHeight / 2;
  const titleCenterY = top + skullVisibleHeight + gapSkullTitle + titleSize / 2;
  const promptCenterY =
    top + skullVisibleHeight + gapSkullTitle + titleSize + gapTitlePrompt + promptSize / 2;
  const secondaryCenterY = (titleCenterY + promptCenterY) / 2;

  const frameCenterX = centerX + (0.5 - (bounds.x + bounds.w / 2)) * frameDrawSize;
  const frameCenterY =
    skullVisibleCenterY + (0.5 - (bounds.y + bounds.h / 2)) * frameDrawSize;

  push();
  noStroke();
  fill(0);
  rectMode(CORNER);
  rect(0, 0, width, height);

  drawingContext.imageSmoothingEnabled = false;
  noSmooth();

  drawGameOverSkull(elapsed, retryElapsed, frameCenterX, frameCenterY, frameDrawSize);

  textFont(FONT_FAMILY);

  if (gameOverRuntime.retrying) {
    const secondaryAlpha = gameOverFade(retryElapsed, GAME_OVER_TIMING.secondaryDelayMs);
    textSize(secondarySize);
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, secondaryAlpha);
    text(GAME_OVER_TEXT.secondary, centerX, secondaryCenterY);
  } else {
    const titleAlpha = gameOverFade(elapsed, GAME_OVER_TIMING.titleDelayMs);

    textSize(titleSize);
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, titleAlpha);
    text(GAME_OVER_TEXT.title, centerX, titleCenterY);

    textSize(promptSize);
    drawGameOverPrompt(centerX, promptCenterY, titleAlpha);
  }

  pop();

  if (gameOverRuntime.retrying && retryElapsed >= gameOverRetryDuration()) {
    gameOverRuntime.retrying = false;
    gameOverRuntime.lastDrawFrame = -10;
    resetGameToStart();
  }
}