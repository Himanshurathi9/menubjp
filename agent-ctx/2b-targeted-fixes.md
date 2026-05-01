---
Task ID: 2-b
Agent: Main Engineer
Task: 5 targeted fixes - banner responsive CSS, stamp card tab, theme priority, floating buttons, category bar sticky

Files Modified:
- `/src/styles/menu-themes.css` - Banner CSS (aspect-ratio), category bar sticky simplification, service FAB cleanup
- `/src/components/menu/PublicMenuClient.tsx` - Stamp tab, theme priority fix, category bar sticky fix
- `/src/app/api/stamp-settings/route.ts` - Public GET by restaurant_id

Changes Summary:

### FIX 1: Banner Responsive CSS
- Replaced `height: 140px` with `aspect-ratio: 16/6` (desktop)
- Mobile: `aspect-ratio: 8/3` (was `height: 120px`)
- Added `max-width: 1200px; margin: 0 auto` for desktop centering

### FIX 2: Stamp Card Tab
- Added `activeTab` state: 'menu' | 'stamps'
- Added `stampSettings` state fetched from `/api/stamp-settings?restaurant_id=...`
- Tab toggle appears in header only when stamp settings are active
- StampsTab renders with correct `MenuTheme` from themes.ts via CSS→lib theme mapping
- Added imports: StampsTab, getTheme, StampSettings, Gift, UtensilsCrossed

### FIX 3: Theme Always From Admin
- Removed localStorage check in theme application effect
- Admin's theme ALWAYS applied on first load
- Customer can still switch themes via cycle button

### FIX 4: Floating Button Positioning
- Removed duplicate `bottom` property in `.menu-service-fab` CSS
- Desktop overrides already handle increased spacing (32px vs 24px)

### FIX 5: Category Bar Simple Sticky
- Category bar uses `top: 56px` always (below header)
- Removed `data-has-banner` attribute approach
- Removed complex CSS calculations (196px/176px)
- Banner scrolls away naturally, category bar stays below header

### Supporting Change: Public Stamp Settings API
- `/api/stamp-settings` GET now supports `restaurant_id` query param without auth
- Returns stamp settings only if `is_active` is true
- Owner session path preserved for full customer list
