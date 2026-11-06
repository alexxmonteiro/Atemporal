class Door {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.interactionRadius = 10;
  }

  checkInteraction(player) {
    const playerCenter = player.center;
    const doorCenterX = this.x + this.w / 2;
    const doorCenterY = this.y + this.h / 2;

    const distance = dist(playerCenter.x, playerCenter.y, doorCenterX, doorCenterY);
    const maxDistance = Math.max(this.w, this.h) / 2 + this.interactionRadius + player.size / 2;

    return distance <= maxDistance;
  }

  draw() {
    fill(COLORS.door);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  drawPrompt() {
    drawInteractionPrompt(this.x + this.w / 2, this.y);
  }
}