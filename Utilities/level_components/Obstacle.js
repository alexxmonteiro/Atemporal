class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    fill(COLORS.obstacle);
    rect(this.x, this.y, this.w, this.h);
  }
}