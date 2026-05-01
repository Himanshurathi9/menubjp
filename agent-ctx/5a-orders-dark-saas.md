# Task 5-a: Live Orders Page — Premium Dark SaaS Rebuild

## Summary
Rebuilt the Live Orders page at `src/app/(dashboard)/dashboard/orders/page.tsx` into a premium dark SaaS experience using the dashboard design system (v5 CSS classes).

## What Changed
- **Complete visual overhaul**: Replaced the light iOS-style theme with a premium dark SaaS aesthetic using `var(--dash-*)` CSS variables
- **Sticky header**: Dark glassmorphism header (`dash-glass`) with "Live Orders" title, animated red pulse dot for new orders, "Updated X ago" text, and dark glass circle refresh button
- **Status tab switcher**: 3-tab segmented control in dark surface-2 background. Active tab fills with status-specific gradient (red for New, amber for Preparing, green for Served) with matching glow shadow. Inactive tabs show transparent with dimmed text
- **Order cards**: `dash-card` class with status-colored 4px gradient top strip, staggered `dash-order-in` entrance animation, dark surface-2 items preview, expand/collapse, note section with amber border, gradient action buttons matching next status color
- **Time pills**: Color-coded background + pulsing dot (green < 5min, amber 5-15min, red > 15min) with matching text colors (#4ade80, #fbbf24, #f87171)
- **Empty state**: Dark themed with status-colored icon in dash-card, staggered entrance animations
- **Loading skeleton**: `dash-skeleton` class for dark shimmer effect on tab + card placeholders
- **Today stat row**: Section label with total orders count and new count in status colors
- **CSS classes used**: `dash-card`, `dash-glass`, `dash-skeleton`, `dash-section-label`, `dash-separator`, `dash-badge-*`, `animate-dash-section-enter`, `animate-dash-section-1/2/3`, `animate-dash-live-pulse`, `animate-btn-press`

## Functionality Preserved (100%)
- Auto-polling every 15 seconds via `useEffect` + `setInterval`
- Manual refresh button
- Order status updates (`PATCH /api/orders/[orderId]/status`)
- Tab switching between NEW/PREPARING/SERVED
- Expandable/collapsible order cards
- Document title update with new order count
- `useOrderBadgeStore` for badge count in BottomNav
- All helper functions: `formatTime`, `getOrderNumber`, `summarizeItems`, `timeAgoShort`, `getTimeElapsedInfo`
- Toast notifications on status update
- Loading/refreshing/error states

## Micro-interactions
- Card hover lift (`dash-card` CSS)
- Button scale on press (`animate-btn-press`)
- Staggered order card entrance (`dash-order-in` with `index * 60ms` delay)
- Pulsing red dot for live new orders indicator
- Pulsing time pill dots for urgent orders
- Smooth tab transitions

## Lint Result
- Zero new lint errors introduced
- Only pre-existing errors remain (run-dev.js: 3 errors, page.tsx: 1 warning)
