const PLAYER_SPRITE_PATH = "../../assets/sprites/main_character/";

const PlayerFacing = Object.freeze({
  DOWN: "DOWN",
  UP: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
});

const PlayerAnimState = Object.freeze({
  IDLE: "IDLE",
  WALK: "WALK",
});

const PLAYER_SPRITE_FILES = Object.freeze({
  icon: "char-icon.png",
  [PlayerAnimState.IDLE]: {
    [PlayerFacing.DOWN]: "char-idle-front.png",
    [PlayerFacing.UP]: "char-idle-back.png",
    [PlayerFacing.LEFT]: "char-idle-left.png",
    [PlayerFacing.RIGHT]: "char-idle-right.png",
  },
  [PlayerAnimState.WALK]: {
    [PlayerFacing.DOWN]: "char-walk.png",
    [PlayerFacing.UP]: "char-walk-back.png",
    [PlayerFacing.LEFT]: "char-walk-left.png",
    [PlayerFacing.RIGHT]: "char-walk-right.png",
  },
});

const PLAYER_ANIMATION = Object.freeze({
  fps: {
    [PlayerAnimState.IDLE]: 4,
    [PlayerAnimState.WALK]: 10,
  },
  drawScale: 2,
  offsetY: 0,
});

const playerSprites = {
  icon: null,
  [PlayerAnimState.IDLE]: {},
  [PlayerAnimState.WALK]: {},
};

async function loadPlayerImage(fileName) {
  try {
    return await loadImage(PLAYER_SPRITE_PATH + fileName);
  } catch (error) {
    console.warn(`[playerSprites] Não foi possível carregar: ${fileName}`);
    return null;
  }
}

async function loadPlayerSprites() {
  playerSprites.icon = await loadPlayerImage(PLAYER_SPRITE_FILES.icon);

  for (const state of Object.values(PlayerAnimState)) {
    for (const facing of Object.values(PlayerFacing)) {
      const fileName = PLAYER_SPRITE_FILES[state][facing];
      playerSprites[state][facing] = await loadPlayerImage(fileName);
    }
  }
}

function playerSheetFrameCount(sheet) {
  return Math.max(1, Math.round(sheet.width / sheet.height));
}

function resolvePlayerSheet(state, facing) {
  const direct = playerSprites[state][facing];
  if (direct) return { sheet: direct, mirror: false };

  if (facing === PlayerFacing.LEFT && playerSprites[state][PlayerFacing.RIGHT]) {
    return { sheet: playerSprites[state][PlayerFacing.RIGHT], mirror: true };
  }
  if (facing === PlayerFacing.RIGHT && playerSprites[state][PlayerFacing.LEFT]) {
    return { sheet: playerSprites[state][PlayerFacing.LEFT], mirror: true };
  }

  if (state === PlayerAnimState.WALK) {
    return resolvePlayerSheet(PlayerAnimState.IDLE, facing);
  }

  return null;
}

class PlayerAnimator {
  constructor() {
    this.state = PlayerAnimState.IDLE;
    this.facing = PlayerFacing.DOWN;
    this.stateStartedAt = 0;
  }

  update(player) {
    const inputX = player.inputX;
    const inputY = player.inputY;
    const isMoving = inputX !== 0 || inputY !== 0;

    let newFacing = this.facing;
    if (inputX < 0) newFacing = PlayerFacing.LEFT;
    else if (inputX > 0) newFacing = PlayerFacing.RIGHT;
    else if (inputY < 0) newFacing = PlayerFacing.UP;
    else if (inputY > 0) newFacing = PlayerFacing.DOWN;

    const newState = isMoving ? PlayerAnimState.WALK : PlayerAnimState.IDLE;

    if (newState !== this.state || newFacing !== this.facing) {
      this.state = newState;
      this.facing = newFacing;
      this.stateStartedAt = millis();
    }
  }

  currentFrame(frameCount) {
    const fps = PLAYER_ANIMATION.fps[this.state];
    const elapsedSeconds = (millis() - this.stateStartedAt) / 1000;
    return Math.floor(elapsedSeconds * fps) % frameCount;
  }

  draw(player) {
    const resolved = resolvePlayerSheet(this.state, this.facing);
    if (!resolved) return false;

    const { sheet, mirror } = resolved;
    const frameSize = sheet.height;
    const frameCount = playerSheetFrameCount(sheet);
    const frameIndex = this.currentFrame(frameCount);

    const drawSize = player.size * PLAYER_ANIMATION.drawScale;

    const anchorX = player.posX + player.size / 2;
    const anchorY = player.posY + player.size + PLAYER_ANIMATION.offsetY;

    push();
    translate(anchorX, anchorY);
    if (mirror) scale(-1, 1);

    noSmooth();
    drawingContext.imageSmoothingEnabled = false;

    imageMode(CORNER);
    image(
      sheet,
      -drawSize / 2, -drawSize,
      drawSize, drawSize,
      frameIndex * frameSize, 0,
      frameSize, frameSize
    );
    pop();

    return true;
  }
}