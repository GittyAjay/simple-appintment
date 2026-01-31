# SahajDesk Design System

For local business users (doctors, coaching owners). Zero learning curve, mobile-first, trustworthy.

## Principles

- **Simple > Clever** — Fewer clicks, clear hierarchy
- **Big buttons, readable text** — Min 44px touch targets, 16px base font
- **Indian local-user friendly** — Hindi/Hinglish labels where helpful

## Colors (CSS variables in `src/index.css`)

| Token | Value | Use |
|-------|--------|-----|
| `--color-primary` | `#0d9488` (teal) | Trust, main actions, links |
| `--color-primary-hover` | `#0f766e` | Button hover |
| `--color-primary-light` | `#ccfbf1` | Badges, active nav |
| `--color-success` | `#059669` | Success toasts, success actions |
| `--color-success-light` | `#d1fae5` | Success badges |
| `--color-bg` | `#f5f5f5` | Page background |
| `--color-surface` | `#ffffff` | Cards, header |
| `--color-border` | `#e5e7eb` | Borders |
| `--color-text` | `#1f2937` | Primary text |
| `--color-text-muted` | `#6b7280` | Secondary text |
| `--color-danger` | `#dc2626` | Delete, errors |
| `--color-danger-light` | `#fee2e2` | Error backgrounds |

## Radius & shadows

- **Radius:** `--radius` 8px, `--radius-lg` 12px. Use for cards and buttons.
- **Shadows:** `shadow-sm` only. No heavy shadows.

## Spacing

- Page padding: `p-4` mobile, `p-6` desktop
- Section gap: `mb-6` between sections
- Card padding: `p-4` / `p-5`
- Consistent 4px base (Tailwind scale)

## Typography

- **Font:** System UI stack (no custom font)
- **Base size:** 16px (no smaller for body)
- **Headings:** `text-xl` / `text-2xl`, `font-bold`
- **Labels:** `text-sm`, `font-medium`

## Components (`src/components/ui/`)

- **Button** — primary, success, secondary, danger, ghost. `loading` disables and shows "Saving..."
- **Card** — surface, border, rounded-lg, optional padding
- **Modal** — overlay + panel, Escape to close
- **ConfirmModal** — title, message, Cancel + Confirm (e.g. delete)
- **Input, Select, Textarea** — label, optional error, min-height 44px
- **Skeleton, CardSkeleton, ListItemSkeleton** — loading placeholders

## Usage in Tailwind

Use arbitrary values for design tokens:

- `bg-[var(--color-primary)]`
- `text-[var(--color-text-muted)]`
- `rounded-[var(--radius)]` / `rounded-[var(--radius-lg)]`
- `border-[var(--color-border)]`
