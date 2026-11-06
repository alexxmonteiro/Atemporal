function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
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

function drawInteractionPrompt(centerX, topY) {
  fill(0);
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text("Pressione E para interagir", centerX, topY - 8);
}