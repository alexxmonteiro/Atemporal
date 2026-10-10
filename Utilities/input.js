function isEnterPressed() {
  return keyCode === ENTER || keyCode === RETURN || key === 'Enter';
}

function keyPressed() {
  if (key === 'q' || key === 'Q') {
    if (gameState === STATE_PLAYING) {
      gameState = STATE_MENU_MAIN;
      selectedIndex = 0;
    }
    return;
  }

  if (gameState === STATE_PLAYING) {
    if (key === 'e' || key === 'E') {
      for (let pickup of companionPickups) {
        if (!pickup.collected && pickup.checkCollision(mainCharacter)) {
          pickup.collected = true;
          companions.push({ name: pickup.name, equipped: false });
          return;
        }
      }

      for (let pickup of itemPickups) {
        if (!pickup.collected && pickup.checkCollision(mainCharacter)) {
          pickup.collected = true;
          inventory.push({ name: pickup.name, equipped: false });
          return;
        }
      }
    }
    return;
  }

  if (gameState === STATE_MENU_MAIN) {
    if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
      selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
    } else if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
      selectedIndex = (selectedIndex + 1) % menuOptions.length;
    } else if (isEnterPressed()) {
      if (selectedIndex === 0) {
        gameState = STATE_INVENTORY;
        subSelectedIndex = 0;
      } else if (selectedIndex === 1) {
        gameState = STATE_COMPANIONS;
        subSelectedIndex = 0;
      } else if (selectedIndex === 2) {
        gameState = STATE_PLAYING;
      }
    }
  } 
  else if (gameState === STATE_INVENTORY || gameState === STATE_COMPANIONS) {
    let list = gameState === STATE_INVENTORY ? inventory : companions;

    if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
      if (list.length > 0) subSelectedIndex = (subSelectedIndex - 1 + list.length) % list.length;
    } else if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
      if (list.length > 0) subSelectedIndex = (subSelectedIndex + 1) % list.length;
    } else if (isEnterPressed() && list.length > 0) {
      list[subSelectedIndex].equipped = !list[subSelectedIndex].equipped;
    } else if (keyCode === BACKSPACE || key === 'Escape') {
      gameState = STATE_MENU_MAIN;
    }
  }
}