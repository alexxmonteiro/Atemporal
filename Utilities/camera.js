const CAMERA_SMOOTHING = 0.08;

let gameCamera;

class Camera {
  constructor(smoothing) {
    this.x = 0;
    this.y = 0;
    this.smoothing = smoothing;
  }

  getTarget(player) {
    const center = player.center;
    return { x: center.x - width / 2, y: center.y - height / 2 };
  }

  snapTo(player) {
    const target = this.getTarget(player);
    this.x = target.x;
    this.y = target.y;
  }

  follow(player) {
    const target = this.getTarget(player);
    const factor = 1 - Math.pow(1 - this.smoothing, deltaTime / (1000 / 60));
    this.x = lerp(this.x, target.x, factor);
    this.y = lerp(this.y, target.y, factor);
  }

  apply() {
    translate(-this.x, -this.y);
  }
}