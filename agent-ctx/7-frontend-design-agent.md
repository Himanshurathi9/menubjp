---
Task ID: 7
Agent: Frontend Design Agent
Task: Redesign BottomNav.tsx to match exact design specification

Work Log:
- Read existing BottomNav.tsx, worklog.md, globals.css, design-system.css, and store.ts for full context
- Rewrote /home/z/my-project/src/components/dashboard/BottomNav.tsx to match the exact design spec:
  - Nav: fixed bottom-0, z-50, 64px height, frosted-bottom-nav class (rgba(255,255,255,0.92) bg, blur(20px) saturate(180%) backdrop, 1px border-top)
  - 4 tabs evenly spaced: Home (House), Orders (ClipboardList), Menu (UtensilsCrossed), Settings (Settings2)
  - INACTIVE tab: 24px icon (w-6 h-6), color #AEAEB2, stroke-width 1.5, no label text
  - ACTIVE tab: 24px icon (w-6 h-6), color #1A1A1A, stroke-width 2, animate-tab-spring (key on icon forces re-trigger on tab change), 4px indicator dot (#1A1A1A, below icon), label text (10px, font-weight 600, #1A1A1A)
  - RED DOT badge: 10px circle (2.5px radius), bg #E63946, animate-pulse-dot (not animate-pulse), 2px white border, positioned top-right of icon
  - Touch targets: min-h-[44px] min-w-[44px]
  - Safe area: env(safe-area-inset-bottom) padding below nav
  - Kept useOrderBadgeStore for red dot badge
  - Kept same route matching logic (exact match for /dashboard, startsWith for others)
  - Used cn() from @/lib/utils
  - No shadcn/ui components used
  - Leveraged existing CSS classes from design-system.css (frosted-bottom-nav, animate-tab-spring, animate-pulse-dot)
- ESLint: zero errors
- Dev server: compiles cleanly

Stage Summary:
- BottomNav redesigned to exact specification
- iOS-level frosted glass aesthetic with proper backdrop-filter
- Spring animation on tab switch, pulsing red dot for order badge
- Active state shows bold icon + indicator dot + label, inactive shows only muted icon
