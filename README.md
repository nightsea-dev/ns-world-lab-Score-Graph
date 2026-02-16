# ns-world-lab/Score Graph System

## Overview

This repository contains a modular **Score Graph** system composed of:

- a backend API responsible for graph construction, scoring, and persistence
- a web interface dedicated to exploration and visualisation
- a shared contracts and utilities package enforcing type and boundary consistency

The project is organised as a monorepo and is intended as a **signal artifact**:
it demonstrates architectural discipline, boundary enforcement, and clarity of intent
rather than feature completeness.


## What This Repository Demonstrates

- Clear separation between **graph computation**, **visualisation**, and **contracts**
- Explicit handling of **score as signal**, not as categorical truth
- Boundary-driven design with minimal cross-package coupling
- Pragmatic evolution: temporary co-location of utilities with clear extraction paths
- An architecture that supports evolution without structural drift


## Packages

- `apps/server` — Score Graph API (construction, scoring, persistence)
- `apps/web` — Score Graph interface (visualisation, interaction)
- `packages/types` — Shared contracts and small cross-cutting utilities


## Diagrams

Authoritative architecture and dependency diagrams are maintained under `_docs/`:

- [Server](/_docs/server.svg)
- [Web](/_docs/web.svg)
- [Types](/_docs/types.svg)

These diagrams are the primary reference for understanding dependency direction
and responsibility boundaries.


## Tooling

The repository is orchestrated using **Turbo** for development and build workflows.
Each package remains independently meaningful while benefiting from shared tooling.


## Running Locally

From the repository root:

```bash
npm install  
npm run turbo:dev
```


## Environment

A `.env.example` file is provided as reference.
Runtime environment files are intentionally excluded from version control.


## License

MIT


## Notes

This repository is designed to be read as much as it is to be run.
Each package README contains the authoritative explanation of its role,
constraints, and guarantees.
