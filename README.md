# GTA5-Mods.com — Next.js TypeScript Migration

This is the static HTML project converted to an **enterprise-level Next.js 14 + TypeScript** application using the App Router.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Navbar, Footer, scripts)
│   ├── page.tsx                  # Home page (index.html)
│   └── paintjobs/
│       └── purple-cat-girl-livery-annis-elegy-rh-7/
│           └── page.tsx          # Product detail page
│
├── components/
│   ├── layout/                   # Global layout components
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── LanguageDropdown.tsx  # Language selector dropdown
│   │   ├── SearchDropdown.tsx    # Search bar dropdown
│   │   ├── Footer.tsx            # Site footer
│   │   └── PageLoader.tsx        # Loading overlay
│   │
│   ├── home/                     # Homepage-specific components
│   │   ├── CategoryNav.tsx       # Category banner (Tools, Vehicles, etc.)
│   │   └── FeaturedSection.tsx   # Featured files carousel
│   │
│   ├── mod/                      # Mod detail page components
│   │   ├── ModGallery.tsx        # Cover image + thumbnail strip
│   │   ├── ModStats.tsx          # Downloads / likes counter
│   │   ├── ModDescription.tsx    # Description + Comments tabs
│   │   ├── ModSidebar.tsx        # Download btn, author, versions, related
│   │   └── DownloadModal.tsx     # All-versions modal
│   │
│   ├── shared/                   # Cross-page reusable components
│   │   ├── ModCard.tsx           # Individual mod card (listing)
│   │   ├── ModGrid.tsx           # Section heading + grid of ModCards
│   │   └── AdContainer.tsx       # Ad slot placeholder
│   │
│   └── ui/                       # Reserved for primitive UI components
│
├── types/
│   └── index.ts                  # All TypeScript interfaces & types
│
├── lib/
│   ├── utils.ts                  # Helper functions (formatCount, cn, etc.)
│   ├── metadata.ts               # SEO metadata builder
│   └── mockData.ts               # Static data (replace with API calls)
│
├── hooks/
│   ├── useDropdown.ts            # Open/close state + outside-click handler
│   └── useSearch.ts              # Search query state + navigation
│
└── constants/
    └── index.ts                  # Site-wide constants (categories, languages, footer links)

public/
├── images/                       # All original images (unchanged)
├── fonts/                        # All original fonts (unchanged)
├── css/                          # Original compiled CSS (unchanged)
└── js/                           # Original JS bundles (unchanged)
```

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run start
npm run type-check
```

---

## Key Decisions

| What | Why |
|------|-----|
| **App Router** | Next.js 14 best practice; enables RSC by default |
| **Original CSS/JS preserved** | Zero UI change requirement — all Bootstrap classes intact |
| **TypeScript strict mode** | Catches bugs at compile time; enterprise standard |
| **Mock data layer** | `src/lib/mockData.ts` mimics what an API would return — swap with `fetch()` calls |
| **`next/image`** | Automatic optimisation without visual change |
| **`next/link`** | Client-side navigation; preserves all `href` values |
| **Component co-location** | Each logical UI section is its own file; easy to test or replace |

---

## Extending to a Real API

Replace the imports from `@/lib/mockData` in each page with `async` data fetching:

```ts
// Example: app/page.tsx
const latestMods = await fetch(`${API_BASE}/mods?sort=latest`).then(r => r.json());
```

Next.js App Router pages are React Server Components by default, so `async/await` at the top level works out of the box.
