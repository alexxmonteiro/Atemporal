class Enemy {
  constructor(x, y, direction = 'DOWN') {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.direction = direction;
    this.speed = 1.5;
    this.isChasing = false;
    this.visionLength = 150;
  }

  update(player) {
    if (!this.isChasing) {
      if (this.checkVision(player)) {
        this.isChasing = true;
      }
    } else {
      let angle = atan2(player.posY - this.y, player.posX - this.x);
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    }
  }

  checkVision(player) {
    let pCenterX = player.posX + player.size / 2;
    let pCenterY = player.posY + player.size / 2;
    let halfSize = this.size / 2;
    let centerX = this.x + halfSize;
    let centerY = this.y + halfSize;

    if (this.direction === 'UP') {
      return (
        pCenterX > this.x &&
        pCenterX < this.x + this.size &&
        pCenterY < centerY &&
        pCenterY > centerY - this.visionLength
      );
    } else if (this.direction === 'DOWN') {
      return (
        pCenterX > this.x &&
        pCenterX < this.x + this.size &&
        pCenterY > centerY &&
        pCenterY < centerY + this.visionLength
      );
    } else if (this.direction === 'LEFT') {
      return (
        pCenterY > this.y &&
        pCenterY < this.y + this.size &&
        pCenterX < centerX &&
        pCenterX > centerX - this.visionLength
      );
    } else if (this.direction === 'RIGHT') {
      return (
        pCenterY > this.y &&
        pCenterY < this.y + this.size &&
        pCenterX > centerX &&
        pCenterX < centerX + this.visionLength
      );
    }
    return false;
  }

  checkCollision(player) {
    return (
      player.posX < this.x + this.size &&
      player.posX + player.size > this.x &&
      player.posY < this.y + this.size &&
      player.posY + player.size > this.y
    );
  }

  draw() {
    fill("#800080");
    noStroke();
    rect(this.x, this.y, this.size, this.size);

    stroke(255, 0, 0, 100);
    strokeWeight(2);
    let cx = this.x + this.size / 2;
    let cy = this.y + this.size / 2;

    if (this.direction === 'UP') line(cx, cy, cx, cy - this.visionLength);
    if (this.direction === 'DOWN') line(cx, cy, cx, cy + this.visionLength);
    if (this.direction === 'LEFT') line(cx, cy, cx - this.visionLength, cy);
    if (this.direction === 'RIGHT') line(cx, cy, cx + this.visionLength, cy);
    noStroke();
  }
}