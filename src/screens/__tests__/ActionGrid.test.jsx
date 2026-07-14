import React from "react";
import { render } from "@testing-library/react";
import { ActionGrid } from "../battle/ActionGrid";
import { expect, test, describe, vi } from "vitest";

describe("ActionGrid UI Guardrails", () => {
  test("Move buttons should retain sleek design and not use hardcoded harsh gradients", () => {
    const mockMoves = [
      { id: "m1", move: "flamethrower", type: "fire", power: 90 },
      { id: "m2", move: "surf", type: "water", power: 90 },
    ];

    const { container } = render(
      <ActionGrid
        targetSelection={null}
        showSwitch={false}
        playerTeam={{ poke1: { displayName: "Charizard" } }}
        playerSlots={["poke1"]}
        choosingSlotIdx={0}
        getMappedMoves={() => mockMoves}
        playerTurn={true}
        isActing={false}
        handlePlayerAttack={vi.fn()}
        battleFormat="doubles"
        proceedToNextSlot={vi.fn()}
      />
    );

    const btn = container.querySelector("#move-btn-m1");
    expect(btn).not.toBeNull();

    // Verify it relies on sleek CSS for background, or has subtle rgba/hex+alpha inline style
    const bgShorthand = btn.style.background;

    // Guardrail: Do NOT use harsh inline linear-gradients that override the sleek minigames.css design
    expect(bgShorthand).not.toContain("linear-gradient");

    // Guardrail: type badge should NOT have a dark background box, it should just be text
    const typeSpan = btn.querySelector(".move-btn-type");
    expect(typeSpan.style.background).not.toContain("rgba(0,0,0");
    expect(typeSpan.style.backgroundColor).not.toContain("rgba(0, 0, 0");
  });

  test("Castle button should maintain sleek design", () => {
    const { container } = render(
      <ActionGrid
        targetSelection={null}
        showSwitch={false}
        playerTeam={{}}
        playerSlots={[]}
        choosingSlotIdx={0}
        getMappedMoves={() => []}
        playerTurn={true}
        isActing={false}
        handlePlayerAttack={vi.fn()}
        battleFormat="doubles"
        proceedToNextSlot={vi.fn()}
      />
    );

    const castleBtn = container.querySelector("#move-btn-shift");
    expect(castleBtn).not.toBeNull();

    // Guardrail: Do NOT use harsh inline linear-gradients
    expect(castleBtn.style.background).not.toContain("linear-gradient");
  });
});
