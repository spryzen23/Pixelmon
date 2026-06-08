import { Battle } from 'pokemon-showdown';

try {
  console.log("Testing Pokemon Showdown import...");
  const battle = new Battle({
    formatid: 'gen7customgame',
    send: (type, data) => {
      console.log(`[Send] type=${type}, data=`, data);
    }
  });
  console.log("Battle successfully instantiated! ID:", battle.id);
  process.exit(0);
} catch (e) {
  console.error("Failed to instantiate Battle:", e);
  process.exit(1);
}
