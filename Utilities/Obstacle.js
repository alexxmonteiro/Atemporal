class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    fill("#333333");
    rect(this.x, this.y, this.w, this.h);
  }
}