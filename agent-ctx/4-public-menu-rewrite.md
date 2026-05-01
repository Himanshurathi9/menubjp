# Task 4 — PublicMenuClient.tsx Complete Rewrite

## Agent: Main Agent
## Task: Completely rewrite PublicMenuClient.tsx with dark premium food UI per design spec

## Work Log
- Read worklog.md (tasks 1-5) to understand full project history
- Read themes.ts to understand MenuTheme interface (90+ properties per theme)
- Read current PublicMenuClient.tsx, BannerCarousel.tsx, CartSheet.tsx, ItemDetailModal.tsx, MenuItemCard.tsx, StampsTab.tsx, types/index.ts, design-system.css
- BannerCarousel already accepts `theme: MenuTheme` prop (updated in task 5) — no changes needed
- Completely rewrote PublicMenuClient.tsx from scratch with all 12 sections

## Changes Made

### Complete Rewrite of `/home/z/my-project/src/components/menu/PublicMenuClient.tsx`

All 12 sections implemented per spec:

1. **Sticky Header** (z-50, glass effect): 52px, backdrop-blur(20px) saturate(180%), restaurant name (17px/700/truncate), animated search pill, search toggle button (40x40/rounded-xl), cart icon with count badge (bg theme.accent, 18px min-width, rounded-full)

2. **Hero Section** (220px): Cover image with theme.heroFallbackBg, gradient overlay (theme.heroOverlay), ambient glow div (theme.heroGlow), restaurant name (26px/800), OPEN/CLOSED pill badges with pulse-dot animation, table number badge with MapPin icon

3. **Banner Carousel**: Only renders when banners.length > 0 AND not searching, passes `theme` prop to BannerCarousel

4. **Glass Category Bar** (sticky top 52px, z-40): backdrop-blur(16px) saturate(180%), horizontal scroll pills with auto-scroll to active, active pill uses theme.pillActiveBg (gradient) as background, animate-pill-pop, inactive pills: theme.pillBg/pillText

5. **Content Area** (flex-1): Three states — search empty (Search icon 72px), no items (ChefHat 80px float animation), items exist with responsive grid (grid-cols-2 md:grid-cols-3), staggered animate-card-enter

6. **Footer**: "Powered by MenuMate" with theme.footerText and theme.footerAccent

7. **Bottom Nav Bar** (fixed bottom-0, z-30): 60px + safe-area, theme.bottomNavBg, blur(20px), max-width 600px centered, Menu + My Stamps (PRO only) tabs, active tab uses theme.bottomNavActiveColor with 2.5px indicator div (background: theme.bottomNavIndicatorColor), inactive: theme.bottomNavInactiveColor

8. **Floating Cart Bar**: Fixed above bottom nav, animate-cart-bar-slide-up, rounded-full 52px button, theme.cartBarBg (gradient), theme.cartBarBorder, theme.cartBarShadow, blur(16px), count badge + items + total + View Cart CTA

9. **Fullscreen Image Viewer** (z-70): rgba(0,0,0,0.95) overlay, 40px white close button, centered image (95%/90vh), animate-fullscreen-enter, Escape key close, body scroll lock

10. **Item Detail Modal** (z-60): Renders ItemDetailModal with full theme integration

11. **Cart Sheet** (z-50): Renders CartSheet with theme, localStorage cleanup on order placed

12. **Bottom Spacer**: calc(60px + env(safe-area-inset-bottom, 0px))

## Key Design Principles Applied
- EVERY themed element uses inline styles with theme values — NO Tailwind color classes
- Content centered with `maxWidth: '600px', margin: '0 auto'`
- CSS animation classes from design-system.css used throughout
- Gradient strings (pillActiveBg, cartBarBg, bottomNavIndicatorColor) used directly as `background` CSS property
- Cart state persisted to localStorage with key `menumate_cart_${restaurant.slug}`
- All existing functionality preserved: cart add/remove, search filter, category intersection observer, pill auto-scroll, scroll-to-category, item tap modal, image tap fullscreen

## Lint Results
- No new errors or warnings from the rewritten file
- Only pre-existing 3 errors in run-dev.js and 1 warning in page.tsx

## Files Modified
- `src/components/menu/PublicMenuClient.tsx` — Complete rewrite (580+ lines)
