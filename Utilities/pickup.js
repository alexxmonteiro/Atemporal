class Pickup {
  constructor(x, y, name, color) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.name = name;
    this.color = color;
    this.collected = false;
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.size, h: this.size };
  }

  checkCollision(player) {
    return rectsOverlap(player.bounds, this.bounds);
  }

  draw() {
    if (this.collected) return;
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }

  drawPrompt() {
    drawInteractionPrompt(this.x + this.size / 2, this.y);
  }
}