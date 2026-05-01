# Task 4-a: Dashboard Home Page Rebuild

## Agent: Dashboard Design Agent
## Task: Rebuild the Dashboard Home page into a premium dark SaaS experience

### Work Log
- Read worklog.md for project context (6 prior tasks, stable codebase)
- Read current page.tsx (white background iOS-style dashboard, 964 lines)
- Read design-system.css to understand all `dash-*` CSS classes and `--dash-*` CSS variables
- Read lib/utils.ts and types/index.ts for imports/types
- Read layout.tsx to confirm it uses `var(--dash-bg)` background

### Changes Made
Complete rewrite of `/home/z/my-project/src/app/(dashboard)/dashboard/page.tsx` (866 lines):

1. **Sticky Header** — `dash-glass` class, 52px height, no border-bottom
   - Red-to-orange gradient logo (28x28, 8px radius)
   - "MenuMate" text in `var(--dash-text)` 
   - Restaurant name pill with `rgba(255,255,255,0.05)` background and border

2. **Greeting Section** — Time-based icons (Cloud/Sun/Moon) now in green (`var(--dash-accent)`)
   - Restaurant name in 28px bold white text

3. **Open/Close Toggle Card** — Large `dash-card` with:
   - Green glow state when open (`var(--dash-shadow-glow-green)`)
   - Gradient top border (`var(--dash-gradient)`) when open
   - `dash-toggle-track` / `dash-toggle-thumb` classes for toggle
   - `animate-dash-toggle-glow` on the green dot when open

4. **Stats Row** (2-col grid) with staggered animation:
   - "Today's Orders" card: `dash-card dash-card-accent`, blue gradient top accent, sparkline (7 bars via `dash-sparkline` + `dash-sparkline-bar`)
   - "Revenue" card: `dash-card dash-card-accent`, green gradient top accent (from `::before`), sparkline

5. **New Orders Alert** — Red-tinted card with `animate-pulse-dot`, navigates to `/dashboard/orders`

6. **Subscription Card** — Dark gradient background, green left border, `dash-badge dash-badge-success` for plan, expiry logic preserved

7. **View My Menu Button** — `dash-card` with `var(--dash-gradient-orange)` icon, opens in new tab

8. **Quick Actions Grid** (2x2) — Four `dash-card` buttons:
   - Edit Menu (blue icon bg)
   - Live Orders (red icon bg, pulsing dot badge)
   - Banners (purple icon bg)
   - QR Codes (green icon bg)

9. **Today Performance** — `dash-card` with `dash-progress` and `dash-progress-fill` bars:
   - Orders progress (blue gradient fill)
   - Revenue progress (green gradient fill)

### Functionality Preserved
- All data fetching (GET /api/restaurant)
- Toggle open/close (PATCH /api/restaurant)
- Navigation via useRouter
- Loading skeleton state (using `dash-skeleton` class)
- Error handling with toast
- Plan expiry logic
- formatPrice import

### Design System Classes Used
- `dash-glass`, `dash-card`, `dash-card-accent`
- `dash-badge`, `dash-badge-success`
- `dash-btn`, `dash-section-label`, `dash-skeleton`
- `dash-toggle-track`, `dash-toggle-track-on`, `dash-toggle-thumb`
- `dash-sparkline`, `dash-sparkline-bar`
- `dash-progress`, `dash-progress-fill`
- `animate-dash-section-enter` through `animate-dash-section-6`
- `animate-dash-toggle-glow`, `animate-pulse-dot`, `animate-spin`

### CSS Variables Used
- `--dash-bg`, `--dash-surface`, `--dash-surface-2`, `--dash-surface-3`
- `--dash-border`, `--dash-text`, `--dash-text-2`, `--dash-text-3`
- `--dash-accent`, `--dash-accent-glow`, `--dash-warning`, `--dash-error`
- `--dash-gradient`, `--dash-gradient-blue`, `--dash-gradient-orange`
- `--dash-shadow-card`, `--dash-shadow-hover`, `--dash-shadow-glow-green`

### Lint Results
- No new errors or warnings from this file
- Only pre-existing 3 errors (run-dev.js) and 1 warning (page.tsx alt-text)
