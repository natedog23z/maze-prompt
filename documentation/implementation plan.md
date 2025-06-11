Here is the content converted to Markdown format.

# 1 – Detailed Blueprint (“what we're building & why")

| Layer | Key Deliverables | Rationale |
| :--- | :--- | :--- |
| **Workspace** | `Turborepo` root, `PNPM`, shared `ESLint`/`Prettier`, GitHub Actions CI | Consistent builds & formatting |
| **Shared Models** | `packages/models` – `Pydantic v2` + `Zod` mirror, strict JSON schemas | Single source of truth across FE & BE |
| **Agent Core** | `packages/agents` – base `MazeAgent`, retry logic, OpenAI wrapper | Eliminates per-agent boilerplate |
| **Backend API** | `FastAPI` service with `/generate`, `/regenerate`, `/explore` | Stateless + JWT guard; orchestrates agents |
| **Database** | Supabase Postgres: `users`, `saved_prompts`, `token_history`, `taxonomies` | Persistence & RLS security |
| **Frontend** | `Next 14` (App Router). Pages: Dashboard, History; components: `CreativeDirectionForm`, `PromptCard` | UX for prompt creation & iteration |
| **Observability**| `Logtail` structured logs, `Sentry` exceptions, CI snapshot tests | Catch drift & regressions early |
| **Docs** | `Mintlify` auto-publishes from `/docs` | Self-service onboarding |

# 2 – Iterative Chunks (round 1 sizing)

| Chunk | Goal | Rough Effort | Status |
| :--- | :--- | :--- | :--- |
| 0. Bootstrap | Workspace, lint, test runners, CI | ½ day | ✅ Completed |
| 1. Models | Shared `Pydantic` + `Zod` models, unit tests | 1 day | ✅ Completed |
| 2. Agent Skeleton | Base agent class + three stub agents | 1 day | ✅ Completed |
| 3. Pipeline API | `FastAPI` `/generate` wiring stub agents | 1 day | ✅ Completed |
| 4. Frontend v0 | `CreativeDirectionForm` + `fetch /generate` | 1 day | 🔜 Next Up |
| 5. Token Chips | `PromptCard` chips + `regen`/`explore` calls | 1 day | ⬜ Pending |
| 6. Persistence | Supabase tables, save & history endpoints | 1 day | ⬜ Pending |
| 7. History UI | History drawer pulling saved prompts | ½ day | ⬜ Pending |
| 8. Polish & A11y | `aXe` checks, mobile tweaks, logging | ½ day | ⬜ Pending |

These chunks are small enough for single-pull-request scopes yet large enough to deliver end-to-end value.

# 3 – Atomic Steps (round 2 sizing)

Below each chunk is decomposed into steps that take 30–90 min each and include their own tests.

<details>
<summary>🗂 Click to expand the full step table</summary>

### Chunk 0 – Bootstrap
| Step | Outcome |
| :--- | :--- |
| 0.1 | Initialise `Turborepo` with `apps/` & `packages/` folders |
| 0.2 | Add `PNPM` workspaces & root `tsconfig.json`, Python `pyproject.toml` |
| 0.3 | Configure `Prettier` + `ESLint` (TS) & `Ruff` (Python) |
| 0.4 | Add GitHub Actions CI: `lint` + `pytest` + `pnpm test` |
| 0.5 | Green-status badge in `README` |

### Chunk 1 – Models
| Step | Outcome |
| :--- | :--- |
| 1.1 | Create `packages/models/maze.py` Pydantic v2 prompt schema |
| 1.2 | Mirror `Zod` schema in `packages/models/maze.ts` |
| 1.3 | `Pytest` validating sample JSON round-trip |
| 1.4 | `Vitest` validating same on TS side |

### Chunk 2 – Agent Skeleton
| Step | Outcome |
| :--- | :--- |
| 2.1 | Base `MazeAgent` class with abstract `run()` |
| 2.2 | Add retry & JSON validation helper |
| 2.3 | Implement `SubjectAgent` stub returning fixed JSON |
| 2.4 | `Pytest` for retry + validation paths |

### Chunk 3 – Pipeline API
| Step | Outcome |
| :--- | :--- |
| 3.1 | `FastAPI` app factory in `apps/backend/app/main.py` |
| 3.2 | Dependency for JWT auth (mock for now) |
| 3.3 | `/prompts/generate` endpoint calling `SubjectAgent` only |
| 3.4 | `FastAPI` `TestClient` verifying 200 + schema |

### Chunk 4 – Frontend v0
| Step | Outcome |
| :--- | :--- |
| 4.1 | `Next 14` app booting at `apps/web/` |
| 4.2 | Supabase `AuthProvider` wrapper (mock keys) |
| 4.3 | `CreativeDirectionForm` with subject text input |
| 4.4 | `useGeneratePrompt` React hook hitting backend |
| 4.5 | Jest + RTL test: form submit triggers fetch |

### Chunk 5 – Token Chips
| Step | Outcome |
| :--- | :--- |
| 5.1 | `PromptCard` component rendering streamed prompt |
| 5.2 | `Chip` component with hover popover |
| 5.3 | `/prompts/regenerate` fetch in `useRegenerateToken` |
| 5.4 | RTL test replacing token chip |

### Chunk 6 – Persistence
| Step | Outcome |
| :--- | :--- |
| 6.1 | Supabase SQL migrations for `saved_prompts` |
| 6.2 | Backend `/prompts/save` endpoint + tests |
| 6.3 | Frontend Save button invoking endpoint |
| 6.4 | E2E Playwright test: generate → save → assert row |

### Chunk 7 – History UI
| Step | Outcome |
| :--- | :--- |
| 7.1 | Backend `/prompts/saved` with pagination |
| 7.2 | `HistoryDrawer` component listing prompts |
| 7.3 | RTL test: drawer shows saved prompt |

### Chunk 8 – Polish & A11y
| Step | Outcome |
| :--- | :--- |
| 8.1 | `aXe` audit fixes |
| 8.2 | Mobile breakpoint styles |
| 8.3 | `Logtail` integration + `Sentry` init |

</details>

# 4 – Detailed Plan for Chunk 4 – Frontend v0

### Objective
Bring the prototype UI that lives in `documentation/frontend UI Protopyte` into a production-ready Next.js 14 application under `apps/web`, wired to the existing `/prompts/generate` API.

### High-Level Outcomes
* Creative Direction sidebar ☑️  (form & selects)
* Prompt preview card streaming response from backend
* Copy/Save buttons functional
* Jest + RTL green

### Step-by-Step Guide (copy-paste ready)

1. **Scaffold the Next.js app**

```bash
# From repo root
pnpm dlx create-next-app@latest apps/web \
  --ts --tailwind --eslint --app --import-alias "@/*"
```

2. **Register app in Turborepo** (update `turbo.json`):
```json
{
  "pipeline": { /* … */ },
  "packages": ["apps/*", "packages/*"],
  "apps": ["apps/web", "apps/backend"]
}
```

3. **Install runtime deps**
```bash
cd apps/web
pnpm add @supabase/auth-helpers-nextjs zustand class-variance-authority lucide-react @radix-ui/react-slot tailwind-merge
```

4. **Copy the prototype UI**
```bash
# still at repo root
rsync -av "documentation/frontend UI Protopyte/" "apps/web/"
```

5. **Environment variables**
```bash
cp apps/web/.env.example apps/web/.env.local
# Add:
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

6. **Wire the Generate API** – create `apps/web/lib/api.ts`:
```ts
export async function generatePrompt(payload: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

7. **Hook up the form** – inside `ControlsPanel` submit handler:
```ts
const data = await generatePrompt(formValues);
setPrompt(data);
```

8. **Add tests**
```bash
pnpm add -D jest @testing-library/react @types/jest jsdom
pnpm test
```

9. **Run dev server**
```bash
pnpm dev --filter apps/web
```

### Acceptance Criteria
- Sidebar inputs correctly update state.
- Clicking **Generate Prompt** fetches data and renders chips.
- Token count badge matches backend response.
- Unit tests & existing CI workflows pass.

---