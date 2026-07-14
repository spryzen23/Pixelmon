# Graphify Connection & Topology Report

This report presents an architectural analysis of the **Pixelmon** codebase. The graph was parsed and analyzed to uncover connections between multi-nodes, multi-edges, and multi-communities.

## 1. Multi-Node (Entity) Distribution

Nodes represent files, classes, functions, variables, or configuration parameters.

| Node Category | Node Count | Percentage |
|---|---|---|
| File Node | 597 | 17.2% |
| Symbol Node | 2864 | 82.8% |

### Breakdown by Language / Extension

| Extension | Node Count | Percentage |
|---|---|---|
| `.js` | 2964 | 85.6% |
| `.jsx` | 382 | 11.0% |
| `.json` | 106 | 3.1% |
| `.py` | 7 | 0.2% |
| `.mjs` | 1 | 0.0% |
| `no_extension` | 1 | 0.0% |

## 2. Multi-Edge (Relationship) Analysis

Edges represent relationships between nodes, including containment hierarchy, function calls, and imports.

### Edges by Relation Type

| Relation Type | Edge Count | Percentage | Description |
|---|---|---|---|
| `contains` | 2339 | 34.0% | Structural containment (e.g. file contains function/class) |
| `calls` | 1751 | 25.5% | Functional invocation (e.g. function A calls function B) |
| `method` | 1012 | 14.7% | Semantic relationship or reference |
| `imports` | 707 | 10.3% | Dependency declaration (e.g. file A imports file B) |
| `imports_from` | 568 | 8.3% | Semantic relationship or reference |
| `integrated_with` | 292 | 4.2% | Semantic relationship or reference |
| `indirect_call` | 73 | 1.1% | Semantic relationship or reference |
| `re_exports` | 56 | 0.8% | Semantic relationship or reference |
| `references` | 44 | 0.6% | General reference or usage of a symbol |
| `launches` | 15 | 0.2% | Semantic relationship or reference |
| `rationale_for` | 9 | 0.1% | Semantic relationship or reference |
| `configures` | 9 | 0.1% | Semantic relationship or reference |

### Edges by Extraction Confidence

| Confidence | Edge Count | Description |
|---|---|---|
| `EXTRACTED` | 5921 | Edges parsed with extracted certainty |
| `INFERRED` | 954 | Edges parsed with inferred certainty |

## 3. Multi-Community Topology (Leiden Clustering)

Communities represent clustered modules/domains within the codebase detected using the Leiden algorithm.

- **Total Discovered Communities:** 1
- **Intra-Community Edges (Internal logic):** 6875 (100.0%)
- **Cross-Community Edges (Bridges/Integrations):** 0 (0.0%)

### Top 15 Largest Communities

| Community ID | Node Count | Primary Context (Files) |
|---|---|---|
| Community 0 | 3461 | `v2/biome/src/world/index.js` (136), `src/server/showdown/sim/battle.js` (110), `src/server/showdown/sim/pokemon.js` (101) |

### Top 15 Bridge Nodes (High Cross-Community Centrality)

These symbols have the highest count of edges connecting different communities, representing critical codebase coupling points.

| Node Label | Node ID | Source File | Cross-Comm Degree | Community |
|---|---|---|---|---|

### Top Cross-Community Connections

| Community A | Community B | Bridge Edge Count | Key Connecting Files |
|---|---|---|---|
