function keyPressed() {
  if (gameState === GameState.GAME_OVER) {
    if (isLetterKey('r')) resetGameToStart();
    return;
  }

  if (isEscapeKey() && handleBattleEscape()) return;

  if (gameState === GameState.BATTLE) {
    handleBattleInput();
    return;
  }

  if (isLetterKey('q')) {
    if (gameState === GameState.PLAYING) openMainMenu();
    return;
  }

  if (gameState === GameState.PLAYING) {
    if (isLetterKey('e')) tryInteract();
    return;
  }

  if (gameState === GameState.MENU_MAIN) {
    handleMainMenuInput();
  } else if (gameState === GameState.INVENTORY || gameState === GameState.COMPANIONS) {
    handleListMenuInput();
  }
}

function openMainMenu() {
  gameState = GameState.MENU_MAIN;
  menu.selectedIndex = 0;
}

function findCollectable(pickups) {
  return pickups.find(pickup => !pickup.collected && pickup.checkCollision(mainCharacter));
}

function tryInteract() {
  if (doors.some(door => door.checkInteraction(mainCharacter))) {
    nextLevel();
    return;
  }

  const companionPickup = findCollectable(companionPickups);
  if (companionPickup) {
    companionPickup.collected = true;
    companions.push(companionPickup.toCompanion());
    return;
  }

  const itemPickup = findCollectable(itemPickups);
  if (itemPickup) {
    itemPickup.collected = true;
    inventory.push(itemPickup.toItem());
  }
}

function handleMainMenuInput() {
  const delta = getNavigationDelta();

  if (delta !== 0) {
    menu.selectedIndex = wrapIndex(menu.selectedIndex, delta, MENU_OPTIONS.length);
    return;
  }

  if (!isEnterPressed()) return;

  if (menu.selectedIndex === 0) {
    gameState = GameState.INVENTORY;
    menu.subIndex = 0;
  } else if (menu.selectedIndex === 1) {
    gameState = GameState.COMPANIONS;
    menu.subIndex = 0;
  } else if (menu.selectedIndex === 2) {
    gameState = GameState.PLAYING;
  }
}

function useInventoryItem(index) {
  applyItemEffect(inventory[index]);
  inventory.splice(index, 1);
  menu.subIndex = clampIndexAfterRemoval(menu.subIndex, inventory.length);
}

function toggleCompanionEquipped(index) {
  companions[index].equipped = !companions[index].equipped;
}

function handleListMenuInput() {
  const isInventory = gameState === GameState.INVENTORY;
  const list = isInventory ? inventory : companions;
  const delta = getNavigationDelta();

  if (delta !== 0) {
    if (list.length > 0) menu.subIndex = wrapIndex(menu.subIndex, delta, list.length);
  } else if (isEnterPressed() && list.length > 0) {
    if (isInventory) useInventoryItem(menu.subIndex);
    else toggleCompanionEquipped(menu.subIndex);
  } else if (isBackKey()) {
    gameState = GameState.MENU_MAIN;
  }
}