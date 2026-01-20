# Web – Score Graph Interface

## Overview

This package provides the interactive user interface for the score graph system.


## Features

- Graph-based visualization of topics
- Dynamic rendering of nodes and edges
- Interactive node selection
- Display of:
  - Related topics
  - Relationship scores

No graph mutation is performed in the UI.


## Tech Stack

- React
- TypeScript
- Graph visualization library (Force-based / D3-based)
- Native `fetch` for API communication
- Vite
- Tailwind CSS
- RSuite

The workspace is orchestrated with **Turbo**.



## Running

```bash
npm install
npm run turbo:dev
```


## Environment Variables

The UI uses Vite-style variables.

### Minimum configuration

```env
VITE_HOST=localhost
VITE_PORT=5173

VITE_GRAPH_API_HOST=localhost
VITE_GRAPH_API_PORT=3001
VITE_GRAPH_API_BASE=/api
VITE_GRAPH_API_GRAPH_ROUTER_BASE=/graph
```

### Optional UI defaults

```env
VITE_SCORE_GRAPH_DEFAULT_MinScore=.15
VITE_SCORE_GRAPH_VIEW_CONFIG_WaitSecondsBeforeShowingTheLoader=1
VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphPayload=false
VITE_SCORE_GRAPH_VIEW_CONFIG_LoadIsDisabled_GraphNodeDetails=true
```

### Environment Reference

A `.env.example` file is provided at repository root.
Runtime `.env` files are intentionally excluded from version control.


## Diagram

Current architecture and dependency

- [Web dependency diagram](/_docs/web.svg)


## Key Dependencies (Web)

- **React** — UI rendering
- **react-force-graph-2d** — score graph visualisation
- **RSuite** — UI component system
- **@ns-sg/types** — shared contracts with the API


## License
**MIT**
