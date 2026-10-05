function setup() {
  createCanvas(windowWidth, windowHeight);
  mainCharacter = new MainCharacter(100, 100);
  obstacles.push(new Obstacle(300, 200, 150, 40));
  obstacles.push(new Obstacle(500, 350, 50, 200));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#ffffff");

  for (let obs of obstacles) {
    obs.draw();
  }

  if (gameState === STATE_PLAYING) {
    mainCharacter.move(obstacles);
  }
  
  mainCharacter.draw();

  if (gameState !== STATE_PLAYING) {
    drawMenuOverlay();
  }
}