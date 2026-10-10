function setup() {
  createCanvas(windowWidth, windowHeight);
  mainCharacter = new MainCharacter(100, 100);
  
  obstacles.push(new Obstacle(300, 200, 150, 40));
  obstacles.push(new Obstacle(500, 350, 50, 200));

  companionPickups.push(new CompanionPickup(250, 150, "Miséria"));
  companionPickups.push(new CompanionPickup(450, 400, "Faísca"));

  itemPickups.push(new ItemPickup(200, 300, "Poção de Vida"));
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

  for (let pickup of companionPickups) {
    if (!pickup.collected) {
      pickup.draw();
      
      if (gameState === STATE_PLAYING && pickup.checkCollision(mainCharacter)) {
        pickup.drawPrompt();
      }
    }
  }

  for (let pickup of itemPickups) {
    if (!pickup.collected) {
      pickup.draw();
      
      if (gameState === STATE_PLAYING && pickup.checkCollision(mainCharacter)) {
        pickup.drawPrompt();
      }
    }
  }

  mainCharacter.draw();

  if (gameState !== STATE_PLAYING) {
    drawMenuOverlay();
  }
}