class CompanionPickup {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.name = name;
    this.collected = false;
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
    if (!this.collected) {
      fill("#00ff66");
      rect(this.x, this.y, this.size, this.size);
    }
  }

  drawPrompt() {
    fill(0);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text("Pressione E para interagir", this.x + this.size / 2, this.y - 8);
  }
}