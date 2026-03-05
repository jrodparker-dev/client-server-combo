export const Conditions: ModdedConditionData = {
  /** One-turn volatile placed by the move; deals a delayed second hit */
  twinvines: {
    name: 'Twin Vines (Follow-up)',
    // This is a VOLATILE (not a status); lasts one turn
    duration: 1,

    onStart(target, source, effect) {
      // Keep a reference to the attacker and the target lane (for Doubles)
      this.effectState.source = source;
      this.effectState.targetLoc =
        typeof source?.lastMoveTargetLoc === 'number' ? source.lastMoveTargetLoc : 0;
      // optional log:
      // this.add('-start', target, 'twinvines');
    },

    // Fire late at end of turn
    onResidualOrder: 25,
    onResidualSubOrder: 1,
    onResidual(target) {
      const source: Pokemon | undefined = this.effectState.source;
      if (!source?.hp || !target.hp) return;

      // If you placed the volatile on the USER and want to re-aim the same slot:
      // const foe = source.side.foe.active[this.effectState.targetLoc] || source.side.foe.active[0];
      // if (!foe || foe.fainted) return;

      // Build the move to use for damage calc (registered in moves.ts),
      // or replace the string with any existing move id.
      const followup = this.dex.getActiveMove('twinvines_second');

      // Calculate damage like a normal move would
      const dmg = this.actions.getDamage(source, target, followup);
      if (typeof dmg === 'number' && dmg > 0) {
        this.damage(dmg, target, source, followup);
        // optional:
        // this.add('-message', `${source.name}'s Twin Vines struck again!`);
      }
    },

    onEnd(target) {
      // optional log:
      // this.add('-end', target, 'twinvines');
    },
  },
};
