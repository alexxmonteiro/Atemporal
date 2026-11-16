class Door {
  constructor(x, y, w, h, type = DoorType.INTERACT, direction = DoorDirection.NEXT, options = {}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.direction = direction;
    this.interactionRadius = 10;
    this.link = options.link || null;
    this.lockId = options.lockId || null;
    this.locked = type === DoorType.LOCKED;
  }

  get isTrigger() {
    return this.type === DoorType.TRIGGER;
  }

  get isSectionLink() {
    return this.isTrigger && this.link !== null;
  }

  get isLocked() {
    return this.type === DoorType.LOCKED && this.locked;
  }

  get isHidden() {
    return this.isTrigger || (this.type === DoorType.LOCKED && !this.locked);
  }

  get isSolid() {
    return !this.isHidden;
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  unlock() {
    this.locked = false;
  }

  checkTrigger(player) {
    return this.isTrigger && rectsOverlap(player.bounds, this.bounds);
  }

  checkInteraction(player) {
    if (this.isHidden) return false;

    const playerCenter = player.center;
    const doorCenterX = this.x + this.w / 2;
    const doorCenterY = this.y + this.h / 2;

    const distance = dist(playerCenter.x, playerCenter.y, doorCenterX, doorCenterY);
    const maxDistance = Math.max(this.w, this.h) / 2 + this.interactionRadius + player.size / 2;

    return distance <= maxDistance;
  }

  draw() {
    if (this.isHidden) return;
    fill(this.isLocked ? COLORS.lockedDoor : COLORS.door);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  drawPrompt() {
    if (this.isHidden) return;
    const label = this.isLocked ? "Porta trancada - pressione E" : undefined;
    drawInteractionPrompt(this.x + this.w / 2, this.y, label);
  }
}