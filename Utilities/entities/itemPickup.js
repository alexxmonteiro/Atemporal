class ItemPickup extends Pickup {
  constructor(x, y, name, effectType, effectValue, lockId = null) {
    super(
      x,
      y,
      name,
      effectType === ItemEffect.KEY ? COLORS.keyPickup : COLORS.itemPickup
    );
    this.effectType = effectType;
    this.effectValue = effectValue;
    this.lockId = lockId;
  }

  toItem() {
    return {
      name: this.name,
      effectType: this.effectType,
      effectValue: this.effectValue,
      lockId: this.lockId,
    };
  }
}