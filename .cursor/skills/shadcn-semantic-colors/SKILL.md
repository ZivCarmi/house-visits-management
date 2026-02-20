---
name: shadcn-semantic-colors
description: Prefer component library semantic color classes (e.g. shadcn's text-muted, destructive, primary) over custom CSS when building or styling components. Use when creating components with shadcn, styling links, nav items, buttons, form feedback, or when the user asks for muted, grayed-out, destructive, or primary/secondary styling.
---

# Shadcn Semantic Colors

When the project uses a component library (e.g. shadcn) that provides CSS variable–based semantic colors, **use those generated classNames in new or updated components instead of custom CSS or raw Tailwind color utilities**.

## Rule

- **Do** use semantic utilities that map to the theme: `text-muted-foreground`, `bg-muted`, `text-destructive`, `bg-primary`, `text-primary`, `border-input`, `ring-ring`, etc.
- **Do not** use custom grays or hex/arbitrary values for semantic purposes (e.g. avoid `text-gray-500`, `bg-[#f5f5f5]`) when a semantic token exists.

## Intent → className (examples)

| Intent | Prefer | Avoid |
|--------|--------|--------|
| Muted / grayed-out text (e.g. nav link, placeholder, hint) | `text-muted-foreground` | `text-gray-500`, `text-neutral-400` |
| Muted background (subtle area) | `bg-muted` | `bg-gray-100`, custom hex |
| Error / danger / destructive text | `text-destructive` | `text-red-600`, custom red |
| Destructive background or button | `bg-destructive text-destructive-foreground` or Button `variant="destructive"` | Custom red classes |
| Primary action / link | `text-primary` or Button `variant="default"` | `text-blue-600`, custom blue |
| Secondary / subdued action | `text-secondary-foreground`, `bg-secondary`, or Button `variant="secondary"` | Custom gray/neutral |
| Borders / inputs | `border-input`, `border-border` | `border-gray-200` |
| Focus ring | `ring-ring` (via component patterns) | Custom ring color |

## Example

**User:** "Add a link in the nav that looks muted (grayed out)."

- **Correct:** `className="text-muted-foreground"` (or `text-muted-foreground hover:text-foreground` for hover).
- **Incorrect:** `className="text-gray-500"` or custom CSS like `color: #6b7280`.

## Scope

Apply to:

- New components and one-off elements (links, labels, hints, nav items, buttons, alerts).
- Styling that conveys meaning: muted, primary, secondary, destructive, borders, focus.

You may still use arbitrary values or raw Tailwind colors when the design explicitly requires a non-semantic color (e.g. brand accent not in the theme).
