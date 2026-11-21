class CompanionPickup extends Pickup {
  constructor(x, y, name, attackBonus, hpBonus, luckBonus) {
    super(x, y, name, COLORS.companionPickup);
    this.attackBonus = attackBonus;
    this.hpBonus = hpBonus;
    this.luckBonus = luckBonus;
  }

  toCompanion() {
    return {
      name: this.name,
      attackBonus: this.attackBonus,
      hpBonus: this.hpBonus,
      luckBonus: this.luckBonus,
      equipped: false,
    };
  }
}