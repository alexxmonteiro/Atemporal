function drawBattleScreen() {
  background(20, 20, 35);

  let stats = mainCharacter.getStats();

  fill(45, 45, 65);
  stroke(200);
  strokeWeight(2);
  rect(width - 400, 40, 350, 110, 10);
  noStroke();

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(currentEnemy ? currentEnemy.name : "Inimigo", width - 380, 55);

  textSize(14);
  text(`HP: ${currentEnemy ? Math.max(0, currentEnemy.hp) : 0} / ${currentEnemy ? currentEnemy.maxHp : 50}`, width - 380, 85);

  let enemyHpPercent = currentEnemy ? Math.max(0, currentEnemy.hp) / currentEnemy.maxHp : 0;
  fill(100);
  rect(width - 380, 110, 300, 15, 5);
  fill(0, 220, 100);
  rect(width - 380, 110, 300 * enemyHpPercent, 15, 5);

  fill(45, 45, 65);
  stroke(200);
  strokeWeight(2);
  rect(50, height - 260, 350, 110, 10);
  noStroke();

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Jogador", 70, height - 245);

  textSize(14);
  text(`HP: ${Math.max(0, mainCharacter.hp)} / ${stats.maxHp}  |  SORTE: ${stats.luck}`, 70, height - 215);

  let playerHpPercent = Math.max(0, mainCharacter.hp) / stats.maxHp;
  fill(100);
  rect(70, height - 190, 300, 15, 5);
  fill(0, 150, 255);
  rect(70, height - 190, 300 * playerHpPercent, 15, 5);

  fill(25, 25, 35);
  stroke(200);
  strokeWeight(2);
  rect(50, height - 130, width - 450, 90, 10);
  noStroke();

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(battleLog, 70, height - 110);

  fill(35, 35, 50);
  stroke(200);
  strokeWeight(2);
  rect(width - 380, height - 130, 330, 90, 10);
  noStroke();

  textSize(18);
  if (battleFinished) {
    fill(255, 200, 0);
    textAlign(CENTER, CENTER);
    text("Pressione ENTER para continuar", width - 380 + 165, height - 130 + 45);
  } else if (!isPlayerTurn) {
    fill(200, 200, 200);
    textAlign(CENTER, CENTER);
    text("Turno do Inimigo...", width - 380 + 165, height - 130 + 45);
  } else {
    if (battleState === BATTLE_MENU_MAIN) {
      let opt1 = battleSelectedIndex === 0 ? "> Atacar" : "  Atacar";
      let opt2 = battleSelectedIndex === 1 ? "> Poupar (HP <= 25)" : "  Poupar (HP <= 25)";

      fill(battleSelectedIndex === 0 ? "#ffcc00" : 255);
      text(opt1, width - 350, height - 110);

      fill(battleSelectedIndex === 1 ? "#ffcc00" : 255);
      text(opt2, width - 350, height - 80);

      fill(150);
      textSize(11);
      text("W/S: Navegar | ENTER: Selecionar", width - 350, height - 50);
    } else if (battleState === BATTLE_MENU_FIGHT) {
      let opt1 = battleSubIndex === 0 ? "> Ataque Forte (-5 HP, Risco)" : "  Ataque Forte (-5 HP, Risco)";
      let opt2 = battleSubIndex === 1 ? "> Ataque Fraco (Seguro)" : "  Ataque Fraco (Seguro)";

      fill(battleSubIndex === 0 ? "#ffcc00" : 255);
      text(opt1, width - 350, height - 110);

      fill(battleSubIndex === 1 ? "#ffcc00" : 255);
      text(opt2, width - 350, height - 80);

      fill(150);
      textSize(11);
      text("W/S: Mudar | ENTER: Atacar | ESC: Voltar", width - 350, height - 50);
    }
  }
}

function drawMenuOverlay() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(40);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 240, height / 2 - 200, 480, 400, 10);
  noStroke();

  textAlign(CENTER, CENTER);

  if (gameState === STATE_MENU_MAIN) {
    fill(255);
    textSize(22);
    text("MENU DE OPÇÕES", width / 2, height / 2 - 150);

    let stats = mainCharacter.getStats();
    textSize(13);
    fill(200);
    text(`HP: ${mainCharacter.hp}/${stats.maxHp} | ATK: ${stats.attack} | SORTE: ${stats.luck}`, width / 2, height / 2 - 110);

    for (let i = 0; i < menuOptions.length; i++) {
      let y = height / 2 - 30 + i * 50;
      if (i === selectedIndex) {
        fill("#ffcc00");
        textSize(20);
        text("> " + menuOptions[i] + " <", width / 2, y);
      } else {
        fill(200);
        textSize(18);
        text(menuOptions[i], width / 2, y);
      }
    }

    fill(150);
    textSize(12);
    text("W/S: Navegar | ENTER: Confirmar", width / 2, height / 2 + 160);
  } 
  else if (gameState === STATE_INVENTORY || gameState === STATE_COMPANIONS) {
    let title = gameState === STATE_INVENTORY ? "INVENTÁRIO (USO ÚNICO)" : "COMPANHEIROS";
    let list = gameState === STATE_INVENTORY ? inventory : companions;

    fill(255);
    textSize(20);
    text(title, width / 2, height / 2 - 150);

    for (let i = 0; i < list.length; i++) {
      let y = height / 2 - 70 + i * 45;
      let details = "";
      
      if (gameState === STATE_INVENTORY) {
        details = ` (${list[i].effectType}: +${list[i].effectValue})`;
      } else {
        let status = list[i].equipped ? " [EQUIPADO]" : "";
        details = ` (ATK: ${list[i].attackBonus >= 0 ? '+' + list[i].attackBonus : list[i].attackBonus}, HP: +${list[i].hpBonus}, SORTE: ${list[i].luckBonus >= 0 ? '+' + list[i].luckBonus : list[i].luckBonus})${status}`;
      }
      
      if (i === subSelectedIndex) {
        fill("#ffcc00");
        textSize(15);
        text("> " + list[i].name + details + " <", width / 2, y);
      } else {
        fill(200);
        textSize(14);
        text(list[i].name + details, width / 2, y);
      }
    }

    if (list.length === 0) {
      fill(150);
      textSize(16);
      text("Vazio", width / 2, height / 2);
    }

    fill(150);
    textSize(12);
    let promptText = gameState === STATE_INVENTORY ? "ENTER: Usar Item | ESC: Voltar" : "ENTER: Equipar/Desequipar | ESC: Voltar";
    text(promptText, width / 2, height / 2 + 160);
  }
}