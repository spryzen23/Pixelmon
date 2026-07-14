import { api } from "../api";

export async function purchaseBall(player, user, ballId, cost) {
  const newCoins = (user.pokecoins ?? 500) - cost;
  const currentInventory = player.inventory || {
    balls: { standard: 999, great: 5, ultra: 1 },
  };
  if (!currentInventory.balls) {
    currentInventory.balls = { standard: 999, great: 5, ultra: 1 };
  }

  const updatedPlayer = {
    ...player,
    coins: newCoins,
    inventory: {
      ...currentInventory,
      balls: {
        ...currentInventory.balls,
        [ballId]: (currentInventory.balls[ballId] ?? 0) + 1,
      },
    },
  };

  const [result] = await Promise.all([
    api.patchPlayer(player.id, updatedPlayer),
    api.patchPlayer(user.id, { pokecoins: newCoins }),
  ]);
  return { result, newCoins };
}
