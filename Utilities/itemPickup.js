class ItemPickup extends Pickup {
  constructor(x, y, name, effectType, effectValue) {
    super(x, y, name, COLORS.itemPickup);
    this.effectType = effectType;
    this.effectValue = effectValue;
  }

  toItem() {
    return {
      name: this.name,
      effectType: this.effectType,
      effectValue: this.effectValue,
    };
  }
}