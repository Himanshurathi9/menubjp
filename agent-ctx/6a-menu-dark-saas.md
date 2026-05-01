# Task 6-a: Menu Management Page — Premium Dark SaaS Rebuild

## Task
Rebuild `/src/app/(dashboard)/dashboard/menu/page.tsx` from a light iOS-inspired theme into a premium dark SaaS design matching the dashboard design system.

## What Changed
Complete visual transformation from light (#F0F0F5 bg, white cards) to dark premium (#0f1115 bg, #161920 surfaces). All business logic preserved identically.

### Visual Changes
1. **Sticky Header**: `dash-glass` class with dark backdrop blur, `var(--dash-text)` title, green accent preview link
2. **Category Chips**: Active = `var(--dash-gradient)` (green gradient fill with glow shadow), Inactive = `dash-glass-light` (dark glass surface), Add chip = green-tinted border with `var(--dash-accent)`
3. **Item Cards**: `dash-card` class with horizontal layout — 72x72 rounded-16px food images, colored food type dots with glow, white price text, dark toggle switches (`dash-toggle-track`/`dash-toggle-thumb`)
4. **PRO Badges**: Best Seller = amber (rgba(245,158,11,0.12) bg, #fbbf24 text), Chef's Special = purple (rgba(168,85,247,0.12) bg, #c084fc text)
5. **Empty States**: Dark card containers with `var(--dash-text-3)` icons
6. **Add/Edit Item Sheet**: `var(--dash-surface)` background, `dash-input` fields with green focus ring, dark food type pill selectors, dark toggle switches, `dash-btn-primary`/`dash-btn-danger` buttons
7. **Add Category Sheet**: Dark surface, `dash-input`, dark ghost suggestion pills
8. **Delete Category Sheet**: Dark surface, red accent danger zone
9. **FAB Button**: `var(--dash-gradient)` with green glow shadow, `animate-dash-fab-in` entrance
10. **Skeleton Loaders**: `dash-skeleton` class for dark shimmer effect
11. **Select dropdowns**: Dark background/color for native `<option>` elements

### Animations
- `animate-dash-section-enter` + `animate-dash-section-1` through `animate-dash-section-6` for staggered entrance
- `animate-dash-fab-in` for floating add button
- Preserved `menuCardIn` staggered card entrance

### Color Mapping
| Old (Light) | New (Dark) |
|---|---|
| `#F0F0F5` bg | `var(--dash-bg)` = #0f1115 |
| `bg-white` cards | `var(--dash-surface)` = #161920 |
| `#1C1C1E` text | `var(--dash-text)` = #f0f1f3 |
| `#6E6E73` secondary | `var(--dash-text-2)` |
| `#AEAEB2` tertiary | `var(--dash-text-3)` |
| `#34C759` green | `#22c55e` (dash-accent) |
| `#FF3B30` red | `#ef4444` |
| `#FF9500` amber | `#f59e0b` |
| `#8B5CF6` purple | `#a855f7` |

### Preserved Functionality (100%)
- All state management (categories, items, sheet modes, loading, etc.)
- All API calls (fetchCategories, fetchItems, handleAddCategory, handleDeleteCategory, handleSaveItem, handleDeleteItem, handleToggleAvailability)
- Long-press to delete category
- Category filtering
- ImageUpload component usage
- PRO feature gating
- Loading/saving/deleting states
- Toast notifications
- formatPrice, handleImgError utilities
- Staggered card entrance animations

### Files Modified
- `src/app/(dashboard)/dashboard/menu/page.tsx` — Complete visual rebuild (~620 lines, down from 1115)

### Lint
- ✅ Clean (only 3 pre-existing errors in run-dev.js, 1 pre-existing warning in page.tsx)
