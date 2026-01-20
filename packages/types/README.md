# Types – Score Graph Contracts (and Shared Utilities)

## Overview

This package defines the shared TypeScript contracts used across the Score Graph system.

It exists to:
- enforce structural consistency between server and web
- make data shapes explicit and stable
- prevent accidental coupling through ad-hoc objects

In addition to type-level contracts, this package currently contains a small set of **runtime utilities**.
They are kept here temporarily to avoid creating an additional package during rapid iteration.


## Responsibilities

- Definition of core graph primitives (nodes, edges, scores)
- Shared DTOs used by API and UI
- Cross-package type safety and boundary enforcement
- A small, curated set of cross-cutting utilities used by multiple packages


## Package Composition

The source tree reflects two intentional categories (with ongoing extraction work):

- **Contracts / primitives / type-level utilities**
  - `src/lib/contracts/`
  - `src/lib/primitives/`
  - `src/lib/ts/`

- **Runtime utilities (shared, cross-package)**
  - `src/lib/utils/`
    - examples include key transforms, id creation, timestamps, flattening helpers

There is also an `_extract/` area used to stage code that should be moved into dedicated packages later:
- `src/lib/_extract/`


## Design Principles

- Contracts stay **framework-agnostic** and **runtime-neutral**
- Runtime utilities remain **small**, **pure**, and **cross-cutting**
- No environment-specific logic (no Node-only or browser-only assumptions) unless explicitly isolated
- Consumers should depend on this package for **shared shape**, not shared behaviour


## Score Semantics

The `score` field is defined here as a numeric value in the range `[0, 1]`.

Interpretation rules:
- `0` represents no overlap or relation
- `1` represents maximal similarity
- No thresholding or categorisation is encoded at the contract layer

Semantic decisions (thresholds, filters, ranking policies) belong in server and web layers.


## Tech Stack

- TypeScript

The workspace is orchestrated with **Turbo**.


## Diagram

Type-level boundaries and dependencies:

- [Types dependency diagram](/_docs/types.svg)


## Key Dependencies (Types)

This package is intended to have **no external runtime dependencies**.
(Where utilities exist, they are implemented with standard language features and kept portable.)

## License
**MIT**
