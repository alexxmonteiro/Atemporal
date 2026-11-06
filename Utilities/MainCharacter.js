class MainCharacter {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.size = 40;
    this.vx = 0;
    this.vy = 0;
    this.acc = 0.8;
    this.friction = 0.85;
    this.isFrozen = false;

    this.maxHp = 100;
    this.hp = 100;
    this.baseAttack = 10;
    this.baseLuck = 10;
  }

  get center() {
    return { x: this.posX + this.size / 2, y: this.posY + this.size / 2 };
  }

  get bounds() {
    return { x: this.posX, y: this.posY, w: this.size, h: this.size };
  }

  get displayHp() {
    return Math.max(0, this.hp);
  }

  getStats() {
    let bonusAttack = 0;
    let bonusHp = 0;
    let bonusLuck = 0;

    for (const companion of companions) {
      if (!companion.equipped) continue;
      bonusAttack += companion.attackBonus;
      bonusHp += companion.hpBonus;
      bonusLuck += companion.luckBonus;
    }

    return {
      attack: this.baseAttack + bonusAttack,
      maxHp: this.maxHp + bonusHp,
      luck: this.baseLuck + bonusLuck,
      hp: Math.min(this.hp, this.maxHp + bonusHp),
    };
  }

  heal(amount) {
    this.hp = Math.min(this.getStats().maxHp, this.hp + amount);
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  resetPosition(x, y) {
    this.posX = x;
    this.posY = y;
    this.vx = 0;
    this.vy = 0;
  }

  move(obstacles) {
    if (this.isFrozen) {
      this.acc = 0;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    this.acc = 0.8;
    this.applyInput();
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.posX += this.vx;
    this.resolveHorizontalCollisions(obstacles);

    this.posY += this.vy;
    this.resolveVerticalCollisions(obstacles);
  }

  applyInput() {
    if (!keyIsPressed) return;
    if (isLetterKey('a')) this.vx -= this.acc;
    if (isLetterKey('d')) this.vx += this.acc;
    if (isLetterKey('w')) this.vy -= this.acc;
    if (isLetterKey('s')) this.vy += this.acc;
  }

  resolveHorizontalCollisions(obstacles) {
    for (const obstacle of obstacles) {
      if (!this.collidesWith(obstacle)) continue;
      if (this.vx > 0) this.posX = obstacle.x - this.size;
      else if (this.vx < 0) this.posX = obstacle.x + obstacle.w;
      this.vx = 0;
    }
  }

  resolveVerticalCollisions(obstacles) {
    for (const obstacle of obstacles) {
      if (!this.collidesWith(obstacle)) continue;
      if (this.vy > 0) this.posY = obstacle.y - this.size;
      else if (this.vy < 0) this.posY = obstacle.y + obstacle.h;
      this.vy = 0;
    }
  }

  collidesWith(obstacle) {
    return rectsOverlap(this.bounds, obstacle);
  }

  draw() {
    fill(COLORS.player);
    noStroke();
    rect(this.posX, this.posY, this.size, this.size);
  }
}