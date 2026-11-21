const DIRECTION_VECTORS = Object.freeze({
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
});

class Enemy {
  constructor(x, y, name, maxHp, direction) {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.direction = direction;
    this.speed = 1.5;
    this.isChasing = false;
    this.visionLength = 150;

    this.maxHp = maxHp;
    this.hp = maxHp;
    this.name = name;
    this.defeated = false;
    this.spared = false;
  }

  get center() {
    return { x: this.x + this.size / 2, y: this.y + this.size / 2 };
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.size, h: this.size };
  }

  update(player) {
    if (!this.isChasing) {
      this.isChasing = this.checkVision(player);
      return;
    }

    const angle = atan2(player.posY - this.y, player.posX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  checkVision(player) {
    const direction = DIRECTION_VECTORS[this.direction];
    if (!direction) return false;

    const playerCenter = player.center;
    const enemyCenter = this.center;
    const isVertical = direction.x === 0;

    const lateralPosition = isVertical ? playerCenter.x : playerCenter.y;
    const lateralStart = isVertical ? this.x : this.y;
    const forwardDistance = isVertical
      ? (playerCenter.y - enemyCenter.y) * direction.y
      : (playerCenter.x - enemyCenter.x) * direction.x;

    return (
      lateralPosition > lateralStart &&
      lateralPosition < lateralStart + this.size &&
      forwardDistance > 0 &&
      forwardDistance < this.visionLength
    );
  }

  checkCollision(player) {
    return rectsOverlap(player.bounds, this.bounds);
  }

  draw() {
    fill(COLORS.enemy);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
    this.drawVisionLine();
  }

  drawVisionLine() {
    const direction = DIRECTION_VECTORS[this.direction];
    if (!direction) return;

    const center = this.center;
    stroke(255, 0, 0, 100);
    strokeWeight(2);
    line(
      center.x,
      center.y,
      center.x + direction.x * this.visionLength,
      center.y + direction.y * this.visionLength
    );
    noStroke();
  }
}