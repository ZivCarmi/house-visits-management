---
name: vite-alias-imports
description: Use path-alias imports (e.g. @/) when the project's Vite or TypeScript config resolves them, instead of relative dot-slash paths. Use when adding or editing imports in JS/TS/TSX files, or when the user asks to fix or standardize import paths.
---

# Vite / Path Alias Imports

When the project config defines a path alias (e.g. `@` → `resources/js` in `vite.config.js` or `paths` in `tsconfig.json`), **use the alias for imports** instead of relative paths with `./` or `../`.

## Rule

- **Do** use the configured alias (e.g. `@/`) for any module under the alias root.
- **Do not** use long relative chains (e.g. `../../Layouts/AppLayout`, `../../../types/patient`) when an alias is available.

## How to check

- **Vite:** In `vite.config.js`, look for `resolve.alias` (e.g. `'@': path.resolve(__dirname, 'resources/js')`).
- **TypeScript:** In `tsconfig.json`, look for `compilerOptions.paths` (e.g. `"@/*": ["./resources/js/*"]`).

If an alias exists, use it for new and updated imports.

## Examples

| Prefer | Avoid |
|--------|--------|
| `import { AppLayout } from "@/Layouts/AppLayout"` | `import { AppLayout } from "../../Layouts/AppLayout"` |
| `import type { Patient } from "@/types/patient"` | `import type { Patient } from "../../types/patient"` |
| `import { Button } from "@/components/ui/button"` | `import { Button } from "../../../components/ui/button"` |
| `import { usePatientFilters } from "@/hooks/usePatientFilters"` | `import { usePatientFilters } from "../../hooks/usePatientFilters"` |

## Scope

- Applies to imports in `.js`, `.jsx`, `.ts`, `.tsx` under the alias root.
- Same-directory imports (e.g. `./PatientForm`) are fine to keep as relative when the file is next to the importer; for anything outside the current directory, prefer the alias.
- When refactoring or adding new files, use the alias so paths stay stable and readable.
