# Architecture Documentation

This document provides detailed architectural patterns and design decisions for the jmiralva.me portfolio website. For quick task recipes and development workflow, see [CLAUDE.md](../CLAUDE.md).

---

## Overview

This is an Astro-based static site generator project that emphasizes:
- **Component reusability** - Shared layouts and reusable components eliminate duplication
- **Data-driven pages** - Projects and testimonials defined as data, not HTML
- **Performance** - Optimized images, minimal JavaScript, lazy loading
- **Type safety** - Content collections for blog posts
- **Developer experience** - File-based routing, hot reloading, clear patterns

---

## Key Architecture Patterns

### Astro Pages and Routing

Astro uses file-based routing in the `src/pages/` directory. Each `.astro` file automatically becomes a route:

**Static routes**:
- `index.astro` → `/`
- `about.astro` → `/about`
- `projects.astro` → `/projects`
- `testimonials.astro` → `/testimonials`
- `blog/index.astro` → `/blog`

**Dynamic routes**:
- `blog/[...slug].astro` → `/blog/{slug}` (catch-all for blog posts)

The dynamic route uses Astro's content collections to generate pages for each markdown file in `src/content/blog/`.

---

### Shared Layout Component

All pages use `BaseLayout.astro` (`src/layouts/BaseLayout.astro`) which provides:

**HTML document structure**:
- `<head>` with meta tags (title, description, canonical URL)
- Open Graph and Twitter Card tags for social sharing
- Favicons and Google Fonts (Bricolage Grotesque, Newsreader)
- SEO enhancements (structured data slot, article meta tags)

**Navigation bar**:
- "jmiralva" wordmark (links home) and page links
- The current page's link is underlined and marked with `aria-current`
- A "Skip to content" link appears first for keyboard users
- Every page's content is wrapped in `<main id="main">` by the layout, so pages don't add their own `<main>`

**Footer**:
- Printed in riso blue with a thin pink stripe on top
- Eight social links with inline SVG icons, read from `src/data/social.ts`
- Copyright year is generated at build time

**Script slots**:
- Named `scripts` slot for page-specific JavaScript (currently unused)

**Why this matters**: A single edit to `BaseLayout.astro` updates all pages.

---

### Reusable Components

The site uses component-based architecture for repeated UI patterns:

**ProjectCrate.astro** (home page):
- Props: `projects`
- Shows side projects as record sleeves in a crate; the names of the sleeves behind peek over the top
- Previous/Next buttons, click a peeking sleeve to jump to it, swipe on phones
- Has its own scoped styles and script; respects reduced motion and announces the current project to screen readers

**ProjectCard.astro** (/projects):
- Props: the `Project` fields (`title`, `description`, `url`, `image`, `altText`, `techStack`)
- One row per project: screenshot in an ink frame on a blue dot tint, title linking to the project, description, and "How it's built"

**TestimonialCard.astro**:
- Props: the `Testimonial` fields plus `variant` (`'lead'` for the big opening quote, `'standard'` otherwise)
- Quote with the author's name (linked to LinkedIn) and role

**PostList.astro**:
- Props: `posts`
- Dated list of blog posts, used on the home page and the blog index

**Benefits**:
- Add new projects/testimonials by just adding data objects
- Consistent styling and behavior across all instances
- Easy to modify all cards by editing one component

---

### Data-Driven Pages

Content that appears on more than one page lives in `src/data/`, so every page reads from one source:

**Projects** (`src/data/projects.ts`), newest first:
```typescript
{
  title: 'Project Name',
  summary: 'One plain-text sentence for the home page',
  description: 'Full description (may contain HTML links)',
  url: 'https://...',
  image: importedImg,
  altText: 'Descriptive alt text',
  techStack: 'How it was built (may contain HTML links)'
}
```

**Testimonials** (`src/data/testimonials.ts`):
```typescript
{
  quote: "Full testimonial text",
  snippet: "Optional shorter excerpt for the home page",
  name: "Person Name",
  nameUrl: "https://...",
  role: "Title, Company"
}
```
- `leadTestimonialName` picks the big opening quote on /testimonials
- `homeFeaturedNames` picks the snippets on the home page (a misspelled name fails the build with a clear message)

**Social links** (`src/data/social.ts`): label, URL and Font Awesome icon path for each footer link.

**Why this pattern**:
- No HTML duplication - data is mapped to components
- Type-safe with TypeScript interfaces
- Easy to add/modify/remove items
- Keeps content separate from presentation

---

### Image Optimization

Astro provides automatic image optimization for images in `src/assets/`:

**Features**:
- **Format conversion**: JPEG/PNG → WebP (90%+ file size reduction)
- **Responsive sizing**: Resized to specified dimensions
- **Lazy loading**: Modern `loading="lazy"` and `decoding="async"` attributes
- **Cache busting**: Content-hashed filenames
- **Type safety**: TypeScript types for imported images

**Usage pattern**:
```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my-image.jpg';
---

<Image src={myImage} alt="Description" width={800} height={600} />
```

**Important distinction**:
- `src/assets/` - Processed and optimized by Astro
- `public/` - Copied as-is without optimization

**When to use which**:
- Use `src/assets/` for: Photos, project screenshots, any large images
- Use `public/` for: Favicons, files that must have exact URLs, already-optimized assets

---

### JavaScript Organization

The site ships very little JavaScript:

- **Home page project crate** (`ProjectCrate.astro`): the only interactive script. It's a regular Astro `<script>`, so Astro bundles it as a small module.
- **Everything else** is static HTML and CSS. The hero's "settle" animation on page load is pure CSS.

**Motion rules** (from the redesign):
- One orchestrated moment: the pink layers settling on the home page hero
- Hover/focus states and the crate respond only to the visitor's own actions
- No scroll-triggered fade-ins, draggable cards or magnetic buttons
- Everything respects `prefers-reduced-motion`

---

### Blog System

Blog posts use Astro's content collections for type safety and organization:

**Content collection** (`src/content/config.ts`):
```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});
```

**Markdown frontmatter** (in `src/content/blog/*.md`):
```markdown
---
title: 'Post Title'
description: 'Brief description for SEO'
pubDate: 2025-01-17
heroImage: '/path/to/image.jpg'  # optional
---

Post content in markdown...
```

**Rendering**:
- Posts use `BlogPost.astro` layout
- Layout provides: Header with back link, title, formatted date, article text in Newsreader (lines kept under ~75 characters), footer
- BlogPost layout passes SEO data to BaseLayout (canonical URL, OG images, article meta tags, BlogPosting schema)

**Helpers** (`src/utils/posts.ts`):
- `getSortedPosts()`: all posts, newest first
- `formatDate()`: formats dates in UTC, so a build on a US-time-zone laptop shows the same date as Netlify's build

**Blog index** (`src/pages/blog/index.astro`):
- Posts grouped by year, newest first, each group using `PostList`

**SEO enhancements**:
- Each post has unique canonical URL
- BlogPosting structured data (schema.org)
- Article-specific Open Graph tags
- RSS feed at `/rss.xml`

---

### Design System

The site looks like it was printed on a small two-color risograph press. Tokens live at the top of `public/styles.css`.

**Colors**:

| Token | Hex | Used for |
|---|---|---|
| `--paper` | `#FBFBF8` | Page background (cool white, not cream) |
| `--ink` | `#1E2735` | Body text, headings, the hero name (14.5:1) |
| `--ink-soft` | `#435060` | Secondary text, dates, captions (~8:1) |
| `--blue` | `#0078BF` | Links, the photo's blue ink, footer (4.6:1) |
| `--pink` | `#FF48B0` | Decoration only. **Never used for text** (3:1) |
| `--rule` | `#C9D3DD` | Thin dividers |

- Where pink and blue overlap, `mix-blend-mode: multiply` makes them print purple/navy like real riso overprint
- Don't add green or a cream background

**Typography**:
- Display: Bricolage Grotesque (variable width and weight), for the name, headings, nav and labels
- Body: Newsreader (variable optical size, weights 400 to 700, italic), ~19px desktop / 17px small phones
- Both from Google Fonts; no icon font (social icons are inline SVGs)

**Signature details**:
- Home hero: two-ink photo (blue photo layer + offset pink halftone), a pink record peeking out, and the name in dark ink with a paper-colored outline and an offset pink "ghost"
- Inner page titles carry a smaller pink ghost
- Thin ink rules (`1.5px solid var(--ink)`) separate sections; `--rule` for lighter dividers
- Subtle paper grain over the whole page (`body::after`)
- No rounded cards, drop shadows or gradient washes
- Avoid generic template details: no tracked-out ALL-CAPS labels, no "A · B · C" strings, no arrows appended to links, no monospace labels

**Copy**:
- Plain headings (About, Projects, Testimonials, Blog/Writing); no record-sleeve wording in the copy. The music nod lives in the visuals.

**Component styling**:
- Global styles in `public/styles.css`
- Component-specific styles use `<style>` tags in `.astro` files (e.g. `ProjectCrate.astro`)
- CSS scoped to components automatically by Astro

---

### Responsive Design

**Breakpoints**:
- **860px**: two-column layouts stack. The hero stacks as photo, name, intro, then credit line.
- **520px**: small phones. Body text drops to 17px and the nav stacks the wordmark above the links.

**Responsive techniques**:
- CSS media queries in `styles.css`
- Fluid type and spacing with `clamp()`
- Container query units inside the crate's sleeves so their labels scale with the sleeve
- Tested from 375px phones to wide desktop with no horizontal scrolling

**Images**:
- Astro Image component generates responsive srcsets
- WebP format for smaller file sizes on all devices
- Lazy loading for below-the-fold images

---

## SEO Architecture

**Sitemap**:
- Auto-generated by `@astrojs/sitemap` integration
- Available at `/sitemap-index.xml`
- Includes all static and dynamic routes

**Structured Data**:
- Person schema on homepage (establishes identity)
- BlogPosting schema on all blog posts (rich results)

**Meta Tags**:
- Unique title and description per page
- Canonical URLs for all pages
- Open Graph tags for social sharing
- Twitter Card tags
- Article-specific meta (published/modified times)

**robots.txt**:
- Located at `/robots.txt`
- Allows all crawlers
- Points to sitemap

**RSS Feed**:
- Available at `/rss.xml`
- Generated by `@astrojs/rss`
- Includes all blog posts sorted by date

---

## Performance Strategy

**Build-time optimizations**:
- Static site generation (no server-side rendering)
- Image optimization to WebP
- CSS/JS bundling and minification
- HTML pre-rendering

**Runtime optimizations**:
- Lazy loading for images
- Preconnected external domains (Google Fonts)
- Minimal JavaScript (only the home page project crate)

**Deployment**:
- Netlify edge network (global CDN)
- Automatic cache invalidation on deploy
- HTTPS enforced

---

## Development Patterns

**File organization**:
- Pages in `src/pages/` (auto-routed)
- Reusable components in `src/components/`
- Shared data (projects, testimonials, social links) in `src/data/`
- Helpers (blog post sorting and dates) in `src/utils/`
- Layouts in `src/layouts/`
- Blog content in `src/content/blog/`
- Optimized images in `src/assets/`
- Static files in `public/`

**Git workflow**:
- Single `main` branch
- Clean, descriptive commits
- Co-authored with Claude Code when appropriate
- Automatic Netlify deploys on push

**Dependencies**:
- Managed via npm
- Lock file committed for reproducibility
- Astro framework and official integrations
- Minimal third-party dependencies

---

## Testing & Validation

**SEO Testing**:
- Google Search Console (sitemap submission)
- Schema validator (https://validator.schema.org/)
- Facebook Sharing Debugger
- Twitter Card Validator
- Lighthouse SEO audit

**Build Validation**:
- `npm run build` - Ensures clean production build
- `npm run preview` - Test production build locally
- Check for TypeScript errors
- Verify image optimization

**Browser Testing**:
- Mobile responsiveness (Chrome DevTools)
- Cross-browser compatibility
- Accessibility (Lighthouse, WAVE)
