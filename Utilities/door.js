class Door {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.interactionRadius = 10;
  }

  checkInteraction(player) {
    let playerCenterX = player.posX + player.size / 2;
    let playerCenterY = player.posY + player.size / 2;
    
    let doorCenterX = this.x + this.w / 2;
    let doorCenterY = this.y + this.h / 2;

    let distance = dist(playerCenterX, playerCenterY, doorCenterX, doorCenterY);
    let maxDist = Math.max(this.w, this.h) / 2 + this.interactionRadius + player.size / 2;

    return distance <= maxDist;
  }

  draw() {
    fill("#f39200");
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  drawPrompt() {
    fill(0);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text("Pressione E para interagir", this.x + this.w / 2, this.y - 8);
  }
}