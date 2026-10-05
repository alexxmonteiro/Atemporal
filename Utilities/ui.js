function drawMenuOverlay() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(40);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 200, height / 2 - 180, 400, 360, 10);
  noStroke();

  textAlign(CENTER, CENTER);

  if (gameState === STATE_MENU_MAIN) {
    fill(255);
    textSize(22);
    text("MENU DE OPÇÕES", width / 2, height / 2 - 130);

    for (let i = 0; i < menuOptions.length; i++) {
      let y = height / 2 - 40 + i * 50;
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
    text("W/S: Navegar | ENTER: Confirmar", width / 2, height / 2 + 140);
  } 
  else if (gameState === STATE_INVENTORY || gameState === STATE_COMPANIONS) {
    let title = gameState === STATE_INVENTORY ? "INVENTÁRIO" : "COMPANHEIROS";
    let list = gameState === STATE_INVENTORY ? inventory : companions;

    fill(255);
    textSize(22);
    text(title, width / 2, height / 2 - 130);

    for (let i = 0; i < list.length; i++) {
      let y = height / 2 - 50 + i * 45;
      let status = list[i].equipped ? " [EQUIPADO]" : "";
      
      if (i === subSelectedIndex) {
        fill("#ffcc00");
        textSize(18);
        text("> " + list[i].name + status + " <", width / 2, y);
      } else {
        fill(200);
        textSize(16);
        text(list[i].name + status, width / 2, y);
      }
    }

    fill(150);
    textSize(12);
    text("ENTER: Equipar/Usar | ESC: Voltar", width / 2, height / 2 + 140);
  }
}