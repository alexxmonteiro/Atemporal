function startBattle(enemy) {
  enemy.hp = enemy.maxHp;
  gameState = GameState.BATTLE;
  Object.assign(battle, {
    enemy,
    state: BattleMenu.MAIN,
    selectedIndex: 0,
    bagIndex: 0,
    log: `Um ${enemy.name} selvagem apareceu!`,
    isPlayerTurn: true,
    finished: false,
  });
}

function removeDefeatedEnemies() {
  enemies = enemies.filter(enemy => !enemy.defeated);
}

function resumeExploration() {
  gameState = GameState.PLAYING;
  mainCharacter.isFrozen = false;
  removeDefeatedEnemies();
}

function concludeBattle() {
  if (battle.enemy.hp <= 0 || battle.enemy.spared) {
    battle.enemy.defeated = true;
  }
  resumeExploration();
}

function rollHit(baseChance, luck) {
  return random() < baseChance + luck * LUCK_HIT_BONUS;
}

function applyItemEffect(item) {
  if (item.effectType !== 'heal') return false;
  mainCharacter.heal(item.effectValue);
  return true;
}

function damageEnemy(amount) {
  battle.enemy.hp = Math.max(0, battle.enemy.hp - amount);
}

function scheduleEnemyTurn() {
  battle.isPlayerTurn = false;
  setTimeout(() => {
    if (gameState === GameState.BATTLE && !battle.finished) {
      enemyTurn();
    }
  }, ENEMY_TURN_DELAY_MS);
}

function enemyTurn() {
  if (battle.enemy.hp <= 0) return;

  const useStrongAttack = Math.floor(random(0, 2)) === 1;
  const stats = mainCharacter.getStats();
  const attack = useStrongAttack
    ? BATTLE_BALANCE.enemyStrongAttack
    : BATTLE_BALANCE.enemyWeakAttack;

  if (rollHit(attack.hitChance, stats.luck)) {
    mainCharacter.takeDamage(attack.damage);
    battle.log = `O inimigo usou ${attack.label} e acertou! -${attack.damage} HP`;
  } else {
    battle.log = `O inimigo usou ${attack.label}, mas errou!`;
  }

  if (mainCharacter.hp <= 0) {
    battle.log = "Você foi derrotado!";
    battle.finished = true;
    gameState = GameState.GAME_OVER;
  } else {
    battle.isPlayerTurn = true;
    battle.state = BattleMenu.MAIN;
  }
}

function performStrongAttack(stats) {
  const attack = BATTLE_BALANCE.playerStrongAttack;
  mainCharacter.takeDamage(attack.selfDamage);

  if (rollHit(attack.hitChance, stats.luck)) {
    const damage = stats.attack * attack.attackMultiplier + attack.flatDamage;
    damageEnemy(damage);
    battle.log = `Ataque Forte acertou! (-${attack.selfDamage} HP seu) Causou ${Math.round(damage)} de dano!`;
  } else {
    battle.log = `Você usou Ataque Forte (-${attack.selfDamage} HP seu), mas errou o golpe!`;
  }
}

function performWeakAttack(stats) {
  const attack = BATTLE_BALANCE.playerWeakAttack;

  if (rollHit(attack.hitChance, stats.luck)) {
    const damage = stats.attack * attack.attackMultiplier;
    damageEnemy(damage);
    battle.log = `Ataque Fraco acertou! Causou ${Math.round(damage)} de dano.`;
  } else {
    battle.log = `Você usou Ataque Fraco, mas errou!`;
  }
}

function resolvePlayerAttack() {
  if (mainCharacter.hp <= 0) {
    battle.log = "Você desmaiou devido ao esforço/dano!";
    battle.finished = true;
    gameState = GameState.GAME_OVER;
  } else if (battle.enemy.hp <= 0) {
    battle.log = `Você derrotou o ${battle.enemy.name}! Pressione ENTER para continuar.`;
    battle.finished = true;
  } else {
    scheduleEnemyTurn();
  }
  battle.state = BattleMenu.MAIN;
}

function useSelectedBagItem() {
  const item = inventory[battle.bagIndex];

  if (applyItemEffect(item)) {
    battle.log = `Você usou ${item.name} e recuperou ${item.effectValue} HP!`;
  }

  inventory.splice(battle.bagIndex, 1);
  battle.bagIndex = clampIndexAfterRemoval(battle.bagIndex, inventory.length);

  scheduleEnemyTurn();
  battle.state = BattleMenu.MAIN;
}

function handleBattleEscape() {
  if (gameState === GameState.BATTLE) {
    if (battle.finished && mainCharacter.hp > 0) {
      concludeBattle();
    } else if (!battle.finished && battle.state !== BattleMenu.MAIN) {
      battle.state = BattleMenu.MAIN;
    }
    return true;
  }

  if (gameState === GameState.BATTLE_TRANSITION) {
    resumeExploration();
    return true;
  }

  return false;
}

function handleBattleInput() {
  if (battle.finished) {
    handleFinishedBattleInput();
    return;
  }

  if (!battle.isPlayerTurn) return;

  if (battle.state === BattleMenu.MAIN) handleBattleMainMenuInput();
  else if (battle.state === BattleMenu.FIGHT) handleBattleFightMenuInput();
  else if (battle.state === BattleMenu.BAG) handleBattleBagMenuInput();
}

function handleFinishedBattleInput() {
  if (mainCharacter.hp <= 0) {
    gameState = GameState.GAME_OVER;
    return;
  }

  if (isEnterPressed()) {
    concludeBattle();
  }
}

function handleBattleMainMenuInput() {
  const delta = getNavigationDelta();

  if (delta !== 0) {
    battle.selectedIndex = wrapIndex(battle.selectedIndex, delta, 2);
  } else if (isEnterPressed()) {
    if (battle.selectedIndex === 0) {
      battle.state = BattleMenu.FIGHT;
      battle.subIndex = 0;
    } else {
      battle.state = BattleMenu.BAG;
      battle.bagIndex = 0;
    }
  }
}

function handleBattleFightMenuInput() {
  if (getNavigationDelta() !== 0) {
    battle.subIndex = battle.subIndex === 0 ? 1 : 0;
    return;
  }

  if (!isEnterPressed()) return;

  const stats = mainCharacter.getStats();

  if (battle.subIndex === 0) performStrongAttack(stats);
  else performWeakAttack(stats);

  resolvePlayerAttack();
}

function handleBattleBagMenuInput() {
  if (inventory.length === 0) return;

  const delta = getNavigationDelta();

  if (delta !== 0) {
    battle.bagIndex = wrapIndex(battle.bagIndex, delta, inventory.length);
  } else if (isEnterPressed()) {
    useSelectedBagItem();
  }
}