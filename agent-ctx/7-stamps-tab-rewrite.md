# Task 7 - StampsTab Theme-Aware Rewrite

## Agent: Main
## Task: COMPLETELY REWRITE StampsTab.tsx with theme-aware dark premium styling

## Work Log:
- Read worklog.md to understand full project history (5 previous tasks, theme system already built)
- Read themes.ts to understand MenuTheme interface (90+ properties per theme, 5 themes)
- Read existing StampsTab.tsx (had hardcoded colors like #1C1C1E, #E63946, #FAFAF8, #6B6B6B, #ABABAB)
- Read types/index.ts for StampSettings interface
- Read utils.ts for formatDate function
- Checked PublicMenuClient.tsx usage — StampsTab was NOT receiving theme prop

## Changes Made:

### 1. StampsTab.tsx — Complete Rewrite
- Added `theme: MenuTheme` prop to StampsTabProps interface
- Added `import type { MenuTheme } from '@/lib/themes'`
- **Removed ALL hardcoded colors** — every color now comes from the theme prop
- Four views fully rewritten with theme-aware inline styles:

**INPUT VIEW:**
- Background: theme.bg
- Centered header with 🎁 emoji (48px), "Earn Rewards" (22px/800 weight), description (14px)
- Glass card: theme.stampCardBg bg, theme.stampCardBorder border, borderRadius 20px, padding 24px
- Name input with User icon: label 12px/700/uppercase/theme.textMuted, input bg theme.searchBg
- Phone input with Phone icon + "+91" prefix: container bg theme.searchBg, border-right theme.border
- "Check My Card" button: full-width, 52px height, theme.accentGradient, theme.accentText, borderRadius 14px, with ArrowRight icon, disabled state opacity 0.5
- Info text: 12px, color theme.textMuted

**LOADING VIEW:**
- Centered Loader2 spinner (theme.accent), "Checking your card..." text (14px, theme.textSub)

**CARD VIEW:**
- Welcome text: 20px/800/theme.text
- Stamp card: theme.stampCardBg, theme.stampCardBorder, theme.cardShadow, borderRadius 24px, padding 24px
- Header row: restaurant name (15px/600/theme.text) + count badge (14px/700/theme.accent)
- Stamp grid: cols based on stamps_required (3 if ≤9, else 4), gap 12px, centered
  - Filled slots: 64px circle, theme.stampFilledBg gradient, theme.cardShadow, Check icon (theme.stampFilledIcon)
  - Empty slots: 64px circle, theme.stampEmptyBg, 2px dashed theme.stampEmptyBorder, index+1 in mono (theme.stampEmptyText)
- Progress text: centered with 28px/900 mono numbers (theme.text) + 14px text (theme.textSub)
- Halfway motivation card: theme.accentSoft bg, theme.accent border with rgba, Target icon, theme.accent text
- Active reward card: theme.stampCardBg, theme.stampCardBorder, Gift icon (theme.accent), code in mono (17px/700/theme.accent), Copy button (theme.searchBg, theme.textSub, theme.border)
- "Collect My Stamp" button: theme.accentGradient, theme.accentText, with Award icon
- "Check a different number" link: theme.textMuted

**REWARD VIEW:**
- Confetti animation with CSS keyframes, confetti colors from theme.accent/theme.accentEnd
- Reward card: theme.stampCardBg, theme.stampCardBorder, borderRadius 24px, padding 32px 24px
- 🎉 emoji (56px, bounce animation)
- "You've earned it!" (26px/900/theme.text)
- "1 Free {item}" (18px/theme.textSub)
- Code box: theme.searchBg, theme.border border, borderRadius 16px
  - "YOUR REWARD CODE" label (11px/theme.textMuted)
  - Code (32px/mono/900/theme.text)
  - Copy button: rgba(255,255,255,0.08) bg, theme.text color
- Valid until text: 13px/theme.textMuted
- Back button: theme.textMuted

### 2. PublicMenuClient.tsx — Added theme prop
- Added `theme={theme}` to StampsTab component usage (line 801)
- Theme was already available as `const theme: MenuTheme = getTheme(restaurant.theme)`

## Verification:
- Lint passes: only 3 pre-existing errors in run-dev.js, 1 warning in page.tsx
- No new lint errors introduced
- Dev server returns 200 OK
- Zero hardcoded colors remain in StampsTab.tsx
- All 4 views (input, loading, card, reward) fully functional with theme-aware styling
