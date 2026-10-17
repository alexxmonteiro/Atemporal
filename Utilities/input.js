function isEnterPressed() {
  return keyCode === ENTER || keyCode === RETURN || key === 'Enter';
}

function startBattle(enemy) {
  currentEnemy = enemy;
  currentEnemy.hp = currentEnemy.maxHp;
  gameState = STATE_BATTLE;
  battleState = BATTLE_MENU_MAIN;
  battleSelectedIndex = 0;
  battleBagIndex = 0;
  battleLog = `Um ${currentEnemy.name} selvagem apareceu!`;
  isPlayerTurn = true;
  battleFinished = false;
}

function enemyTurn() {
  if (currentEnemy.hp <= 0) return;

  let enemyChoice = Math.floor(random(0, 2));
  let stats = mainCharacter.getStats();

  if (enemyChoice === 1) {
    let hitChance = 0.5 + (stats.luck * 0.01); 
    if (random() < hitChance) {
      let dmg = 25;
      mainCharacter.hp = Math.max(0, mainCharacter.hp - dmg);
      battleLog = `O inimigo usou ATAQUE FORTE e acertou! -${dmg} HP`;
    } else {
      battleLog = `O inimigo usou ATAQUE FRACO, mas errou!`;
    }
  } else {
    let hitChance = 0.8 + (stats.luck * 0.01);
    if (random() < hitChance) {
      let dmg = 10;
      mainCharacter.hp = Math.max(0, mainCharacter.hp - dmg);
      battleLog = `O inimigo usou ATAQUE FRACO e acertou! -${dmg} HP`;
    } else {
      battleLog = `O inimigo usou ATAQUE FRACO, mas errou!`;
    }
  }

  if (mainCharacter.hp <= 0) {
    battleLog = "Você foi derrotado!";
    battleFinished = true;
    gameState = STATE_GAME_OVER;
  } else {
    isPlayerTurn = true;
    battleState = BATTLE_MENU_MAIN;
  }
}

function keyPressed() {
  if (gameState === STATE_GAME_OVER) {
    if (key === 'r' || key === 'R') {
      resetGameToStart();
    }
    return;
  }

  if (key === 'Escape' || keyCode === 27) {
    if (gameState === STATE_BATTLE) {
      if (battleFinished && mainCharacter.hp > 0) {
        gameState = STATE_PLAYING;
        mainCharacter.isFrozen = false;
        if (currentEnemy.hp <= 0 || currentEnemy.spared) {
          currentEnemy.defeated = true;
        }
        enemies = enemies.filter(enemy => !enemy.defeated);
        return;
      }
      if (!battleFinished && battleState !== BATTLE_MENU_MAIN) {
        battleState = BATTLE_MENU_MAIN;
        return;
      }
      return;
    }

    if (gameState === STATE_BATTLE_TRANSITION) {
      gameState = STATE_PLAYING;
      mainCharacter.isFrozen = false;
      enemies = enemies.filter(enemy => !enemy.defeated);
      return;
    }
  }

  if (gameState === STATE_BATTLE) {
    if (battleFinished) {
      if (mainCharacter.hp <= 0) {
        gameState = STATE_GAME_OVER;
        return;
      }
      if (isEnterPressed()) {
        gameState = STATE_PLAYING;
        mainCharacter.isFrozen = false;
        if (currentEnemy.hp <= 0 || currentEnemy.spared) {
          currentEnemy.defeated = true;
        }
        enemies = enemies.filter(enemy => !enemy.defeated);
      }
      return;
    }

    if (!isPlayerTurn) return;

    if (battleState === BATTLE_MENU_MAIN) {
      if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
        battleSelectedIndex = (battleSelectedIndex - 1 + 2) % 2;
      } else if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
        battleSelectedIndex = (battleSelectedIndex + 1) % 2;
      } else if (isEnterPressed()) {
        if (battleSelectedIndex === 0) {
          battleState = BATTLE_MENU_FIGHT;
          battleSubIndex = 0;
        } else if (battleSelectedIndex === 1) {
          battleState = BATTLE_MENU_BAG;
          battleBagIndex = 0;
        }
      }
    } else if (battleState === BATTLE_MENU_FIGHT) {
      if (key === 'w' || key === 'W' || keyCode === UP_ARROW || key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
        battleSubIndex = battleSubIndex === 0 ? 1 : 0;
      } else if (isEnterPressed()) {
        let stats = mainCharacter.getStats();
        
        if (battleSubIndex === 0) {
          mainCharacter.hp = Math.max(0, mainCharacter.hp - 25);
          
          let hitChance = 0.1 + (stats.luck * 0.01);
          if (random() < hitChance) {
            let dmg = stats.attack * 1.8 + 10;
            currentEnemy.hp = Math.max(0, currentEnemy.hp - dmg);
            battleLog = `Ataque Forte acertou! (-25 HP seu) Causou ${Math.round(dmg)} de dano!`;
          } else {
            battleLog = `Você usou Ataque Forte (-25 HP seu), mas errou o golpe!`;
          }
        } else {
          let hitChance = 0.85 + (stats.luck * 0.01);
          if (random() < hitChance) {
            let dmg = stats.attack * 0.3;
            currentEnemy.hp = Math.max(0, currentEnemy.hp - dmg);
            battleLog = `Ataque Fraco acertou! Causou ${Math.round(dmg)} de dano.`;
          } else {
            battleLog = `Você usou Ataque Fraco, mas errou!`;
          }
        }

        if (mainCharacter.hp <= 0) {
          battleLog = "Você desmaiou devido ao esforço/dano!";
          battleFinished = true;
          gameState = STATE_GAME_OVER;
        } else if (currentEnemy.hp <= 0) {
          battleLog = `Você derrotou o ${currentEnemy.name}! Pressione ENTER para continuar.`;
          battleFinished = true;
        } else {
          isPlayerTurn = false;
          setTimeout(() => {
            if (gameState === STATE_BATTLE && !battleFinished) {
              enemyTurn();
            }
          }, 800);
        }
        battleState = BATTLE_MENU_MAIN;
      }
    } else if (battleState === BATTLE_MENU_BAG) {
      if (inventory.length > 0) {
        if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
          battleBagIndex = (battleBagIndex - 1 + inventory.length) % inventory.length;
        } else if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
          battleBagIndex = (battleBagIndex + 1) % inventory.length;
        }
      }

      if (isEnterPressed() && inventory.length > 0) {
        let item = inventory[battleBagIndex];
        if (item.effectType === 'heal') {
          let stats = mainCharacter.getStats();
          mainCharacter.hp = Math.min(stats.maxHp, mainCharacter.hp + item.effectValue);
          battleLog = `Você usou ${item.name} e recuperou ${item.effectValue} HP!`;
        }
        inventory.splice(battleBagIndex, 1);
        if (battleBagIndex >= inventory.length && inventory.length > 0) {
          battleBagIndex = inventory.length - 1;
        }

        isPlayerTurn = false;
        setTimeout(() => {
          if (gameState === STATE_BATTLE && !battleFinished) {
            enemyTurn();
          }
        }, 800);
        battleState = BATTLE_MENU_MAIN;
      }
    }
    return;
  }

  if (key === 'q' || key === 'Q') {
    if (gameState === STATE_PLAYING) {
      gameState = STATE_MENU_MAIN;
      selectedIndex = 0;
    }
    return;
  }

  if (gameState === STATE_PLAYING) {
    if (key === 'e' || key === 'E') {
      for (let door of doors) {
        if (door.checkInteraction(mainCharacter)) {
          nextLevel();
          return;
        }
      }

      for (let pickup of companionPickups) {
        if (!pickup.collected && pickup.checkCollision(mainCharacter)) {
          pickup.collected = true;
          companions.push({ 
            name: pickup.name, 
            attackBonus: pickup.attackBonus, 
            hpBonus: pickup.hpBonus, 
            luckBonus: pickup.luckBonus,
            equipped: false 
          });
          return;
        }
      }

      for (let pickup of itemPickups) {
        if (!pickup.collected && pickup.checkCollision(mainCharacter)) {
          pickup.collected = true;
          inventory.push({ 
            name: pickup.name, 
            effectType: pickup.effectType, 
            effectValue: pickup.effectValue 
          });
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
      if (gameState === STATE_INVENTORY) {
        let item = list[subSelectedIndex];
        if (item.effectType === 'heal') {
          let stats = mainCharacter.getStats();
          mainCharacter.hp = Math.min(stats.maxHp, mainCharacter.hp + item.effectValue);
        }
        inventory.splice(subSelectedIndex, 1);
        if (subSelectedIndex >= inventory.length && inventory.length > 0) {
          subSelectedIndex = inventory.length - 1;
        }
      } else {
        list[subSelectedIndex].equipped = !list[subSelectedIndex].equipped;
      }
    } else if (keyCode === BACKSPACE || key === 'Escape') {
      gameState = STATE_MENU_MAIN;
    }
  }
}