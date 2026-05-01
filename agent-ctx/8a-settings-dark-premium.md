# Task 8-a: Settings Page — Premium Dark SaaS Rebuild with Theme Switcher

## Agent: Settings Page Agent
## Task: Rebuild settings page into premium dark SaaS experience with theme switcher

### Work Log:
- Read `/home/z/my-project/worklog.md` for full project context (7 prior tasks documented)
- Read current settings page (`src/app/(dashboard)/dashboard/settings/page.tsx`) — 1035 lines, light theme
- Read `src/styles/design-system.css` for all `dash-*` CSS class definitions (v5 dashboard styles)
- Verified `src/types/index.ts` has `ThemeName = 'dark' | 'light' | 'green' | 'colorful' | 'cartoon'`
- Checked `/api/restaurant` PATCH endpoint — currently only supports `is_open`, theme save falls back to local state
- Completely rewrote settings page with:
  - Dark SaaS background: `var(--dash-bg)` = #0f1115
  - Card surfaces: `var(--dash-surface)` / `var(--dash-surface-2)`
  - Text: `var(--dash-text)` / `var(--dash-text-2)` / `var(--dash-text-3)`
  - Accent: `var(--dash-accent)` = #22c55e green
  - All CSS classes: `dash-card`, `dash-btn`, `dash-btn-primary`, `dash-btn-ghost`, `dash-btn-danger`, `dash-badge`, `dash-badge-pro`, `dash-section-label`, `dash-skeleton`, `dash-input`, `dash-toggle-track`, `dash-glass`, `dash-separator`
  - Animations: `animate-dash-section-enter` with staggered delays
- **New Section: Menu Theme Switcher** (between Restaurant Info and Loyalty Program)
  - 5 theme preview cards: Minimal, Dark Premium, Green Organic, Colorful Fun, Luxury
  - Each card shows mini mockup preview with theme colors
  - Selected theme has green border + glow + checkmark
  - Horizontal scrollable row on mobile
  - Attempts PATCH /api/restaurant with theme field, falls back to local state
- Created `DashToggle` component for green-on/dark-off toggle
- Created `ThemePreviewCard` component with mini preview
- Updated `SkeletonSettings` to use `dash-skeleton` class
- Updated `SectionCard` to use `dash-card` class
- Updated `SectionLabel` to use `dash-section-label` and `dash-badge`
- Updated `SettingsRow` to use dark theme colors
- All existing functionality preserved: QR generation, regeneration, deletion, print, loyalty settings, customer list, sign out, PRO gating
- Lint passes (only pre-existing errors in run-dev.js and page.tsx)

### Files Modified:
- `src/app/(dashboard)/dashboard/settings/page.tsx` — Complete rewrite (light → dark premium + theme switcher)

### Key Design Decisions:
- Theme data uses `['dark', 'light', 'green', 'colorful', 'luxury']` — 'luxury' maps to 'cartoon' ThemeName internally
- Theme save attempts PATCH to /api/restaurant but silently falls back to local state if API doesn't support it yet
- Master QR card uses subtle green border glow instead of red
- Stamps segmented control uses gradient background when selected (was white bg)
- All borders use `var(--dash-border)` for consistency
- Sign out button uses `var(--dash-error)` color
- Info box uses dark card surface with subtle border
