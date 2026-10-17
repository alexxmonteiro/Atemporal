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

  getStats() {
    let bonusAttack = 0;
    let bonusHp = 0;
    let bonusLuck = 0;

    for (let comp of companions) {
      if (comp.equipped) {
        bonusAttack += comp.attackBonus;
        bonusHp += comp.hpBonus;
        bonusLuck += comp.luckBonus;
      }
    }

    return {
      attack: this.baseAttack + bonusAttack,
      maxHp: this.maxHp + bonusHp,
      luck: this.baseLuck + bonusLuck,
      hp: Math.min(this.hp, this.maxHp + bonusHp)
    };
  }

  move(obstacles) {
    if (this.isFrozen) {
      this.acc = 0;
      this.vx = 0;
      this.vy = 0;
      return;
    } else {
      this.acc = 0.8;
    }

    if (keyIsPressed && (key === 'a' || key === 'A')) this.vx -= this.acc;
    if (keyIsPressed && (key === 'd' || key === 'D')) this.vx += this.acc;
    if (keyIsPressed && (key === 'w' || key === 'W')) this.vy -= this.acc;
    if (keyIsPressed && (key === 's' || key === 'S')) this.vy += this.acc;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.posX += this.vx;
    for (let obs of obstacles) {
      if (this.checkCollision(this.posX, this.posY, obs)) {
        if (this.vx > 0) this.posX = obs.x - this.size;
        else if (this.vx < 0) this.posX = obs.x + obs.w;
        this.vx = 0;
      }
    }

    this.posY += this.vy;
    for (let obs of obstacles) {
      if (this.checkCollision(this.posX, this.posY, obs)) {
        if (this.vy > 0) this.posY = obs.y - this.size;
        else if (this.vy < 0) this.posY = obs.y + obs.h;
        this.vy = 0;
      }
    }
  }

  checkCollision(px, py, obs) {
    return (
      px < obs.x + obs.w &&
      px + this.size > obs.x &&
      py < obs.y + obs.h &&
      py + this.size > obs.y
    );
  }

  draw() {
    fill("#ff0000");
    rect(this.posX, this.posY, this.size, this.size);
  }
}