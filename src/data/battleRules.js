export const BATTLE_RULES = {
  singles: {
    title: 'Single Battle Strategy',
    tips: [
      "⚔️ 1v1 Format: Only one Pokémon from each side is on the field.",
      "🚀 Priority and Speed: Turn order is decided by Move Priority first, then Speed stat. Speed ties are a 50/50 coin flip.",
      "⚡ Dynamic Recalculation: If Speed changes mid-turn, the turn order updates instantly.",
    ],
    spreadMoves: [],
  },
  doubles: {
    title: 'Double Battle Strategy',
    tips: [
      "💥 Spread moves (Earthquake, Surf, Discharge) hit ALL Pokémon on field — 25% weaker.",
      "🎯 Single-target moves: choose which foe to attack each turn.",
      "🤝 Helping Hand boosts your ally's next move by 50%.",
      "👆 Follow Me / Rage Powder redirects all attacks to the user.",
      "🔀 Ally Switch swaps your two Pokémon's positions.",
      "⏱️ Turn Order: Move Priority first, then Speed. Speed ties are a 50/50 coin flip.",
      "⚡ Dynamic Speed: Speed changes mid-turn recalculate action order immediately.",
    ],
    spreadMoves: ['Earthquake','Surf','Discharge','Dazzling Gleam','Rock Slide','Lava Plume','Bulldoze','Blizzard','Heat Wave','Boomburst','Self-Destruct','Explosion','Magnitude','Eruption','Sludge Wave'],
  },
  triples: {
    title: 'Triple Battle Strategy',
    tips: [
      "📍 CENTER Pokémon can attack ANY target on the field.",
      "↔️ SIDE Pokémon can only reach adjacent foes (center + opposite side).",
      "🔀 SHIFT: Left/Right Pokémon can swap to center — no stat reset!",
      "🦅 Flying-type & Pulse/Aura moves always reach non-adjacent foes.",
      "📉 Spread moves only hit ADJACENT Pokémon in triples (not all).",
      "⏱️ Turn Order: Move Priority first, then Speed. Speed ties are a 50/50 coin flip.",
      "⚡ Dynamic Speed: Speed changes mid-turn recalculate action order immediately.",
    ],
    spreadMoves: ['Earthquake','Discharge','Blizzard','Rock Slide','Lava Plume','Bulldoze','Boomburst'],
  }
};
