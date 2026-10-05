class MainCharacter {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.size = 40;
    this.vx = 0;
    this.vy = 0;
    this.acc = 0.8;
    this.friction = 0.90;
  }

  move(obstacles) {
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