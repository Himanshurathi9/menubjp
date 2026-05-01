# Task 6 — Frontend Design Agent

## Task: Redesign Dashboard Home Page

### Work Log
- Read project context from `/home/z/my-project/worklog.md` — understood full project history (Tasks 1-13)
- Read existing dashboard page at `src/app/(dashboard)/dashboard/page.tsx` — analyzed all existing functionality
- Read `src/lib/utils.ts` — confirmed `formatPrice`, `isPlanExpired`, `daysUntilExpiry` imports
- Read `src/types/index.ts` — confirmed `Restaurant` type interface
- Read `src/styles/design-system.css` — mapped all available CSS animations and utility classes
- Read `src/app/globals.css` — confirmed CSS variable definitions and theme setup

### Changes Made

**Redesigned `/src/app/(dashboard)/dashboard/page.tsx`** with exact design specification:

1. **HEADER** — Sticky 52px frosted glass header with `bg-white/85 backdrop-blur-[20px] saturate-[1.8]` and proper border
   - Left: 20px MenuMate logo (red rounded-lg + UtensilsCrossed icon + "MenuMate" text-sm font-bold)
   - Right: Restaurant name in #6E6E73

2. **GREETING** — Staggered page-enter animation (animate-page-enter-1)
   - Time-based emoji: ☀️ morning, 🌤️ afternoon, 🌙 evening
   - Restaurant name: text-[22px], font-bold, tracking-[-0.03em]

3. **OPEN/CLOSE TOGGLE CARD** — Full width, rounded-[20px], p-[20px]
   - OPEN: green gradient bg, green pulsing dot, iOS toggle (ON, #34C759)
   - CLOSED: #F5F5F7 bg, grey dot, iOS toggle (OFF, #E5E5EA)
   - Toggle uses cubic-bezier(0.34, 1.56, 0.64, 1) spring easing

4. **STATS ROW** — Two cards, gap-[12px], white bg, border #E5E5EA, rounded-[16px]
   - Labels: text-[11px], uppercase, tracking-[0.08em], color #AEAEB2
   - Numbers: text-[28px], font-bold, color #1A1A1A

5. **NEW ORDERS ALERT** — Red bg (#FFF5F5), red pulsing dot, "View →" with ChevronRight
   - Only renders when newOrdersCount > 0

6. **SUBSCRIPTION CARD** — Dark gradient (linear-gradient 135deg #1A1A1A to #2C2C2E)
   - PRO badge with semi-transparent white bg
   - "Expires in X days" in rgba(255,255,255,0.6)
   - Expired variant: red-tinted dark gradient, "Plan expired" message
   - Expiring ≤7 days: amber-tinted dark gradient

7. **SKELETON LOADER** — Uses shimmer gradient animation per spec
8. **EMPTY STATE** — 48px icon in #AEAEB2, text-[15px] heading, text-[13px] subtext

### Preserved Functionality
- All existing: `fetchRestaurant`, `handleToggle`, `router`, `toast`
- All state: `data`, `loading`, `toggling`
- All logic: plan expiry checks, greeting time-of-day, new orders count

### Design Rules Followed
- ✅ No shadcn/ui imports
- ✅ Only lucide-react icons (UtensilsCrossed, ChevronRight, Loader2)
- ✅ min-h-[44px] on all interactive elements
- ✅ Exact color values from design system
- ✅ Exact font sizes and letter spacing
- ✅ Staggered page-enter animations (1-5)
- ✅ animate-btn-press on interactive elements
- ✅ animate-pulse-dot on status dots
- ✅ 'use client' directive preserved

### Verification
- ESLint: 0 errors
- Dev server: compiles cleanly, no warnings
