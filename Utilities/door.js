class Door {
  constructor(x, y, w, h, type = DoorType.INTERACT, direction = DoorDirection.NEXT) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.direction = direction;
    this.interactionRadius = 10;
  }

  get isTrigger() {
    return this.type === DoorType.TRIGGER;
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  checkTrigger(player) {
    return this.isTrigger && rectsOverlap(player.bounds, this.bounds);
  }

  checkInteraction(player) {
    if (this.isTrigger) return false;

    const playerCenter = player.center;
    const doorCenterX = this.x + this.w / 2;
    const doorCenterY = this.y + this.h / 2;

    const distance = dist(playerCenter.x, playerCenter.y, doorCenterX, doorCenterY);
    const maxDistance = Math.max(this.w, this.h) / 2 + this.interactionRadius + player.size / 2;

    return distance <= maxDistance;
  }

  draw() {
    if (this.isTrigger) return;
    fill(COLORS.door);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  drawPrompt() {
    if (this.isTrigger) return;
    drawInteractionPrompt(this.x + this.w / 2, this.y);
  }
}