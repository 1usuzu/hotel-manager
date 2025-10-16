# Copilot Instructions for this repo

## Project scope
- Monorepo with 3 workspaces: backend (Node/Express), frontend (Next.js + React + Tailwind), ai (RAG gateway).
- DB: PostgreSQL on Supabase. Use env via `.env` (never hardcode secrets).

## Coding standards (apply to all code suggestions)
- Language: JavaScript (ESM, `"type": "module"`). Use async/await, no callbacks.
- Style: Prettier default (2 spaces, semicolons, LF). Keep imports sorted; prefer named exports.
- Structure:
  - **backend**: `src/modules/<domain>/` (controllers, services, repos), `src/routes/`, `src/config/`.
  - **frontend**: Next.js App Router. Components in `src/components/`, hooks in `src/hooks/`.
  - **ai**: `src/rag/` (retriever, ranker), `src/config/`, `src/adapters/` (LLM, embeddings).
- Patterns:
  - Controllers: thin → call service. Services: business logic. Repos: DB only (`pg`).
  - Error handling: return `{ ok: false, error: { code, message } }` or throw typed errors then map to HTTP.
  - API responses: `{ ok: true, data }`. Never leak stack traces to clients.
- Security:
  - Always read secrets from env; never commit keys.
  - Input validation at boundary (route level) before calling services.
- Testing hint (for suggestions): generate unit tests using jest style, but do NOT scaffold here unless asked.

## What to avoid
- Do not change line endings (use LF). Do not introduce CommonJS in ESM packages.
- No “magic numbers/strings”; extract constants to `packages/shared` when reused across apps.
- Do not generate code that queries Supabase with raw secrets on the client; only via server.

## Examples the model should imitate
- Express route:
  ```js
  // /src/routes/rooms.js
  import { Router } from 'express';
  import { listRooms } from '../modules/rooms/controller.js';
  const router = Router();
  router.get('/rooms', listRooms);
  export default router;
