# Pokémon by Regional Biome, Spawn Level & Evolution Stage

Generated from `src/game/data/spawnCatalog.json` via `npm run generate-pokemons-md`.

JSON mirror: `public/assets/dataSet/pokemons.json`

## Formula

```
spawnLevel = (evolutionStage - 1) × 5 + formTier
```

| formTier | Meaning |
|----------|---------|
| 1 | regular |
| 2 | shiny |
| 3 | regional/alternate |
| 4 | mega |
| 5 | gmax/multiform |

## Playable path → region map

| Path | Terrain | Region | Dex range |
|------|---------|--------|-----------|
| 0 | Fieldlands Trail | Kanto | 1–151 (151) |
| 1 | Sandglass Flats | Johto | 152–251 (100) |
| 2 | Frostpine Pass | Hoenn | 252–386 (135) |
| 3 | Coastal Run | Sinnoh | 387–493 (107) |
| 4 | Crimson Mire | Unova | 494–649 (156) |
| 5 | Coronet Approach | Kalos | 650–721 (72) |
| 6 | Fantasy World | Alola | 722–809 (88) |
| 7 | Village World | Galar | 810–905 (96) |
| — | *(no path yet)* | Paldea | 906–1025 (120) |

---

## Kanto (dex 1–151, 151 species)

**In-game path:** 0 — Fieldlands Trail

### Summary

- Spawn levels present: 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16
- Evolution stages present: 1, 2, 3, 4
- Total catalog entries: 238

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 78 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 1 | Bulbasaur | 1 | regular (regular) | grass, poison | monster, plant |
| 2 | 4 | Charmander | 1 | regular (regular) | fire | monster, dragon |
| 3 | 7 | Squirtle | 1 | regular (regular) | water | monster, water1 |
| 4 | 10 | Caterpie | 1 | regular (regular) | bug | bug |
| 5 | 13 | Weedle | 1 | regular (regular) | bug, poison | bug |
| 6 | 16 | Pidgey | 1 | regular (regular) | normal, flying | flying |
| 7 | 19 | Rattata | 1 | regular (regular) | normal | ground |
| 8 | 21 | Spearow | 1 | regular (regular) | normal, flying | flying |
| 9 | 23 | Ekans | 1 | regular (regular) | poison | ground, dragon |
| 10 | 25 | Pikachu | 1 | regular (regular) | electric | ground, fairy |
| 11 | 27 | Sandshrew | 1 | regular (regular) | ground | ground |
| 12 | 29 | Nidoran-F | 1 | regular (regular) | poison | monster, ground |
| 13 | 32 | Nidoran-M | 1 | regular (regular) | poison | monster, ground |
| 14 | 35 | Clefairy | 1 | regular (regular) | fairy | fairy |
| 15 | 37 | Vulpix | 1 | regular (regular) | fire | ground |
| 16 | 39 | Jigglypuff | 1 | regular (regular) | normal, fairy | fairy |
| 17 | 41 | Zubat | 1 | regular (regular) | poison, flying | flying |
| 18 | 43 | Oddish | 1 | regular (regular) | grass, poison | plant |
| 19 | 46 | Paras | 1 | regular (regular) | bug, grass | bug, plant |
| 20 | 48 | Venonat | 1 | regular (regular) | bug, poison | bug |
| 21 | 50 | Diglett | 1 | regular (regular) | ground | ground |
| 22 | 52 | Meowth | 1 | regular (regular) | normal | ground |
| 23 | 54 | Psyduck | 1 | regular (regular) | water | water1, ground |
| 24 | 56 | Mankey | 1 | regular (regular) | fighting | ground |
| 25 | 58 | Growlithe | 1 | regular (regular) | fire | ground |
| 26 | 60 | Poliwag | 1 | regular (regular) | water | water1 |
| 27 | 63 | Abra | 1 | regular (regular) | psychic | humanshape |
| 28 | 66 | Machop | 1 | regular (regular) | fighting | humanshape |
| 29 | 69 | Bellsprout | 1 | regular (regular) | grass, poison | plant |
| 30 | 72 | Tentacool | 1 | regular (regular) | water, poison | water3 |
| 31 | 74 | Geodude | 1 | regular (regular) | rock, ground | mineral |
| 32 | 77 | Ponyta | 1 | regular (regular) | fire | ground |
| 33 | 79 | Slowpoke | 1 | regular (regular) | water, psychic | monster, water1 |
| 34 | 81 | Magnemite | 1 | regular (regular) | electric, steel | mineral |
| 35 | 83 | Farfetchd | 1 | regular (regular) | normal, flying | flying, ground |
| 36 | 84 | Doduo | 1 | regular (regular) | normal, flying | flying |
| 37 | 86 | Seel | 1 | regular (regular) | water | water1, ground |
| 38 | 88 | Grimer | 1 | regular (regular) | poison | indeterminate |
| 39 | 90 | Shellder | 1 | regular (regular) | water | water3 |
| 40 | 92 | Gastly | 1 | regular (regular) | ghost, poison | indeterminate |
| 41 | 95 | Onix | 1 | regular (regular) | rock, ground | mineral |
| 42 | 96 | Drowzee | 1 | regular (regular) | psychic | humanshape |
| 43 | 98 | Krabby | 1 | regular (regular) | water | water3 |
| 44 | 100 | Voltorb | 1 | regular (regular) | electric | mineral |
| 45 | 102 | Exeggcute | 1 | regular (regular) | grass, psychic | plant |
| 46 | 104 | Cubone | 1 | regular (regular) | ground | monster |
| 47 | 106 | Hitmonlee | 1 | regular (regular) | fighting | humanshape |
| 48 | 108 | Lickitung | 1 | regular (regular) | normal | monster |
| 49 | 109 | Koffing | 1 | regular (regular) | poison | indeterminate |
| 50 | 111 | Rhyhorn | 1 | regular (regular) | ground, rock | monster, ground |
| 51 | 113 | Chansey | 1 | regular (regular) | normal | fairy |
| 52 | 114 | Tangela | 1 | regular (regular) | grass | plant |
| 53 | 115 | Kangaskhan | 1 | regular (regular) | normal | monster |
| 54 | 116 | Horsea | 1 | regular (regular) | water | water1, dragon |
| 55 | 118 | Goldeen | 1 | regular (regular) | water | water2 |
| 56 | 120 | Staryu | 1 | regular (regular) | water | water3 |
| 57 | 122 | Mr-Mime | 1 | regular (regular) | psychic, fairy | humanshape |
| 58 | 123 | Scyther | 1 | regular (regular) | bug, flying | bug |
| 59 | 124 | Jynx | 1 | regular (regular) | ice, psychic | humanshape |
| 60 | 125 | Electabuzz | 1 | regular (regular) | electric | humanshape |
| 61 | 126 | Magmar | 1 | regular (regular) | fire | humanshape |
| 62 | 127 | Pinsir | 1 | regular (regular) | bug | bug |
| 63 | 128 | Tauros | 1 | regular (regular) | normal | ground |
| 64 | 129 | Magikarp | 1 | regular (regular) | water | water2, dragon |
| 65 | 131 | Lapras | 1 | regular (regular) | water, ice | monster, water1 |
| 66 | 132 | Ditto | 1 | regular (regular) | normal | ditto |
| 67 | 133 | Eevee | 1 | regular (regular) | normal | ground |
| 68 | 137 | Porygon | 1 | regular (regular) | normal | mineral |
| 69 | 138 | Omanyte | 1 | regular (regular) | rock, water | water1, water3 |
| 70 | 140 | Kabuto | 1 | regular (regular) | rock, water | water1, water3 |
| 71 | 142 | Aerodactyl | 1 | regular (regular) | rock, flying | flying |
| 72 | 143 | Snorlax | 1 | regular (regular) | normal | monster |
| 73 | 144 | Articuno | 1 | regular (regular) | ice, flying | no-eggs |
| 74 | 145 | Zapdos | 1 | regular (regular) | electric, flying | no-eggs |
| 75 | 146 | Moltres | 1 | regular (regular) | fire, flying | no-eggs |
| 76 | 147 | Dratini | 1 | regular (regular) | dragon | water1, dragon |
| 77 | 150 | Mewtwo | 1 | regular (regular) | psychic | no-eggs |
| 78 | 151 | Mew | 1 | regular (regular) | psychic | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 36 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 19 | Rattata-Alola | 1 | alola (regional/alternate) | dark, normal | ground |
| 2 | 25 | Pikachu-Rock-Star | 1 | rock-star (regional/alternate) | electric | ground, fairy |
| 3 | 25 | Pikachu-Belle | 1 | belle (regional/alternate) | electric | ground, fairy |
| 4 | 25 | Pikachu-Pop-Star | 1 | pop-star (regional/alternate) | electric | ground, fairy |
| 5 | 25 | Pikachu-Phd | 1 | phd (regional/alternate) | electric | ground, fairy |
| 6 | 25 | Pikachu-Libre | 1 | libre (regional/alternate) | electric | ground, fairy |
| 7 | 25 | Pikachu-Cosplay | 1 | cosplay (regional/alternate) | electric | ground, fairy |
| 8 | 25 | Pikachu-Original-Cap | 1 | original-cap (regional/alternate) | electric | ground, fairy |
| 9 | 25 | Pikachu-Hoenn-Cap | 1 | hoenn-cap (regional/alternate) | electric | ground, fairy |
| 10 | 25 | Pikachu-Sinnoh-Cap | 1 | sinnoh-cap (regional/alternate) | electric | ground, fairy |
| 11 | 25 | Pikachu-Unova-Cap | 1 | unova-cap (regional/alternate) | electric | ground, fairy |
| 12 | 25 | Pikachu-Kalos-Cap | 1 | kalos-cap (regional/alternate) | electric | ground, fairy |
| 13 | 25 | Pikachu-Alola-Cap | 1 | alola-cap (regional/alternate) | electric | ground, fairy |
| 14 | 25 | Pikachu-Partner-Cap | 1 | partner-cap (regional/alternate) | electric | ground, fairy |
| 15 | 25 | Pikachu-Starter | 1 | starter (regional/alternate) | electric | ground, fairy |
| 16 | 25 | Pikachu-World-Cap | 1 | world-cap (regional/alternate) | electric | ground, fairy |
| 17 | 27 | Sandshrew-Alola | 1 | alola (regional/alternate) | ice, steel | ground |
| 18 | 37 | Vulpix-Alola | 1 | alola (regional/alternate) | ice | ground |
| 19 | 50 | Diglett-Alola | 1 | alola (regional/alternate) | ground, steel | ground |
| 20 | 52 | Meowth-Alola | 1 | alola (regional/alternate) | dark | ground |
| 21 | 52 | Meowth-Galar | 1 | galar (regional/alternate) | steel | ground |
| 22 | 58 | Growlithe-Hisui | 1 | hisui (regional/alternate) | fire, rock | ground |
| 23 | 74 | Geodude-Alola | 1 | alola (regional/alternate) | rock, electric | mineral |
| 24 | 77 | Ponyta-Galar | 1 | galar (regional/alternate) | psychic | ground |
| 25 | 79 | Slowpoke-Galar | 1 | galar (regional/alternate) | psychic | monster, water1 |
| 26 | 83 | Farfetchd-Galar | 1 | galar (regional/alternate) | fighting | flying, ground |
| 27 | 88 | Grimer-Alola | 1 | alola (regional/alternate) | poison, dark | indeterminate |
| 28 | 100 | Voltorb-Hisui | 1 | hisui (regional/alternate) | electric, grass | mineral |
| 29 | 122 | Mr-Mime-Galar | 1 | mime-galar (regional/alternate) | ice, psychic | humanshape |
| 30 | 128 | Tauros-Paldea-Combat-Breed | 1 | paldea-combat-breed (regional/alternate) | fighting | ground |
| 31 | 128 | Tauros-Paldea-Blaze-Breed | 1 | paldea-blaze-breed (regional/alternate) | fighting, fire | ground |
| 32 | 128 | Tauros-Paldea-Aqua-Breed | 1 | paldea-aqua-breed (regional/alternate) | fighting, water | ground |
| 33 | 133 | Eevee-Starter | 1 | starter (regional/alternate) | normal | ground |
| 34 | 144 | Articuno-Galar | 1 | galar (regional/alternate) | psychic, flying | no-eggs |
| 35 | 145 | Zapdos-Galar | 1 | galar (regional/alternate) | fighting, flying | no-eggs |
| 36 | 146 | Moltres-Galar | 1 | galar (regional/alternate) | dark, flying | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 5 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 115 | Kangaskhan-Mega | 1 | mega (mega) | normal | monster |
| 2 | 127 | Pinsir-Mega | 1 | mega (mega) | bug, flying | bug |
| 3 | 142 | Aerodactyl-Mega | 1 | mega (mega) | rock, flying | flying |
| 4 | 150 | Mewtwo-Mega-X | 1 | mega-x (mega) | psychic, fighting | no-eggs |
| 5 | 150 | Mewtwo-Mega-Y | 1 | mega-y (mega) | psychic | no-eggs |

#### Spawn level 5 (stage 1, form tier gmax/multiform) — 5 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 25 | Pikachu-Gmax | 1 | gmax (gmax/multiform) | electric | ground, fairy |
| 2 | 52 | Meowth-Gmax | 1 | gmax (gmax/multiform) | normal | ground |
| 3 | 131 | Lapras-Gmax | 1 | gmax (gmax/multiform) | water, ice | monster, water1 |
| 4 | 133 | Eevee-Gmax | 1 | gmax (gmax/multiform) | normal | ground |
| 5 | 143 | Snorlax-Gmax | 1 | gmax (gmax/multiform) | normal | monster |

#### Spawn level 6 (stage 2, form tier regular) — 55 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 2 | Ivysaur | 2 | regular (regular) | grass, poison | monster, plant |
| 2 | 5 | Charmeleon | 2 | regular (regular) | fire | monster, dragon |
| 3 | 8 | Wartortle | 2 | regular (regular) | water | monster, water1 |
| 4 | 11 | Metapod | 2 | regular (regular) | bug | bug |
| 5 | 14 | Kakuna | 2 | regular (regular) | bug, poison | bug |
| 6 | 17 | Pidgeotto | 2 | regular (regular) | normal, flying | flying |
| 7 | 20 | Raticate | 2 | regular (regular) | normal | ground |
| 8 | 22 | Fearow | 2 | regular (regular) | normal, flying | flying |
| 9 | 24 | Arbok | 2 | regular (regular) | poison | ground, dragon |
| 10 | 26 | Raichu | 2 | regular (regular) | electric | ground, fairy |
| 11 | 28 | Sandslash | 2 | regular (regular) | ground | ground |
| 12 | 30 | Nidorina | 2 | regular (regular) | poison | no-eggs |
| 13 | 33 | Nidorino | 2 | regular (regular) | poison | monster, ground |
| 14 | 36 | Clefable | 2 | regular (regular) | fairy | fairy |
| 15 | 38 | Ninetales | 2 | regular (regular) | fire | ground |
| 16 | 40 | Wigglytuff | 2 | regular (regular) | normal, fairy | fairy |
| 17 | 42 | Golbat | 2 | regular (regular) | poison, flying | flying |
| 18 | 44 | Gloom | 2 | regular (regular) | grass, poison | plant |
| 19 | 47 | Parasect | 2 | regular (regular) | bug, grass | bug, plant |
| 20 | 49 | Venomoth | 2 | regular (regular) | bug, poison | bug |
| 21 | 51 | Dugtrio | 2 | regular (regular) | ground | ground |
| 22 | 53 | Persian | 2 | regular (regular) | normal | ground |
| 23 | 55 | Golduck | 2 | regular (regular) | water | water1, ground |
| 24 | 57 | Primeape | 2 | regular (regular) | fighting | ground |
| 25 | 59 | Arcanine | 2 | regular (regular) | fire | ground |
| 26 | 61 | Poliwhirl | 2 | regular (regular) | water | water1 |
| 27 | 64 | Kadabra | 2 | regular (regular) | psychic | humanshape |
| 28 | 67 | Machoke | 2 | regular (regular) | fighting | humanshape |
| 29 | 70 | Weepinbell | 2 | regular (regular) | grass, poison | plant |
| 30 | 73 | Tentacruel | 2 | regular (regular) | water, poison | water3 |
| 31 | 75 | Graveler | 2 | regular (regular) | rock, ground | mineral |
| 32 | 78 | Rapidash | 2 | regular (regular) | fire | ground |
| 33 | 80 | Slowbro | 2 | regular (regular) | water, psychic | monster, water1 |
| 34 | 82 | Magneton | 2 | regular (regular) | electric, steel | mineral |
| 35 | 85 | Dodrio | 2 | regular (regular) | normal, flying | flying |
| 36 | 87 | Dewgong | 2 | regular (regular) | water, ice | water1, ground |
| 37 | 89 | Muk | 2 | regular (regular) | poison | indeterminate |
| 38 | 91 | Cloyster | 2 | regular (regular) | water, ice | water3 |
| 39 | 93 | Haunter | 2 | regular (regular) | ghost, poison | indeterminate |
| 40 | 97 | Hypno | 2 | regular (regular) | psychic | humanshape |
| 41 | 99 | Kingler | 2 | regular (regular) | water | water3 |
| 42 | 101 | Electrode | 2 | regular (regular) | electric | mineral |
| 43 | 103 | Exeggutor | 2 | regular (regular) | grass, psychic | plant |
| 44 | 105 | Marowak | 2 | regular (regular) | ground | monster |
| 45 | 107 | Hitmonchan | 2 | regular (regular) | fighting | humanshape |
| 46 | 110 | Weezing | 2 | regular (regular) | poison | indeterminate |
| 47 | 112 | Rhydon | 2 | regular (regular) | ground, rock | monster, ground |
| 48 | 117 | Seadra | 2 | regular (regular) | water | water1, dragon |
| 49 | 119 | Seaking | 2 | regular (regular) | water | water2 |
| 50 | 121 | Starmie | 2 | regular (regular) | water, psychic | water3 |
| 51 | 130 | Gyarados | 2 | regular (regular) | water, flying | water2, dragon |
| 52 | 134 | Vaporeon | 2 | regular (regular) | water | ground |
| 53 | 139 | Omastar | 2 | regular (regular) | rock, water | water1, water3 |
| 54 | 141 | Kabutops | 2 | regular (regular) | rock, water | water1, water3 |
| 55 | 148 | Dragonair | 2 | regular (regular) | dragon | water1, dragon |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 17 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 20 | Raticate-Alola | 2 | alola (regional/alternate) | dark, normal | ground |
| 2 | 20 | Raticate-Totem-Alola | 2 | totem-alola (regional/alternate) | dark, normal | ground |
| 3 | 26 | Raichu-Alola | 2 | alola (regional/alternate) | electric, psychic | ground, fairy |
| 4 | 28 | Sandslash-Alola | 2 | alola (regional/alternate) | ice, steel | ground |
| 5 | 38 | Ninetales-Alola | 2 | alola (regional/alternate) | ice, fairy | ground |
| 6 | 51 | Dugtrio-Alola | 2 | alola (regional/alternate) | ground, steel | ground |
| 7 | 53 | Persian-Alola | 2 | alola (regional/alternate) | dark | ground |
| 8 | 59 | Arcanine-Hisui | 2 | hisui (regional/alternate) | fire, rock | ground |
| 9 | 75 | Graveler-Alola | 2 | alola (regional/alternate) | rock, electric | mineral |
| 10 | 78 | Rapidash-Galar | 2 | galar (regional/alternate) | psychic, fairy | ground |
| 11 | 80 | Slowbro-Galar | 2 | galar (regional/alternate) | poison, psychic | monster, water1 |
| 12 | 89 | Muk-Alola | 2 | alola (regional/alternate) | poison, dark | indeterminate |
| 13 | 101 | Electrode-Hisui | 2 | hisui (regional/alternate) | electric, grass | mineral |
| 14 | 103 | Exeggutor-Alola | 2 | alola (regional/alternate) | grass, dragon | plant |
| 15 | 105 | Marowak-Alola | 2 | alola (regional/alternate) | fire, ghost | monster |
| 16 | 105 | Marowak-Totem | 2 | totem (regional/alternate) | fire, ghost | monster |
| 17 | 110 | Weezing-Galar | 2 | galar (regional/alternate) | poison, fairy | indeterminate |

#### Spawn level 9 (stage 2, form tier mega) — 6 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 26 | Raichu-Mega-X | 2 | mega-x (mega) | electric | ground, fairy |
| 2 | 26 | Raichu-Mega-Y | 2 | mega-y (mega) | electric | ground, fairy |
| 3 | 36 | Clefable-Mega | 2 | mega (mega) | fairy, flying | fairy |
| 4 | 80 | Slowbro-Mega | 2 | mega (mega) | water, psychic | monster, water1 |
| 5 | 121 | Starmie-Mega | 2 | mega (mega) | water, psychic | water3 |
| 6 | 130 | Gyarados-Mega | 2 | mega (mega) | water, dark | water2, dragon |

#### Spawn level 10 (stage 2, form tier gmax/multiform) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 99 | Kingler-Gmax | 2 | gmax (gmax/multiform) | water | water3 |

#### Spawn level 11 (stage 3, form tier regular) — 17 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 3 | Venusaur | 3 | regular (regular) | grass, poison | monster, plant |
| 2 | 6 | Charizard | 3 | regular (regular) | fire, flying | monster, dragon |
| 3 | 9 | Blastoise | 3 | regular (regular) | water | monster, water1 |
| 4 | 12 | Butterfree | 3 | regular (regular) | bug, flying | bug |
| 5 | 15 | Beedrill | 3 | regular (regular) | bug, poison | bug |
| 6 | 18 | Pidgeot | 3 | regular (regular) | normal, flying | flying |
| 7 | 31 | Nidoqueen | 3 | regular (regular) | poison, ground | no-eggs |
| 8 | 34 | Nidoking | 3 | regular (regular) | poison, ground | monster, ground |
| 9 | 45 | Vileplume | 3 | regular (regular) | grass, poison | plant |
| 10 | 62 | Poliwrath | 3 | regular (regular) | water, fighting | water1 |
| 11 | 65 | Alakazam | 3 | regular (regular) | psychic | humanshape |
| 12 | 68 | Machamp | 3 | regular (regular) | fighting | humanshape |
| 13 | 71 | Victreebel | 3 | regular (regular) | grass, poison | plant |
| 14 | 76 | Golem | 3 | regular (regular) | rock, ground | mineral |
| 15 | 94 | Gengar | 3 | regular (regular) | ghost, poison | indeterminate |
| 16 | 135 | Jolteon | 3 | regular (regular) | electric | ground |
| 17 | 149 | Dragonite | 3 | regular (regular) | dragon, flying | water1, dragon |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 76 | Golem-Alola | 3 | alola (regional/alternate) | rock, electric | mineral |

#### Spawn level 14 (stage 3, form tier mega) — 10 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 3 | Venusaur-Mega | 3 | mega (mega) | grass, poison | monster, plant |
| 2 | 6 | Charizard-Mega-X | 3 | mega-x (mega) | fire, dragon | monster, dragon |
| 3 | 6 | Charizard-Mega-Y | 3 | mega-y (mega) | fire, flying | monster, dragon |
| 4 | 9 | Blastoise-Mega | 3 | mega (mega) | water | monster, water1 |
| 5 | 15 | Beedrill-Mega | 3 | mega (mega) | bug, poison | bug |
| 6 | 18 | Pidgeot-Mega | 3 | mega (mega) | normal, flying | flying |
| 7 | 65 | Alakazam-Mega | 3 | mega (mega) | psychic | humanshape |
| 8 | 71 | Victreebel-Mega | 3 | mega (mega) | grass, poison | plant |
| 9 | 94 | Gengar-Mega | 3 | mega (mega) | ghost, poison | indeterminate |
| 10 | 149 | Dragonite-Mega | 3 | mega (mega) | dragon, flying | water1, dragon |

#### Spawn level 15 (stage 3, form tier gmax/multiform) — 6 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 3 | Venusaur-Gmax | 3 | gmax (gmax/multiform) | grass, poison | monster, plant |
| 2 | 6 | Charizard-Gmax | 3 | gmax (gmax/multiform) | fire, flying | monster, dragon |
| 3 | 9 | Blastoise-Gmax | 3 | gmax (gmax/multiform) | water | monster, water1 |
| 4 | 12 | Butterfree-Gmax | 3 | gmax (gmax/multiform) | bug, flying | bug |
| 5 | 68 | Machamp-Gmax | 3 | gmax (gmax/multiform) | fighting | humanshape |
| 6 | 94 | Gengar-Gmax | 3 | gmax (gmax/multiform) | ghost, poison | indeterminate |

#### Spawn level 16 (stage 4, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 136 | Flareon | 4 | regular (regular) | fire | ground |

### By evolution stage

#### Evolution stage 1 — 124 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 1 | Bulbasaur | regular | grass, poison |
| 1 | 4 | Charmander | regular | fire |
| 1 | 7 | Squirtle | regular | water |
| 1 | 10 | Caterpie | regular | bug |
| 1 | 13 | Weedle | regular | bug, poison |
| 1 | 16 | Pidgey | regular | normal, flying |
| 1 | 19 | Rattata | regular | normal |
| 1 | 21 | Spearow | regular | normal, flying |
| 1 | 23 | Ekans | regular | poison |
| 1 | 25 | Pikachu | regular | electric |
| 1 | 27 | Sandshrew | regular | ground |
| 1 | 29 | Nidoran-F | regular | poison |
| 1 | 32 | Nidoran-M | regular | poison |
| 1 | 35 | Clefairy | regular | fairy |
| 1 | 37 | Vulpix | regular | fire |
| 1 | 39 | Jigglypuff | regular | normal, fairy |
| 1 | 41 | Zubat | regular | poison, flying |
| 1 | 43 | Oddish | regular | grass, poison |
| 1 | 46 | Paras | regular | bug, grass |
| 1 | 48 | Venonat | regular | bug, poison |
| 1 | 50 | Diglett | regular | ground |
| 1 | 52 | Meowth | regular | normal |
| 1 | 54 | Psyduck | regular | water |
| 1 | 56 | Mankey | regular | fighting |
| 1 | 58 | Growlithe | regular | fire |
| 1 | 60 | Poliwag | regular | water |
| 1 | 63 | Abra | regular | psychic |
| 1 | 66 | Machop | regular | fighting |
| 1 | 69 | Bellsprout | regular | grass, poison |
| 1 | 72 | Tentacool | regular | water, poison |
| 1 | 74 | Geodude | regular | rock, ground |
| 1 | 77 | Ponyta | regular | fire |
| 1 | 79 | Slowpoke | regular | water, psychic |
| 1 | 81 | Magnemite | regular | electric, steel |
| 1 | 83 | Farfetchd | regular | normal, flying |
| 1 | 84 | Doduo | regular | normal, flying |
| 1 | 86 | Seel | regular | water |
| 1 | 88 | Grimer | regular | poison |
| 1 | 90 | Shellder | regular | water |
| 1 | 92 | Gastly | regular | ghost, poison |
| 1 | 95 | Onix | regular | rock, ground |
| 1 | 96 | Drowzee | regular | psychic |
| 1 | 98 | Krabby | regular | water |
| 1 | 100 | Voltorb | regular | electric |
| 1 | 102 | Exeggcute | regular | grass, psychic |
| 1 | 104 | Cubone | regular | ground |
| 1 | 106 | Hitmonlee | regular | fighting |
| 1 | 108 | Lickitung | regular | normal |
| 1 | 109 | Koffing | regular | poison |
| 1 | 111 | Rhyhorn | regular | ground, rock |
| 1 | 113 | Chansey | regular | normal |
| 1 | 114 | Tangela | regular | grass |
| 1 | 115 | Kangaskhan | regular | normal |
| 1 | 116 | Horsea | regular | water |
| 1 | 118 | Goldeen | regular | water |
| 1 | 120 | Staryu | regular | water |
| 1 | 122 | Mr-Mime | regular | psychic, fairy |
| 1 | 123 | Scyther | regular | bug, flying |
| 1 | 124 | Jynx | regular | ice, psychic |
| 1 | 125 | Electabuzz | regular | electric |
| 1 | 126 | Magmar | regular | fire |
| 1 | 127 | Pinsir | regular | bug |
| 1 | 128 | Tauros | regular | normal |
| 1 | 129 | Magikarp | regular | water |
| 1 | 131 | Lapras | regular | water, ice |
| 1 | 132 | Ditto | regular | normal |
| 1 | 133 | Eevee | regular | normal |
| 1 | 137 | Porygon | regular | normal |
| 1 | 138 | Omanyte | regular | rock, water |
| 1 | 140 | Kabuto | regular | rock, water |
| 1 | 142 | Aerodactyl | regular | rock, flying |
| 1 | 143 | Snorlax | regular | normal |
| 1 | 144 | Articuno | regular | ice, flying |
| 1 | 145 | Zapdos | regular | electric, flying |
| 1 | 146 | Moltres | regular | fire, flying |
| 1 | 147 | Dratini | regular | dragon |
| 1 | 150 | Mewtwo | regular | psychic |
| 1 | 151 | Mew | regular | psychic |
| 3 | 19 | Rattata-Alola | alola | dark, normal |
| 3 | 25 | Pikachu-Rock-Star | rock-star | electric |
| 3 | 25 | Pikachu-Belle | belle | electric |
| 3 | 25 | Pikachu-Pop-Star | pop-star | electric |
| 3 | 25 | Pikachu-Phd | phd | electric |
| 3 | 25 | Pikachu-Libre | libre | electric |
| 3 | 25 | Pikachu-Cosplay | cosplay | electric |
| 3 | 25 | Pikachu-Original-Cap | original-cap | electric |
| 3 | 25 | Pikachu-Hoenn-Cap | hoenn-cap | electric |
| 3 | 25 | Pikachu-Sinnoh-Cap | sinnoh-cap | electric |
| 3 | 25 | Pikachu-Unova-Cap | unova-cap | electric |
| 3 | 25 | Pikachu-Kalos-Cap | kalos-cap | electric |
| 3 | 25 | Pikachu-Alola-Cap | alola-cap | electric |
| 3 | 25 | Pikachu-Partner-Cap | partner-cap | electric |
| 3 | 25 | Pikachu-Starter | starter | electric |
| 3 | 25 | Pikachu-World-Cap | world-cap | electric |
| 3 | 27 | Sandshrew-Alola | alola | ice, steel |
| 3 | 37 | Vulpix-Alola | alola | ice |
| 3 | 50 | Diglett-Alola | alola | ground, steel |
| 3 | 52 | Meowth-Alola | alola | dark |
| 3 | 52 | Meowth-Galar | galar | steel |
| 3 | 58 | Growlithe-Hisui | hisui | fire, rock |
| 3 | 74 | Geodude-Alola | alola | rock, electric |
| 3 | 77 | Ponyta-Galar | galar | psychic |
| 3 | 79 | Slowpoke-Galar | galar | psychic |
| 3 | 83 | Farfetchd-Galar | galar | fighting |
| 3 | 88 | Grimer-Alola | alola | poison, dark |
| 3 | 100 | Voltorb-Hisui | hisui | electric, grass |
| 3 | 122 | Mr-Mime-Galar | mime-galar | ice, psychic |
| 3 | 128 | Tauros-Paldea-Combat-Breed | paldea-combat-breed | fighting |
| 3 | 128 | Tauros-Paldea-Blaze-Breed | paldea-blaze-breed | fighting, fire |
| 3 | 128 | Tauros-Paldea-Aqua-Breed | paldea-aqua-breed | fighting, water |
| 3 | 133 | Eevee-Starter | starter | normal |
| 3 | 144 | Articuno-Galar | galar | psychic, flying |
| 3 | 145 | Zapdos-Galar | galar | fighting, flying |
| 3 | 146 | Moltres-Galar | galar | dark, flying |
| 4 | 115 | Kangaskhan-Mega | mega | normal |
| 4 | 127 | Pinsir-Mega | mega | bug, flying |
| 4 | 142 | Aerodactyl-Mega | mega | rock, flying |
| 4 | 150 | Mewtwo-Mega-X | mega-x | psychic, fighting |
| 4 | 150 | Mewtwo-Mega-Y | mega-y | psychic |
| 5 | 25 | Pikachu-Gmax | gmax | electric |
| 5 | 52 | Meowth-Gmax | gmax | normal |
| 5 | 131 | Lapras-Gmax | gmax | water, ice |
| 5 | 133 | Eevee-Gmax | gmax | normal |
| 5 | 143 | Snorlax-Gmax | gmax | normal |

#### Evolution stage 2 — 79 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 2 | Ivysaur | regular | grass, poison |
| 6 | 5 | Charmeleon | regular | fire |
| 6 | 8 | Wartortle | regular | water |
| 6 | 11 | Metapod | regular | bug |
| 6 | 14 | Kakuna | regular | bug, poison |
| 6 | 17 | Pidgeotto | regular | normal, flying |
| 6 | 20 | Raticate | regular | normal |
| 6 | 22 | Fearow | regular | normal, flying |
| 6 | 24 | Arbok | regular | poison |
| 6 | 26 | Raichu | regular | electric |
| 6 | 28 | Sandslash | regular | ground |
| 6 | 30 | Nidorina | regular | poison |
| 6 | 33 | Nidorino | regular | poison |
| 6 | 36 | Clefable | regular | fairy |
| 6 | 38 | Ninetales | regular | fire |
| 6 | 40 | Wigglytuff | regular | normal, fairy |
| 6 | 42 | Golbat | regular | poison, flying |
| 6 | 44 | Gloom | regular | grass, poison |
| 6 | 47 | Parasect | regular | bug, grass |
| 6 | 49 | Venomoth | regular | bug, poison |
| 6 | 51 | Dugtrio | regular | ground |
| 6 | 53 | Persian | regular | normal |
| 6 | 55 | Golduck | regular | water |
| 6 | 57 | Primeape | regular | fighting |
| 6 | 59 | Arcanine | regular | fire |
| 6 | 61 | Poliwhirl | regular | water |
| 6 | 64 | Kadabra | regular | psychic |
| 6 | 67 | Machoke | regular | fighting |
| 6 | 70 | Weepinbell | regular | grass, poison |
| 6 | 73 | Tentacruel | regular | water, poison |
| 6 | 75 | Graveler | regular | rock, ground |
| 6 | 78 | Rapidash | regular | fire |
| 6 | 80 | Slowbro | regular | water, psychic |
| 6 | 82 | Magneton | regular | electric, steel |
| 6 | 85 | Dodrio | regular | normal, flying |
| 6 | 87 | Dewgong | regular | water, ice |
| 6 | 89 | Muk | regular | poison |
| 6 | 91 | Cloyster | regular | water, ice |
| 6 | 93 | Haunter | regular | ghost, poison |
| 6 | 97 | Hypno | regular | psychic |
| 6 | 99 | Kingler | regular | water |
| 6 | 101 | Electrode | regular | electric |
| 6 | 103 | Exeggutor | regular | grass, psychic |
| 6 | 105 | Marowak | regular | ground |
| 6 | 107 | Hitmonchan | regular | fighting |
| 6 | 110 | Weezing | regular | poison |
| 6 | 112 | Rhydon | regular | ground, rock |
| 6 | 117 | Seadra | regular | water |
| 6 | 119 | Seaking | regular | water |
| 6 | 121 | Starmie | regular | water, psychic |
| 6 | 130 | Gyarados | regular | water, flying |
| 6 | 134 | Vaporeon | regular | water |
| 6 | 139 | Omastar | regular | rock, water |
| 6 | 141 | Kabutops | regular | rock, water |
| 6 | 148 | Dragonair | regular | dragon |
| 8 | 20 | Raticate-Alola | alola | dark, normal |
| 8 | 20 | Raticate-Totem-Alola | totem-alola | dark, normal |
| 8 | 26 | Raichu-Alola | alola | electric, psychic |
| 8 | 28 | Sandslash-Alola | alola | ice, steel |
| 8 | 38 | Ninetales-Alola | alola | ice, fairy |
| 8 | 51 | Dugtrio-Alola | alola | ground, steel |
| 8 | 53 | Persian-Alola | alola | dark |
| 8 | 59 | Arcanine-Hisui | hisui | fire, rock |
| 8 | 75 | Graveler-Alola | alola | rock, electric |
| 8 | 78 | Rapidash-Galar | galar | psychic, fairy |
| 8 | 80 | Slowbro-Galar | galar | poison, psychic |
| 8 | 89 | Muk-Alola | alola | poison, dark |
| 8 | 101 | Electrode-Hisui | hisui | electric, grass |
| 8 | 103 | Exeggutor-Alola | alola | grass, dragon |
| 8 | 105 | Marowak-Alola | alola | fire, ghost |
| 8 | 105 | Marowak-Totem | totem | fire, ghost |
| 8 | 110 | Weezing-Galar | galar | poison, fairy |
| 9 | 26 | Raichu-Mega-X | mega-x | electric |
| 9 | 26 | Raichu-Mega-Y | mega-y | electric |
| 9 | 36 | Clefable-Mega | mega | fairy, flying |
| 9 | 80 | Slowbro-Mega | mega | water, psychic |
| 9 | 121 | Starmie-Mega | mega | water, psychic |
| 9 | 130 | Gyarados-Mega | mega | water, dark |
| 10 | 99 | Kingler-Gmax | gmax | water |

#### Evolution stage 3 — 34 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 3 | Venusaur | regular | grass, poison |
| 11 | 6 | Charizard | regular | fire, flying |
| 11 | 9 | Blastoise | regular | water |
| 11 | 12 | Butterfree | regular | bug, flying |
| 11 | 15 | Beedrill | regular | bug, poison |
| 11 | 18 | Pidgeot | regular | normal, flying |
| 11 | 31 | Nidoqueen | regular | poison, ground |
| 11 | 34 | Nidoking | regular | poison, ground |
| 11 | 45 | Vileplume | regular | grass, poison |
| 11 | 62 | Poliwrath | regular | water, fighting |
| 11 | 65 | Alakazam | regular | psychic |
| 11 | 68 | Machamp | regular | fighting |
| 11 | 71 | Victreebel | regular | grass, poison |
| 11 | 76 | Golem | regular | rock, ground |
| 11 | 94 | Gengar | regular | ghost, poison |
| 11 | 135 | Jolteon | regular | electric |
| 11 | 149 | Dragonite | regular | dragon, flying |
| 13 | 76 | Golem-Alola | alola | rock, electric |
| 14 | 3 | Venusaur-Mega | mega | grass, poison |
| 14 | 6 | Charizard-Mega-X | mega-x | fire, dragon |
| 14 | 6 | Charizard-Mega-Y | mega-y | fire, flying |
| 14 | 9 | Blastoise-Mega | mega | water |
| 14 | 15 | Beedrill-Mega | mega | bug, poison |
| 14 | 18 | Pidgeot-Mega | mega | normal, flying |
| 14 | 65 | Alakazam-Mega | mega | psychic |
| 14 | 71 | Victreebel-Mega | mega | grass, poison |
| 14 | 94 | Gengar-Mega | mega | ghost, poison |
| 14 | 149 | Dragonite-Mega | mega | dragon, flying |
| 15 | 3 | Venusaur-Gmax | gmax | grass, poison |
| 15 | 6 | Charizard-Gmax | gmax | fire, flying |
| 15 | 9 | Blastoise-Gmax | gmax | water |
| 15 | 12 | Butterfree-Gmax | gmax | bug, flying |
| 15 | 68 | Machamp-Gmax | gmax | fighting |
| 15 | 94 | Gengar-Gmax | gmax | ghost, poison |

#### Evolution stage 4 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 136 | Flareon | regular | fire |

---

## Johto (dex 152–251, 100 species)

**In-game path:** 1 — Sandglass Flats

### Summary

- Spawn levels present: 1, 3, 4, 6, 9, 11, 13, 14, 16, 21, 26
- Evolution stages present: 1, 2, 3, 4, 5, 6
- Total catalog entries: 115

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 51 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 152 | Chikorita | 1 | regular (regular) | grass | monster, plant |
| 2 | 155 | Cyndaquil | 1 | regular (regular) | fire | ground |
| 3 | 158 | Totodile | 1 | regular (regular) | water | monster, water1 |
| 4 | 161 | Sentret | 1 | regular (regular) | normal | ground |
| 5 | 163 | Hoothoot | 1 | regular (regular) | normal, flying | flying |
| 6 | 165 | Ledyba | 1 | regular (regular) | bug, flying | bug |
| 7 | 167 | Spinarak | 1 | regular (regular) | bug, poison | bug |
| 8 | 170 | Chinchou | 1 | regular (regular) | water, electric | water2 |
| 9 | 175 | Togepi | 1 | regular (regular) | fairy | no-eggs |
| 10 | 177 | Natu | 1 | regular (regular) | psychic, flying | flying |
| 11 | 179 | Mareep | 1 | regular (regular) | electric | monster, ground |
| 12 | 183 | Marill | 1 | regular (regular) | water, fairy | water1, fairy |
| 13 | 185 | Sudowoodo | 1 | regular (regular) | rock | mineral |
| 14 | 187 | Hoppip | 1 | regular (regular) | grass, flying | fairy, plant |
| 15 | 190 | Aipom | 1 | regular (regular) | normal | ground |
| 16 | 191 | Sunkern | 1 | regular (regular) | grass | plant |
| 17 | 193 | Yanma | 1 | regular (regular) | bug, flying | bug |
| 18 | 194 | Wooper | 1 | regular (regular) | water, ground | water1, ground |
| 19 | 198 | Murkrow | 1 | regular (regular) | dark, flying | flying |
| 20 | 200 | Misdreavus | 1 | regular (regular) | ghost | indeterminate |
| 21 | 201 | Unown | 1 | regular (regular) | psychic | no-eggs |
| 22 | 202 | Wobbuffet | 1 | regular (regular) | psychic | indeterminate |
| 23 | 203 | Girafarig | 1 | regular (regular) | normal, psychic | ground |
| 24 | 204 | Pineco | 1 | regular (regular) | bug | bug |
| 25 | 206 | Dunsparce | 1 | regular (regular) | normal | ground |
| 26 | 207 | Gligar | 1 | regular (regular) | ground, flying | bug |
| 27 | 209 | Snubbull | 1 | regular (regular) | fairy | ground, fairy |
| 28 | 211 | Qwilfish | 1 | regular (regular) | water, poison | water2 |
| 29 | 213 | Shuckle | 1 | regular (regular) | bug, rock | bug |
| 30 | 214 | Heracross | 1 | regular (regular) | bug, fighting | bug |
| 31 | 215 | Sneasel | 1 | regular (regular) | dark, ice | ground |
| 32 | 216 | Teddiursa | 1 | regular (regular) | normal | ground |
| 33 | 218 | Slugma | 1 | regular (regular) | fire | indeterminate |
| 34 | 220 | Swinub | 1 | regular (regular) | ice, ground | ground |
| 35 | 222 | Corsola | 1 | regular (regular) | water, rock | water1, water3 |
| 36 | 223 | Remoraid | 1 | regular (regular) | water | water1, water2 |
| 37 | 225 | Delibird | 1 | regular (regular) | ice, flying | water1, ground |
| 38 | 226 | Mantine | 1 | regular (regular) | water, flying | water1 |
| 39 | 227 | Skarmory | 1 | regular (regular) | steel, flying | flying |
| 40 | 228 | Houndour | 1 | regular (regular) | dark, fire | ground |
| 41 | 231 | Phanpy | 1 | regular (regular) | ground | ground |
| 42 | 234 | Stantler | 1 | regular (regular) | normal | ground |
| 43 | 235 | Smeargle | 1 | regular (regular) | normal | ground |
| 44 | 241 | Miltank | 1 | regular (regular) | normal | ground |
| 45 | 243 | Raikou | 1 | regular (regular) | electric | no-eggs |
| 46 | 244 | Entei | 1 | regular (regular) | fire | no-eggs |
| 47 | 245 | Suicune | 1 | regular (regular) | water | no-eggs |
| 48 | 246 | Larvitar | 1 | regular (regular) | rock, ground | monster |
| 49 | 249 | Lugia | 1 | regular (regular) | psychic, flying | no-eggs |
| 50 | 250 | Ho-Oh | 1 | regular (regular) | fire, flying | no-eggs |
| 51 | 251 | Celebi | 1 | regular (regular) | psychic, grass | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 194 | Wooper-Paldea | 1 | paldea (regional/alternate) | poison, ground | water1, ground |
| 2 | 211 | Qwilfish-Hisui | 1 | hisui (regional/alternate) | dark, poison | water2 |
| 3 | 215 | Sneasel-Hisui | 1 | hisui (regional/alternate) | fighting, poison | ground |
| 4 | 222 | Corsola-Galar | 1 | galar (regional/alternate) | ghost | water1, water3 |

#### Spawn level 4 (stage 1, form tier mega) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 214 | Heracross-Mega | 1 | mega (mega) | bug, fighting | bug |
| 2 | 227 | Skarmory-Mega | 1 | mega (mega) | steel, flying | flying |

#### Spawn level 6 (stage 2, form tier regular) — 31 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 153 | Bayleef | 2 | regular (regular) | grass | monster, plant |
| 2 | 156 | Quilava | 2 | regular (regular) | fire | ground |
| 3 | 159 | Croconaw | 2 | regular (regular) | water | monster, water1 |
| 4 | 162 | Furret | 2 | regular (regular) | normal | ground |
| 5 | 164 | Noctowl | 2 | regular (regular) | normal, flying | flying |
| 6 | 166 | Ledian | 2 | regular (regular) | bug, flying | bug |
| 7 | 168 | Ariados | 2 | regular (regular) | bug, poison | bug |
| 8 | 171 | Lanturn | 2 | regular (regular) | water, electric | water2 |
| 9 | 176 | Togetic | 2 | regular (regular) | fairy, flying | flying, fairy |
| 10 | 178 | Xatu | 2 | regular (regular) | psychic, flying | flying |
| 11 | 180 | Flaaffy | 2 | regular (regular) | electric | monster, ground |
| 12 | 184 | Azumarill | 2 | regular (regular) | water, fairy | water1, fairy |
| 13 | 188 | Skiploom | 2 | regular (regular) | grass, flying | fairy, plant |
| 14 | 192 | Sunflora | 2 | regular (regular) | grass | plant |
| 15 | 195 | Quagsire | 2 | regular (regular) | water, ground | water1, ground |
| 16 | 205 | Forretress | 2 | regular (regular) | bug, steel | bug |
| 17 | 208 | Steelix | 2 | regular (regular) | steel, ground | mineral |
| 18 | 210 | Granbull | 2 | regular (regular) | fairy | ground, fairy |
| 19 | 212 | Scizor | 2 | regular (regular) | bug, steel | bug |
| 20 | 217 | Ursaring | 2 | regular (regular) | normal | ground |
| 21 | 219 | Magcargo | 2 | regular (regular) | fire, rock | indeterminate |
| 22 | 221 | Piloswine | 2 | regular (regular) | ice, ground | ground |
| 23 | 224 | Octillery | 2 | regular (regular) | water | water1, water2 |
| 24 | 229 | Houndoom | 2 | regular (regular) | dark, fire | ground |
| 25 | 232 | Donphan | 2 | regular (regular) | ground | ground |
| 26 | 233 | Porygon2 | 2 | regular (regular) | normal | mineral |
| 27 | 238 | Smoochum | 2 | regular (regular) | ice, psychic | no-eggs |
| 28 | 239 | Elekid | 2 | regular (regular) | electric | no-eggs |
| 29 | 240 | Magby | 2 | regular (regular) | fire | no-eggs |
| 30 | 242 | Blissey | 2 | regular (regular) | normal | fairy |
| 31 | 247 | Pupitar | 2 | regular (regular) | rock, ground | monster |

#### Spawn level 9 (stage 2, form tier mega) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 208 | Steelix-Mega | 2 | mega (mega) | steel, ground | mineral |
| 2 | 212 | Scizor-Mega | 2 | mega (mega) | bug, steel | bug |
| 3 | 229 | Houndoom-Mega | 2 | mega (mega) | dark, fire | ground |

#### Spawn level 11 (stage 3, form tier regular) — 13 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 154 | Meganium | 3 | regular (regular) | grass | monster, plant |
| 2 | 157 | Typhlosion | 3 | regular (regular) | fire | ground |
| 3 | 160 | Feraligatr | 3 | regular (regular) | water | monster, water1 |
| 4 | 169 | Crobat | 3 | regular (regular) | poison, flying | flying |
| 5 | 172 | Pichu | 3 | regular (regular) | electric | no-eggs |
| 6 | 173 | Cleffa | 3 | regular (regular) | fairy | no-eggs |
| 7 | 174 | Igglybuff | 3 | regular (regular) | normal, fairy | no-eggs |
| 8 | 181 | Ampharos | 3 | regular (regular) | electric | monster, ground |
| 9 | 189 | Jumpluff | 3 | regular (regular) | grass, flying | fairy, plant |
| 10 | 199 | Slowking | 3 | regular (regular) | water, psychic | monster, water1 |
| 11 | 230 | Kingdra | 3 | regular (regular) | water, dragon | water1, dragon |
| 12 | 236 | Tyrogue | 3 | regular (regular) | fighting | no-eggs |
| 13 | 248 | Tyranitar | 3 | regular (regular) | rock, dark | monster |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 157 | Typhlosion-Hisui | 3 | hisui (regional/alternate) | fire, ghost | ground |
| 2 | 199 | Slowking-Galar | 3 | galar (regional/alternate) | poison, psychic | monster, water1 |

#### Spawn level 14 (stage 3, form tier mega) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 154 | Meganium-Mega | 3 | mega (mega) | grass, fairy | monster, plant |
| 2 | 160 | Feraligatr-Mega | 3 | mega (mega) | water, dragon | monster, water1 |
| 3 | 181 | Ampharos-Mega | 3 | mega (mega) | electric, dragon | monster, ground |
| 4 | 248 | Tyranitar-Mega | 3 | mega (mega) | rock, dark | monster |

#### Spawn level 16 (stage 4, form tier regular) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 182 | Bellossom | 4 | regular (regular) | grass | plant |
| 2 | 186 | Politoed | 4 | regular (regular) | water | water1 |
| 3 | 237 | Hitmontop | 4 | regular (regular) | fighting | humanshape |

#### Spawn level 21 (stage 5, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 196 | Espeon | 5 | regular (regular) | psychic | ground |

#### Spawn level 26 (stage 6, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 197 | Umbreon | 6 | regular (regular) | dark | ground |

### By evolution stage

#### Evolution stage 1 — 57 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 152 | Chikorita | regular | grass |
| 1 | 155 | Cyndaquil | regular | fire |
| 1 | 158 | Totodile | regular | water |
| 1 | 161 | Sentret | regular | normal |
| 1 | 163 | Hoothoot | regular | normal, flying |
| 1 | 165 | Ledyba | regular | bug, flying |
| 1 | 167 | Spinarak | regular | bug, poison |
| 1 | 170 | Chinchou | regular | water, electric |
| 1 | 175 | Togepi | regular | fairy |
| 1 | 177 | Natu | regular | psychic, flying |
| 1 | 179 | Mareep | regular | electric |
| 1 | 183 | Marill | regular | water, fairy |
| 1 | 185 | Sudowoodo | regular | rock |
| 1 | 187 | Hoppip | regular | grass, flying |
| 1 | 190 | Aipom | regular | normal |
| 1 | 191 | Sunkern | regular | grass |
| 1 | 193 | Yanma | regular | bug, flying |
| 1 | 194 | Wooper | regular | water, ground |
| 1 | 198 | Murkrow | regular | dark, flying |
| 1 | 200 | Misdreavus | regular | ghost |
| 1 | 201 | Unown | regular | psychic |
| 1 | 202 | Wobbuffet | regular | psychic |
| 1 | 203 | Girafarig | regular | normal, psychic |
| 1 | 204 | Pineco | regular | bug |
| 1 | 206 | Dunsparce | regular | normal |
| 1 | 207 | Gligar | regular | ground, flying |
| 1 | 209 | Snubbull | regular | fairy |
| 1 | 211 | Qwilfish | regular | water, poison |
| 1 | 213 | Shuckle | regular | bug, rock |
| 1 | 214 | Heracross | regular | bug, fighting |
| 1 | 215 | Sneasel | regular | dark, ice |
| 1 | 216 | Teddiursa | regular | normal |
| 1 | 218 | Slugma | regular | fire |
| 1 | 220 | Swinub | regular | ice, ground |
| 1 | 222 | Corsola | regular | water, rock |
| 1 | 223 | Remoraid | regular | water |
| 1 | 225 | Delibird | regular | ice, flying |
| 1 | 226 | Mantine | regular | water, flying |
| 1 | 227 | Skarmory | regular | steel, flying |
| 1 | 228 | Houndour | regular | dark, fire |
| 1 | 231 | Phanpy | regular | ground |
| 1 | 234 | Stantler | regular | normal |
| 1 | 235 | Smeargle | regular | normal |
| 1 | 241 | Miltank | regular | normal |
| 1 | 243 | Raikou | regular | electric |
| 1 | 244 | Entei | regular | fire |
| 1 | 245 | Suicune | regular | water |
| 1 | 246 | Larvitar | regular | rock, ground |
| 1 | 249 | Lugia | regular | psychic, flying |
| 1 | 250 | Ho-Oh | regular | fire, flying |
| 1 | 251 | Celebi | regular | psychic, grass |
| 3 | 194 | Wooper-Paldea | paldea | poison, ground |
| 3 | 211 | Qwilfish-Hisui | hisui | dark, poison |
| 3 | 215 | Sneasel-Hisui | hisui | fighting, poison |
| 3 | 222 | Corsola-Galar | galar | ghost |
| 4 | 214 | Heracross-Mega | mega | bug, fighting |
| 4 | 227 | Skarmory-Mega | mega | steel, flying |

#### Evolution stage 2 — 34 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 153 | Bayleef | regular | grass |
| 6 | 156 | Quilava | regular | fire |
| 6 | 159 | Croconaw | regular | water |
| 6 | 162 | Furret | regular | normal |
| 6 | 164 | Noctowl | regular | normal, flying |
| 6 | 166 | Ledian | regular | bug, flying |
| 6 | 168 | Ariados | regular | bug, poison |
| 6 | 171 | Lanturn | regular | water, electric |
| 6 | 176 | Togetic | regular | fairy, flying |
| 6 | 178 | Xatu | regular | psychic, flying |
| 6 | 180 | Flaaffy | regular | electric |
| 6 | 184 | Azumarill | regular | water, fairy |
| 6 | 188 | Skiploom | regular | grass, flying |
| 6 | 192 | Sunflora | regular | grass |
| 6 | 195 | Quagsire | regular | water, ground |
| 6 | 205 | Forretress | regular | bug, steel |
| 6 | 208 | Steelix | regular | steel, ground |
| 6 | 210 | Granbull | regular | fairy |
| 6 | 212 | Scizor | regular | bug, steel |
| 6 | 217 | Ursaring | regular | normal |
| 6 | 219 | Magcargo | regular | fire, rock |
| 6 | 221 | Piloswine | regular | ice, ground |
| 6 | 224 | Octillery | regular | water |
| 6 | 229 | Houndoom | regular | dark, fire |
| 6 | 232 | Donphan | regular | ground |
| 6 | 233 | Porygon2 | regular | normal |
| 6 | 238 | Smoochum | regular | ice, psychic |
| 6 | 239 | Elekid | regular | electric |
| 6 | 240 | Magby | regular | fire |
| 6 | 242 | Blissey | regular | normal |
| 6 | 247 | Pupitar | regular | rock, ground |
| 9 | 208 | Steelix-Mega | mega | steel, ground |
| 9 | 212 | Scizor-Mega | mega | bug, steel |
| 9 | 229 | Houndoom-Mega | mega | dark, fire |

#### Evolution stage 3 — 19 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 154 | Meganium | regular | grass |
| 11 | 157 | Typhlosion | regular | fire |
| 11 | 160 | Feraligatr | regular | water |
| 11 | 169 | Crobat | regular | poison, flying |
| 11 | 172 | Pichu | regular | electric |
| 11 | 173 | Cleffa | regular | fairy |
| 11 | 174 | Igglybuff | regular | normal, fairy |
| 11 | 181 | Ampharos | regular | electric |
| 11 | 189 | Jumpluff | regular | grass, flying |
| 11 | 199 | Slowking | regular | water, psychic |
| 11 | 230 | Kingdra | regular | water, dragon |
| 11 | 236 | Tyrogue | regular | fighting |
| 11 | 248 | Tyranitar | regular | rock, dark |
| 13 | 157 | Typhlosion-Hisui | hisui | fire, ghost |
| 13 | 199 | Slowking-Galar | galar | poison, psychic |
| 14 | 154 | Meganium-Mega | mega | grass, fairy |
| 14 | 160 | Feraligatr-Mega | mega | water, dragon |
| 14 | 181 | Ampharos-Mega | mega | electric, dragon |
| 14 | 248 | Tyranitar-Mega | mega | rock, dark |

#### Evolution stage 4 — 3 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 182 | Bellossom | regular | grass |
| 16 | 186 | Politoed | regular | water |
| 16 | 237 | Hitmontop | regular | fighting |

#### Evolution stage 5 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 21 | 196 | Espeon | regular | psychic |

#### Evolution stage 6 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 26 | 197 | Umbreon | regular | dark |

---

## Hoenn (dex 252–386, 135 species)

**In-game path:** 2 — Frostpine Pass

### Summary

- Spawn levels present: 1, 3, 4, 6, 8, 9, 11, 14, 16, 21
- Evolution stages present: 1, 2, 3, 4, 5
- Total catalog entries: 167

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 73 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 252 | Treecko | 1 | regular (regular) | grass | monster, dragon |
| 2 | 255 | Torchic | 1 | regular (regular) | fire | ground |
| 3 | 258 | Mudkip | 1 | regular (regular) | water | monster, water1 |
| 4 | 261 | Poochyena | 1 | regular (regular) | dark | ground |
| 5 | 263 | Zigzagoon | 1 | regular (regular) | normal | ground |
| 6 | 265 | Wurmple | 1 | regular (regular) | bug | bug |
| 7 | 270 | Lotad | 1 | regular (regular) | water, grass | water1, plant |
| 8 | 273 | Seedot | 1 | regular (regular) | grass | ground, plant |
| 9 | 276 | Taillow | 1 | regular (regular) | normal, flying | flying |
| 10 | 278 | Wingull | 1 | regular (regular) | water, flying | water1, flying |
| 11 | 280 | Ralts | 1 | regular (regular) | psychic, fairy | humanshape, indeterminate |
| 12 | 283 | Surskit | 1 | regular (regular) | bug, water | water1, bug |
| 13 | 285 | Shroomish | 1 | regular (regular) | grass | fairy, plant |
| 14 | 287 | Slakoth | 1 | regular (regular) | normal | ground |
| 15 | 290 | Nincada | 1 | regular (regular) | bug, ground | bug |
| 16 | 293 | Whismur | 1 | regular (regular) | normal | monster, ground |
| 17 | 296 | Makuhita | 1 | regular (regular) | fighting | humanshape |
| 18 | 299 | Nosepass | 1 | regular (regular) | rock | mineral |
| 19 | 300 | Skitty | 1 | regular (regular) | normal | ground, fairy |
| 20 | 302 | Sableye | 1 | regular (regular) | dark, ghost | humanshape |
| 21 | 303 | Mawile | 1 | regular (regular) | steel, fairy | ground, fairy |
| 22 | 304 | Aron | 1 | regular (regular) | steel, rock | monster |
| 23 | 307 | Meditite | 1 | regular (regular) | fighting, psychic | humanshape |
| 24 | 309 | Electrike | 1 | regular (regular) | electric | ground |
| 25 | 311 | Plusle | 1 | regular (regular) | electric | fairy |
| 26 | 312 | Minun | 1 | regular (regular) | electric | fairy |
| 27 | 313 | Volbeat | 1 | regular (regular) | bug | bug, humanshape |
| 28 | 314 | Illumise | 1 | regular (regular) | bug | bug, humanshape |
| 29 | 315 | Roselia | 1 | regular (regular) | grass, poison | fairy, plant |
| 30 | 316 | Gulpin | 1 | regular (regular) | poison | indeterminate |
| 31 | 318 | Carvanha | 1 | regular (regular) | water, dark | water2 |
| 32 | 320 | Wailmer | 1 | regular (regular) | water | ground, water2 |
| 33 | 322 | Numel | 1 | regular (regular) | fire, ground | ground |
| 34 | 324 | Torkoal | 1 | regular (regular) | fire | ground |
| 35 | 325 | Spoink | 1 | regular (regular) | psychic | ground |
| 36 | 327 | Spinda | 1 | regular (regular) | normal | ground, humanshape |
| 37 | 328 | Trapinch | 1 | regular (regular) | ground | bug, dragon |
| 38 | 331 | Cacnea | 1 | regular (regular) | grass | plant, humanshape |
| 39 | 333 | Swablu | 1 | regular (regular) | normal, flying | flying, dragon |
| 40 | 335 | Zangoose | 1 | regular (regular) | normal | ground |
| 41 | 336 | Seviper | 1 | regular (regular) | poison | ground, dragon |
| 42 | 337 | Lunatone | 1 | regular (regular) | rock, psychic | mineral |
| 43 | 338 | Solrock | 1 | regular (regular) | rock, psychic | mineral |
| 44 | 339 | Barboach | 1 | regular (regular) | water, ground | water2 |
| 45 | 341 | Corphish | 1 | regular (regular) | water | water1, water3 |
| 46 | 343 | Baltoy | 1 | regular (regular) | ground, psychic | mineral |
| 47 | 345 | Lileep | 1 | regular (regular) | rock, grass | water3 |
| 48 | 347 | Anorith | 1 | regular (regular) | rock, bug | water3 |
| 49 | 349 | Feebas | 1 | regular (regular) | water | water1, dragon |
| 50 | 351 | Castform | 1 | regular (regular) | normal | fairy, indeterminate |
| 51 | 352 | Kecleon | 1 | regular (regular) | normal | ground |
| 52 | 353 | Shuppet | 1 | regular (regular) | ghost | indeterminate |
| 53 | 355 | Duskull | 1 | regular (regular) | ghost | indeterminate |
| 54 | 357 | Tropius | 1 | regular (regular) | grass, flying | monster, plant |
| 55 | 358 | Chimecho | 1 | regular (regular) | psychic | indeterminate |
| 56 | 359 | Absol | 1 | regular (regular) | dark | ground |
| 57 | 361 | Snorunt | 1 | regular (regular) | ice | fairy, mineral |
| 58 | 363 | Spheal | 1 | regular (regular) | ice, water | water1, ground |
| 59 | 366 | Clamperl | 1 | regular (regular) | water | water1 |
| 60 | 369 | Relicanth | 1 | regular (regular) | water, rock | water1, water2 |
| 61 | 370 | Luvdisc | 1 | regular (regular) | water | water2 |
| 62 | 371 | Bagon | 1 | regular (regular) | dragon | dragon |
| 63 | 374 | Beldum | 1 | regular (regular) | steel, psychic | mineral |
| 64 | 377 | Regirock | 1 | regular (regular) | rock | no-eggs |
| 65 | 378 | Regice | 1 | regular (regular) | ice | no-eggs |
| 66 | 379 | Registeel | 1 | regular (regular) | steel | no-eggs |
| 67 | 380 | Latias | 1 | regular (regular) | dragon, psychic | no-eggs |
| 68 | 381 | Latios | 1 | regular (regular) | dragon, psychic | no-eggs |
| 69 | 382 | Kyogre | 1 | regular (regular) | water | no-eggs |
| 70 | 383 | Groudon | 1 | regular (regular) | ground | no-eggs |
| 71 | 384 | Rayquaza | 1 | regular (regular) | dragon, flying | no-eggs |
| 72 | 385 | Jirachi | 1 | regular (regular) | steel, psychic | no-eggs |
| 73 | 386 | Deoxys-Normal | 1 | regular (regular) | psychic | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 9 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 263 | Zigzagoon-Galar | 1 | galar (regional/alternate) | dark, normal | ground |
| 2 | 351 | Castform-Sunny | 1 | sunny (regional/alternate) | fire | fairy, indeterminate |
| 3 | 351 | Castform-Rainy | 1 | rainy (regional/alternate) | water | fairy, indeterminate |
| 4 | 351 | Castform-Snowy | 1 | snowy (regional/alternate) | ice | fairy, indeterminate |
| 5 | 382 | Kyogre-Primal | 1 | primal (regional/alternate) | water | no-eggs |
| 6 | 383 | Groudon-Primal | 1 | primal (regional/alternate) | ground, fire | no-eggs |
| 7 | 386 | Deoxys-Attack | 1 | attack (regional/alternate) | psychic | no-eggs |
| 8 | 386 | Deoxys-Defense | 1 | defense (regional/alternate) | psychic | no-eggs |
| 9 | 386 | Deoxys-Speed | 1 | speed (regional/alternate) | psychic | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 8 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 302 | Sableye-Mega | 1 | mega (mega) | dark, ghost | humanshape |
| 2 | 303 | Mawile-Mega | 1 | mega (mega) | steel, fairy | ground, fairy |
| 3 | 358 | Chimecho-Mega | 1 | mega (mega) | psychic, steel | indeterminate |
| 4 | 359 | Absol-Mega | 1 | mega (mega) | dark | ground |
| 5 | 359 | Absol-Mega-Z | 1 | mega-z (mega) | dark, ghost | ground |
| 6 | 380 | Latias-Mega | 1 | mega (mega) | dragon, psychic | no-eggs |
| 7 | 381 | Latios-Mega | 1 | mega (mega) | dragon, psychic | no-eggs |
| 8 | 384 | Rayquaza-Mega | 1 | mega (mega) | dragon, flying | no-eggs |

#### Spawn level 6 (stage 2, form tier regular) — 43 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 253 | Grovyle | 2 | regular (regular) | grass | monster, dragon |
| 2 | 256 | Combusken | 2 | regular (regular) | fire, fighting | ground |
| 3 | 259 | Marshtomp | 2 | regular (regular) | water, ground | monster, water1 |
| 4 | 262 | Mightyena | 2 | regular (regular) | dark | ground |
| 5 | 264 | Linoone | 2 | regular (regular) | normal | ground |
| 6 | 266 | Silcoon | 2 | regular (regular) | bug | bug |
| 7 | 271 | Lombre | 2 | regular (regular) | water, grass | water1, plant |
| 8 | 274 | Nuzleaf | 2 | regular (regular) | grass, dark | ground, plant |
| 9 | 277 | Swellow | 2 | regular (regular) | normal, flying | flying |
| 10 | 279 | Pelipper | 2 | regular (regular) | water, flying | water1, flying |
| 11 | 281 | Kirlia | 2 | regular (regular) | psychic, fairy | humanshape, indeterminate |
| 12 | 284 | Masquerain | 2 | regular (regular) | bug, flying | water1, bug |
| 13 | 286 | Breloom | 2 | regular (regular) | grass, fighting | fairy, plant |
| 14 | 288 | Vigoroth | 2 | regular (regular) | normal | ground |
| 15 | 291 | Ninjask | 2 | regular (regular) | bug, flying | bug |
| 16 | 294 | Loudred | 2 | regular (regular) | normal | monster, ground |
| 17 | 297 | Hariyama | 2 | regular (regular) | fighting | humanshape |
| 18 | 301 | Delcatty | 2 | regular (regular) | normal | ground, fairy |
| 19 | 305 | Lairon | 2 | regular (regular) | steel, rock | monster |
| 20 | 308 | Medicham | 2 | regular (regular) | fighting, psychic | humanshape |
| 21 | 310 | Manectric | 2 | regular (regular) | electric | ground |
| 22 | 317 | Swalot | 2 | regular (regular) | poison | indeterminate |
| 23 | 319 | Sharpedo | 2 | regular (regular) | water, dark | water2 |
| 24 | 321 | Wailord | 2 | regular (regular) | water | ground, water2 |
| 25 | 323 | Camerupt | 2 | regular (regular) | fire, ground | ground |
| 26 | 326 | Grumpig | 2 | regular (regular) | psychic | ground |
| 27 | 329 | Vibrava | 2 | regular (regular) | ground, dragon | bug, dragon |
| 28 | 332 | Cacturne | 2 | regular (regular) | grass, dark | plant, humanshape |
| 29 | 334 | Altaria | 2 | regular (regular) | dragon, flying | flying, dragon |
| 30 | 340 | Whiscash | 2 | regular (regular) | water, ground | water2 |
| 31 | 342 | Crawdaunt | 2 | regular (regular) | water, dark | water1, water3 |
| 32 | 344 | Claydol | 2 | regular (regular) | ground, psychic | mineral |
| 33 | 346 | Cradily | 2 | regular (regular) | rock, grass | water3 |
| 34 | 348 | Armaldo | 2 | regular (regular) | rock, bug | water3 |
| 35 | 350 | Milotic | 2 | regular (regular) | water | water1, dragon |
| 36 | 354 | Banette | 2 | regular (regular) | ghost | indeterminate |
| 37 | 356 | Dusclops | 2 | regular (regular) | ghost | indeterminate |
| 38 | 360 | Wynaut | 2 | regular (regular) | psychic | no-eggs |
| 39 | 362 | Glalie | 2 | regular (regular) | ice | fairy, mineral |
| 40 | 364 | Sealeo | 2 | regular (regular) | ice, water | water1, ground |
| 41 | 367 | Huntail | 2 | regular (regular) | water | water1 |
| 42 | 372 | Shelgon | 2 | regular (regular) | dragon | dragon |
| 43 | 375 | Metang | 2 | regular (regular) | steel, psychic | mineral |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 264 | Linoone-Galar | 2 | galar (regional/alternate) | dark, normal | ground |

#### Spawn level 9 (stage 2, form tier mega) — 7 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 308 | Medicham-Mega | 2 | mega (mega) | fighting, psychic | humanshape |
| 2 | 310 | Manectric-Mega | 2 | mega (mega) | electric | ground |
| 3 | 319 | Sharpedo-Mega | 2 | mega (mega) | water, dark | water2 |
| 4 | 323 | Camerupt-Mega | 2 | mega (mega) | fire, ground | ground |
| 5 | 334 | Altaria-Mega | 2 | mega (mega) | dragon, fairy | flying, dragon |
| 6 | 354 | Banette-Mega | 2 | mega (mega) | ghost | indeterminate |
| 7 | 362 | Glalie-Mega | 2 | mega (mega) | ice | fairy, mineral |

#### Spawn level 11 (stage 3, form tier regular) — 17 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 254 | Sceptile | 3 | regular (regular) | grass | monster, dragon |
| 2 | 257 | Blaziken | 3 | regular (regular) | fire, fighting | ground |
| 3 | 260 | Swampert | 3 | regular (regular) | water, ground | monster, water1 |
| 4 | 267 | Beautifly | 3 | regular (regular) | bug, flying | bug |
| 5 | 272 | Ludicolo | 3 | regular (regular) | water, grass | water1, plant |
| 6 | 275 | Shiftry | 3 | regular (regular) | grass, dark | ground, plant |
| 7 | 282 | Gardevoir | 3 | regular (regular) | psychic, fairy | humanshape, indeterminate |
| 8 | 289 | Slaking | 3 | regular (regular) | normal | ground |
| 9 | 292 | Shedinja | 3 | regular (regular) | bug, ghost | mineral |
| 10 | 295 | Exploud | 3 | regular (regular) | normal | monster, ground |
| 11 | 298 | Azurill | 3 | regular (regular) | normal, fairy | no-eggs |
| 12 | 306 | Aggron | 3 | regular (regular) | steel, rock | monster |
| 13 | 330 | Flygon | 3 | regular (regular) | ground, dragon | bug, dragon |
| 14 | 365 | Walrein | 3 | regular (regular) | ice, water | water1, ground |
| 15 | 368 | Gorebyss | 3 | regular (regular) | water | water1 |
| 16 | 373 | Salamence | 3 | regular (regular) | dragon, flying | dragon |
| 17 | 376 | Metagross | 3 | regular (regular) | steel, psychic | mineral |

#### Spawn level 14 (stage 3, form tier mega) — 7 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 254 | Sceptile-Mega | 3 | mega (mega) | grass, dragon | monster, dragon |
| 2 | 257 | Blaziken-Mega | 3 | mega (mega) | fire, fighting | ground |
| 3 | 260 | Swampert-Mega | 3 | mega (mega) | water, ground | monster, water1 |
| 4 | 282 | Gardevoir-Mega | 3 | mega (mega) | psychic, fairy | humanshape, indeterminate |
| 5 | 306 | Aggron-Mega | 3 | mega (mega) | steel | monster |
| 6 | 373 | Salamence-Mega | 3 | mega (mega) | dragon, flying | dragon |
| 7 | 376 | Metagross-Mega | 3 | mega (mega) | steel, psychic | mineral |

#### Spawn level 16 (stage 4, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 268 | Cascoon | 4 | regular (regular) | bug | bug |

#### Spawn level 21 (stage 5, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 269 | Dustox | 5 | regular (regular) | bug, poison | bug |

### By evolution stage

#### Evolution stage 1 — 90 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 252 | Treecko | regular | grass |
| 1 | 255 | Torchic | regular | fire |
| 1 | 258 | Mudkip | regular | water |
| 1 | 261 | Poochyena | regular | dark |
| 1 | 263 | Zigzagoon | regular | normal |
| 1 | 265 | Wurmple | regular | bug |
| 1 | 270 | Lotad | regular | water, grass |
| 1 | 273 | Seedot | regular | grass |
| 1 | 276 | Taillow | regular | normal, flying |
| 1 | 278 | Wingull | regular | water, flying |
| 1 | 280 | Ralts | regular | psychic, fairy |
| 1 | 283 | Surskit | regular | bug, water |
| 1 | 285 | Shroomish | regular | grass |
| 1 | 287 | Slakoth | regular | normal |
| 1 | 290 | Nincada | regular | bug, ground |
| 1 | 293 | Whismur | regular | normal |
| 1 | 296 | Makuhita | regular | fighting |
| 1 | 299 | Nosepass | regular | rock |
| 1 | 300 | Skitty | regular | normal |
| 1 | 302 | Sableye | regular | dark, ghost |
| 1 | 303 | Mawile | regular | steel, fairy |
| 1 | 304 | Aron | regular | steel, rock |
| 1 | 307 | Meditite | regular | fighting, psychic |
| 1 | 309 | Electrike | regular | electric |
| 1 | 311 | Plusle | regular | electric |
| 1 | 312 | Minun | regular | electric |
| 1 | 313 | Volbeat | regular | bug |
| 1 | 314 | Illumise | regular | bug |
| 1 | 315 | Roselia | regular | grass, poison |
| 1 | 316 | Gulpin | regular | poison |
| 1 | 318 | Carvanha | regular | water, dark |
| 1 | 320 | Wailmer | regular | water |
| 1 | 322 | Numel | regular | fire, ground |
| 1 | 324 | Torkoal | regular | fire |
| 1 | 325 | Spoink | regular | psychic |
| 1 | 327 | Spinda | regular | normal |
| 1 | 328 | Trapinch | regular | ground |
| 1 | 331 | Cacnea | regular | grass |
| 1 | 333 | Swablu | regular | normal, flying |
| 1 | 335 | Zangoose | regular | normal |
| 1 | 336 | Seviper | regular | poison |
| 1 | 337 | Lunatone | regular | rock, psychic |
| 1 | 338 | Solrock | regular | rock, psychic |
| 1 | 339 | Barboach | regular | water, ground |
| 1 | 341 | Corphish | regular | water |
| 1 | 343 | Baltoy | regular | ground, psychic |
| 1 | 345 | Lileep | regular | rock, grass |
| 1 | 347 | Anorith | regular | rock, bug |
| 1 | 349 | Feebas | regular | water |
| 1 | 351 | Castform | regular | normal |
| 1 | 352 | Kecleon | regular | normal |
| 1 | 353 | Shuppet | regular | ghost |
| 1 | 355 | Duskull | regular | ghost |
| 1 | 357 | Tropius | regular | grass, flying |
| 1 | 358 | Chimecho | regular | psychic |
| 1 | 359 | Absol | regular | dark |
| 1 | 361 | Snorunt | regular | ice |
| 1 | 363 | Spheal | regular | ice, water |
| 1 | 366 | Clamperl | regular | water |
| 1 | 369 | Relicanth | regular | water, rock |
| 1 | 370 | Luvdisc | regular | water |
| 1 | 371 | Bagon | regular | dragon |
| 1 | 374 | Beldum | regular | steel, psychic |
| 1 | 377 | Regirock | regular | rock |
| 1 | 378 | Regice | regular | ice |
| 1 | 379 | Registeel | regular | steel |
| 1 | 380 | Latias | regular | dragon, psychic |
| 1 | 381 | Latios | regular | dragon, psychic |
| 1 | 382 | Kyogre | regular | water |
| 1 | 383 | Groudon | regular | ground |
| 1 | 384 | Rayquaza | regular | dragon, flying |
| 1 | 385 | Jirachi | regular | steel, psychic |
| 1 | 386 | Deoxys-Normal | regular | psychic |
| 3 | 263 | Zigzagoon-Galar | galar | dark, normal |
| 3 | 351 | Castform-Sunny | sunny | fire |
| 3 | 351 | Castform-Rainy | rainy | water |
| 3 | 351 | Castform-Snowy | snowy | ice |
| 3 | 382 | Kyogre-Primal | primal | water |
| 3 | 383 | Groudon-Primal | primal | ground, fire |
| 3 | 386 | Deoxys-Attack | attack | psychic |
| 3 | 386 | Deoxys-Defense | defense | psychic |
| 3 | 386 | Deoxys-Speed | speed | psychic |
| 4 | 302 | Sableye-Mega | mega | dark, ghost |
| 4 | 303 | Mawile-Mega | mega | steel, fairy |
| 4 | 358 | Chimecho-Mega | mega | psychic, steel |
| 4 | 359 | Absol-Mega | mega | dark |
| 4 | 359 | Absol-Mega-Z | mega-z | dark, ghost |
| 4 | 380 | Latias-Mega | mega | dragon, psychic |
| 4 | 381 | Latios-Mega | mega | dragon, psychic |
| 4 | 384 | Rayquaza-Mega | mega | dragon, flying |

#### Evolution stage 2 — 51 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 253 | Grovyle | regular | grass |
| 6 | 256 | Combusken | regular | fire, fighting |
| 6 | 259 | Marshtomp | regular | water, ground |
| 6 | 262 | Mightyena | regular | dark |
| 6 | 264 | Linoone | regular | normal |
| 6 | 266 | Silcoon | regular | bug |
| 6 | 271 | Lombre | regular | water, grass |
| 6 | 274 | Nuzleaf | regular | grass, dark |
| 6 | 277 | Swellow | regular | normal, flying |
| 6 | 279 | Pelipper | regular | water, flying |
| 6 | 281 | Kirlia | regular | psychic, fairy |
| 6 | 284 | Masquerain | regular | bug, flying |
| 6 | 286 | Breloom | regular | grass, fighting |
| 6 | 288 | Vigoroth | regular | normal |
| 6 | 291 | Ninjask | regular | bug, flying |
| 6 | 294 | Loudred | regular | normal |
| 6 | 297 | Hariyama | regular | fighting |
| 6 | 301 | Delcatty | regular | normal |
| 6 | 305 | Lairon | regular | steel, rock |
| 6 | 308 | Medicham | regular | fighting, psychic |
| 6 | 310 | Manectric | regular | electric |
| 6 | 317 | Swalot | regular | poison |
| 6 | 319 | Sharpedo | regular | water, dark |
| 6 | 321 | Wailord | regular | water |
| 6 | 323 | Camerupt | regular | fire, ground |
| 6 | 326 | Grumpig | regular | psychic |
| 6 | 329 | Vibrava | regular | ground, dragon |
| 6 | 332 | Cacturne | regular | grass, dark |
| 6 | 334 | Altaria | regular | dragon, flying |
| 6 | 340 | Whiscash | regular | water, ground |
| 6 | 342 | Crawdaunt | regular | water, dark |
| 6 | 344 | Claydol | regular | ground, psychic |
| 6 | 346 | Cradily | regular | rock, grass |
| 6 | 348 | Armaldo | regular | rock, bug |
| 6 | 350 | Milotic | regular | water |
| 6 | 354 | Banette | regular | ghost |
| 6 | 356 | Dusclops | regular | ghost |
| 6 | 360 | Wynaut | regular | psychic |
| 6 | 362 | Glalie | regular | ice |
| 6 | 364 | Sealeo | regular | ice, water |
| 6 | 367 | Huntail | regular | water |
| 6 | 372 | Shelgon | regular | dragon |
| 6 | 375 | Metang | regular | steel, psychic |
| 8 | 264 | Linoone-Galar | galar | dark, normal |
| 9 | 308 | Medicham-Mega | mega | fighting, psychic |
| 9 | 310 | Manectric-Mega | mega | electric |
| 9 | 319 | Sharpedo-Mega | mega | water, dark |
| 9 | 323 | Camerupt-Mega | mega | fire, ground |
| 9 | 334 | Altaria-Mega | mega | dragon, fairy |
| 9 | 354 | Banette-Mega | mega | ghost |
| 9 | 362 | Glalie-Mega | mega | ice |

#### Evolution stage 3 — 24 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 254 | Sceptile | regular | grass |
| 11 | 257 | Blaziken | regular | fire, fighting |
| 11 | 260 | Swampert | regular | water, ground |
| 11 | 267 | Beautifly | regular | bug, flying |
| 11 | 272 | Ludicolo | regular | water, grass |
| 11 | 275 | Shiftry | regular | grass, dark |
| 11 | 282 | Gardevoir | regular | psychic, fairy |
| 11 | 289 | Slaking | regular | normal |
| 11 | 292 | Shedinja | regular | bug, ghost |
| 11 | 295 | Exploud | regular | normal |
| 11 | 298 | Azurill | regular | normal, fairy |
| 11 | 306 | Aggron | regular | steel, rock |
| 11 | 330 | Flygon | regular | ground, dragon |
| 11 | 365 | Walrein | regular | ice, water |
| 11 | 368 | Gorebyss | regular | water |
| 11 | 373 | Salamence | regular | dragon, flying |
| 11 | 376 | Metagross | regular | steel, psychic |
| 14 | 254 | Sceptile-Mega | mega | grass, dragon |
| 14 | 257 | Blaziken-Mega | mega | fire, fighting |
| 14 | 260 | Swampert-Mega | mega | water, ground |
| 14 | 282 | Gardevoir-Mega | mega | psychic, fairy |
| 14 | 306 | Aggron-Mega | mega | steel |
| 14 | 373 | Salamence-Mega | mega | dragon, flying |
| 14 | 376 | Metagross-Mega | mega | steel, psychic |

#### Evolution stage 4 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 268 | Cascoon | regular | bug |

#### Evolution stage 5 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 21 | 269 | Dustox | regular | bug, poison |

---

## Sinnoh (dex 387–493, 107 species)

**In-game path:** 3 — Coastal Run

### Summary

- Spawn levels present: 1, 3, 4, 6, 8, 9, 11, 14, 16, 19, 31, 36
- Evolution stages present: 1, 2, 3, 4, 7, 8
- Total catalog entries: 129

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 44 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 387 | Turtwig | 1 | regular (regular) | grass | monster, plant |
| 2 | 390 | Chimchar | 1 | regular (regular) | fire | ground, humanshape |
| 3 | 393 | Piplup | 1 | regular (regular) | water | water1, ground |
| 4 | 396 | Starly | 1 | regular (regular) | normal, flying | flying |
| 5 | 399 | Bidoof | 1 | regular (regular) | normal | water1, ground |
| 6 | 401 | Kricketot | 1 | regular (regular) | bug | bug |
| 7 | 403 | Shinx | 1 | regular (regular) | electric | ground |
| 8 | 408 | Cranidos | 1 | regular (regular) | rock | monster |
| 9 | 410 | Shieldon | 1 | regular (regular) | rock, steel | monster |
| 10 | 412 | Burmy | 1 | regular (regular) | bug | bug |
| 11 | 415 | Combee | 1 | regular (regular) | bug, flying | bug |
| 12 | 417 | Pachirisu | 1 | regular (regular) | electric | ground, fairy |
| 13 | 418 | Buizel | 1 | regular (regular) | water | water1, ground |
| 14 | 420 | Cherubi | 1 | regular (regular) | grass | fairy, plant |
| 15 | 422 | Shellos | 1 | regular (regular) | water | water1, indeterminate |
| 16 | 425 | Drifloon | 1 | regular (regular) | ghost, flying | indeterminate |
| 17 | 427 | Buneary | 1 | regular (regular) | normal | ground, humanshape |
| 18 | 431 | Glameow | 1 | regular (regular) | normal | ground |
| 19 | 434 | Stunky | 1 | regular (regular) | poison, dark | ground |
| 20 | 436 | Bronzor | 1 | regular (regular) | steel, psychic | mineral |
| 21 | 441 | Chatot | 1 | regular (regular) | normal, flying | flying |
| 22 | 442 | Spiritomb | 1 | regular (regular) | ghost, dark | indeterminate |
| 23 | 443 | Gible | 1 | regular (regular) | dragon, ground | monster, dragon |
| 24 | 447 | Riolu | 1 | regular (regular) | fighting | no-eggs |
| 25 | 449 | Hippopotas | 1 | regular (regular) | ground | ground |
| 26 | 451 | Skorupi | 1 | regular (regular) | poison, bug | bug, water3 |
| 27 | 453 | Croagunk | 1 | regular (regular) | poison, fighting | humanshape |
| 28 | 455 | Carnivine | 1 | regular (regular) | grass | plant |
| 29 | 456 | Finneon | 1 | regular (regular) | water | water2 |
| 30 | 459 | Snover | 1 | regular (regular) | grass, ice | monster, plant |
| 31 | 479 | Rotom | 1 | regular (regular) | electric, ghost | indeterminate |
| 32 | 480 | Uxie | 1 | regular (regular) | psychic | no-eggs |
| 33 | 481 | Mesprit | 1 | regular (regular) | psychic | no-eggs |
| 34 | 482 | Azelf | 1 | regular (regular) | psychic | no-eggs |
| 35 | 483 | Dialga | 1 | regular (regular) | steel, dragon | no-eggs |
| 36 | 484 | Palkia | 1 | regular (regular) | water, dragon | no-eggs |
| 37 | 485 | Heatran | 1 | regular (regular) | fire, steel | no-eggs |
| 38 | 486 | Regigigas | 1 | regular (regular) | normal | no-eggs |
| 39 | 487 | Giratina-Altered | 1 | regular (regular) | ghost, dragon | no-eggs |
| 40 | 488 | Cresselia | 1 | regular (regular) | psychic | no-eggs |
| 41 | 489 | Phione | 1 | regular (regular) | water | water1, fairy |
| 42 | 491 | Darkrai | 1 | regular (regular) | dark | no-eggs |
| 43 | 492 | Shaymin-Land | 1 | regular (regular) | grass | no-eggs |
| 44 | 493 | Arceus | 1 | regular (regular) | normal | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 9 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 479 | Rotom-Heat | 1 | heat (regional/alternate) | electric, fire | indeterminate |
| 2 | 479 | Rotom-Wash | 1 | wash (regional/alternate) | electric, water | indeterminate |
| 3 | 479 | Rotom-Frost | 1 | frost (regional/alternate) | electric, ice | indeterminate |
| 4 | 479 | Rotom-Fan | 1 | fan (regional/alternate) | electric, flying | indeterminate |
| 5 | 479 | Rotom-Mow | 1 | mow (regional/alternate) | electric, grass | indeterminate |
| 6 | 483 | Dialga-Origin | 1 | origin (regional/alternate) | steel, dragon | no-eggs |
| 7 | 484 | Palkia-Origin | 1 | origin (regional/alternate) | water, dragon | no-eggs |
| 8 | 487 | Giratina-Origin | 1 | origin (regional/alternate) | ghost, dragon | no-eggs |
| 9 | 492 | Shaymin-Sky | 1 | sky (regional/alternate) | grass, flying | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 485 | Heatran-Mega | 1 | mega (mega) | fire, steel | no-eggs |
| 2 | 491 | Darkrai-Mega | 1 | mega (mega) | dark | no-eggs |

#### Spawn level 6 (stage 2, form tier regular) — 42 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 388 | Grotle | 2 | regular (regular) | grass | monster, plant |
| 2 | 391 | Monferno | 2 | regular (regular) | fire, fighting | ground, humanshape |
| 3 | 394 | Prinplup | 2 | regular (regular) | water | water1, ground |
| 4 | 397 | Staravia | 2 | regular (regular) | normal, flying | flying |
| 5 | 400 | Bibarel | 2 | regular (regular) | normal, water | water1, ground |
| 6 | 402 | Kricketune | 2 | regular (regular) | bug | bug |
| 7 | 404 | Luxio | 2 | regular (regular) | electric | ground |
| 8 | 406 | Budew | 2 | regular (regular) | grass, poison | no-eggs |
| 9 | 409 | Rampardos | 2 | regular (regular) | rock | monster |
| 10 | 411 | Bastiodon | 2 | regular (regular) | rock, steel | monster |
| 11 | 413 | Wormadam-Plant | 2 | regular (regular) | bug, grass | bug |
| 12 | 416 | Vespiquen | 2 | regular (regular) | bug, flying | bug |
| 13 | 419 | Floatzel | 2 | regular (regular) | water | water1, ground |
| 14 | 421 | Cherrim | 2 | regular (regular) | grass | fairy, plant |
| 15 | 423 | Gastrodon | 2 | regular (regular) | water, ground | water1, indeterminate |
| 16 | 424 | Ambipom | 2 | regular (regular) | normal | ground |
| 17 | 426 | Drifblim | 2 | regular (regular) | ghost, flying | indeterminate |
| 18 | 428 | Lopunny | 2 | regular (regular) | normal | ground, humanshape |
| 19 | 429 | Mismagius | 2 | regular (regular) | ghost | indeterminate |
| 20 | 430 | Honchkrow | 2 | regular (regular) | dark, flying | flying |
| 21 | 432 | Purugly | 2 | regular (regular) | normal | ground |
| 22 | 433 | Chingling | 2 | regular (regular) | psychic | no-eggs |
| 23 | 435 | Skuntank | 2 | regular (regular) | poison, dark | ground |
| 24 | 437 | Bronzong | 2 | regular (regular) | steel, psychic | mineral |
| 25 | 438 | Bonsly | 2 | regular (regular) | rock | no-eggs |
| 26 | 439 | Mime-Jr | 2 | regular (regular) | psychic, fairy | no-eggs |
| 27 | 444 | Gabite | 2 | regular (regular) | dragon, ground | monster, dragon |
| 28 | 446 | Munchlax | 2 | regular (regular) | normal | no-eggs |
| 29 | 448 | Lucario | 2 | regular (regular) | fighting, steel | ground, humanshape |
| 30 | 450 | Hippowdon | 2 | regular (regular) | ground | ground |
| 31 | 452 | Drapion | 2 | regular (regular) | poison, dark | bug, water3 |
| 32 | 454 | Toxicroak | 2 | regular (regular) | poison, fighting | humanshape |
| 33 | 457 | Lumineon | 2 | regular (regular) | water | water2 |
| 34 | 458 | Mantyke | 2 | regular (regular) | water, flying | no-eggs |
| 35 | 460 | Abomasnow | 2 | regular (regular) | grass, ice | monster, plant |
| 36 | 461 | Weavile | 2 | regular (regular) | dark, ice | ground |
| 37 | 463 | Lickilicky | 2 | regular (regular) | normal | monster |
| 38 | 465 | Tangrowth | 2 | regular (regular) | grass | plant |
| 39 | 469 | Yanmega | 2 | regular (regular) | bug, flying | bug |
| 40 | 472 | Gliscor | 2 | regular (regular) | ground, flying | bug |
| 41 | 476 | Probopass | 2 | regular (regular) | rock, steel | mineral |
| 42 | 490 | Manaphy | 2 | regular (regular) | water | water1, fairy |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 413 | Wormadam-Sandy | 2 | sandy (regional/alternate) | bug, ground | bug |
| 2 | 413 | Wormadam-Trash | 2 | trash (regional/alternate) | bug, steel | bug |

#### Spawn level 9 (stage 2, form tier mega) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 428 | Lopunny-Mega | 2 | mega (mega) | normal, fighting | ground, humanshape |
| 2 | 448 | Lucario-Mega | 2 | mega (mega) | fighting, steel | ground, humanshape |
| 3 | 448 | Lucario-Mega-Z | 2 | mega-z (mega) | fighting, steel | ground, humanshape |
| 4 | 460 | Abomasnow-Mega | 2 | mega (mega) | grass, ice | monster, plant |

#### Spawn level 11 (stage 3, form tier regular) — 18 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 389 | Torterra | 3 | regular (regular) | grass, ground | monster, plant |
| 2 | 392 | Infernape | 3 | regular (regular) | fire, fighting | ground, humanshape |
| 3 | 395 | Empoleon | 3 | regular (regular) | water, steel | water1, ground |
| 4 | 398 | Staraptor | 3 | regular (regular) | normal, flying | flying |
| 5 | 405 | Luxray | 3 | regular (regular) | electric | ground |
| 6 | 407 | Roserade | 3 | regular (regular) | grass, poison | fairy, plant |
| 7 | 414 | Mothim | 3 | regular (regular) | bug, flying | bug |
| 8 | 440 | Happiny | 3 | regular (regular) | normal | no-eggs |
| 9 | 445 | Garchomp | 3 | regular (regular) | dragon, ground | monster, dragon |
| 10 | 462 | Magnezone | 3 | regular (regular) | electric, steel | mineral |
| 11 | 464 | Rhyperior | 3 | regular (regular) | ground, rock | monster, ground |
| 12 | 466 | Electivire | 3 | regular (regular) | electric | humanshape |
| 13 | 467 | Magmortar | 3 | regular (regular) | fire | humanshape |
| 14 | 468 | Togekiss | 3 | regular (regular) | fairy, flying | flying, fairy |
| 15 | 473 | Mamoswine | 3 | regular (regular) | ice, ground | ground |
| 16 | 474 | Porygon-Z | 3 | regular (regular) | normal | mineral |
| 17 | 477 | Dusknoir | 3 | regular (regular) | ghost | indeterminate |
| 18 | 478 | Froslass | 3 | regular (regular) | ice, ghost | fairy, mineral |

#### Spawn level 14 (stage 3, form tier mega) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 398 | Staraptor-Mega | 3 | mega (mega) | fighting, flying | flying |
| 2 | 445 | Garchomp-Mega | 3 | mega (mega) | dragon, ground | monster, dragon |
| 3 | 445 | Garchomp-Mega-Z | 3 | mega-z (mega) | dragon | monster, dragon |
| 4 | 478 | Froslass-Mega | 3 | mega (mega) | ice, ghost | fairy, mineral |

#### Spawn level 16 (stage 4, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 475 | Gallade | 4 | regular (regular) | psychic, fighting | humanshape, indeterminate |

#### Spawn level 19 (stage 4, form tier mega) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 475 | Gallade-Mega | 4 | mega (mega) | psychic, fighting | humanshape, indeterminate |

#### Spawn level 31 (stage 7, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 470 | Leafeon | 7 | regular (regular) | grass | ground |

#### Spawn level 36 (stage 8, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 471 | Glaceon | 8 | regular (regular) | ice | ground |

### By evolution stage

#### Evolution stage 1 — 55 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 387 | Turtwig | regular | grass |
| 1 | 390 | Chimchar | regular | fire |
| 1 | 393 | Piplup | regular | water |
| 1 | 396 | Starly | regular | normal, flying |
| 1 | 399 | Bidoof | regular | normal |
| 1 | 401 | Kricketot | regular | bug |
| 1 | 403 | Shinx | regular | electric |
| 1 | 408 | Cranidos | regular | rock |
| 1 | 410 | Shieldon | regular | rock, steel |
| 1 | 412 | Burmy | regular | bug |
| 1 | 415 | Combee | regular | bug, flying |
| 1 | 417 | Pachirisu | regular | electric |
| 1 | 418 | Buizel | regular | water |
| 1 | 420 | Cherubi | regular | grass |
| 1 | 422 | Shellos | regular | water |
| 1 | 425 | Drifloon | regular | ghost, flying |
| 1 | 427 | Buneary | regular | normal |
| 1 | 431 | Glameow | regular | normal |
| 1 | 434 | Stunky | regular | poison, dark |
| 1 | 436 | Bronzor | regular | steel, psychic |
| 1 | 441 | Chatot | regular | normal, flying |
| 1 | 442 | Spiritomb | regular | ghost, dark |
| 1 | 443 | Gible | regular | dragon, ground |
| 1 | 447 | Riolu | regular | fighting |
| 1 | 449 | Hippopotas | regular | ground |
| 1 | 451 | Skorupi | regular | poison, bug |
| 1 | 453 | Croagunk | regular | poison, fighting |
| 1 | 455 | Carnivine | regular | grass |
| 1 | 456 | Finneon | regular | water |
| 1 | 459 | Snover | regular | grass, ice |
| 1 | 479 | Rotom | regular | electric, ghost |
| 1 | 480 | Uxie | regular | psychic |
| 1 | 481 | Mesprit | regular | psychic |
| 1 | 482 | Azelf | regular | psychic |
| 1 | 483 | Dialga | regular | steel, dragon |
| 1 | 484 | Palkia | regular | water, dragon |
| 1 | 485 | Heatran | regular | fire, steel |
| 1 | 486 | Regigigas | regular | normal |
| 1 | 487 | Giratina-Altered | regular | ghost, dragon |
| 1 | 488 | Cresselia | regular | psychic |
| 1 | 489 | Phione | regular | water |
| 1 | 491 | Darkrai | regular | dark |
| 1 | 492 | Shaymin-Land | regular | grass |
| 1 | 493 | Arceus | regular | normal |
| 3 | 479 | Rotom-Heat | heat | electric, fire |
| 3 | 479 | Rotom-Wash | wash | electric, water |
| 3 | 479 | Rotom-Frost | frost | electric, ice |
| 3 | 479 | Rotom-Fan | fan | electric, flying |
| 3 | 479 | Rotom-Mow | mow | electric, grass |
| 3 | 483 | Dialga-Origin | origin | steel, dragon |
| 3 | 484 | Palkia-Origin | origin | water, dragon |
| 3 | 487 | Giratina-Origin | origin | ghost, dragon |
| 3 | 492 | Shaymin-Sky | sky | grass, flying |
| 4 | 485 | Heatran-Mega | mega | fire, steel |
| 4 | 491 | Darkrai-Mega | mega | dark |

#### Evolution stage 2 — 48 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 388 | Grotle | regular | grass |
| 6 | 391 | Monferno | regular | fire, fighting |
| 6 | 394 | Prinplup | regular | water |
| 6 | 397 | Staravia | regular | normal, flying |
| 6 | 400 | Bibarel | regular | normal, water |
| 6 | 402 | Kricketune | regular | bug |
| 6 | 404 | Luxio | regular | electric |
| 6 | 406 | Budew | regular | grass, poison |
| 6 | 409 | Rampardos | regular | rock |
| 6 | 411 | Bastiodon | regular | rock, steel |
| 6 | 413 | Wormadam-Plant | regular | bug, grass |
| 6 | 416 | Vespiquen | regular | bug, flying |
| 6 | 419 | Floatzel | regular | water |
| 6 | 421 | Cherrim | regular | grass |
| 6 | 423 | Gastrodon | regular | water, ground |
| 6 | 424 | Ambipom | regular | normal |
| 6 | 426 | Drifblim | regular | ghost, flying |
| 6 | 428 | Lopunny | regular | normal |
| 6 | 429 | Mismagius | regular | ghost |
| 6 | 430 | Honchkrow | regular | dark, flying |
| 6 | 432 | Purugly | regular | normal |
| 6 | 433 | Chingling | regular | psychic |
| 6 | 435 | Skuntank | regular | poison, dark |
| 6 | 437 | Bronzong | regular | steel, psychic |
| 6 | 438 | Bonsly | regular | rock |
| 6 | 439 | Mime-Jr | regular | psychic, fairy |
| 6 | 444 | Gabite | regular | dragon, ground |
| 6 | 446 | Munchlax | regular | normal |
| 6 | 448 | Lucario | regular | fighting, steel |
| 6 | 450 | Hippowdon | regular | ground |
| 6 | 452 | Drapion | regular | poison, dark |
| 6 | 454 | Toxicroak | regular | poison, fighting |
| 6 | 457 | Lumineon | regular | water |
| 6 | 458 | Mantyke | regular | water, flying |
| 6 | 460 | Abomasnow | regular | grass, ice |
| 6 | 461 | Weavile | regular | dark, ice |
| 6 | 463 | Lickilicky | regular | normal |
| 6 | 465 | Tangrowth | regular | grass |
| 6 | 469 | Yanmega | regular | bug, flying |
| 6 | 472 | Gliscor | regular | ground, flying |
| 6 | 476 | Probopass | regular | rock, steel |
| 6 | 490 | Manaphy | regular | water |
| 8 | 413 | Wormadam-Sandy | sandy | bug, ground |
| 8 | 413 | Wormadam-Trash | trash | bug, steel |
| 9 | 428 | Lopunny-Mega | mega | normal, fighting |
| 9 | 448 | Lucario-Mega | mega | fighting, steel |
| 9 | 448 | Lucario-Mega-Z | mega-z | fighting, steel |
| 9 | 460 | Abomasnow-Mega | mega | grass, ice |

#### Evolution stage 3 — 22 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 389 | Torterra | regular | grass, ground |
| 11 | 392 | Infernape | regular | fire, fighting |
| 11 | 395 | Empoleon | regular | water, steel |
| 11 | 398 | Staraptor | regular | normal, flying |
| 11 | 405 | Luxray | regular | electric |
| 11 | 407 | Roserade | regular | grass, poison |
| 11 | 414 | Mothim | regular | bug, flying |
| 11 | 440 | Happiny | regular | normal |
| 11 | 445 | Garchomp | regular | dragon, ground |
| 11 | 462 | Magnezone | regular | electric, steel |
| 11 | 464 | Rhyperior | regular | ground, rock |
| 11 | 466 | Electivire | regular | electric |
| 11 | 467 | Magmortar | regular | fire |
| 11 | 468 | Togekiss | regular | fairy, flying |
| 11 | 473 | Mamoswine | regular | ice, ground |
| 11 | 474 | Porygon-Z | regular | normal |
| 11 | 477 | Dusknoir | regular | ghost |
| 11 | 478 | Froslass | regular | ice, ghost |
| 14 | 398 | Staraptor-Mega | mega | fighting, flying |
| 14 | 445 | Garchomp-Mega | mega | dragon, ground |
| 14 | 445 | Garchomp-Mega-Z | mega-z | dragon |
| 14 | 478 | Froslass-Mega | mega | ice, ghost |

#### Evolution stage 4 — 2 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 475 | Gallade | regular | psychic, fighting |
| 19 | 475 | Gallade-Mega | mega | psychic, fighting |

#### Evolution stage 7 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 31 | 470 | Leafeon | regular | grass |

#### Evolution stage 8 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 36 | 471 | Glaceon | regular | ice |

---

## Unova (dex 494–649, 156 species)

**In-game path:** 4 — Crimson Mire

### Summary

- Spawn levels present: 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14
- Evolution stages present: 1, 2, 3
- Total catalog entries: 185

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 81 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 494 | Victini | 1 | regular (regular) | psychic, fire | no-eggs |
| 2 | 495 | Snivy | 1 | regular (regular) | grass | ground, plant |
| 3 | 498 | Tepig | 1 | regular (regular) | fire | ground |
| 4 | 501 | Oshawott | 1 | regular (regular) | water | ground |
| 5 | 504 | Patrat | 1 | regular (regular) | normal | ground |
| 6 | 506 | Lillipup | 1 | regular (regular) | normal | ground |
| 7 | 509 | Purrloin | 1 | regular (regular) | dark | ground |
| 8 | 511 | Pansage | 1 | regular (regular) | grass | ground |
| 9 | 513 | Pansear | 1 | regular (regular) | fire | ground |
| 10 | 515 | Panpour | 1 | regular (regular) | water | ground |
| 11 | 517 | Munna | 1 | regular (regular) | psychic | ground |
| 12 | 519 | Pidove | 1 | regular (regular) | normal, flying | flying |
| 13 | 522 | Blitzle | 1 | regular (regular) | electric | ground |
| 14 | 524 | Roggenrola | 1 | regular (regular) | rock | mineral |
| 15 | 527 | Woobat | 1 | regular (regular) | psychic, flying | ground, flying |
| 16 | 529 | Drilbur | 1 | regular (regular) | ground | ground |
| 17 | 531 | Audino | 1 | regular (regular) | normal | fairy |
| 18 | 532 | Timburr | 1 | regular (regular) | fighting | humanshape |
| 19 | 535 | Tympole | 1 | regular (regular) | water | water1 |
| 20 | 538 | Throh | 1 | regular (regular) | fighting | humanshape |
| 21 | 539 | Sawk | 1 | regular (regular) | fighting | humanshape |
| 22 | 540 | Sewaddle | 1 | regular (regular) | bug, grass | bug |
| 23 | 543 | Venipede | 1 | regular (regular) | bug, poison | bug |
| 24 | 546 | Cottonee | 1 | regular (regular) | grass, fairy | plant, fairy |
| 25 | 548 | Petilil | 1 | regular (regular) | grass | plant |
| 26 | 551 | Sandile | 1 | regular (regular) | ground, dark | ground |
| 27 | 554 | Darumaka | 1 | regular (regular) | fire | ground |
| 28 | 556 | Maractus | 1 | regular (regular) | grass | plant |
| 29 | 557 | Dwebble | 1 | regular (regular) | bug, rock | bug, mineral |
| 30 | 559 | Scraggy | 1 | regular (regular) | dark, fighting | ground, dragon |
| 31 | 561 | Sigilyph | 1 | regular (regular) | psychic, flying | flying |
| 32 | 562 | Yamask | 1 | regular (regular) | ghost | mineral, indeterminate |
| 33 | 564 | Tirtouga | 1 | regular (regular) | water, rock | water1, water3 |
| 34 | 566 | Archen | 1 | regular (regular) | rock, flying | flying, water3 |
| 35 | 568 | Trubbish | 1 | regular (regular) | poison | mineral |
| 36 | 570 | Zorua | 1 | regular (regular) | dark | ground |
| 37 | 572 | Minccino | 1 | regular (regular) | normal | ground |
| 38 | 574 | Gothita | 1 | regular (regular) | psychic | humanshape |
| 39 | 577 | Solosis | 1 | regular (regular) | psychic | indeterminate |
| 40 | 580 | Ducklett | 1 | regular (regular) | water, flying | water1, flying |
| 41 | 582 | Vanillite | 1 | regular (regular) | ice | mineral |
| 42 | 585 | Deerling | 1 | regular (regular) | normal, grass | ground |
| 43 | 587 | Emolga | 1 | regular (regular) | electric, flying | ground |
| 44 | 588 | Karrablast | 1 | regular (regular) | bug | bug |
| 45 | 590 | Foongus | 1 | regular (regular) | grass, poison | plant |
| 46 | 592 | Frillish-Male | 1 | regular (regular) | water, ghost | indeterminate |
| 47 | 594 | Alomomola | 1 | regular (regular) | water | water1, water2 |
| 48 | 595 | Joltik | 1 | regular (regular) | bug, electric | bug |
| 49 | 597 | Ferroseed | 1 | regular (regular) | grass, steel | plant, mineral |
| 50 | 599 | Klink | 1 | regular (regular) | steel | mineral |
| 51 | 602 | Tynamo | 1 | regular (regular) | electric | indeterminate |
| 52 | 605 | Elgyem | 1 | regular (regular) | psychic | humanshape |
| 53 | 607 | Litwick | 1 | regular (regular) | ghost, fire | indeterminate |
| 54 | 610 | Axew | 1 | regular (regular) | dragon | monster, dragon |
| 55 | 613 | Cubchoo | 1 | regular (regular) | ice | ground |
| 56 | 615 | Cryogonal | 1 | regular (regular) | ice | mineral |
| 57 | 616 | Shelmet | 1 | regular (regular) | bug | bug |
| 58 | 618 | Stunfisk | 1 | regular (regular) | ground, electric | water1, indeterminate |
| 59 | 619 | Mienfoo | 1 | regular (regular) | fighting | ground, humanshape |
| 60 | 621 | Druddigon | 1 | regular (regular) | dragon | dragon, monster |
| 61 | 622 | Golett | 1 | regular (regular) | ground, ghost | mineral |
| 62 | 624 | Pawniard | 1 | regular (regular) | dark, steel | humanshape |
| 63 | 626 | Bouffalant | 1 | regular (regular) | normal | ground |
| 64 | 627 | Rufflet | 1 | regular (regular) | normal, flying | flying |
| 65 | 629 | Vullaby | 1 | regular (regular) | dark, flying | flying |
| 66 | 631 | Heatmor | 1 | regular (regular) | fire | ground |
| 67 | 632 | Durant | 1 | regular (regular) | bug, steel | bug |
| 68 | 633 | Deino | 1 | regular (regular) | dark, dragon | dragon |
| 69 | 636 | Larvesta | 1 | regular (regular) | bug, fire | bug |
| 70 | 638 | Cobalion | 1 | regular (regular) | steel, fighting | no-eggs |
| 71 | 639 | Terrakion | 1 | regular (regular) | rock, fighting | no-eggs |
| 72 | 640 | Virizion | 1 | regular (regular) | grass, fighting | no-eggs |
| 73 | 641 | Tornadus-Incarnate | 1 | regular (regular) | flying | no-eggs |
| 74 | 642 | Thundurus-Incarnate | 1 | regular (regular) | electric, flying | no-eggs |
| 75 | 643 | Reshiram | 1 | regular (regular) | dragon, fire | no-eggs |
| 76 | 644 | Zekrom | 1 | regular (regular) | dragon, electric | no-eggs |
| 77 | 645 | Landorus-Incarnate | 1 | regular (regular) | ground, flying | no-eggs |
| 78 | 646 | Kyurem | 1 | regular (regular) | dragon, ice | no-eggs |
| 79 | 647 | Keldeo-Ordinary | 1 | regular (regular) | water, fighting | no-eggs |
| 80 | 648 | Meloetta-Aria | 1 | regular (regular) | normal, psychic | no-eggs |
| 81 | 649 | Genesect | 1 | regular (regular) | bug, steel | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 13 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 550 | Basculin-Blue-Striped | 1 | blue-striped (regional/alternate) | water | water2 |
| 2 | 550 | Basculin-White-Striped | 1 | white-striped (regional/alternate) | water | water2 |
| 3 | 554 | Darumaka-Galar | 1 | galar (regional/alternate) | ice | ground |
| 4 | 562 | Yamask-Galar | 1 | galar (regional/alternate) | ground, ghost | mineral, indeterminate |
| 5 | 570 | Zorua-Hisui | 1 | hisui (regional/alternate) | normal, ghost | ground |
| 6 | 618 | Stunfisk-Galar | 1 | galar (regional/alternate) | ground, steel | water1, indeterminate |
| 7 | 641 | Tornadus-Therian | 1 | therian (regional/alternate) | flying | no-eggs |
| 8 | 642 | Thundurus-Therian | 1 | therian (regional/alternate) | electric, flying | no-eggs |
| 9 | 645 | Landorus-Therian | 1 | therian (regional/alternate) | ground, flying | no-eggs |
| 10 | 646 | Kyurem-Black | 1 | black (regional/alternate) | dragon, ice | no-eggs |
| 11 | 646 | Kyurem-White | 1 | white (regional/alternate) | dragon, ice | no-eggs |
| 12 | 647 | Keldeo-Resolute | 1 | resolute (regional/alternate) | water, fighting | no-eggs |
| 13 | 648 | Meloetta-Pirouette | 1 | pirouette (regional/alternate) | normal, fighting | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 531 | Audino-Mega | 1 | mega (mega) | normal, fairy | fairy |

#### Spawn level 5 (stage 1, form tier gmax/multiform) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 550 | Basculin-Red-Striped | 1 | red-striped (gmax/multiform) | water | water2 |

#### Spawn level 6 (stage 2, form tier regular) — 55 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 496 | Servine | 2 | regular (regular) | grass | ground, plant |
| 2 | 499 | Pignite | 2 | regular (regular) | fire, fighting | ground |
| 3 | 502 | Dewott | 2 | regular (regular) | water | ground |
| 4 | 505 | Watchog | 2 | regular (regular) | normal | ground |
| 5 | 507 | Herdier | 2 | regular (regular) | normal | ground |
| 6 | 510 | Liepard | 2 | regular (regular) | dark | ground |
| 7 | 512 | Simisage | 2 | regular (regular) | grass | ground |
| 8 | 514 | Simisear | 2 | regular (regular) | fire | ground |
| 9 | 516 | Simipour | 2 | regular (regular) | water | ground |
| 10 | 518 | Musharna | 2 | regular (regular) | psychic | ground |
| 11 | 520 | Tranquill | 2 | regular (regular) | normal, flying | flying |
| 12 | 523 | Zebstrika | 2 | regular (regular) | electric | ground |
| 13 | 525 | Boldore | 2 | regular (regular) | rock | mineral |
| 14 | 528 | Swoobat | 2 | regular (regular) | psychic, flying | ground, flying |
| 15 | 530 | Excadrill | 2 | regular (regular) | ground, steel | ground |
| 16 | 533 | Gurdurr | 2 | regular (regular) | fighting | humanshape |
| 17 | 536 | Palpitoad | 2 | regular (regular) | water, ground | water1 |
| 18 | 541 | Swadloon | 2 | regular (regular) | bug, grass | bug |
| 19 | 544 | Whirlipede | 2 | regular (regular) | bug, poison | bug |
| 20 | 547 | Whimsicott | 2 | regular (regular) | grass, fairy | plant, fairy |
| 21 | 549 | Lilligant | 2 | regular (regular) | grass | plant |
| 22 | 552 | Krokorok | 2 | regular (regular) | ground, dark | ground |
| 23 | 555 | Darmanitan-Standard | 2 | regular (regular) | fire | ground |
| 24 | 558 | Crustle | 2 | regular (regular) | bug, rock | bug, mineral |
| 25 | 560 | Scrafty | 2 | regular (regular) | dark, fighting | ground, dragon |
| 26 | 563 | Cofagrigus | 2 | regular (regular) | ghost | mineral, indeterminate |
| 27 | 565 | Carracosta | 2 | regular (regular) | water, rock | water1, water3 |
| 28 | 567 | Archeops | 2 | regular (regular) | rock, flying | flying, water3 |
| 29 | 569 | Garbodor | 2 | regular (regular) | poison | mineral |
| 30 | 571 | Zoroark | 2 | regular (regular) | dark | ground |
| 31 | 573 | Cinccino | 2 | regular (regular) | normal | ground |
| 32 | 575 | Gothorita | 2 | regular (regular) | psychic | humanshape |
| 33 | 578 | Duosion | 2 | regular (regular) | psychic | indeterminate |
| 34 | 581 | Swanna | 2 | regular (regular) | water, flying | water1, flying |
| 35 | 583 | Vanillish | 2 | regular (regular) | ice | mineral |
| 36 | 586 | Sawsbuck | 2 | regular (regular) | normal, grass | ground |
| 37 | 589 | Escavalier | 2 | regular (regular) | bug, steel | bug |
| 38 | 591 | Amoonguss | 2 | regular (regular) | grass, poison | plant |
| 39 | 593 | Jellicent-Male | 2 | regular (regular) | water, ghost | indeterminate |
| 40 | 596 | Galvantula | 2 | regular (regular) | bug, electric | bug |
| 41 | 598 | Ferrothorn | 2 | regular (regular) | grass, steel | plant, mineral |
| 42 | 600 | Klang | 2 | regular (regular) | steel | mineral |
| 43 | 603 | Eelektrik | 2 | regular (regular) | electric | indeterminate |
| 44 | 606 | Beheeyem | 2 | regular (regular) | psychic | humanshape |
| 45 | 608 | Lampent | 2 | regular (regular) | ghost, fire | indeterminate |
| 46 | 611 | Fraxure | 2 | regular (regular) | dragon | monster, dragon |
| 47 | 614 | Beartic | 2 | regular (regular) | ice | ground |
| 48 | 617 | Accelgor | 2 | regular (regular) | bug | bug |
| 49 | 620 | Mienshao | 2 | regular (regular) | fighting | ground, humanshape |
| 50 | 623 | Golurk | 2 | regular (regular) | ground, ghost | mineral |
| 51 | 625 | Bisharp | 2 | regular (regular) | dark, steel | humanshape |
| 52 | 628 | Braviary | 2 | regular (regular) | normal, flying | flying |
| 53 | 630 | Mandibuzz | 2 | regular (regular) | dark, flying | flying |
| 54 | 634 | Zweilous | 2 | regular (regular) | dark, dragon | dragon |
| 55 | 637 | Volcarona | 2 | regular (regular) | bug, fire | bug |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 6 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 549 | Lilligant-Hisui | 2 | hisui (regional/alternate) | grass, fighting | plant |
| 2 | 555 | Darmanitan-Zen | 2 | zen (regional/alternate) | fire, psychic | ground |
| 3 | 555 | Darmanitan-Galar-Standard | 2 | galar-standard (regional/alternate) | ice | ground |
| 4 | 555 | Darmanitan-Galar-Zen | 2 | galar-zen (regional/alternate) | ice, fire | ground |
| 5 | 571 | Zoroark-Hisui | 2 | hisui (regional/alternate) | normal, ghost | ground |
| 6 | 628 | Braviary-Hisui | 2 | hisui (regional/alternate) | psychic, flying | flying |

#### Spawn level 9 (stage 2, form tier mega) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 530 | Excadrill-Mega | 2 | mega (mega) | ground, steel | ground |
| 2 | 560 | Scrafty-Mega | 2 | mega (mega) | dark, fighting | ground, dragon |
| 3 | 623 | Golurk-Mega | 2 | mega (mega) | ground, ghost | mineral |

#### Spawn level 10 (stage 2, form tier gmax/multiform) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 569 | Garbodor-Gmax | 2 | gmax (gmax/multiform) | poison | mineral |

#### Spawn level 11 (stage 3, form tier regular) — 19 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 497 | Serperior | 3 | regular (regular) | grass | ground, plant |
| 2 | 500 | Emboar | 3 | regular (regular) | fire, fighting | ground |
| 3 | 503 | Samurott | 3 | regular (regular) | water | ground |
| 4 | 508 | Stoutland | 3 | regular (regular) | normal | ground |
| 5 | 521 | Unfezant | 3 | regular (regular) | normal, flying | flying |
| 6 | 526 | Gigalith | 3 | regular (regular) | rock | mineral |
| 7 | 534 | Conkeldurr | 3 | regular (regular) | fighting | humanshape |
| 8 | 537 | Seismitoad | 3 | regular (regular) | water, ground | water1 |
| 9 | 542 | Leavanny | 3 | regular (regular) | bug, grass | bug |
| 10 | 545 | Scolipede | 3 | regular (regular) | bug, poison | bug |
| 11 | 553 | Krookodile | 3 | regular (regular) | ground, dark | ground |
| 12 | 576 | Gothitelle | 3 | regular (regular) | psychic | humanshape |
| 13 | 579 | Reuniclus | 3 | regular (regular) | psychic | indeterminate |
| 14 | 584 | Vanilluxe | 3 | regular (regular) | ice | mineral |
| 15 | 601 | Klinklang | 3 | regular (regular) | steel | mineral |
| 16 | 604 | Eelektross | 3 | regular (regular) | electric | indeterminate |
| 17 | 609 | Chandelure | 3 | regular (regular) | ghost, fire | indeterminate |
| 18 | 612 | Haxorus | 3 | regular (regular) | dragon | monster, dragon |
| 19 | 635 | Hydreigon | 3 | regular (regular) | dark, dragon | dragon |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 503 | Samurott-Hisui | 3 | hisui (regional/alternate) | water, dark | ground |

#### Spawn level 14 (stage 3, form tier mega) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 500 | Emboar-Mega | 3 | mega (mega) | fire, fighting | ground |
| 2 | 545 | Scolipede-Mega | 3 | mega (mega) | bug, poison | bug |
| 3 | 604 | Eelektross-Mega | 3 | mega (mega) | electric | indeterminate |
| 4 | 609 | Chandelure-Mega | 3 | mega (mega) | ghost, fire | indeterminate |

### By evolution stage

#### Evolution stage 1 — 96 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 494 | Victini | regular | psychic, fire |
| 1 | 495 | Snivy | regular | grass |
| 1 | 498 | Tepig | regular | fire |
| 1 | 501 | Oshawott | regular | water |
| 1 | 504 | Patrat | regular | normal |
| 1 | 506 | Lillipup | regular | normal |
| 1 | 509 | Purrloin | regular | dark |
| 1 | 511 | Pansage | regular | grass |
| 1 | 513 | Pansear | regular | fire |
| 1 | 515 | Panpour | regular | water |
| 1 | 517 | Munna | regular | psychic |
| 1 | 519 | Pidove | regular | normal, flying |
| 1 | 522 | Blitzle | regular | electric |
| 1 | 524 | Roggenrola | regular | rock |
| 1 | 527 | Woobat | regular | psychic, flying |
| 1 | 529 | Drilbur | regular | ground |
| 1 | 531 | Audino | regular | normal |
| 1 | 532 | Timburr | regular | fighting |
| 1 | 535 | Tympole | regular | water |
| 1 | 538 | Throh | regular | fighting |
| 1 | 539 | Sawk | regular | fighting |
| 1 | 540 | Sewaddle | regular | bug, grass |
| 1 | 543 | Venipede | regular | bug, poison |
| 1 | 546 | Cottonee | regular | grass, fairy |
| 1 | 548 | Petilil | regular | grass |
| 1 | 551 | Sandile | regular | ground, dark |
| 1 | 554 | Darumaka | regular | fire |
| 1 | 556 | Maractus | regular | grass |
| 1 | 557 | Dwebble | regular | bug, rock |
| 1 | 559 | Scraggy | regular | dark, fighting |
| 1 | 561 | Sigilyph | regular | psychic, flying |
| 1 | 562 | Yamask | regular | ghost |
| 1 | 564 | Tirtouga | regular | water, rock |
| 1 | 566 | Archen | regular | rock, flying |
| 1 | 568 | Trubbish | regular | poison |
| 1 | 570 | Zorua | regular | dark |
| 1 | 572 | Minccino | regular | normal |
| 1 | 574 | Gothita | regular | psychic |
| 1 | 577 | Solosis | regular | psychic |
| 1 | 580 | Ducklett | regular | water, flying |
| 1 | 582 | Vanillite | regular | ice |
| 1 | 585 | Deerling | regular | normal, grass |
| 1 | 587 | Emolga | regular | electric, flying |
| 1 | 588 | Karrablast | regular | bug |
| 1 | 590 | Foongus | regular | grass, poison |
| 1 | 592 | Frillish-Male | regular | water, ghost |
| 1 | 594 | Alomomola | regular | water |
| 1 | 595 | Joltik | regular | bug, electric |
| 1 | 597 | Ferroseed | regular | grass, steel |
| 1 | 599 | Klink | regular | steel |
| 1 | 602 | Tynamo | regular | electric |
| 1 | 605 | Elgyem | regular | psychic |
| 1 | 607 | Litwick | regular | ghost, fire |
| 1 | 610 | Axew | regular | dragon |
| 1 | 613 | Cubchoo | regular | ice |
| 1 | 615 | Cryogonal | regular | ice |
| 1 | 616 | Shelmet | regular | bug |
| 1 | 618 | Stunfisk | regular | ground, electric |
| 1 | 619 | Mienfoo | regular | fighting |
| 1 | 621 | Druddigon | regular | dragon |
| 1 | 622 | Golett | regular | ground, ghost |
| 1 | 624 | Pawniard | regular | dark, steel |
| 1 | 626 | Bouffalant | regular | normal |
| 1 | 627 | Rufflet | regular | normal, flying |
| 1 | 629 | Vullaby | regular | dark, flying |
| 1 | 631 | Heatmor | regular | fire |
| 1 | 632 | Durant | regular | bug, steel |
| 1 | 633 | Deino | regular | dark, dragon |
| 1 | 636 | Larvesta | regular | bug, fire |
| 1 | 638 | Cobalion | regular | steel, fighting |
| 1 | 639 | Terrakion | regular | rock, fighting |
| 1 | 640 | Virizion | regular | grass, fighting |
| 1 | 641 | Tornadus-Incarnate | regular | flying |
| 1 | 642 | Thundurus-Incarnate | regular | electric, flying |
| 1 | 643 | Reshiram | regular | dragon, fire |
| 1 | 644 | Zekrom | regular | dragon, electric |
| 1 | 645 | Landorus-Incarnate | regular | ground, flying |
| 1 | 646 | Kyurem | regular | dragon, ice |
| 1 | 647 | Keldeo-Ordinary | regular | water, fighting |
| 1 | 648 | Meloetta-Aria | regular | normal, psychic |
| 1 | 649 | Genesect | regular | bug, steel |
| 3 | 550 | Basculin-Blue-Striped | blue-striped | water |
| 3 | 550 | Basculin-White-Striped | white-striped | water |
| 3 | 554 | Darumaka-Galar | galar | ice |
| 3 | 562 | Yamask-Galar | galar | ground, ghost |
| 3 | 570 | Zorua-Hisui | hisui | normal, ghost |
| 3 | 618 | Stunfisk-Galar | galar | ground, steel |
| 3 | 641 | Tornadus-Therian | therian | flying |
| 3 | 642 | Thundurus-Therian | therian | electric, flying |
| 3 | 645 | Landorus-Therian | therian | ground, flying |
| 3 | 646 | Kyurem-Black | black | dragon, ice |
| 3 | 646 | Kyurem-White | white | dragon, ice |
| 3 | 647 | Keldeo-Resolute | resolute | water, fighting |
| 3 | 648 | Meloetta-Pirouette | pirouette | normal, fighting |
| 4 | 531 | Audino-Mega | mega | normal, fairy |
| 5 | 550 | Basculin-Red-Striped | red-striped | water |

#### Evolution stage 2 — 65 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 496 | Servine | regular | grass |
| 6 | 499 | Pignite | regular | fire, fighting |
| 6 | 502 | Dewott | regular | water |
| 6 | 505 | Watchog | regular | normal |
| 6 | 507 | Herdier | regular | normal |
| 6 | 510 | Liepard | regular | dark |
| 6 | 512 | Simisage | regular | grass |
| 6 | 514 | Simisear | regular | fire |
| 6 | 516 | Simipour | regular | water |
| 6 | 518 | Musharna | regular | psychic |
| 6 | 520 | Tranquill | regular | normal, flying |
| 6 | 523 | Zebstrika | regular | electric |
| 6 | 525 | Boldore | regular | rock |
| 6 | 528 | Swoobat | regular | psychic, flying |
| 6 | 530 | Excadrill | regular | ground, steel |
| 6 | 533 | Gurdurr | regular | fighting |
| 6 | 536 | Palpitoad | regular | water, ground |
| 6 | 541 | Swadloon | regular | bug, grass |
| 6 | 544 | Whirlipede | regular | bug, poison |
| 6 | 547 | Whimsicott | regular | grass, fairy |
| 6 | 549 | Lilligant | regular | grass |
| 6 | 552 | Krokorok | regular | ground, dark |
| 6 | 555 | Darmanitan-Standard | regular | fire |
| 6 | 558 | Crustle | regular | bug, rock |
| 6 | 560 | Scrafty | regular | dark, fighting |
| 6 | 563 | Cofagrigus | regular | ghost |
| 6 | 565 | Carracosta | regular | water, rock |
| 6 | 567 | Archeops | regular | rock, flying |
| 6 | 569 | Garbodor | regular | poison |
| 6 | 571 | Zoroark | regular | dark |
| 6 | 573 | Cinccino | regular | normal |
| 6 | 575 | Gothorita | regular | psychic |
| 6 | 578 | Duosion | regular | psychic |
| 6 | 581 | Swanna | regular | water, flying |
| 6 | 583 | Vanillish | regular | ice |
| 6 | 586 | Sawsbuck | regular | normal, grass |
| 6 | 589 | Escavalier | regular | bug, steel |
| 6 | 591 | Amoonguss | regular | grass, poison |
| 6 | 593 | Jellicent-Male | regular | water, ghost |
| 6 | 596 | Galvantula | regular | bug, electric |
| 6 | 598 | Ferrothorn | regular | grass, steel |
| 6 | 600 | Klang | regular | steel |
| 6 | 603 | Eelektrik | regular | electric |
| 6 | 606 | Beheeyem | regular | psychic |
| 6 | 608 | Lampent | regular | ghost, fire |
| 6 | 611 | Fraxure | regular | dragon |
| 6 | 614 | Beartic | regular | ice |
| 6 | 617 | Accelgor | regular | bug |
| 6 | 620 | Mienshao | regular | fighting |
| 6 | 623 | Golurk | regular | ground, ghost |
| 6 | 625 | Bisharp | regular | dark, steel |
| 6 | 628 | Braviary | regular | normal, flying |
| 6 | 630 | Mandibuzz | regular | dark, flying |
| 6 | 634 | Zweilous | regular | dark, dragon |
| 6 | 637 | Volcarona | regular | bug, fire |
| 8 | 549 | Lilligant-Hisui | hisui | grass, fighting |
| 8 | 555 | Darmanitan-Zen | zen | fire, psychic |
| 8 | 555 | Darmanitan-Galar-Standard | galar-standard | ice |
| 8 | 555 | Darmanitan-Galar-Zen | galar-zen | ice, fire |
| 8 | 571 | Zoroark-Hisui | hisui | normal, ghost |
| 8 | 628 | Braviary-Hisui | hisui | psychic, flying |
| 9 | 530 | Excadrill-Mega | mega | ground, steel |
| 9 | 560 | Scrafty-Mega | mega | dark, fighting |
| 9 | 623 | Golurk-Mega | mega | ground, ghost |
| 10 | 569 | Garbodor-Gmax | gmax | poison |

#### Evolution stage 3 — 24 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 497 | Serperior | regular | grass |
| 11 | 500 | Emboar | regular | fire, fighting |
| 11 | 503 | Samurott | regular | water |
| 11 | 508 | Stoutland | regular | normal |
| 11 | 521 | Unfezant | regular | normal, flying |
| 11 | 526 | Gigalith | regular | rock |
| 11 | 534 | Conkeldurr | regular | fighting |
| 11 | 537 | Seismitoad | regular | water, ground |
| 11 | 542 | Leavanny | regular | bug, grass |
| 11 | 545 | Scolipede | regular | bug, poison |
| 11 | 553 | Krookodile | regular | ground, dark |
| 11 | 576 | Gothitelle | regular | psychic |
| 11 | 579 | Reuniclus | regular | psychic |
| 11 | 584 | Vanilluxe | regular | ice |
| 11 | 601 | Klinklang | regular | steel |
| 11 | 604 | Eelektross | regular | electric |
| 11 | 609 | Chandelure | regular | ghost, fire |
| 11 | 612 | Haxorus | regular | dragon |
| 11 | 635 | Hydreigon | regular | dark, dragon |
| 13 | 503 | Samurott-Hisui | hisui | water, dark |
| 14 | 500 | Emboar-Mega | mega | fire, fighting |
| 14 | 545 | Scolipede-Mega | mega | bug, poison |
| 14 | 604 | Eelektross-Mega | mega | electric |
| 14 | 609 | Chandelure-Mega | mega | ghost, fire |

---

## Kalos (dex 650–721, 72 species)

**In-game path:** 5 — Coronet Approach

### Summary

- Spawn levels present: 1, 3, 4, 6, 8, 9, 11, 13, 14, 41
- Evolution stages present: 1, 2, 3, 9
- Total catalog entries: 103

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 37 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 650 | Chespin | 1 | regular (regular) | grass | ground |
| 2 | 653 | Fennekin | 1 | regular (regular) | fire | ground |
| 3 | 656 | Froakie | 1 | regular (regular) | water | water1 |
| 4 | 659 | Bunnelby | 1 | regular (regular) | normal | ground |
| 5 | 661 | Fletchling | 1 | regular (regular) | normal, flying | flying |
| 6 | 664 | Scatterbug | 1 | regular (regular) | bug | bug |
| 7 | 667 | Litleo | 1 | regular (regular) | fire, normal | ground |
| 8 | 669 | Flabebe | 1 | regular (regular) | fairy | fairy |
| 9 | 672 | Skiddo | 1 | regular (regular) | grass | ground |
| 10 | 674 | Pancham | 1 | regular (regular) | fighting | ground, humanshape |
| 11 | 676 | Furfrou | 1 | regular (regular) | normal | ground |
| 12 | 677 | Espurr | 1 | regular (regular) | psychic | ground |
| 13 | 679 | Honedge | 1 | regular (regular) | steel, ghost | mineral |
| 14 | 682 | Spritzee | 1 | regular (regular) | fairy | fairy |
| 15 | 684 | Swirlix | 1 | regular (regular) | fairy | fairy |
| 16 | 686 | Inkay | 1 | regular (regular) | dark, psychic | water1, water2 |
| 17 | 688 | Binacle | 1 | regular (regular) | rock, water | water3 |
| 18 | 690 | Skrelp | 1 | regular (regular) | poison, water | water1, dragon |
| 19 | 692 | Clauncher | 1 | regular (regular) | water | water1, water3 |
| 20 | 694 | Helioptile | 1 | regular (regular) | electric, normal | monster, dragon |
| 21 | 696 | Tyrunt | 1 | regular (regular) | rock, dragon | monster, dragon |
| 22 | 698 | Amaura | 1 | regular (regular) | rock, ice | monster |
| 23 | 701 | Hawlucha | 1 | regular (regular) | fighting, flying | flying, humanshape |
| 24 | 702 | Dedenne | 1 | regular (regular) | electric, fairy | ground, fairy |
| 25 | 703 | Carbink | 1 | regular (regular) | rock, fairy | fairy, mineral |
| 26 | 704 | Goomy | 1 | regular (regular) | dragon | dragon |
| 27 | 707 | Klefki | 1 | regular (regular) | steel, fairy | mineral |
| 28 | 708 | Phantump | 1 | regular (regular) | ghost, grass | plant, indeterminate |
| 29 | 710 | Pumpkaboo-Average | 1 | regular (regular) | ghost, grass | indeterminate |
| 30 | 712 | Bergmite | 1 | regular (regular) | ice | monster, mineral |
| 31 | 714 | Noibat | 1 | regular (regular) | flying, dragon | flying, dragon |
| 32 | 716 | Xerneas | 1 | regular (regular) | fairy | no-eggs |
| 33 | 717 | Yveltal | 1 | regular (regular) | dark, flying | no-eggs |
| 34 | 718 | Zygarde-50 | 1 | regular (regular) | dragon, ground | no-eggs |
| 35 | 719 | Diancie | 1 | regular (regular) | rock, fairy | no-eggs |
| 36 | 720 | Hoopa | 1 | regular (regular) | psychic, ghost | no-eggs |
| 37 | 721 | Volcanion | 1 | regular (regular) | fire, water | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 8 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 710 | Pumpkaboo-Small | 1 | small (regional/alternate) | ghost, grass | indeterminate |
| 2 | 710 | Pumpkaboo-Large | 1 | large (regional/alternate) | ghost, grass | indeterminate |
| 3 | 710 | Pumpkaboo-Super | 1 | super (regional/alternate) | ghost, grass | indeterminate |
| 4 | 718 | Zygarde-10-Power-Construct | 1 | 10-power-construct (regional/alternate) | dragon, ground | no-eggs |
| 5 | 718 | Zygarde-50-Power-Construct | 1 | 50-power-construct (regional/alternate) | dragon, ground | no-eggs |
| 6 | 718 | Zygarde-Complete | 1 | complete (regional/alternate) | dragon, ground | no-eggs |
| 7 | 718 | Zygarde-10 | 1 | 10 (regional/alternate) | dragon, ground | no-eggs |
| 8 | 720 | Hoopa-Unbound | 1 | unbound (regional/alternate) | psychic, dark | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 701 | Hawlucha-Mega | 1 | mega (mega) | fighting, flying | flying, humanshape |
| 2 | 718 | Zygarde-Mega | 1 | mega (mega) | dragon, ground | no-eggs |
| 3 | 719 | Diancie-Mega | 1 | mega (mega) | rock, fairy | no-eggs |

#### Spawn level 6 (stage 2, form tier regular) — 26 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 651 | Quilladin | 2 | regular (regular) | grass | ground |
| 2 | 654 | Braixen | 2 | regular (regular) | fire | ground |
| 3 | 657 | Frogadier | 2 | regular (regular) | water | water1 |
| 4 | 660 | Diggersby | 2 | regular (regular) | normal, ground | ground |
| 5 | 662 | Fletchinder | 2 | regular (regular) | fire, flying | flying |
| 6 | 665 | Spewpa | 2 | regular (regular) | bug | bug |
| 7 | 668 | Pyroar-Male | 2 | regular (regular) | fire, normal | ground |
| 8 | 670 | Floette | 2 | regular (regular) | fairy | fairy |
| 9 | 673 | Gogoat | 2 | regular (regular) | grass | ground |
| 10 | 675 | Pangoro | 2 | regular (regular) | fighting, dark | ground, humanshape |
| 11 | 678 | Meowstic-Male | 2 | regular (regular) | psychic | ground |
| 12 | 680 | Doublade | 2 | regular (regular) | steel, ghost | mineral |
| 13 | 683 | Aromatisse | 2 | regular (regular) | fairy | fairy |
| 14 | 685 | Slurpuff | 2 | regular (regular) | fairy | fairy |
| 15 | 687 | Malamar | 2 | regular (regular) | dark, psychic | water1, water2 |
| 16 | 689 | Barbaracle | 2 | regular (regular) | rock, water | water3 |
| 17 | 691 | Dragalge | 2 | regular (regular) | poison, dragon | water1, dragon |
| 18 | 693 | Clawitzer | 2 | regular (regular) | water | water1, water3 |
| 19 | 695 | Heliolisk | 2 | regular (regular) | electric, normal | monster, dragon |
| 20 | 697 | Tyrantrum | 2 | regular (regular) | rock, dragon | monster, dragon |
| 21 | 699 | Aurorus | 2 | regular (regular) | rock, ice | monster |
| 22 | 705 | Sliggoo | 2 | regular (regular) | dragon | dragon |
| 23 | 709 | Trevenant | 2 | regular (regular) | ghost, grass | plant, indeterminate |
| 24 | 711 | Gourgeist-Average | 2 | regular (regular) | ghost, grass | indeterminate |
| 25 | 713 | Avalugg | 2 | regular (regular) | ice | monster, mineral |
| 26 | 715 | Noivern | 2 | regular (regular) | flying, dragon | flying, dragon |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 7 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 670 | Floette-Eternal | 2 | eternal (regional/alternate) | fairy | fairy |
| 2 | 678 | Meowstic-Female | 2 | female (regional/alternate) | psychic | ground |
| 3 | 705 | Sliggoo-Hisui | 2 | hisui (regional/alternate) | steel, dragon | dragon |
| 4 | 711 | Gourgeist-Small | 2 | small (regional/alternate) | ghost, grass | indeterminate |
| 5 | 711 | Gourgeist-Large | 2 | large (regional/alternate) | ghost, grass | indeterminate |
| 6 | 711 | Gourgeist-Super | 2 | super (regional/alternate) | ghost, grass | indeterminate |
| 7 | 713 | Avalugg-Hisui | 2 | hisui (regional/alternate) | ice, rock | monster, mineral |

#### Spawn level 9 (stage 2, form tier mega) — 6 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 668 | Pyroar-Mega | 2 | mega (mega) | fire, normal | ground |
| 2 | 670 | Floette-Mega | 2 | mega (mega) | fairy | fairy |
| 3 | 678 | Meowstic-Mega | 2 | mega (mega) | psychic | ground |
| 4 | 687 | Malamar-Mega | 2 | mega (mega) | dark, psychic | water1, water2 |
| 5 | 689 | Barbaracle-Mega | 2 | mega (mega) | rock, fighting | water3 |
| 6 | 691 | Dragalge-Mega | 2 | mega (mega) | poison, dragon | water1, dragon |

#### Spawn level 11 (stage 3, form tier regular) — 8 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 652 | Chesnaught | 3 | regular (regular) | grass, fighting | ground |
| 2 | 655 | Delphox | 3 | regular (regular) | fire, psychic | ground |
| 3 | 658 | Greninja | 3 | regular (regular) | water, dark | water1 |
| 4 | 663 | Talonflame | 3 | regular (regular) | fire, flying | flying |
| 5 | 666 | Vivillon | 3 | regular (regular) | bug, flying | bug |
| 6 | 671 | Florges | 3 | regular (regular) | fairy | fairy |
| 7 | 681 | Aegislash-Shield | 3 | regular (regular) | steel, ghost | mineral |
| 8 | 706 | Goodra | 3 | regular (regular) | dragon | dragon |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 658 | Greninja-Battle-Bond | 3 | battle-bond (regional/alternate) | water, dark | water1 |
| 2 | 658 | Greninja-Ash | 3 | ash (regional/alternate) | water, dark | water1 |
| 3 | 681 | Aegislash-Blade | 3 | blade (regional/alternate) | steel, ghost | mineral |
| 4 | 706 | Goodra-Hisui | 3 | hisui (regional/alternate) | steel, dragon | dragon |

#### Spawn level 14 (stage 3, form tier mega) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 652 | Chesnaught-Mega | 3 | mega (mega) | grass, fighting | ground |
| 2 | 655 | Delphox-Mega | 3 | mega (mega) | fire, psychic | ground |
| 3 | 658 | Greninja-Mega | 3 | mega (mega) | water, dark | water1 |

#### Spawn level 41 (stage 9, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 700 | Sylveon | 9 | regular (regular) | fairy | ground |

### By evolution stage

#### Evolution stage 1 — 48 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 650 | Chespin | regular | grass |
| 1 | 653 | Fennekin | regular | fire |
| 1 | 656 | Froakie | regular | water |
| 1 | 659 | Bunnelby | regular | normal |
| 1 | 661 | Fletchling | regular | normal, flying |
| 1 | 664 | Scatterbug | regular | bug |
| 1 | 667 | Litleo | regular | fire, normal |
| 1 | 669 | Flabebe | regular | fairy |
| 1 | 672 | Skiddo | regular | grass |
| 1 | 674 | Pancham | regular | fighting |
| 1 | 676 | Furfrou | regular | normal |
| 1 | 677 | Espurr | regular | psychic |
| 1 | 679 | Honedge | regular | steel, ghost |
| 1 | 682 | Spritzee | regular | fairy |
| 1 | 684 | Swirlix | regular | fairy |
| 1 | 686 | Inkay | regular | dark, psychic |
| 1 | 688 | Binacle | regular | rock, water |
| 1 | 690 | Skrelp | regular | poison, water |
| 1 | 692 | Clauncher | regular | water |
| 1 | 694 | Helioptile | regular | electric, normal |
| 1 | 696 | Tyrunt | regular | rock, dragon |
| 1 | 698 | Amaura | regular | rock, ice |
| 1 | 701 | Hawlucha | regular | fighting, flying |
| 1 | 702 | Dedenne | regular | electric, fairy |
| 1 | 703 | Carbink | regular | rock, fairy |
| 1 | 704 | Goomy | regular | dragon |
| 1 | 707 | Klefki | regular | steel, fairy |
| 1 | 708 | Phantump | regular | ghost, grass |
| 1 | 710 | Pumpkaboo-Average | regular | ghost, grass |
| 1 | 712 | Bergmite | regular | ice |
| 1 | 714 | Noibat | regular | flying, dragon |
| 1 | 716 | Xerneas | regular | fairy |
| 1 | 717 | Yveltal | regular | dark, flying |
| 1 | 718 | Zygarde-50 | regular | dragon, ground |
| 1 | 719 | Diancie | regular | rock, fairy |
| 1 | 720 | Hoopa | regular | psychic, ghost |
| 1 | 721 | Volcanion | regular | fire, water |
| 3 | 710 | Pumpkaboo-Small | small | ghost, grass |
| 3 | 710 | Pumpkaboo-Large | large | ghost, grass |
| 3 | 710 | Pumpkaboo-Super | super | ghost, grass |
| 3 | 718 | Zygarde-10-Power-Construct | 10-power-construct | dragon, ground |
| 3 | 718 | Zygarde-50-Power-Construct | 50-power-construct | dragon, ground |
| 3 | 718 | Zygarde-Complete | complete | dragon, ground |
| 3 | 718 | Zygarde-10 | 10 | dragon, ground |
| 3 | 720 | Hoopa-Unbound | unbound | psychic, dark |
| 4 | 701 | Hawlucha-Mega | mega | fighting, flying |
| 4 | 718 | Zygarde-Mega | mega | dragon, ground |
| 4 | 719 | Diancie-Mega | mega | rock, fairy |

#### Evolution stage 2 — 39 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 651 | Quilladin | regular | grass |
| 6 | 654 | Braixen | regular | fire |
| 6 | 657 | Frogadier | regular | water |
| 6 | 660 | Diggersby | regular | normal, ground |
| 6 | 662 | Fletchinder | regular | fire, flying |
| 6 | 665 | Spewpa | regular | bug |
| 6 | 668 | Pyroar-Male | regular | fire, normal |
| 6 | 670 | Floette | regular | fairy |
| 6 | 673 | Gogoat | regular | grass |
| 6 | 675 | Pangoro | regular | fighting, dark |
| 6 | 678 | Meowstic-Male | regular | psychic |
| 6 | 680 | Doublade | regular | steel, ghost |
| 6 | 683 | Aromatisse | regular | fairy |
| 6 | 685 | Slurpuff | regular | fairy |
| 6 | 687 | Malamar | regular | dark, psychic |
| 6 | 689 | Barbaracle | regular | rock, water |
| 6 | 691 | Dragalge | regular | poison, dragon |
| 6 | 693 | Clawitzer | regular | water |
| 6 | 695 | Heliolisk | regular | electric, normal |
| 6 | 697 | Tyrantrum | regular | rock, dragon |
| 6 | 699 | Aurorus | regular | rock, ice |
| 6 | 705 | Sliggoo | regular | dragon |
| 6 | 709 | Trevenant | regular | ghost, grass |
| 6 | 711 | Gourgeist-Average | regular | ghost, grass |
| 6 | 713 | Avalugg | regular | ice |
| 6 | 715 | Noivern | regular | flying, dragon |
| 8 | 670 | Floette-Eternal | eternal | fairy |
| 8 | 678 | Meowstic-Female | female | psychic |
| 8 | 705 | Sliggoo-Hisui | hisui | steel, dragon |
| 8 | 711 | Gourgeist-Small | small | ghost, grass |
| 8 | 711 | Gourgeist-Large | large | ghost, grass |
| 8 | 711 | Gourgeist-Super | super | ghost, grass |
| 8 | 713 | Avalugg-Hisui | hisui | ice, rock |
| 9 | 668 | Pyroar-Mega | mega | fire, normal |
| 9 | 670 | Floette-Mega | mega | fairy |
| 9 | 678 | Meowstic-Mega | mega | psychic |
| 9 | 687 | Malamar-Mega | mega | dark, psychic |
| 9 | 689 | Barbaracle-Mega | mega | rock, fighting |
| 9 | 691 | Dragalge-Mega | mega | poison, dragon |

#### Evolution stage 3 — 15 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 652 | Chesnaught | regular | grass, fighting |
| 11 | 655 | Delphox | regular | fire, psychic |
| 11 | 658 | Greninja | regular | water, dark |
| 11 | 663 | Talonflame | regular | fire, flying |
| 11 | 666 | Vivillon | regular | bug, flying |
| 11 | 671 | Florges | regular | fairy |
| 11 | 681 | Aegislash-Shield | regular | steel, ghost |
| 11 | 706 | Goodra | regular | dragon |
| 13 | 658 | Greninja-Battle-Bond | battle-bond | water, dark |
| 13 | 658 | Greninja-Ash | ash | water, dark |
| 13 | 681 | Aegislash-Blade | blade | steel, ghost |
| 13 | 706 | Goodra-Hisui | hisui | steel, dragon |
| 14 | 652 | Chesnaught-Mega | mega | grass, fighting |
| 14 | 655 | Delphox-Mega | mega | fire, psychic |
| 14 | 658 | Greninja-Mega | mega | water, dark |

#### Evolution stage 9 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 41 | 700 | Sylveon | regular | fairy |

---

## Alola (dex 722–809, 88 species)

**In-game path:** 6 — Fantasy World

### Summary

- Spawn levels present: 1, 3, 4, 5, 6, 8, 9, 11, 13, 16
- Evolution stages present: 1, 2, 3, 4
- Total catalog entries: 131

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 55 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 722 | Rowlet | 1 | regular (regular) | grass, flying | flying |
| 2 | 725 | Litten | 1 | regular (regular) | fire | ground |
| 3 | 728 | Popplio | 1 | regular (regular) | water | water1, ground |
| 4 | 731 | Pikipek | 1 | regular (regular) | normal, flying | flying |
| 5 | 734 | Yungoos | 1 | regular (regular) | normal | ground |
| 6 | 736 | Grubbin | 1 | regular (regular) | bug | bug |
| 7 | 739 | Crabrawler | 1 | regular (regular) | fighting | water3 |
| 8 | 741 | Oricorio-Baile | 1 | regular (regular) | fire, flying | flying |
| 9 | 742 | Cutiefly | 1 | regular (regular) | bug, fairy | bug, fairy |
| 10 | 744 | Rockruff | 1 | regular (regular) | rock | ground |
| 11 | 746 | Wishiwashi-Solo | 1 | regular (regular) | water | water2 |
| 12 | 747 | Mareanie | 1 | regular (regular) | poison, water | water1 |
| 13 | 749 | Mudbray | 1 | regular (regular) | ground | ground |
| 14 | 751 | Dewpider | 1 | regular (regular) | water, bug | water1, bug |
| 15 | 753 | Fomantis | 1 | regular (regular) | grass | plant |
| 16 | 755 | Morelull | 1 | regular (regular) | grass, fairy | plant |
| 17 | 757 | Salandit | 1 | regular (regular) | poison, fire | monster, dragon |
| 18 | 759 | Stufful | 1 | regular (regular) | normal, fighting | ground |
| 19 | 761 | Bounsweet | 1 | regular (regular) | grass | plant |
| 20 | 764 | Comfey | 1 | regular (regular) | fairy | plant |
| 21 | 765 | Oranguru | 1 | regular (regular) | normal, psychic | ground |
| 22 | 766 | Passimian | 1 | regular (regular) | fighting | ground |
| 23 | 767 | Wimpod | 1 | regular (regular) | bug, water | bug, water3 |
| 24 | 769 | Sandygast | 1 | regular (regular) | ghost, ground | indeterminate |
| 25 | 771 | Pyukumuku | 1 | regular (regular) | water | water1 |
| 26 | 772 | Type-Null | 1 | regular (regular) | normal | no-eggs |
| 27 | 775 | Komala | 1 | regular (regular) | normal | ground |
| 28 | 776 | Turtonator | 1 | regular (regular) | fire, dragon | monster, dragon |
| 29 | 777 | Togedemaru | 1 | regular (regular) | electric, steel | ground, fairy |
| 30 | 778 | Mimikyu-Disguised | 1 | regular (regular) | ghost, fairy | indeterminate |
| 31 | 779 | Bruxish | 1 | regular (regular) | water, psychic | water2 |
| 32 | 780 | Drampa | 1 | regular (regular) | normal, dragon | monster, dragon |
| 33 | 781 | Dhelmise | 1 | regular (regular) | ghost, grass | mineral |
| 34 | 782 | Jangmo-O | 1 | regular (regular) | dragon | dragon |
| 35 | 785 | Tapu-Koko | 1 | regular (regular) | electric, fairy | no-eggs |
| 36 | 786 | Tapu-Lele | 1 | regular (regular) | psychic, fairy | no-eggs |
| 37 | 787 | Tapu-Bulu | 1 | regular (regular) | grass, fairy | no-eggs |
| 38 | 788 | Tapu-Fini | 1 | regular (regular) | water, fairy | no-eggs |
| 39 | 789 | Cosmog | 1 | regular (regular) | psychic | no-eggs |
| 40 | 793 | Nihilego | 1 | regular (regular) | rock, poison | no-eggs |
| 41 | 794 | Buzzwole | 1 | regular (regular) | bug, fighting | no-eggs |
| 42 | 795 | Pheromosa | 1 | regular (regular) | bug, fighting | no-eggs |
| 43 | 796 | Xurkitree | 1 | regular (regular) | electric | no-eggs |
| 44 | 797 | Celesteela | 1 | regular (regular) | steel, flying | no-eggs |
| 45 | 798 | Kartana | 1 | regular (regular) | grass, steel | no-eggs |
| 46 | 799 | Guzzlord | 1 | regular (regular) | dark, dragon | no-eggs |
| 47 | 800 | Necrozma | 1 | regular (regular) | psychic | no-eggs |
| 48 | 801 | Magearna | 1 | regular (regular) | steel, fairy | no-eggs |
| 49 | 802 | Marshadow | 1 | regular (regular) | fighting, ghost | no-eggs |
| 50 | 803 | Poipole | 1 | regular (regular) | poison | no-eggs |
| 51 | 805 | Stakataka | 1 | regular (regular) | rock, steel | no-eggs |
| 52 | 806 | Blacephalon | 1 | regular (regular) | fire, ghost | no-eggs |
| 53 | 807 | Zeraora | 1 | regular (regular) | electric | no-eggs |
| 54 | 808 | Meltan | 1 | regular (regular) | steel | no-eggs |
| 55 | 809 | Melmetal | 1 | regular (regular) | steel | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 26 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 741 | Oricorio-Pom-Pom | 1 | pom-pom (regional/alternate) | electric, flying | flying |
| 2 | 741 | Oricorio-Pau | 1 | pau (regional/alternate) | psychic, flying | flying |
| 3 | 741 | Oricorio-Sensu | 1 | sensu (regional/alternate) | ghost, flying | flying |
| 4 | 744 | Rockruff-Own-Tempo | 1 | own-tempo (regional/alternate) | rock | ground |
| 5 | 746 | Wishiwashi-School | 1 | school (regional/alternate) | water | water2 |
| 6 | 774 | Minior-Orange-Meteor | 1 | orange-meteor (regional/alternate) | rock, flying | mineral |
| 7 | 774 | Minior-Yellow-Meteor | 1 | yellow-meteor (regional/alternate) | rock, flying | mineral |
| 8 | 774 | Minior-Green-Meteor | 1 | green-meteor (regional/alternate) | rock, flying | mineral |
| 9 | 774 | Minior-Blue-Meteor | 1 | blue-meteor (regional/alternate) | rock, flying | mineral |
| 10 | 774 | Minior-Indigo-Meteor | 1 | indigo-meteor (regional/alternate) | rock, flying | mineral |
| 11 | 774 | Minior-Violet-Meteor | 1 | violet-meteor (regional/alternate) | rock, flying | mineral |
| 12 | 774 | Minior-Red | 1 | red (regional/alternate) | rock, flying | mineral |
| 13 | 774 | Minior-Orange | 1 | orange (regional/alternate) | rock, flying | mineral |
| 14 | 774 | Minior-Yellow | 1 | yellow (regional/alternate) | rock, flying | mineral |
| 15 | 774 | Minior-Green | 1 | green (regional/alternate) | rock, flying | mineral |
| 16 | 774 | Minior-Blue | 1 | blue (regional/alternate) | rock, flying | mineral |
| 17 | 774 | Minior-Indigo | 1 | indigo (regional/alternate) | rock, flying | mineral |
| 18 | 774 | Minior-Violet | 1 | violet (regional/alternate) | rock, flying | mineral |
| 19 | 777 | Togedemaru-Totem | 1 | totem (regional/alternate) | electric, steel | ground, fairy |
| 20 | 778 | Mimikyu-Busted | 1 | busted (regional/alternate) | ghost, fairy | indeterminate |
| 21 | 778 | Mimikyu-Totem-Disguised | 1 | totem-disguised (regional/alternate) | ghost, fairy | indeterminate |
| 22 | 778 | Mimikyu-Totem-Busted | 1 | totem-busted (regional/alternate) | ghost, fairy | indeterminate |
| 23 | 800 | Necrozma-Dusk | 1 | dusk (regional/alternate) | psychic, steel | no-eggs |
| 24 | 800 | Necrozma-Dawn | 1 | dawn (regional/alternate) | psychic, ghost | no-eggs |
| 25 | 800 | Necrozma-Ultra | 1 | ultra (regional/alternate) | psychic, dragon | no-eggs |
| 26 | 801 | Magearna-Original | 1 | original (regional/alternate) | steel, fairy | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 780 | Drampa-Mega | 1 | mega (mega) | normal, dragon | monster, dragon |
| 2 | 801 | Magearna-Mega | 1 | mega (mega) | steel, fairy | no-eggs |
| 3 | 801 | Magearna-Original-Mega | 1 | original-mega (mega) | steel, fairy | no-eggs |
| 4 | 807 | Zeraora-Mega | 1 | mega (mega) | electric | no-eggs |

#### Spawn level 5 (stage 1, form tier gmax/multiform) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 774 | Minior-Red-Meteor | 1 | red-meteor (gmax/multiform) | rock, flying | mineral |
| 2 | 809 | Melmetal-Gmax | 1 | gmax (gmax/multiform) | steel | no-eggs |

#### Spawn level 6 (stage 2, form tier regular) — 23 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 723 | Dartrix | 2 | regular (regular) | grass, flying | flying |
| 2 | 726 | Torracat | 2 | regular (regular) | fire | ground |
| 3 | 729 | Brionne | 2 | regular (regular) | water | water1, ground |
| 4 | 732 | Trumbeak | 2 | regular (regular) | normal, flying | flying |
| 5 | 735 | Gumshoos | 2 | regular (regular) | normal | ground |
| 6 | 737 | Charjabug | 2 | regular (regular) | bug, electric | bug |
| 7 | 740 | Crabominable | 2 | regular (regular) | fighting, ice | water3 |
| 8 | 743 | Ribombee | 2 | regular (regular) | bug, fairy | bug, fairy |
| 9 | 745 | Lycanroc-Midday | 2 | regular (regular) | rock | ground |
| 10 | 748 | Toxapex | 2 | regular (regular) | poison, water | water1 |
| 11 | 750 | Mudsdale | 2 | regular (regular) | ground | ground |
| 12 | 752 | Araquanid | 2 | regular (regular) | water, bug | water1, bug |
| 13 | 754 | Lurantis | 2 | regular (regular) | grass | plant |
| 14 | 756 | Shiinotic | 2 | regular (regular) | grass, fairy | plant |
| 15 | 758 | Salazzle | 2 | regular (regular) | poison, fire | monster, dragon |
| 16 | 760 | Bewear | 2 | regular (regular) | normal, fighting | ground |
| 17 | 762 | Steenee | 2 | regular (regular) | grass | plant |
| 18 | 768 | Golisopod | 2 | regular (regular) | bug, water | bug, water3 |
| 19 | 770 | Palossand | 2 | regular (regular) | ghost, ground | indeterminate |
| 20 | 773 | Silvally | 2 | regular (regular) | normal | no-eggs |
| 21 | 783 | Hakamo-O | 2 | regular (regular) | dragon, fighting | dragon |
| 22 | 790 | Cosmoem | 2 | regular (regular) | psychic | no-eggs |
| 23 | 804 | Naganadel | 2 | regular (regular) | poison, dragon | no-eggs |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 7 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 735 | Gumshoos-Totem | 2 | totem (regional/alternate) | normal | ground |
| 2 | 743 | Ribombee-Totem | 2 | totem (regional/alternate) | bug, fairy | bug, fairy |
| 3 | 745 | Lycanroc-Midnight | 2 | midnight (regional/alternate) | rock | ground |
| 4 | 745 | Lycanroc-Dusk | 2 | dusk (regional/alternate) | rock | ground |
| 5 | 752 | Araquanid-Totem | 2 | totem (regional/alternate) | water, bug | water1, bug |
| 6 | 754 | Lurantis-Totem | 2 | totem (regional/alternate) | grass | plant |
| 7 | 758 | Salazzle-Totem | 2 | totem (regional/alternate) | poison, fire | monster, dragon |

#### Spawn level 9 (stage 2, form tier mega) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 740 | Crabominable-Mega | 2 | mega (mega) | fighting, ice | water3 |
| 2 | 768 | Golisopod-Mega | 2 | mega (mega) | bug, steel | bug, water3 |

#### Spawn level 11 (stage 3, form tier regular) — 8 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 724 | Decidueye | 3 | regular (regular) | grass, ghost | flying |
| 2 | 727 | Incineroar | 3 | regular (regular) | fire, dark | ground |
| 3 | 730 | Primarina | 3 | regular (regular) | water, fairy | water1, ground |
| 4 | 733 | Toucannon | 3 | regular (regular) | normal, flying | flying |
| 5 | 738 | Vikavolt | 3 | regular (regular) | bug, electric | bug |
| 6 | 763 | Tsareena | 3 | regular (regular) | grass | plant |
| 7 | 784 | Kommo-O | 3 | regular (regular) | dragon, fighting | dragon |
| 8 | 791 | Solgaleo | 3 | regular (regular) | psychic, steel | no-eggs |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 724 | Decidueye-Hisui | 3 | hisui (regional/alternate) | grass, fighting | flying |
| 2 | 738 | Vikavolt-Totem | 3 | totem (regional/alternate) | bug, electric | bug |
| 3 | 784 | Kommo-O-Totem | 3 | o-totem (regional/alternate) | dragon, fighting | dragon |

#### Spawn level 16 (stage 4, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 792 | Lunala | 4 | regular (regular) | psychic, ghost | no-eggs |

### By evolution stage

#### Evolution stage 1 — 87 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 722 | Rowlet | regular | grass, flying |
| 1 | 725 | Litten | regular | fire |
| 1 | 728 | Popplio | regular | water |
| 1 | 731 | Pikipek | regular | normal, flying |
| 1 | 734 | Yungoos | regular | normal |
| 1 | 736 | Grubbin | regular | bug |
| 1 | 739 | Crabrawler | regular | fighting |
| 1 | 741 | Oricorio-Baile | regular | fire, flying |
| 1 | 742 | Cutiefly | regular | bug, fairy |
| 1 | 744 | Rockruff | regular | rock |
| 1 | 746 | Wishiwashi-Solo | regular | water |
| 1 | 747 | Mareanie | regular | poison, water |
| 1 | 749 | Mudbray | regular | ground |
| 1 | 751 | Dewpider | regular | water, bug |
| 1 | 753 | Fomantis | regular | grass |
| 1 | 755 | Morelull | regular | grass, fairy |
| 1 | 757 | Salandit | regular | poison, fire |
| 1 | 759 | Stufful | regular | normal, fighting |
| 1 | 761 | Bounsweet | regular | grass |
| 1 | 764 | Comfey | regular | fairy |
| 1 | 765 | Oranguru | regular | normal, psychic |
| 1 | 766 | Passimian | regular | fighting |
| 1 | 767 | Wimpod | regular | bug, water |
| 1 | 769 | Sandygast | regular | ghost, ground |
| 1 | 771 | Pyukumuku | regular | water |
| 1 | 772 | Type-Null | regular | normal |
| 1 | 775 | Komala | regular | normal |
| 1 | 776 | Turtonator | regular | fire, dragon |
| 1 | 777 | Togedemaru | regular | electric, steel |
| 1 | 778 | Mimikyu-Disguised | regular | ghost, fairy |
| 1 | 779 | Bruxish | regular | water, psychic |
| 1 | 780 | Drampa | regular | normal, dragon |
| 1 | 781 | Dhelmise | regular | ghost, grass |
| 1 | 782 | Jangmo-O | regular | dragon |
| 1 | 785 | Tapu-Koko | regular | electric, fairy |
| 1 | 786 | Tapu-Lele | regular | psychic, fairy |
| 1 | 787 | Tapu-Bulu | regular | grass, fairy |
| 1 | 788 | Tapu-Fini | regular | water, fairy |
| 1 | 789 | Cosmog | regular | psychic |
| 1 | 793 | Nihilego | regular | rock, poison |
| 1 | 794 | Buzzwole | regular | bug, fighting |
| 1 | 795 | Pheromosa | regular | bug, fighting |
| 1 | 796 | Xurkitree | regular | electric |
| 1 | 797 | Celesteela | regular | steel, flying |
| 1 | 798 | Kartana | regular | grass, steel |
| 1 | 799 | Guzzlord | regular | dark, dragon |
| 1 | 800 | Necrozma | regular | psychic |
| 1 | 801 | Magearna | regular | steel, fairy |
| 1 | 802 | Marshadow | regular | fighting, ghost |
| 1 | 803 | Poipole | regular | poison |
| 1 | 805 | Stakataka | regular | rock, steel |
| 1 | 806 | Blacephalon | regular | fire, ghost |
| 1 | 807 | Zeraora | regular | electric |
| 1 | 808 | Meltan | regular | steel |
| 1 | 809 | Melmetal | regular | steel |
| 3 | 741 | Oricorio-Pom-Pom | pom-pom | electric, flying |
| 3 | 741 | Oricorio-Pau | pau | psychic, flying |
| 3 | 741 | Oricorio-Sensu | sensu | ghost, flying |
| 3 | 744 | Rockruff-Own-Tempo | own-tempo | rock |
| 3 | 746 | Wishiwashi-School | school | water |
| 3 | 774 | Minior-Orange-Meteor | orange-meteor | rock, flying |
| 3 | 774 | Minior-Yellow-Meteor | yellow-meteor | rock, flying |
| 3 | 774 | Minior-Green-Meteor | green-meteor | rock, flying |
| 3 | 774 | Minior-Blue-Meteor | blue-meteor | rock, flying |
| 3 | 774 | Minior-Indigo-Meteor | indigo-meteor | rock, flying |
| 3 | 774 | Minior-Violet-Meteor | violet-meteor | rock, flying |
| 3 | 774 | Minior-Red | red | rock, flying |
| 3 | 774 | Minior-Orange | orange | rock, flying |
| 3 | 774 | Minior-Yellow | yellow | rock, flying |
| 3 | 774 | Minior-Green | green | rock, flying |
| 3 | 774 | Minior-Blue | blue | rock, flying |
| 3 | 774 | Minior-Indigo | indigo | rock, flying |
| 3 | 774 | Minior-Violet | violet | rock, flying |
| 3 | 777 | Togedemaru-Totem | totem | electric, steel |
| 3 | 778 | Mimikyu-Busted | busted | ghost, fairy |
| 3 | 778 | Mimikyu-Totem-Disguised | totem-disguised | ghost, fairy |
| 3 | 778 | Mimikyu-Totem-Busted | totem-busted | ghost, fairy |
| 3 | 800 | Necrozma-Dusk | dusk | psychic, steel |
| 3 | 800 | Necrozma-Dawn | dawn | psychic, ghost |
| 3 | 800 | Necrozma-Ultra | ultra | psychic, dragon |
| 3 | 801 | Magearna-Original | original | steel, fairy |
| 4 | 780 | Drampa-Mega | mega | normal, dragon |
| 4 | 801 | Magearna-Mega | mega | steel, fairy |
| 4 | 801 | Magearna-Original-Mega | original-mega | steel, fairy |
| 4 | 807 | Zeraora-Mega | mega | electric |
| 5 | 774 | Minior-Red-Meteor | red-meteor | rock, flying |
| 5 | 809 | Melmetal-Gmax | gmax | steel |

#### Evolution stage 2 — 32 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 723 | Dartrix | regular | grass, flying |
| 6 | 726 | Torracat | regular | fire |
| 6 | 729 | Brionne | regular | water |
| 6 | 732 | Trumbeak | regular | normal, flying |
| 6 | 735 | Gumshoos | regular | normal |
| 6 | 737 | Charjabug | regular | bug, electric |
| 6 | 740 | Crabominable | regular | fighting, ice |
| 6 | 743 | Ribombee | regular | bug, fairy |
| 6 | 745 | Lycanroc-Midday | regular | rock |
| 6 | 748 | Toxapex | regular | poison, water |
| 6 | 750 | Mudsdale | regular | ground |
| 6 | 752 | Araquanid | regular | water, bug |
| 6 | 754 | Lurantis | regular | grass |
| 6 | 756 | Shiinotic | regular | grass, fairy |
| 6 | 758 | Salazzle | regular | poison, fire |
| 6 | 760 | Bewear | regular | normal, fighting |
| 6 | 762 | Steenee | regular | grass |
| 6 | 768 | Golisopod | regular | bug, water |
| 6 | 770 | Palossand | regular | ghost, ground |
| 6 | 773 | Silvally | regular | normal |
| 6 | 783 | Hakamo-O | regular | dragon, fighting |
| 6 | 790 | Cosmoem | regular | psychic |
| 6 | 804 | Naganadel | regular | poison, dragon |
| 8 | 735 | Gumshoos-Totem | totem | normal |
| 8 | 743 | Ribombee-Totem | totem | bug, fairy |
| 8 | 745 | Lycanroc-Midnight | midnight | rock |
| 8 | 745 | Lycanroc-Dusk | dusk | rock |
| 8 | 752 | Araquanid-Totem | totem | water, bug |
| 8 | 754 | Lurantis-Totem | totem | grass |
| 8 | 758 | Salazzle-Totem | totem | poison, fire |
| 9 | 740 | Crabominable-Mega | mega | fighting, ice |
| 9 | 768 | Golisopod-Mega | mega | bug, steel |

#### Evolution stage 3 — 11 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 724 | Decidueye | regular | grass, ghost |
| 11 | 727 | Incineroar | regular | fire, dark |
| 11 | 730 | Primarina | regular | water, fairy |
| 11 | 733 | Toucannon | regular | normal, flying |
| 11 | 738 | Vikavolt | regular | bug, electric |
| 11 | 763 | Tsareena | regular | grass |
| 11 | 784 | Kommo-O | regular | dragon, fighting |
| 11 | 791 | Solgaleo | regular | psychic, steel |
| 13 | 724 | Decidueye-Hisui | hisui | grass, fighting |
| 13 | 738 | Vikavolt-Totem | totem | bug, electric |
| 13 | 784 | Kommo-O-Totem | o-totem | dragon, fighting |

#### Evolution stage 4 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 792 | Lunala | regular | psychic, ghost |

---

## Galar (dex 810–905, 96 species)

**In-game path:** 7 — Village World

### Summary

- Spawn levels present: 1, 3, 4, 5, 6, 8, 10, 11, 13, 15
- Evolution stages present: 1, 2, 3
- Total catalog entries: 133

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 47 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 810 | Grookey | 1 | regular (regular) | grass | ground, plant |
| 2 | 813 | Scorbunny | 1 | regular (regular) | fire | ground, humanshape |
| 3 | 816 | Sobble | 1 | regular (regular) | water | water1, ground |
| 4 | 819 | Skwovet | 1 | regular (regular) | normal | ground |
| 5 | 821 | Rookidee | 1 | regular (regular) | flying | flying |
| 6 | 824 | Blipbug | 1 | regular (regular) | bug | bug |
| 7 | 827 | Nickit | 1 | regular (regular) | dark | ground |
| 8 | 829 | Gossifleur | 1 | regular (regular) | grass | plant |
| 9 | 831 | Wooloo | 1 | regular (regular) | normal | ground |
| 10 | 833 | Chewtle | 1 | regular (regular) | water | monster, water1 |
| 11 | 835 | Yamper | 1 | regular (regular) | electric | ground |
| 12 | 837 | Rolycoly | 1 | regular (regular) | rock | mineral |
| 13 | 840 | Applin | 1 | regular (regular) | grass, dragon | plant, dragon |
| 14 | 843 | Silicobra | 1 | regular (regular) | ground | ground, dragon |
| 15 | 845 | Cramorant | 1 | regular (regular) | flying, water | water1, flying |
| 16 | 846 | Arrokuda | 1 | regular (regular) | water | water2 |
| 17 | 848 | Toxel | 1 | regular (regular) | electric, poison | no-eggs |
| 18 | 850 | Sizzlipede | 1 | regular (regular) | fire, bug | bug |
| 19 | 852 | Clobbopus | 1 | regular (regular) | fighting | water1, humanshape |
| 20 | 854 | Sinistea | 1 | regular (regular) | ghost | mineral, indeterminate |
| 21 | 856 | Hatenna | 1 | regular (regular) | psychic | fairy |
| 22 | 859 | Impidimp | 1 | regular (regular) | dark, fairy | fairy, humanshape |
| 23 | 868 | Milcery | 1 | regular (regular) | fairy | fairy, indeterminate |
| 24 | 870 | Falinks | 1 | regular (regular) | fighting | fairy, mineral |
| 25 | 871 | Pincurchin | 1 | regular (regular) | electric | water1, indeterminate |
| 26 | 872 | Snom | 1 | regular (regular) | ice, bug | bug |
| 27 | 874 | Stonjourner | 1 | regular (regular) | rock | mineral |
| 28 | 875 | Eiscue-Ice | 1 | regular (regular) | ice | water1, ground |
| 29 | 876 | Indeedee-Male | 1 | regular (regular) | psychic, normal | fairy |
| 30 | 878 | Cufant | 1 | regular (regular) | steel | ground, mineral |
| 31 | 880 | Dracozolt | 1 | regular (regular) | electric, dragon | no-eggs |
| 32 | 881 | Arctozolt | 1 | regular (regular) | electric, ice | no-eggs |
| 33 | 882 | Dracovish | 1 | regular (regular) | water, dragon | no-eggs |
| 34 | 883 | Arctovish | 1 | regular (regular) | water, ice | no-eggs |
| 35 | 884 | Duraludon | 1 | regular (regular) | steel, dragon | mineral, dragon |
| 36 | 885 | Dreepy | 1 | regular (regular) | dragon, ghost | indeterminate, dragon |
| 37 | 888 | Zacian | 1 | regular (regular) | fairy | no-eggs |
| 38 | 889 | Zamazenta | 1 | regular (regular) | fighting | no-eggs |
| 39 | 890 | Eternatus | 1 | regular (regular) | poison, dragon | no-eggs |
| 40 | 891 | Kubfu | 1 | regular (regular) | fighting | no-eggs |
| 41 | 893 | Zarude | 1 | regular (regular) | dark, grass | no-eggs |
| 42 | 894 | Regieleki | 1 | regular (regular) | electric | no-eggs |
| 43 | 895 | Regidrago | 1 | regular (regular) | dragon | no-eggs |
| 44 | 896 | Glastrier | 1 | regular (regular) | ice | no-eggs |
| 45 | 897 | Spectrier | 1 | regular (regular) | ghost | no-eggs |
| 46 | 898 | Calyrex | 1 | regular (regular) | psychic, grass | no-eggs |
| 47 | 905 | Enamorus-Incarnate | 1 | regular (regular) | fairy, flying | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 12 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 845 | Cramorant-Gulping | 1 | gulping (regional/alternate) | flying, water | water1, flying |
| 2 | 845 | Cramorant-Gorging | 1 | gorging (regional/alternate) | flying, water | water1, flying |
| 3 | 875 | Eiscue-Noice | 1 | noice (regional/alternate) | ice | water1, ground |
| 4 | 876 | Indeedee-Female | 1 | female (regional/alternate) | psychic, normal | fairy |
| 5 | 877 | Morpeko-Hangry | 1 | hangry (regional/alternate) | electric, dark | ground, fairy |
| 6 | 888 | Zacian-Crowned | 1 | crowned (regional/alternate) | fairy, steel | no-eggs |
| 7 | 889 | Zamazenta-Crowned | 1 | crowned (regional/alternate) | fighting, steel | no-eggs |
| 8 | 890 | Eternatus-Eternamax | 1 | eternamax (regional/alternate) | poison, dragon | no-eggs |
| 9 | 893 | Zarude-Dada | 1 | dada (regional/alternate) | dark, grass | no-eggs |
| 10 | 898 | Calyrex-Ice | 1 | ice (regional/alternate) | psychic, ice | no-eggs |
| 11 | 898 | Calyrex-Shadow | 1 | shadow (regional/alternate) | psychic, ghost | no-eggs |
| 12 | 905 | Enamorus-Therian | 1 | therian (regional/alternate) | fairy, flying | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 870 | Falinks-Mega | 1 | mega (mega) | fighting | fairy, mineral |

#### Spawn level 5 (stage 1, form tier gmax/multiform) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 877 | Morpeko-Full-Belly | 1 | full-belly (gmax/multiform) | electric, dark | ground, fairy |
| 2 | 884 | Duraludon-Gmax | 1 | gmax (gmax/multiform) | steel, dragon | mineral, dragon |

#### Spawn level 6 (stage 2, form tier regular) — 30 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 811 | Thwackey | 2 | regular (regular) | grass | ground, plant |
| 2 | 814 | Raboot | 2 | regular (regular) | fire | ground, humanshape |
| 3 | 817 | Drizzile | 2 | regular (regular) | water | water1, ground |
| 4 | 820 | Greedent | 2 | regular (regular) | normal | ground |
| 5 | 822 | Corvisquire | 2 | regular (regular) | flying | flying |
| 6 | 825 | Dottler | 2 | regular (regular) | bug, psychic | bug |
| 7 | 828 | Thievul | 2 | regular (regular) | dark | ground |
| 8 | 830 | Eldegoss | 2 | regular (regular) | grass | plant |
| 9 | 832 | Dubwool | 2 | regular (regular) | normal | ground |
| 10 | 834 | Drednaw | 2 | regular (regular) | water, rock | monster, water1 |
| 11 | 836 | Boltund | 2 | regular (regular) | electric | ground |
| 12 | 838 | Carkol | 2 | regular (regular) | rock, fire | mineral |
| 13 | 841 | Flapple | 2 | regular (regular) | grass, dragon | plant, dragon |
| 14 | 844 | Sandaconda | 2 | regular (regular) | ground | ground, dragon |
| 15 | 847 | Barraskewda | 2 | regular (regular) | water | water2 |
| 16 | 849 | Toxtricity-Amped | 2 | regular (regular) | electric, poison | humanshape |
| 17 | 851 | Centiskorch | 2 | regular (regular) | fire, bug | bug |
| 18 | 853 | Grapploct | 2 | regular (regular) | fighting | water1, humanshape |
| 19 | 855 | Polteageist | 2 | regular (regular) | ghost | mineral, indeterminate |
| 20 | 857 | Hattrem | 2 | regular (regular) | psychic | fairy |
| 21 | 860 | Morgrem | 2 | regular (regular) | dark, fairy | fairy, humanshape |
| 22 | 864 | Cursola | 2 | regular (regular) | ghost | water1, water3 |
| 23 | 865 | Sirfetchd | 2 | regular (regular) | fighting | flying, ground |
| 24 | 869 | Alcremie | 2 | regular (regular) | fairy | fairy, indeterminate |
| 25 | 873 | Frosmoth | 2 | regular (regular) | ice, bug | bug |
| 26 | 879 | Copperajah | 2 | regular (regular) | steel | ground, mineral |
| 27 | 886 | Drakloak | 2 | regular (regular) | dragon, ghost | indeterminate, dragon |
| 28 | 899 | Wyrdeer | 2 | regular (regular) | normal, psychic | ground |
| 29 | 902 | Basculegion-Male | 2 | regular (regular) | water, ghost | water2 |
| 30 | 904 | Overqwil | 2 | regular (regular) | dark, poison | water2 |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 849 | Toxtricity-Low-Key | 2 | low-key (regional/alternate) | electric, poison | humanshape |
| 2 | 892 | Urshifu-Rapid-Strike | 2 | rapid-strike (regional/alternate) | fighting, water | no-eggs |
| 3 | 902 | Basculegion-Female | 2 | female (regional/alternate) | water, ghost | water2 |

#### Spawn level 10 (stage 2, form tier gmax/multiform) — 11 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 834 | Drednaw-Gmax | 2 | gmax (gmax/multiform) | water, rock | monster, water1 |
| 2 | 841 | Flapple-Gmax | 2 | gmax (gmax/multiform) | grass, dragon | plant, dragon |
| 3 | 844 | Sandaconda-Gmax | 2 | gmax (gmax/multiform) | ground | ground, dragon |
| 4 | 849 | Toxtricity-Amped-Gmax | 2 | amped-gmax (gmax/multiform) | electric, poison | humanshape |
| 5 | 849 | Toxtricity-Low-Key-Gmax | 2 | low-key-gmax (gmax/multiform) | electric, poison | humanshape |
| 6 | 851 | Centiskorch-Gmax | 2 | gmax (gmax/multiform) | fire, bug | bug |
| 7 | 869 | Alcremie-Gmax | 2 | gmax (gmax/multiform) | fairy | fairy, indeterminate |
| 8 | 879 | Copperajah-Gmax | 2 | gmax (gmax/multiform) | steel | ground, mineral |
| 9 | 892 | Urshifu-Single-Strike | 2 | single-strike (gmax/multiform) | fighting, dark | no-eggs |
| 10 | 892 | Urshifu-Single-Strike-Gmax | 2 | single-strike-gmax (gmax/multiform) | fighting, dark | no-eggs |
| 11 | 892 | Urshifu-Rapid-Strike-Gmax | 2 | rapid-strike-gmax (gmax/multiform) | fighting, water | no-eggs |

#### Spawn level 11 (stage 3, form tier regular) — 17 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 812 | Rillaboom | 3 | regular (regular) | grass | ground, plant |
| 2 | 815 | Cinderace | 3 | regular (regular) | fire | ground, humanshape |
| 3 | 818 | Inteleon | 3 | regular (regular) | water | water1, ground |
| 4 | 823 | Corviknight | 3 | regular (regular) | flying, steel | flying |
| 5 | 826 | Orbeetle | 3 | regular (regular) | bug, psychic | bug |
| 6 | 839 | Coalossal | 3 | regular (regular) | rock, fire | mineral |
| 7 | 842 | Appletun | 3 | regular (regular) | grass, dragon | plant, dragon |
| 8 | 858 | Hatterene | 3 | regular (regular) | psychic, fairy | fairy |
| 9 | 861 | Grimmsnarl | 3 | regular (regular) | dark, fairy | fairy, humanshape |
| 10 | 862 | Obstagoon | 3 | regular (regular) | dark, normal | ground |
| 11 | 863 | Perrserker | 3 | regular (regular) | steel | ground |
| 12 | 866 | Mr-Rime | 3 | regular (regular) | ice, psychic | humanshape |
| 13 | 867 | Runerigus | 3 | regular (regular) | ground, ghost | mineral, indeterminate |
| 14 | 887 | Dragapult | 3 | regular (regular) | dragon, ghost | indeterminate, dragon |
| 15 | 900 | Kleavor | 3 | regular (regular) | bug, rock | bug |
| 16 | 901 | Ursaluna | 3 | regular (regular) | ground, normal | ground |
| 17 | 903 | Sneasler | 3 | regular (regular) | fighting, poison | ground |

#### Spawn level 13 (stage 3, form tier regional/alternate) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 901 | Ursaluna-Bloodmoon | 3 | bloodmoon (regional/alternate) | ground, normal | ground |

#### Spawn level 15 (stage 3, form tier gmax/multiform) — 9 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 812 | Rillaboom-Gmax | 3 | gmax (gmax/multiform) | grass | ground, plant |
| 2 | 815 | Cinderace-Gmax | 3 | gmax (gmax/multiform) | fire | ground, humanshape |
| 3 | 818 | Inteleon-Gmax | 3 | gmax (gmax/multiform) | water | water1, ground |
| 4 | 823 | Corviknight-Gmax | 3 | gmax (gmax/multiform) | flying, steel | flying |
| 5 | 826 | Orbeetle-Gmax | 3 | gmax (gmax/multiform) | bug, psychic | bug |
| 6 | 839 | Coalossal-Gmax | 3 | gmax (gmax/multiform) | rock, fire | mineral |
| 7 | 842 | Appletun-Gmax | 3 | gmax (gmax/multiform) | grass, dragon | plant, dragon |
| 8 | 858 | Hatterene-Gmax | 3 | gmax (gmax/multiform) | psychic, fairy | fairy |
| 9 | 861 | Grimmsnarl-Gmax | 3 | gmax (gmax/multiform) | dark, fairy | fairy, humanshape |

### By evolution stage

#### Evolution stage 1 — 62 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 810 | Grookey | regular | grass |
| 1 | 813 | Scorbunny | regular | fire |
| 1 | 816 | Sobble | regular | water |
| 1 | 819 | Skwovet | regular | normal |
| 1 | 821 | Rookidee | regular | flying |
| 1 | 824 | Blipbug | regular | bug |
| 1 | 827 | Nickit | regular | dark |
| 1 | 829 | Gossifleur | regular | grass |
| 1 | 831 | Wooloo | regular | normal |
| 1 | 833 | Chewtle | regular | water |
| 1 | 835 | Yamper | regular | electric |
| 1 | 837 | Rolycoly | regular | rock |
| 1 | 840 | Applin | regular | grass, dragon |
| 1 | 843 | Silicobra | regular | ground |
| 1 | 845 | Cramorant | regular | flying, water |
| 1 | 846 | Arrokuda | regular | water |
| 1 | 848 | Toxel | regular | electric, poison |
| 1 | 850 | Sizzlipede | regular | fire, bug |
| 1 | 852 | Clobbopus | regular | fighting |
| 1 | 854 | Sinistea | regular | ghost |
| 1 | 856 | Hatenna | regular | psychic |
| 1 | 859 | Impidimp | regular | dark, fairy |
| 1 | 868 | Milcery | regular | fairy |
| 1 | 870 | Falinks | regular | fighting |
| 1 | 871 | Pincurchin | regular | electric |
| 1 | 872 | Snom | regular | ice, bug |
| 1 | 874 | Stonjourner | regular | rock |
| 1 | 875 | Eiscue-Ice | regular | ice |
| 1 | 876 | Indeedee-Male | regular | psychic, normal |
| 1 | 878 | Cufant | regular | steel |
| 1 | 880 | Dracozolt | regular | electric, dragon |
| 1 | 881 | Arctozolt | regular | electric, ice |
| 1 | 882 | Dracovish | regular | water, dragon |
| 1 | 883 | Arctovish | regular | water, ice |
| 1 | 884 | Duraludon | regular | steel, dragon |
| 1 | 885 | Dreepy | regular | dragon, ghost |
| 1 | 888 | Zacian | regular | fairy |
| 1 | 889 | Zamazenta | regular | fighting |
| 1 | 890 | Eternatus | regular | poison, dragon |
| 1 | 891 | Kubfu | regular | fighting |
| 1 | 893 | Zarude | regular | dark, grass |
| 1 | 894 | Regieleki | regular | electric |
| 1 | 895 | Regidrago | regular | dragon |
| 1 | 896 | Glastrier | regular | ice |
| 1 | 897 | Spectrier | regular | ghost |
| 1 | 898 | Calyrex | regular | psychic, grass |
| 1 | 905 | Enamorus-Incarnate | regular | fairy, flying |
| 3 | 845 | Cramorant-Gulping | gulping | flying, water |
| 3 | 845 | Cramorant-Gorging | gorging | flying, water |
| 3 | 875 | Eiscue-Noice | noice | ice |
| 3 | 876 | Indeedee-Female | female | psychic, normal |
| 3 | 877 | Morpeko-Hangry | hangry | electric, dark |
| 3 | 888 | Zacian-Crowned | crowned | fairy, steel |
| 3 | 889 | Zamazenta-Crowned | crowned | fighting, steel |
| 3 | 890 | Eternatus-Eternamax | eternamax | poison, dragon |
| 3 | 893 | Zarude-Dada | dada | dark, grass |
| 3 | 898 | Calyrex-Ice | ice | psychic, ice |
| 3 | 898 | Calyrex-Shadow | shadow | psychic, ghost |
| 3 | 905 | Enamorus-Therian | therian | fairy, flying |
| 4 | 870 | Falinks-Mega | mega | fighting |
| 5 | 877 | Morpeko-Full-Belly | full-belly | electric, dark |
| 5 | 884 | Duraludon-Gmax | gmax | steel, dragon |

#### Evolution stage 2 — 44 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 811 | Thwackey | regular | grass |
| 6 | 814 | Raboot | regular | fire |
| 6 | 817 | Drizzile | regular | water |
| 6 | 820 | Greedent | regular | normal |
| 6 | 822 | Corvisquire | regular | flying |
| 6 | 825 | Dottler | regular | bug, psychic |
| 6 | 828 | Thievul | regular | dark |
| 6 | 830 | Eldegoss | regular | grass |
| 6 | 832 | Dubwool | regular | normal |
| 6 | 834 | Drednaw | regular | water, rock |
| 6 | 836 | Boltund | regular | electric |
| 6 | 838 | Carkol | regular | rock, fire |
| 6 | 841 | Flapple | regular | grass, dragon |
| 6 | 844 | Sandaconda | regular | ground |
| 6 | 847 | Barraskewda | regular | water |
| 6 | 849 | Toxtricity-Amped | regular | electric, poison |
| 6 | 851 | Centiskorch | regular | fire, bug |
| 6 | 853 | Grapploct | regular | fighting |
| 6 | 855 | Polteageist | regular | ghost |
| 6 | 857 | Hattrem | regular | psychic |
| 6 | 860 | Morgrem | regular | dark, fairy |
| 6 | 864 | Cursola | regular | ghost |
| 6 | 865 | Sirfetchd | regular | fighting |
| 6 | 869 | Alcremie | regular | fairy |
| 6 | 873 | Frosmoth | regular | ice, bug |
| 6 | 879 | Copperajah | regular | steel |
| 6 | 886 | Drakloak | regular | dragon, ghost |
| 6 | 899 | Wyrdeer | regular | normal, psychic |
| 6 | 902 | Basculegion-Male | regular | water, ghost |
| 6 | 904 | Overqwil | regular | dark, poison |
| 8 | 849 | Toxtricity-Low-Key | low-key | electric, poison |
| 8 | 892 | Urshifu-Rapid-Strike | rapid-strike | fighting, water |
| 8 | 902 | Basculegion-Female | female | water, ghost |
| 10 | 834 | Drednaw-Gmax | gmax | water, rock |
| 10 | 841 | Flapple-Gmax | gmax | grass, dragon |
| 10 | 844 | Sandaconda-Gmax | gmax | ground |
| 10 | 849 | Toxtricity-Amped-Gmax | amped-gmax | electric, poison |
| 10 | 849 | Toxtricity-Low-Key-Gmax | low-key-gmax | electric, poison |
| 10 | 851 | Centiskorch-Gmax | gmax | fire, bug |
| 10 | 869 | Alcremie-Gmax | gmax | fairy |
| 10 | 879 | Copperajah-Gmax | gmax | steel |
| 10 | 892 | Urshifu-Single-Strike | single-strike | fighting, dark |
| 10 | 892 | Urshifu-Single-Strike-Gmax | single-strike-gmax | fighting, dark |
| 10 | 892 | Urshifu-Rapid-Strike-Gmax | rapid-strike-gmax | fighting, water |

#### Evolution stage 3 — 27 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 812 | Rillaboom | regular | grass |
| 11 | 815 | Cinderace | regular | fire |
| 11 | 818 | Inteleon | regular | water |
| 11 | 823 | Corviknight | regular | flying, steel |
| 11 | 826 | Orbeetle | regular | bug, psychic |
| 11 | 839 | Coalossal | regular | rock, fire |
| 11 | 842 | Appletun | regular | grass, dragon |
| 11 | 858 | Hatterene | regular | psychic, fairy |
| 11 | 861 | Grimmsnarl | regular | dark, fairy |
| 11 | 862 | Obstagoon | regular | dark, normal |
| 11 | 863 | Perrserker | regular | steel |
| 11 | 866 | Mr-Rime | regular | ice, psychic |
| 11 | 867 | Runerigus | regular | ground, ghost |
| 11 | 887 | Dragapult | regular | dragon, ghost |
| 11 | 900 | Kleavor | regular | bug, rock |
| 11 | 901 | Ursaluna | regular | ground, normal |
| 11 | 903 | Sneasler | regular | fighting, poison |
| 13 | 901 | Ursaluna-Bloodmoon | bloodmoon | ground, normal |
| 15 | 812 | Rillaboom-Gmax | gmax | grass |
| 15 | 815 | Cinderace-Gmax | gmax | fire |
| 15 | 818 | Inteleon-Gmax | gmax | water |
| 15 | 823 | Corviknight-Gmax | gmax | flying, steel |
| 15 | 826 | Orbeetle-Gmax | gmax | bug, psychic |
| 15 | 839 | Coalossal-Gmax | gmax | rock, fire |
| 15 | 842 | Appletun-Gmax | gmax | grass, dragon |
| 15 | 858 | Hatterene-Gmax | gmax | psychic, fairy |
| 15 | 861 | Grimmsnarl-Gmax | gmax | dark, fairy |

---

## Paldea (dex 906–1025, 120 species)

**In-game path:** none (data catalog only)

### Summary

- Spawn levels present: 1, 3, 4, 5, 6, 8, 9, 10, 11, 14, 16, 21
- Evolution stages present: 1, 2, 3, 4, 5
- Total catalog entries: 149

### By spawn level

#### Spawn level 1 (stage 1, form tier regular) — 71 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 906 | Sprigatito | 1 | regular (regular) | grass | ground, plant |
| 2 | 909 | Fuecoco | 1 | regular (regular) | fire | ground |
| 3 | 912 | Quaxly | 1 | regular (regular) | water | flying, water1 |
| 4 | 915 | Lechonk | 1 | regular (regular) | normal | ground |
| 5 | 917 | Tarountula | 1 | regular (regular) | bug | bug |
| 6 | 919 | Nymble | 1 | regular (regular) | bug | bug |
| 7 | 921 | Pawmi | 1 | regular (regular) | electric | ground |
| 8 | 924 | Tandemaus | 1 | regular (regular) | normal | ground, fairy |
| 9 | 926 | Fidough | 1 | regular (regular) | fairy | ground, mineral |
| 10 | 928 | Smoliv | 1 | regular (regular) | grass, normal | plant |
| 11 | 932 | Nacli | 1 | regular (regular) | rock | mineral |
| 12 | 935 | Charcadet | 1 | regular (regular) | fire | humanshape |
| 13 | 938 | Tadbulb | 1 | regular (regular) | electric | water1 |
| 14 | 940 | Wattrel | 1 | regular (regular) | electric, flying | water1, flying |
| 15 | 942 | Maschiff | 1 | regular (regular) | dark | ground |
| 16 | 944 | Shroodle | 1 | regular (regular) | poison, normal | ground |
| 17 | 946 | Bramblin | 1 | regular (regular) | grass, ghost | plant |
| 18 | 948 | Toedscool | 1 | regular (regular) | ground, grass | plant |
| 19 | 950 | Klawf | 1 | regular (regular) | rock | water3 |
| 20 | 951 | Capsakid | 1 | regular (regular) | grass | plant |
| 21 | 953 | Rellor | 1 | regular (regular) | bug | bug |
| 22 | 955 | Flittle | 1 | regular (regular) | psychic | flying |
| 23 | 957 | Tinkatink | 1 | regular (regular) | fairy, steel | fairy |
| 24 | 960 | Wiglett | 1 | regular (regular) | water | water3 |
| 25 | 962 | Bombirdier | 1 | regular (regular) | flying, dark | flying |
| 26 | 963 | Finizen | 1 | regular (regular) | water | ground, water2 |
| 27 | 965 | Varoom | 1 | regular (regular) | steel, poison | mineral |
| 28 | 967 | Cyclizar | 1 | regular (regular) | dragon, normal | ground |
| 29 | 968 | Orthworm | 1 | regular (regular) | steel | ground |
| 30 | 969 | Glimmet | 1 | regular (regular) | rock, poison | mineral |
| 31 | 971 | Greavard | 1 | regular (regular) | ghost | ground |
| 32 | 973 | Flamigo | 1 | regular (regular) | flying, fighting | flying |
| 33 | 974 | Cetoddle | 1 | regular (regular) | ice | ground |
| 34 | 976 | Veluza | 1 | regular (regular) | water, psychic | water2 |
| 35 | 977 | Dondozo | 1 | regular (regular) | water | water2 |
| 36 | 978 | Tatsugiri-Curly | 1 | regular (regular) | dragon, water | water2 |
| 37 | 984 | Great-Tusk | 1 | regular (regular) | ground, fighting | no-eggs |
| 38 | 985 | Scream-Tail | 1 | regular (regular) | fairy, psychic | no-eggs |
| 39 | 986 | Brute-Bonnet | 1 | regular (regular) | grass, dark | no-eggs |
| 40 | 987 | Flutter-Mane | 1 | regular (regular) | ghost, fairy | no-eggs |
| 41 | 988 | Slither-Wing | 1 | regular (regular) | bug, fighting | no-eggs |
| 42 | 989 | Sandy-Shocks | 1 | regular (regular) | electric, ground | no-eggs |
| 43 | 990 | Iron-Treads | 1 | regular (regular) | ground, steel | no-eggs |
| 44 | 991 | Iron-Bundle | 1 | regular (regular) | ice, water | no-eggs |
| 45 | 992 | Iron-Hands | 1 | regular (regular) | fighting, electric | no-eggs |
| 46 | 993 | Iron-Jugulis | 1 | regular (regular) | dark, flying | no-eggs |
| 47 | 994 | Iron-Moth | 1 | regular (regular) | fire, poison | no-eggs |
| 48 | 995 | Iron-Thorns | 1 | regular (regular) | rock, electric | no-eggs |
| 49 | 996 | Frigibax | 1 | regular (regular) | dragon, ice | dragon, mineral |
| 50 | 999 | Gimmighoul | 1 | regular (regular) | ghost | no-eggs |
| 51 | 1001 | Wo-Chien | 1 | regular (regular) | dark, grass | no-eggs |
| 52 | 1002 | Chien-Pao | 1 | regular (regular) | dark, ice | no-eggs |
| 53 | 1003 | Ting-Lu | 1 | regular (regular) | dark, ground | no-eggs |
| 54 | 1004 | Chi-Yu | 1 | regular (regular) | dark, fire | no-eggs |
| 55 | 1005 | Roaring-Moon | 1 | regular (regular) | dragon, dark | no-eggs |
| 56 | 1006 | Iron-Valiant | 1 | regular (regular) | fairy, fighting | no-eggs |
| 57 | 1007 | Koraidon | 1 | regular (regular) | fighting, dragon | no-eggs |
| 58 | 1008 | Miraidon | 1 | regular (regular) | electric, dragon | no-eggs |
| 59 | 1009 | Walking-Wake | 1 | regular (regular) | water, dragon | no-eggs |
| 60 | 1010 | Iron-Leaves | 1 | regular (regular) | grass, psychic | no-eggs |
| 61 | 1012 | Poltchageist | 1 | regular (regular) | grass, ghost | mineral, indeterminate |
| 62 | 1014 | Okidogi | 1 | regular (regular) | poison, fighting | no-eggs |
| 63 | 1015 | Munkidori | 1 | regular (regular) | poison, psychic | no-eggs |
| 64 | 1016 | Fezandipiti | 1 | regular (regular) | poison, fairy | no-eggs |
| 65 | 1017 | Ogerpon | 1 | regular (regular) | grass | no-eggs |
| 66 | 1020 | Gouging-Fire | 1 | regular (regular) | fire, dragon | no-eggs |
| 67 | 1021 | Raging-Bolt | 1 | regular (regular) | electric, dragon | no-eggs |
| 68 | 1022 | Iron-Boulder | 1 | regular (regular) | rock, psychic | no-eggs |
| 69 | 1023 | Iron-Crown | 1 | regular (regular) | steel, psychic | no-eggs |
| 70 | 1024 | Terapagos | 1 | regular (regular) | normal | no-eggs |
| 71 | 1025 | Pecharunt | 1 | regular (regular) | poison, ghost | no-eggs |

#### Spawn level 3 (stage 1, form tier regional/alternate) — 19 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 931 | Squawkabilly-Blue-Plumage | 1 | blue-plumage (regional/alternate) | normal, flying | flying |
| 2 | 931 | Squawkabilly-Yellow-Plumage | 1 | yellow-plumage (regional/alternate) | normal, flying | flying |
| 3 | 931 | Squawkabilly-White-Plumage | 1 | white-plumage (regional/alternate) | normal, flying | flying |
| 4 | 978 | Tatsugiri-Droopy | 1 | droopy (regional/alternate) | dragon, water | water2 |
| 5 | 978 | Tatsugiri-Stretchy | 1 | stretchy (regional/alternate) | dragon, water | water2 |
| 6 | 999 | Gimmighoul-Roaming | 1 | roaming (regional/alternate) | ghost | no-eggs |
| 7 | 1007 | Koraidon-Limited-Build | 1 | limited-build (regional/alternate) | fighting, dragon | no-eggs |
| 8 | 1007 | Koraidon-Sprinting-Build | 1 | sprinting-build (regional/alternate) | fighting, dragon | no-eggs |
| 9 | 1007 | Koraidon-Swimming-Build | 1 | swimming-build (regional/alternate) | fighting, dragon | no-eggs |
| 10 | 1007 | Koraidon-Gliding-Build | 1 | gliding-build (regional/alternate) | fighting, dragon | no-eggs |
| 11 | 1008 | Miraidon-Low-Power-Mode | 1 | low-power-mode (regional/alternate) | electric, dragon | no-eggs |
| 12 | 1008 | Miraidon-Drive-Mode | 1 | drive-mode (regional/alternate) | electric, dragon | no-eggs |
| 13 | 1008 | Miraidon-Aquatic-Mode | 1 | aquatic-mode (regional/alternate) | electric, dragon | no-eggs |
| 14 | 1008 | Miraidon-Glide-Mode | 1 | glide-mode (regional/alternate) | electric, dragon | no-eggs |
| 15 | 1017 | Ogerpon-Wellspring-Mask | 1 | wellspring-mask (regional/alternate) | grass, water | no-eggs |
| 16 | 1017 | Ogerpon-Hearthflame-Mask | 1 | hearthflame-mask (regional/alternate) | grass, fire | no-eggs |
| 17 | 1017 | Ogerpon-Cornerstone-Mask | 1 | cornerstone-mask (regional/alternate) | grass, rock | no-eggs |
| 18 | 1024 | Terapagos-Terastal | 1 | terastal (regional/alternate) | normal | no-eggs |
| 19 | 1024 | Terapagos-Stellar | 1 | stellar (regional/alternate) | normal | no-eggs |

#### Spawn level 4 (stage 1, form tier mega) — 3 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 978 | Tatsugiri-Curly-Mega | 1 | curly-mega (mega) | dragon, water | water2 |
| 2 | 978 | Tatsugiri-Droopy-Mega | 1 | droopy-mega (mega) | dragon, water | water2 |
| 3 | 978 | Tatsugiri-Stretchy-Mega | 1 | stretchy-mega (mega) | dragon, water | water2 |

#### Spawn level 5 (stage 1, form tier gmax/multiform) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 931 | Squawkabilly-Green-Plumage | 1 | green-plumage (gmax/multiform) | normal, flying | flying |

#### Spawn level 6 (stage 2, form tier regular) — 32 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 907 | Floragato | 2 | regular (regular) | grass | ground, plant |
| 2 | 910 | Crocalor | 2 | regular (regular) | fire | ground |
| 3 | 913 | Quaxwell | 2 | regular (regular) | water | flying, water1 |
| 4 | 916 | Oinkologne-Male | 2 | regular (regular) | normal | ground |
| 5 | 918 | Spidops | 2 | regular (regular) | bug | bug |
| 6 | 920 | Lokix | 2 | regular (regular) | bug, dark | bug |
| 7 | 922 | Pawmo | 2 | regular (regular) | electric, fighting | ground |
| 8 | 927 | Dachsbun | 2 | regular (regular) | fairy | ground, mineral |
| 9 | 929 | Dolliv | 2 | regular (regular) | grass, normal | plant |
| 10 | 933 | Naclstack | 2 | regular (regular) | rock | mineral |
| 11 | 936 | Armarouge | 2 | regular (regular) | fire, psychic | humanshape |
| 12 | 939 | Bellibolt | 2 | regular (regular) | electric | water1 |
| 13 | 941 | Kilowattrel | 2 | regular (regular) | electric, flying | water1, flying |
| 14 | 943 | Mabosstiff | 2 | regular (regular) | dark | ground |
| 15 | 945 | Grafaiai | 2 | regular (regular) | poison, normal | ground |
| 16 | 947 | Brambleghast | 2 | regular (regular) | grass, ghost | plant |
| 17 | 949 | Toedscruel | 2 | regular (regular) | ground, grass | plant |
| 18 | 952 | Scovillain | 2 | regular (regular) | grass, fire | plant |
| 19 | 954 | Rabsca | 2 | regular (regular) | bug, psychic | bug |
| 20 | 956 | Espathra | 2 | regular (regular) | psychic | flying |
| 21 | 958 | Tinkatuff | 2 | regular (regular) | fairy, steel | fairy |
| 22 | 961 | Wugtrio | 2 | regular (regular) | water | water3 |
| 23 | 964 | Palafin-Zero | 2 | regular (regular) | water | ground, water2 |
| 24 | 966 | Revavroom | 2 | regular (regular) | steel, poison | mineral |
| 25 | 970 | Glimmora | 2 | regular (regular) | rock, poison | mineral |
| 26 | 972 | Houndstone | 2 | regular (regular) | ghost | ground |
| 27 | 975 | Cetitan | 2 | regular (regular) | ice | ground |
| 28 | 981 | Farigiraf | 2 | regular (regular) | normal, psychic | ground |
| 29 | 997 | Arctibax | 2 | regular (regular) | dragon, ice | dragon, mineral |
| 30 | 1000 | Gholdengo | 2 | regular (regular) | steel, ghost | no-eggs |
| 31 | 1013 | Sinistcha | 2 | regular (regular) | grass, ghost | mineral, indeterminate |
| 32 | 1018 | Archaludon | 2 | regular (regular) | steel, dragon | mineral, dragon |

#### Spawn level 8 (stage 2, form tier regional/alternate) — 4 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 916 | Oinkologne-Female | 2 | female (regional/alternate) | normal | ground |
| 2 | 925 | Maushold-Family-Of-Three | 2 | family-of-three (regional/alternate) | normal | ground, fairy |
| 3 | 964 | Palafin-Hero | 2 | hero (regional/alternate) | water | ground, water2 |
| 4 | 982 | Dudunsparce-Three-Segment | 2 | three-segment (regional/alternate) | normal | ground |

#### Spawn level 9 (stage 2, form tier mega) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 952 | Scovillain-Mega | 2 | mega (mega) | grass, fire | plant |
| 2 | 970 | Glimmora-Mega | 2 | mega (mega) | rock, poison | mineral |

#### Spawn level 10 (stage 2, form tier gmax/multiform) — 2 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 925 | Maushold-Family-Of-Four | 2 | family-of-four (gmax/multiform) | normal | ground, fairy |
| 2 | 982 | Dudunsparce-Two-Segment | 2 | two-segment (gmax/multiform) | normal | ground |

#### Spawn level 11 (stage 3, form tier regular) — 12 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 908 | Meowscarada | 3 | regular (regular) | grass, dark | ground, plant |
| 2 | 911 | Skeledirge | 3 | regular (regular) | fire, ghost | ground |
| 3 | 914 | Quaquaval | 3 | regular (regular) | water, fighting | flying, water1 |
| 4 | 923 | Pawmot | 3 | regular (regular) | electric, fighting | ground |
| 5 | 930 | Arboliva | 3 | regular (regular) | grass, normal | plant |
| 6 | 934 | Garganacl | 3 | regular (regular) | rock | mineral |
| 7 | 937 | Ceruledge | 3 | regular (regular) | fire, ghost | humanshape |
| 8 | 959 | Tinkaton | 3 | regular (regular) | fairy, steel | fairy |
| 9 | 979 | Annihilape | 3 | regular (regular) | fighting, ghost | ground |
| 10 | 980 | Clodsire | 3 | regular (regular) | poison, ground | water1, ground |
| 11 | 983 | Kingambit | 3 | regular (regular) | dark, steel | humanshape |
| 12 | 998 | Baxcalibur | 3 | regular (regular) | dragon, ice | dragon, mineral |

#### Spawn level 14 (stage 3, form tier mega) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 998 | Baxcalibur-Mega | 3 | mega (mega) | dragon, ice | dragon, mineral |

#### Spawn level 16 (stage 4, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 1011 | Dipplin | 4 | regular (regular) | grass, dragon | plant, dragon |

#### Spawn level 21 (stage 5, form tier regular) — 1 entries

| # | Dex | Name | Stage | Form | Types | Egg groups |
|---|-----|------|-------|------|-------|------------|
| 1 | 1019 | Hydrapple | 5 | regular (regular) | grass, dragon | plant, dragon |

### By evolution stage

#### Evolution stage 1 — 94 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 1 | 906 | Sprigatito | regular | grass |
| 1 | 909 | Fuecoco | regular | fire |
| 1 | 912 | Quaxly | regular | water |
| 1 | 915 | Lechonk | regular | normal |
| 1 | 917 | Tarountula | regular | bug |
| 1 | 919 | Nymble | regular | bug |
| 1 | 921 | Pawmi | regular | electric |
| 1 | 924 | Tandemaus | regular | normal |
| 1 | 926 | Fidough | regular | fairy |
| 1 | 928 | Smoliv | regular | grass, normal |
| 1 | 932 | Nacli | regular | rock |
| 1 | 935 | Charcadet | regular | fire |
| 1 | 938 | Tadbulb | regular | electric |
| 1 | 940 | Wattrel | regular | electric, flying |
| 1 | 942 | Maschiff | regular | dark |
| 1 | 944 | Shroodle | regular | poison, normal |
| 1 | 946 | Bramblin | regular | grass, ghost |
| 1 | 948 | Toedscool | regular | ground, grass |
| 1 | 950 | Klawf | regular | rock |
| 1 | 951 | Capsakid | regular | grass |
| 1 | 953 | Rellor | regular | bug |
| 1 | 955 | Flittle | regular | psychic |
| 1 | 957 | Tinkatink | regular | fairy, steel |
| 1 | 960 | Wiglett | regular | water |
| 1 | 962 | Bombirdier | regular | flying, dark |
| 1 | 963 | Finizen | regular | water |
| 1 | 965 | Varoom | regular | steel, poison |
| 1 | 967 | Cyclizar | regular | dragon, normal |
| 1 | 968 | Orthworm | regular | steel |
| 1 | 969 | Glimmet | regular | rock, poison |
| 1 | 971 | Greavard | regular | ghost |
| 1 | 973 | Flamigo | regular | flying, fighting |
| 1 | 974 | Cetoddle | regular | ice |
| 1 | 976 | Veluza | regular | water, psychic |
| 1 | 977 | Dondozo | regular | water |
| 1 | 978 | Tatsugiri-Curly | regular | dragon, water |
| 1 | 984 | Great-Tusk | regular | ground, fighting |
| 1 | 985 | Scream-Tail | regular | fairy, psychic |
| 1 | 986 | Brute-Bonnet | regular | grass, dark |
| 1 | 987 | Flutter-Mane | regular | ghost, fairy |
| 1 | 988 | Slither-Wing | regular | bug, fighting |
| 1 | 989 | Sandy-Shocks | regular | electric, ground |
| 1 | 990 | Iron-Treads | regular | ground, steel |
| 1 | 991 | Iron-Bundle | regular | ice, water |
| 1 | 992 | Iron-Hands | regular | fighting, electric |
| 1 | 993 | Iron-Jugulis | regular | dark, flying |
| 1 | 994 | Iron-Moth | regular | fire, poison |
| 1 | 995 | Iron-Thorns | regular | rock, electric |
| 1 | 996 | Frigibax | regular | dragon, ice |
| 1 | 999 | Gimmighoul | regular | ghost |
| 1 | 1001 | Wo-Chien | regular | dark, grass |
| 1 | 1002 | Chien-Pao | regular | dark, ice |
| 1 | 1003 | Ting-Lu | regular | dark, ground |
| 1 | 1004 | Chi-Yu | regular | dark, fire |
| 1 | 1005 | Roaring-Moon | regular | dragon, dark |
| 1 | 1006 | Iron-Valiant | regular | fairy, fighting |
| 1 | 1007 | Koraidon | regular | fighting, dragon |
| 1 | 1008 | Miraidon | regular | electric, dragon |
| 1 | 1009 | Walking-Wake | regular | water, dragon |
| 1 | 1010 | Iron-Leaves | regular | grass, psychic |
| 1 | 1012 | Poltchageist | regular | grass, ghost |
| 1 | 1014 | Okidogi | regular | poison, fighting |
| 1 | 1015 | Munkidori | regular | poison, psychic |
| 1 | 1016 | Fezandipiti | regular | poison, fairy |
| 1 | 1017 | Ogerpon | regular | grass |
| 1 | 1020 | Gouging-Fire | regular | fire, dragon |
| 1 | 1021 | Raging-Bolt | regular | electric, dragon |
| 1 | 1022 | Iron-Boulder | regular | rock, psychic |
| 1 | 1023 | Iron-Crown | regular | steel, psychic |
| 1 | 1024 | Terapagos | regular | normal |
| 1 | 1025 | Pecharunt | regular | poison, ghost |
| 3 | 931 | Squawkabilly-Blue-Plumage | blue-plumage | normal, flying |
| 3 | 931 | Squawkabilly-Yellow-Plumage | yellow-plumage | normal, flying |
| 3 | 931 | Squawkabilly-White-Plumage | white-plumage | normal, flying |
| 3 | 978 | Tatsugiri-Droopy | droopy | dragon, water |
| 3 | 978 | Tatsugiri-Stretchy | stretchy | dragon, water |
| 3 | 999 | Gimmighoul-Roaming | roaming | ghost |
| 3 | 1007 | Koraidon-Limited-Build | limited-build | fighting, dragon |
| 3 | 1007 | Koraidon-Sprinting-Build | sprinting-build | fighting, dragon |
| 3 | 1007 | Koraidon-Swimming-Build | swimming-build | fighting, dragon |
| 3 | 1007 | Koraidon-Gliding-Build | gliding-build | fighting, dragon |
| 3 | 1008 | Miraidon-Low-Power-Mode | low-power-mode | electric, dragon |
| 3 | 1008 | Miraidon-Drive-Mode | drive-mode | electric, dragon |
| 3 | 1008 | Miraidon-Aquatic-Mode | aquatic-mode | electric, dragon |
| 3 | 1008 | Miraidon-Glide-Mode | glide-mode | electric, dragon |
| 3 | 1017 | Ogerpon-Wellspring-Mask | wellspring-mask | grass, water |
| 3 | 1017 | Ogerpon-Hearthflame-Mask | hearthflame-mask | grass, fire |
| 3 | 1017 | Ogerpon-Cornerstone-Mask | cornerstone-mask | grass, rock |
| 3 | 1024 | Terapagos-Terastal | terastal | normal |
| 3 | 1024 | Terapagos-Stellar | stellar | normal |
| 4 | 978 | Tatsugiri-Curly-Mega | curly-mega | dragon, water |
| 4 | 978 | Tatsugiri-Droopy-Mega | droopy-mega | dragon, water |
| 4 | 978 | Tatsugiri-Stretchy-Mega | stretchy-mega | dragon, water |
| 5 | 931 | Squawkabilly-Green-Plumage | green-plumage | normal, flying |

#### Evolution stage 2 — 40 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 6 | 907 | Floragato | regular | grass |
| 6 | 910 | Crocalor | regular | fire |
| 6 | 913 | Quaxwell | regular | water |
| 6 | 916 | Oinkologne-Male | regular | normal |
| 6 | 918 | Spidops | regular | bug |
| 6 | 920 | Lokix | regular | bug, dark |
| 6 | 922 | Pawmo | regular | electric, fighting |
| 6 | 927 | Dachsbun | regular | fairy |
| 6 | 929 | Dolliv | regular | grass, normal |
| 6 | 933 | Naclstack | regular | rock |
| 6 | 936 | Armarouge | regular | fire, psychic |
| 6 | 939 | Bellibolt | regular | electric |
| 6 | 941 | Kilowattrel | regular | electric, flying |
| 6 | 943 | Mabosstiff | regular | dark |
| 6 | 945 | Grafaiai | regular | poison, normal |
| 6 | 947 | Brambleghast | regular | grass, ghost |
| 6 | 949 | Toedscruel | regular | ground, grass |
| 6 | 952 | Scovillain | regular | grass, fire |
| 6 | 954 | Rabsca | regular | bug, psychic |
| 6 | 956 | Espathra | regular | psychic |
| 6 | 958 | Tinkatuff | regular | fairy, steel |
| 6 | 961 | Wugtrio | regular | water |
| 6 | 964 | Palafin-Zero | regular | water |
| 6 | 966 | Revavroom | regular | steel, poison |
| 6 | 970 | Glimmora | regular | rock, poison |
| 6 | 972 | Houndstone | regular | ghost |
| 6 | 975 | Cetitan | regular | ice |
| 6 | 981 | Farigiraf | regular | normal, psychic |
| 6 | 997 | Arctibax | regular | dragon, ice |
| 6 | 1000 | Gholdengo | regular | steel, ghost |
| 6 | 1013 | Sinistcha | regular | grass, ghost |
| 6 | 1018 | Archaludon | regular | steel, dragon |
| 8 | 916 | Oinkologne-Female | female | normal |
| 8 | 925 | Maushold-Family-Of-Three | family-of-three | normal |
| 8 | 964 | Palafin-Hero | hero | water |
| 8 | 982 | Dudunsparce-Three-Segment | three-segment | normal |
| 9 | 952 | Scovillain-Mega | mega | grass, fire |
| 9 | 970 | Glimmora-Mega | mega | rock, poison |
| 10 | 925 | Maushold-Family-Of-Four | family-of-four | normal |
| 10 | 982 | Dudunsparce-Two-Segment | two-segment | normal |

#### Evolution stage 3 — 13 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 11 | 908 | Meowscarada | regular | grass, dark |
| 11 | 911 | Skeledirge | regular | fire, ghost |
| 11 | 914 | Quaquaval | regular | water, fighting |
| 11 | 923 | Pawmot | regular | electric, fighting |
| 11 | 930 | Arboliva | regular | grass, normal |
| 11 | 934 | Garganacl | regular | rock |
| 11 | 937 | Ceruledge | regular | fire, ghost |
| 11 | 959 | Tinkaton | regular | fairy, steel |
| 11 | 979 | Annihilape | regular | fighting, ghost |
| 11 | 980 | Clodsire | regular | poison, ground |
| 11 | 983 | Kingambit | regular | dark, steel |
| 11 | 998 | Baxcalibur | regular | dragon, ice |
| 14 | 998 | Baxcalibur-Mega | mega | dragon, ice |

#### Evolution stage 4 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 16 | 1011 | Dipplin | regular | grass, dragon |

#### Evolution stage 5 — 1 entries

| Spawn Lv | Dex | Name | Form | Types |
|----------|-----|------|------|-------|
| 21 | 1019 | Hydrapple | regular | grass, dragon |
