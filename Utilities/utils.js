function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function intersectRects(a, b) {
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.w, b.x + b.w);
  const bottom = Math.min(a.y + a.h, b.y + b.h);

  if (right <= left || bottom <= top) return null;

  return { x: left, y: top, w: right - left, h: bottom - top };
}

function expandRect(rectData, amount) {
  return {
    x: rectData.x - amount,
    y: rectData.y - amount,
    w: rectData.w + amount * 2,
    h: rectData.h + amount * 2,
  };
}

function clipRectsToZone(rects, zone, margin = 0) {
  const clipped = [];

  for (const zoneRect of zone) {
    const area = margin > 0 ? expandRect(zoneRect, margin) : zoneRect;

    for (const rectData of rects) {
      const piece = intersectRects(rectData, area);
      if (piece) clipped.push(piece);
    }
  }

  return clipped;
}

function zoneContainsPoint(zone, x, y) {
  return zone.some(r => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
}

function boxCenter(box) {
  const boxWidth = box.w !== undefined ? box.w : box.size;
  const boxHeight = box.h !== undefined ? box.h : box.size;
  return { x: box.x + boxWidth / 2, y: box.y + boxHeight / 2 };
}

function isLetterKey(letter) {
  return key === letter || key === letter.toUpperCase();
}

function isUpKey() {
  return isLetterKey('w') || keyCode === UP_ARROW;
}

function isDownKey() {
  return isLetterKey('s') || keyCode === DOWN_ARROW;
}

function isEnterPressed() {
  return keyCode === ENTER || keyCode === RETURN || key === 'Enter';
}

function isEscapeKey() {
  return key === 'Escape' || keyCode === 27;
}

function isBackKey() {
  return keyCode === BACKSPACE || key === 'Escape';
}

function getNavigationDelta() {
  if (isUpKey()) return -1;
  if (isDownKey()) return 1;
  return 0;
}

function wrapIndex(index, delta, length) {
  return (index + delta + length) % length;
}

function clampIndexAfterRemoval(index, length) {
  return length > 0 && index >= length ? length - 1 : index;
}

function formatSigned(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function formatItemDetails(item) {
  if (item.effectType === ItemEffect.KEY) return " (chave)";
  return ` (${item.effectType}: +${item.effectValue})`;
}

function showNotice(text) {
  notice.text = text;
  notice.expiresAt = millis() + NOTICE_DURATION_MS;
}

function drawInteractionPrompt(centerX, topY, label = "Pressione E para interagir") {
  fill(0);
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text(label, centerX, topY - 8);
}