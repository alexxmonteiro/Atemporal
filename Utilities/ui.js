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