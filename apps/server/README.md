# Server – Score Graph API

## Overview

This package provides the backend API for the score graph system.


## Responsibilities

- Graph construction logic
- Persistence layer
- API endpoints for graph generation and retrieval


## API Shape (simplified)

- Nodes: id, label  
- Edges: source, target, score




## Similarity Scoring – Jaccard

The server uses **Jaccard similarity** to compute overlap-based similarity scores
between sets (e.g. tags, neighbors, attributes).

### Definition

Jaccard similarity is defined as:

J(A, B) = |A ∩ B| / |A ∪ B|

- Range: **0.0 → 1.0**
- 0.0 means no overlap
- 1.0 means identical sets

### `minScore` Policy

There is **no intrinsic minimum score** defined by the Jaccard metric itself.

Accordingly, the server **does not enforce a hard `minScore` at computation time**.

Instead:

- All raw Jaccard scores are computed and stored
- Thresholding (if any) is applied at:
  - query time
  - ranking / sorting time
  - visualization or filtering layers

This avoids baking application-specific assumptions into the graph data.

### Practical Guidance (Non-binding)

Typical downstream heuristics (context-dependent):

- `> 0` : excludes pure non-overlap
- `≥ 0.2` : weak but meaningful overlap
- `≥ 0.4` : strong similarity
- `≥ 0.7` : near-duplicate sets

These values are **not enforced by the server** and are provided only as guidance
for consumers of the API.

### API Representation

Edges may expose similarity as:

```
score: number  // raw Jaccard similarity in [0,1]
```

No server-side pruning is performed based solely on score.




## Tech Stack

- Node.js
- TypeScript
- PostgreSQL
- **Turbo** -- workspace orchestration

The workspace is orchestrated with **Turbo**.




## Running

```bash
npm install
npm run turbo:dev
```



## Environment Variables

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/ns_world_lab
DATABASE_SCHEMA_NAME=knowledge_graph_1
```

### Environment Reference

A `.env.example` file is provided at repository root.
Runtime `.env` files are intentionally excluded from version control.

## Database Schema

The authoritative schema snapshot lives at:

```
apps/server/schema.sql
```

This file reflects the current **Score Graph** data model used by the API.




## Diagram

Current architecture and dependency 

- [Server dependency diagram](/_docs/server.svg)







## Key Dependencies (Server)

- **Express** — HTTP API surface
- **pg** — PostgreSQL driver
- **zod** — request / boundary validation
- **cors** — controlled cross-origin access
- **dotenv** — local configuration loading
- **@ns-sg/types** — shared contracts with the UI




## License
**MIT**
