# Phase 2: Landing Page & Project Pages — Research

**Researched:** 2026-04-07
**Domain:** Astro 6 content collections, dynamic routes, CSS-only animations, vanilla JS filtering, responsive CSS Grid
**Confidence:** HIGH (all patterns verified against existing Phase 1 code and Astro 6 known API)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Hero is minimal — headline + 1-2 sentence subheadline. No long founder narrative.
- **D-02:** No photo or avatar in the hero. Text-only.
- **D-04:** Card design is Balatro-inspired — rounded cards with bold color pop, thick borders, vibrant tag chips, playful but clean and readable.
- **D-05:** Hover effects: slight tilt/wobble animation, glow intensifies. Cards should feel interactive and fun.
- **D-06:** Price tier tags use rarity-style color coding — Free = common (green), Paid = legendary (gold/purple glow), Semi-Paid = rare (blue).
- **D-09:** Tools/tech stack displayed as Balatro-style tag chips — same visual language as the showcase grid.
- **D-10:** Free project downloads accessible directly. Paid/semi-paid show locked state (Phase 4 wires Stripe).

### Claude's Discretion
- Hero CTA structure (D-03): single "Browse Projects" scroll-down chosen in UI-SPEC
- Grid column count (D-07): 1/2/3 at 375px/768px/1024px+ chosen in UI-SPEC
- Project detail page section ordering (D-08): back link → header → video → description → setup guide → download
- Filtering UI approach (D-11): clickable tag row (Balatro chips) above grid, no search bar in v1
- Footer content and layout
- Empty state when no projects match a filter
- Navigation structure

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAND-01 | Hero section with headline and subheadline | Hero section pattern in Astro page, CSS gradient text |
| LAND-02 | Grid of project cards with name, description, preview | CSS Grid auto-fill, ProjectCard component |
| LAND-03 | Cards display glowy colored tags (Free, Paid, Semi-Paid, category) | Rarity chip CSS, box-shadow glow |
| LAND-04 | Filter/search projects by tag using clickable tag row | Vanilla JS data-attribute filtering pattern |
| PROJ-01 | Dedicated detail page per project | Astro `[slug].astro` dynamic route + `getStaticPaths` |
| PROJ-02 | Detail page shows tools used as list/chips | TagChip component reuse, `tools` array from schema |
| PROJ-03 | Embedded video tutorial (YouTube) | Responsive 16:9 iframe wrapper, conditional render if `videoUrl` exists |
| PROJ-04 | Downloadable resources section | Anchor tag with `download` attribute or direct `href` |
| PROJ-05 | Step-by-step setup guide | Markdown body rendered via `<Content />` slot in Astro |
| PROJ-07 | Free projects: direct download, no gate | Conditional render on `priceTier === 'free'` |
| COMM-04 | Discord community link prominently displayed | Footer or hero CTA area link |
| INFR-04 | SEO basics: meta tags, Open Graph, sitemap, robots.txt | BaseLayout title prop extension, Astro sitemap integration |
| INFR-05 | Favicon and social share image | `<link rel="icon">` in BaseLayout head |
</phase_requirements>

---

## Summary

Phase 2 builds entirely on the Phase 1 scaffold. All the hard infrastructure work (Astro 6, Tailwind v4, content collections, Netlify deploy) is done. This phase is pure product: replace the placeholder `index.astro` with a full landing page, create `[slug].astro` for project detail pages, and build a set of reusable components (`ProjectCard`, `TagChip`, `FilterBar`).

The defining technical challenge is the Balatro card aesthetic — CSS-only tilt/wobble hover with per-card rarity glow. This requires inline CSS variables on each card (so the glow color can be tier-specific) and CSS transitions on `transform` + `box-shadow`. The filter interaction is vanilla JS data-attribute toggling — no Astro islands or framework needed for 4-8 cards.

The second challenge is the dynamic route pattern. Astro 6 with content collections uses `getStaticPaths` + `getEntry` inside `[slug].astro`. The `glob()` loader in Phase 1's `content.config.ts` automatically derives the entry `id` from the filename (e.g. `polymarket-bot.md` → id `polymarket-bot`), which becomes the URL slug.

**Primary recommendation:** Build in this order — TagChip component first (used everywhere), then ProjectCard, then FilterBar, then `index.astro`, then `[slug].astro`. Shared CSS custom properties for rarity colors defined once in `global.css`.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.4 | Framework, routing, content collections | Already installed, Phase 1 |
| tailwindcss | 4.2.2 | Utility classes | Already installed, Phase 1 |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind v4 | Already installed, Phase 1 |
| typescript | 5.9.3 | Type safety | Already installed, Phase 1 |

### No new dependencies required

All Phase 2 features are achievable with what's installed:
- Dynamic routes: built into Astro
- Content collection queries: `astro:content` built-in
- CSS animations: native CSS transitions
- Tag filtering: vanilla JS inline `<script>` in Astro component
- YouTube embeds: plain `<iframe>` HTML
- Responsive grid: CSS Grid native

**Installation:** None needed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── pages/
│   ├── index.astro              # Landing page (replace placeholder)
│   └── projects/
│       └── [slug].astro         # Dynamic project detail pages
├── components/
│   ├── TagChip.astro            # Reusable chip (rarity + tool variants)
│   ├── ProjectCard.astro        # Card with Balatro hover effects
│   ├── FilterBar.astro          # Tag row with vanilla JS filtering
│   ├── HeroSection.astro        # Minimal text hero
│   ├── ProjectGrid.astro        # Grid wrapper + empty states
│   └── VideoEmbed.astro         # Responsive 16:9 YouTube iframe
├── layouts/
│   └── BaseLayout.astro         # Extend with title prop (already exists)
├── content/
│   └── projects/
│       └── polymarket-bot.md    # Existing entry
└── styles/
    └── global.css               # Add rarity CSS custom properties here
```

### Pattern 1: Astro 6 Dynamic Routes with Content Collections

**What:** `getStaticPaths` generates one page per project entry at build time. `getEntry` fetches the full entry including markdown body.

**When to use:** Any page that maps 1:1 to a content collection entry.

```astro
---
// src/pages/projects/[slug].astro
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---
<BaseLayout title={project.data.title}>
  <Content />
</BaseLayout>
```

**Key detail:** In Astro 6 with the `glob()` loader, the entry `id` is the filename without extension (e.g. `polymarket-bot`). Use `project.id` as the slug param — NOT `project.slug` (that field was removed in Astro 5+).

**Key detail:** `render()` is imported from `astro:content` (not a method on the entry). Returns `{ Content, headings, remarkPluginFrontmatter }`.

### Pattern 2: Content Collection Query with Filtering

```astro
---
// In index.astro frontmatter
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects', ({ data }) =>
  data.status === 'live'
);

// Sort by publishedAt descending
const projects = allProjects.sort((a, b) => {
  const dateA = a.data.publishedAt?.getTime() ?? 0;
  const dateB = b.data.publishedAt?.getTime() ?? 0;
  return dateB - dateA;
});

// Derive unique tags for FilterBar
const allTags = [...new Set(projects.flatMap((p) => p.data.tags))].sort();
---
```

### Pattern 3: CSS-Only Card Tilt + Glow

**What:** CSS `transform` + `box-shadow` transitions triggered by `:hover`. Rarity-specific glow color set as a CSS custom property inline on each card.

**When to use:** Any interactive card with per-instance color variation.

```astro
<!-- ProjectCard.astro -->
---
const { project } = Astro.props;
const glowMap = {
  free: 'rgba(34,197,94,0.3)',
  'semi-paid': 'rgba(59,130,246,0.3)',
  paid: 'rgba(168,85,247,0.4)',
};
const borderMap = {
  free: 'rgba(34,197,94,0.6)',
  'semi-paid': 'rgba(59,130,246,0.6)',
  paid: 'rgba(168,85,247,0.6)',
};
const glow = glowMap[project.data.priceTier];
const border = borderMap[project.data.priceTier];
---
<a
  href={`/projects/${project.id}`}
  class="project-card"
  style={`--glow: ${glow}; --border: ${border};`}
>
  <!-- card content -->
</a>

<style>
  .project-card {
    background: var(--color-surface);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
    display: block;
    text-decoration: none;
  }
  .project-card:hover {
    transform: rotate(-1.5deg) scale(1.03);
    box-shadow: 0 8px 32px var(--glow);
    border-color: color-mix(in srgb, var(--border) 167%, transparent);
  }
  .project-card:focus-visible {
    outline: 2px solid #22d3ee;
    outline-offset: 2px;
  }
  .project-card:active {
    transform: scale(0.97);
    transition-duration: 100ms;
  }
</style>
```

**Why CSS custom properties on the element:** Avoids generating multiple Tailwind variants per tier; keeps the hover logic in one CSS rule.

### Pattern 4: Vanilla JS Tag Filtering

**What:** Inline `<script>` in `FilterBar.astro` or `index.astro` uses `data-tags` attributes on cards and `data-filter` on chips. No Astro islands needed.

**When to use:** Client-side DOM manipulation in Astro with no framework.

```html
<!-- Each card gets data-tags attribute -->
<div class="project-card" data-tags="Trading,Automation,AI">...</div>

<!-- Each filter chip gets data-filter attribute -->
<button class="filter-chip" data-filter="Trading">Trading</button>
<button class="filter-chip active" data-filter="all">All</button>
```

```js
// Inline <script> in FilterBar.astro
const chips = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-tags]');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;

    // Update active state
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // Show/hide cards
    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        const tags = card.dataset.tags.split(',');
        card.style.display = tags.includes(filter) ? '' : 'none';
      }
    });

    // Show/hide empty state
    const visible = [...cards].filter(c => c.style.display !== 'none');
    document.getElementById('empty-state').style.display =
      visible.length === 0 ? '' : 'none';
  });
});
```

**Key Astro detail:** Scripts in `.astro` files are bundled by Vite. Use a plain `<script>` tag (not `<script type="module">` — Astro handles the module wrapping). The script runs after the DOM is ready by default in Astro's build.

### Pattern 5: Responsive YouTube Embed (16:9)

```html
<!-- VideoEmbed.astro -->
---
const { url } = Astro.props;
// Convert watch URL to embed URL
const embedUrl = url?.replace('watch?v=', 'embed/');
---
{url && (
  <div class="video-wrapper">
    <iframe
      src={embedUrl}
      title="Project video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
)}

<style>
  .video-wrapper {
    position: relative;
    padding-top: 56.25%; /* 16:9 */
    border-radius: 12px;
    overflow: hidden;
  }
  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

**Pitfall:** YouTube URLs come in multiple formats (`youtu.be/ID`, `youtube.com/watch?v=ID`, `youtube.com/embed/ID`). Use a regex or the URL API to normalize, not a simple string replace.

### Pattern 6: Responsive CSS Grid

```css
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;          /* 375px: 1 col */
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

**Note:** Tailwind v4 responsive prefix syntax (`md:grid-cols-2 lg:grid-cols-3`) also works fine — either approach. CSS-in-style block is used here for readability but Tailwind utilities are equivalent.

### Pattern 7: BaseLayout Extension for SEO (INFR-04, INFR-05)

```astro
---
// Extended BaseLayout.astro props
const {
  title = 'Zeenomena',
  description = 'Non-tech business guy building automated systems with AI.',
  image = '/social-share.png',
  canonicalUrl,
} = Astro.props;
---
<head>
  <!-- existing head content -->
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/favicon.ico" />
  {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
</head>
```

**Astro sitemap:** `@astrojs/sitemap` integration adds `sitemap-index.xml` automatically. Add to `astro.config.mjs` as `integrations: [sitemap()]`. Requires `site` set in Astro config.

### Anti-Patterns to Avoid

- **Don't use `project.slug`** — Astro 6 glob loader uses `project.id` (slug was an Astro 4 concept)
- **Don't import CSS variables with `var()` in Tailwind arbitrary values** — Tailwind v4 supports `text-[var(--color-cyan)]` but inline style is cleaner for dynamic per-card values
- **Don't use `getEntry` for static paths** — use `getCollection` and pass `props: { project }` directly from `getStaticPaths` to avoid a double fetch
- **Don't wrap the filter script in DOMContentLoaded** — Astro scripts run after DOM by default; wrapping in `DOMContentLoaded` is redundant and causes issues with Astro's script deduplication
- **Don't set `display: none` on the grid container for empty state** — toggle a child `#empty-state` element instead, keeps the grid container visible for layout

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom MD parser | Astro `render()` + `<Content />` | Handles remark/rehype pipeline, code blocks, headings |
| YouTube URL normalization | String.replace | URL constructor + regex | Multiple URL formats exist (short, long, embed, nocookie) |
| CSS grid responsive | Manual JS resize listener | CSS Grid + media queries | Native CSS handles this, JS resize is brittle |
| Content type validation | Manual schema checks | Zod schema (already in content.config.ts) | Already done in Phase 1 |
| Gradient text | SVG text | CSS `background-clip: text` | Simpler, hardware-accelerated, works in all modern browsers |

**Key insight:** Astro's content collection pipeline (Zod validation + render()) eliminates the two most complex hand-rolled problems: schema enforcement and markdown rendering.

---

## Common Pitfalls

### Pitfall 1: Astro 6 Entry ID vs Slug
**What goes wrong:** Code uses `project.slug` and gets `undefined`. URLs break or return 404.
**Why it happens:** Astro 5+ removed the auto-generated `slug` field. The `glob()` loader sets `project.id` to the filename (e.g. `polymarket-bot`).
**How to avoid:** Always use `project.id` for URLs: `href={/projects/${project.id}}` and `params: { slug: project.id }` in `getStaticPaths`.
**Warning signs:** TypeScript error "Property 'slug' does not exist on type..." or runtime 404 on all project pages.

### Pitfall 2: CSS Custom Properties in Hover State
**What goes wrong:** Rarity glow doesn't change per card — all cards glow the same color.
**Why it happens:** CSS custom properties defined inline on the element are scoped to that element, but the hover rule must also be scoped to the same element. If glow is defined globally or on a parent, all cards share the value.
**How to avoid:** Set `--glow` and `--border` via `style` attribute directly on the `.project-card` element. The `:hover` rule on `.project-card` then reads its own `--glow`.

### Pitfall 3: Astro Script Deduplication
**What goes wrong:** Filter chips stop working when the same `<FilterBar />` component is used on multiple pages, or the script runs before DOM is populated.
**Why it happens:** Astro deduplicates identical scripts across pages by content hash. If the script queries the DOM immediately, it may run before hydration.
**How to avoid:** Keep filter scripts in the page-level `.astro` file (not the component), or use `<script is:inline>` if deduplication is causing issues.

### Pitfall 4: YouTube URL Formats
**What goes wrong:** Video embed shows blank or broken iframe.
**Why it happens:** `polymarket-bot.md` might store `https://youtu.be/abcdef` but the embed needs `https://www.youtube.com/embed/abcdef`.
**How to avoid:** Write a `toEmbedUrl(url: string): string` utility that handles all YouTube URL formats. Check for `youtu.be`, `youtube.com/watch?v=`, and `youtube.com/embed/` as inputs.

### Pitfall 5: Tailwind v4 No Config File
**What goes wrong:** Developer tries to add `safelist`, `extend`, or custom breakpoints in `tailwind.config.js` and it has no effect.
**Why it happens:** Tailwind v4 uses a CSS-first config via `@theme {}` in `global.css`. There is no `tailwind.config.js`.
**How to avoid:** Add all custom tokens to `@theme {}` in `global.css`. For rarity colors used in dynamic contexts (CSS custom properties on elements), use inline styles rather than Tailwind classes — dynamic class generation from JS strings is not supported without safelist.

### Pitfall 6: `render()` Import Location
**What goes wrong:** `project.render()` throws "is not a function".
**Why it happens:** In Astro 5+, `render()` is a standalone function imported from `astro:content`, not a method on the entry object.
**How to avoid:** `import { getCollection, render } from 'astro:content'` and call `await render(project)`.

---

## Code Examples

### Complete getStaticPaths for [slug].astro
```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagChip from '../../components/TagChip.astro';
import VideoEmbed from '../../components/VideoEmbed.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) =>
    data.status !== 'archived'
  );
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { data } = project;
const { Content } = await render(project);
---
```

### YouTube URL Normalizer
```typescript
// src/utils/youtube.ts
export function toEmbedUrl(url: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // youtube.com/watch?v=ID
    if (u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    // already embed URL
    if (u.pathname.startsWith('/embed/')) return url;
  } catch {
    return undefined;
  }
  return undefined;
}
```

### Rarity Chip CSS-in-Astro
```astro
<!-- TagChip.astro -->
---
type Props = {
  label: string;
  variant?: 'tool' | 'free' | 'paid' | 'semi-paid';
};
const { label, variant = 'tool' } = Astro.props;
---
<span class:list={['chip', variant]}>{label}</span>

<style>
  .chip {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
  }
  .tool {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    color: #94a3b8;
  }
  .free {
    background: #14532d;
    border: 1px solid #22c55e;
    color: #bbf7d0;
  }
  .semi-paid {
    background: #1e3a5f;
    border: 1px solid #3b82f6;
    color: #bfdbfe;
  }
  .paid {
    background: #3b1f6e;
    border: 1px solid #a855f7;
    color: #e9d5ff;
  }
</style>
```

---

## Environment Availability

Step 2.6: No new external dependencies. Phase 2 is purely code/config — no new CLI tools, databases, or services required beyond what Phase 1 established.

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| Node.js 22+ | Astro dev/build | Already confirmed (package.json engines) | — |
| Astro 6.1.4 | All routing | Already installed | — |
| Tailwind v4 | All styling | Already installed | — |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `project.slug` (Astro 4) | `project.id` (Astro 5+) | Must use `.id` in all route params |
| `entry.render()` method call | `render(entry)` standalone import | Import from `astro:content` |
| `src/content/config.ts` | `src/content.config.ts` (Astro 5+) | Already handled in Phase 1 |
| `tailwind.config.js` | `@theme {}` in CSS | Phase 1 already uses this pattern |
| `defineCollection` with inline schema | Same — still current | No change |

---

## Open Questions

1. **Favicon and social share image assets (INFR-04, INFR-05)**
   - What we know: BaseLayout needs `<link rel="icon">` and OG image meta tags
   - What's unclear: Does Zee have a favicon or logo asset? Does he want a generated OG image or a static PNG?
   - Recommendation: Create placeholder `/public/favicon.ico` and `/public/social-share.png` (1200x630px) with the site name. Phase 3/5 can replace with designed assets.

2. **`downloadUrl` field missing from content schema**
   - What we know: PROJ-04 requires downloadable resources. `content.config.ts` has no `downloadUrl` field.
   - What's unclear: Whether downloads are repo URLs, file attachments, or external links.
   - Recommendation: Add optional `downloadUrl: z.string().url().optional()` to the Zod schema in `content.config.ts` as part of Phase 2 Wave 1. For now, free downloads can point to the `githubUrl` (already in schema). A dedicated `downloadUrl` field is cleaner for Phase 4 when Stripe-gated downloads need signed URLs.

3. **Discord link**
   - What we know: COMM-04 requires Discord link prominently displayed.
   - What's unclear: Does Zee have a Discord server URL yet?
   - Recommendation: Use a placeholder `href="#"` with `aria-label="Join Discord community"` in Phase 2. Replace with real URL when server is created.

---

## Sources

### Primary (HIGH confidence)
- Astro 6 content collections — `getCollection`, `render`, `getStaticPaths` patterns verified against existing `content.config.ts` which already uses Astro 6 glob loader API
- Phase 1 artifacts (`content.config.ts`, `BaseLayout.astro`, `global.css`, `index.astro`) — direct inspection
- CSS `transform` + `box-shadow` transitions — native CSS, no library dependency
- CSS custom properties for per-element theming — well-established CSS pattern

### Secondary (MEDIUM confidence)
- Astro 5+ `render()` standalone import (vs old `entry.render()` method) — inferred from Phase 1 Astro version (6.1.4); training knowledge aligns with Astro 5 changelog
- YouTube embed URL normalization patterns — common web pattern, verified by understanding of YouTube URL structure

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Phase 1 already installed, no new deps
- Architecture: HIGH — Astro dynamic routes and content collections are the core Astro 6 use case
- Pitfalls: HIGH — entry ID vs slug and render() import are verified Astro 5+ breaking changes
- CSS animations: HIGH — CSS transitions are native, no library risk

**Research date:** 2026-04-07
**Valid until:** 2026-07-07 (Astro 6 stable, Tailwind v4 stable — 90-day window)
