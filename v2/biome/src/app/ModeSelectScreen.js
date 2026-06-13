function ModeSelectScreen({ onSelectMode }) {
  return (
    <main className="mode-select-shell">
      <section className="mode-select-panel" aria-labelledby="mode-select-title">
        <p className="mode-eyebrow">Voxel Legends</p>
        <h1 id="mode-select-title">Choose Game Mode</h1>
        <p className="mode-select-copy">
          Start the current creature-catching prototype, or step into the new
          battle royale staging area.
        </p>

        <div className="mode-card-grid">
          <button
            className="mode-card"
            type="button"
            onClick={() => onSelectMode('normal')}
          >
            <span className="mode-card-kicker">Solo Adventure</span>
            <strong>Normal Mode</strong>
            <span>
              Explore the eight biomes, catch creatures, test weather, volcanoes,
              and the current prototype loop.
            </span>
          </button>

          <button
            className="mode-card mode-card-battle"
            type="button"
            onClick={() => onSelectMode('battleRoyale')}
          >
            <span className="mode-card-kicker">2 Minute Match</span>
            <strong>Battle Royale</strong>
            <span>
              Prepare a room, pick a biome, choose a drop point, and get ready
              for the multiplayer catch race.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default ModeSelectScreen;
