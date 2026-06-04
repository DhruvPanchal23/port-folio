# Dhruv Panchal — Premium Portfolio (PRD)

## Original problem statement
Build a premium, company-ready, recruiter-ready, and client-ready portfolio website for **Dhruv Panchal** with a multi-page architecture (Home, About, Work, Resume, Blog, Connect, Guestbook, Testimonials, Links, Feedback, Engine Room, Custom 404) and an Admin panel to manage dynamic content. Latest direction: a comprehensive UI/UX redesign inspired by the polish, layout, and professional tone of `aayushbharti.in` (not a clone) — while keeping Dhruv's brand identity intact.

## Stack
- **Frontend**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend / DB**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Netlify-ready (`netlify.toml`)
- **Dev server**: `yarn dev` on port 3000 (NOT supervisor-managed — supervisor expects `/app/frontend` and `/app/backend` which don't exist for this Next.js setup)

## Pages
- `/` — Home (Pixels. Logic. Story. hero, /now card, services, tech stack, globe, CTA)
- `/about` — About Me with Currently working on highlight
- `/work` — Selected Work, filterable, premium project cards
- `/work/[id]` — Case study (existing routes)
- `/resume` — Resume page
- `/blog`, `/blog/[slug]` — Blog
- `/connect` — Contact form
- `/guestbook` — Sticky 2-column sign + wall layout
- `/testimonials` — Testimonials
- `/links` — Featured / Around the web / On-site link cards
- `/feedback` — Send feedback form
- `/engine-room` — Tools / "uses"
- `/admin` — Admin dashboard (Supabase auth)
- Custom 404

## Theme & design system
- Dark-first portfolio (forces dark unless user explicitly toggles light).
- Background `hsl(220 14% 5%)` (deep charcoal blue-black).
- Primary accent: **Cyan** `hsl(187 92% 58%)` — distinctive, premium, avoids the AI-slop blue.
- Theme Studio popover lets users swap accent: Cyan (default) / Ocean / Violet / Ember / Aurora.
- Font: Inter (body), Syne (display), JetBrains Mono (mono).
- All interactive elements have `data-testid` for testing.

## Implemented (Feb 2026)
- ✅ Multi-page architecture wired with App Router
- ✅ Supabase auth + tables (guestbook, feedback, blog, projects)
- ✅ Admin dashboard with CRUD on blog & guestbook moderation
- ✅ SEO: sitemap, robots, structured-data, OG tags, manifest
- ✅ Custom CSS-based animated globe (replacing crashing R3F implementation)
- ✅ **Premium redesign pass (Feb 2026)**
  - Dark theme by default + cyan accent (`/app/app/globals.css`, `/app/(site)/layout.tsx`, `/app/layout.tsx`)
  - Removed `LoadingScreen` overlay (killed the "ar/DP" flash on initial load)
  - Removed "Developer & Designer" subtext from logo & resume header
  - **Home** rebuilt: Pixels. Logic. Story. hero, /now card, principles marquee, services grid, tech stack, timezone globe, CTA
  - **Work** rebuilt: ProjectCard with preview gradient + emoji, Featured/Status badges, Private lock, tech chips, metrics, Code/Live/Case-study CTAs, filter with counts
  - **Links** rebuilt: Featured trio + Around-the-web + On-this-site groups with gradient-tinted cards
  - **Guestbook** rebuilt: 2-column sticky layout, quote glyph background, tinted avatars per name hash, character counter
  - **Command Menu (Ctrl+K)** rebuilt: backdrop blur, search input, categorized items with kbd hints, footer move/open hints, aria-selected + data-selected for a11y
  - **About** updated: highlighted "Currently working on Cinematica + AI in Digital Forensics" block with cyan ping dot
  - **Resume** updated: new tagline "A snapshot of what I've built, broken & shipped."

## Known issues / next steps
- ⚠️ **Guestbook list returns 401 on `/guestbook`** (pre-existing). The RLS policy exists in `/app/supabase/migrations/20260604120000_guestbook_feedback.sql` but appears not yet applied on the live Supabase project. Apply the migration (`Public can read approved guestbook entries` policy) to fix. The page already renders the empty-state gracefully.
- P1 backlog: per-project case-study pages (`/work/[id]`) currently fall back to a generic layout — could be enriched with actual case-study content.
- P2 backlog: connect actual Spotify "now playing" instead of the static `/now` card.
- P2 backlog: replace stock project preview emojis with real screenshots once available.

## Roadmap
- **P0 (DONE)**: Dark default, logo flash fix, subtext removal, premium home/work/links/guestbook/cmdk redesign, About update
- **P1**: Apply guestbook RLS migration, per-project case studies, blog post drafts
- **P2**: Spotify now-playing, real project screenshots, image asset CDN setup

## Credentials (`/app/memory/test_credentials.md`)
- Admin: `dhruv.pnchl.2307@gmail.com` / `dhruv@admin123`
- Supabase: project + anon key in `/app/.env.local`

## Architecture
```
/app/
├── app/
│   ├── (site)/             # Public pages
│   ├── admin/              # Admin dashboard
│   ├── globals.css         # Tailwind + theme tokens
│   ├── layout.tsx          # Root layout + theme boot script
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── 3d/CSSGlobe.tsx     # Pure-CSS globe (replacement for R3F)
│   ├── admin/              # Admin UI
│   ├── providers/          # AppThemeProvider
│   ├── Navigation.tsx
│   ├── SiteShell.tsx       # Layout shell (LoadingScreen removed)
│   ├── SiteCommandMenu.tsx # Premium Ctrl+K palette
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts
│   ├── theme-accent.ts     # Accent preset list (Cyan default)
│   └── nav-config.ts
├── supabase/migrations/    # SQL schemas + RLS policies
└── memory/                 # PRD + test credentials
```
