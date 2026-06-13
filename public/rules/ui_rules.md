# UI & Aesthetic Guidelines

This document serves as a strict guardrail for all UI modifications, particularly concerning the Battle Arena. Future updates and prompts MUST adhere to these design principles to preserve the sleek, premium feel of the application.

## General Aesthetics
1. **Glassmorphism & Transparency:** Rely heavily on subtle, transparent backgrounds (e.g., `rgba(255, 255, 255, 0.03)`) combined with borders and box-shadows. Avoid stark, solid color blocks unless explicitly used for accents.
2. **Hover States:** Interactive elements must have fluid transition effects on hover. Utilize glow effects (box-shadows) tinted to the element's specific context (e.g., a Fire-type move glowing red on hover).
3. **Typography:** Keep text clean and legible. Do not use overly aggressive text shadows or harsh contrasts. Use muted colors (`var(--px-text-muted)`) for secondary information to establish clear visual hierarchy.

## Battle Arena UI Guardrails

### Action Grid (`ActionGrid.jsx`)
- **Move Buttons:** Must rely on CSS classes (e.g., `.btn-action-move`) for their base styling.
- **NEVER** apply harsh inline `linear-gradient` backgrounds to the move buttons.
- The base background should be a highly transparent, subtle tint (`10%` to `15%` opacity) of the move's elemental type.
- Do NOT float unnecessary "Slot 1" or "Action" badges awkwardly on the right side of the buttons.
- Type labels (`.move-btn-type`) should be styled via text color, NOT by wrapping the text in a solid dark background box.

### Damage Lab Analyzer (`DamageCalculator.jsx`)
- **Layout:** The Damage Calculator MUST utilize a two-column CSS Grid layout (`.dmg-calc-left-col`, `.dmg-calc-right-col`) on larger screens. Do not revert it to a single scrolling column.
- **Chaos Variance Chart:** The interactive "Roll Outputs (Chaos Variance)" visual bar chart is a critical feature. **DO NOT** replace it with simple text readouts.
- **Variables:** Always ensure the component binds to the exact variable names dictated by the game engine (`atk`, `def`, `type`). Do not unilaterally rename these in the UI without updating the core simulator.
- **Native Elements:** Hide native browser spinner arrows (`::-webkit-inner-spin-button`) on number inputs to maintain the custom, dark-themed aesthetic.
