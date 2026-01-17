# Architecture Documentation

This document provides detailed architectural patterns and design decisions for the jmiralva.me portfolio website. For quick task recipes and development workflow, see [CLAUDE.md](../CLAUDE.md).

---

## Overview

This is an Astro-based static site generator project that emphasizes:
- **Component reusability** - Shared layouts and reusable components eliminate duplication
- **Data-driven pages** - Projects and testimonials defined as data, not HTML
- **Performance** - Optimized images, inline scripts, lazy loading
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
- Favicons and font preloading
- SEO enhancements (structured data slot, article meta tags)

**Navigation bar**:
- Fixed top navigation with logo and page links
- Scroll-based shadow effect
- Responsive design

**Footer**:
- Social media links (email, LinkedIn, Twitter, Instagram, Bandcamp, Goodreads, Apple Music)
- Copyright notice

**Script slots**:
- Common scripts (nav scroll shadow) run on all pages
- Named `scripts` slot for page-specific JavaScript

**Why this matters**: Eliminates previous duplication where nav/footer HTML was copied across pages. Now a single edit to `BaseLayout.astro` updates all pages.

---

### Reusable Components

The site uses component-based architecture for repeated UI patterns:

**ProjectCard.astro**:
- Props: `title`, `description`, `url`, `image`, `altText`, `techStack`
- Displays project screenshot, title, description, and tech details
- Clickable card opens project in new tab

**TestimonialCard.astro**:
- Props: `quote`, `name`, `nameUrl`, `role`, `className`
- Displays testimonial quote with author attribution
- Linked author names for LinkedIn profiles

**Benefits**:
- Add new projects/testimonials by just adding data objects
- Consistent styling and behavior across all instances
- Easy to modify all cards by editing one component

---

### Data-Driven Pages

Projects and testimonials follow a data-driven pattern:

**Projects** (`src/pages/projects.astro`):
```javascript
const projects = [
  {
    title: 'Project Name',
    description: 'What it does',
    url: 'https://...',
    image: importedImg,
    altText: 'Descriptive alt text',
    techStack: 'How it was built'
  },
  // ... more projects
];
```

**Testimonials** (`src/pages/testimonials.astro`):
```javascript
const testimonials = [
  {
    quote: "Testimonial text",
    name: "Person Name",
    nameUrl: "https://...",
    role: "Title, Company",
    className: "testimonial-1"
  },
  // ... more testimonials
];
```

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

JavaScript is organized for optimal performance and maintainability:

**Common scripts** (in `BaseLayout.astro`):
- Navigation scroll shadow effect
- Runs on every page
- Inlined with `is:inline` attribute

**Page-specific scripts** (in individual pages):
- Testimonials/Projects: Fade-in animations with IntersectionObserver
- Project cards: Click handling to open in new tab
- Blog: None (static content)
- Uses named `scripts` slot in BaseLayout

**Why inline scripts**:
- Avoids bundling overhead
- Faster page loads (no extra HTTP request)
- Appropriate for small scripts
- Uses `is:inline` directive to prevent Astro processing

**Client-side features**:
- Smooth scrolling for anchor links
- Intersection Observer for fade-in animations
- Dynamic navigation shadow based on scroll position
- Project card click handling (respects inner links)

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
- Layout provides: Header with back link, formatted date, article wrapper, footer
- BlogPost layout passes SEO data to BaseLayout (canonical URL, OG images, article meta tags, BlogPosting schema)

**Blog index** (`src/pages/blog/index.astro`):
- Fetches all posts with `getCollection('blog')`
- Sorts by date (newest first)
- Displays as list with links

**SEO enhancements**:
- Each post has unique canonical URL
- BlogPosting structured data (schema.org)
- Article-specific Open Graph tags
- RSS feed at `/rss.xml`

---

### Design System

The site uses a cohesive design system defined primarily in `public/styles.css`:

**Color Palette**:
- Primary accent: Forest green `#2D6A4F`
- Backgrounds: Cream/beige tones (`#FAF8F2`, `#F0EBE3`)
- Text: Dark gray/black for readability
- Links: Primary accent color with hover states

**Typography**:
- Headings: Instrument Serif (serif, elegant)
- Body text: Source Sans 3 (sans-serif, readable)
- Font loading: Preconnected Google Fonts for performance

**Spacing**:
- Consistent spacing scale using CSS custom properties
- Generous whitespace for readability
- Responsive spacing adjustments at breakpoints

**Layout**:
- Fixed navigation bar (always visible)
- Max-width content containers (prevents overly wide text)
- Centered layouts with padding
- Grid layouts for projects and testimonials

**Component styling**:
- Global styles in `public/styles.css`
- Component-specific styles use `<style>` tags in `.astro` files
- CSS scoped to components automatically by Astro

---

### Responsive Design

The site is fully responsive with a mobile-first approach:

**Breakpoints**:
- **968px**: Tablet/desktop transition
  - Hero layout: Side-by-side → stacked
  - Testimonials grid: 3 columns → 2 columns
  - Navigation: Full links visible

- **600px**: Mobile
  - Further spacing reduction
  - Smaller font sizes
  - Single-column layouts
  - Testimonials grid: 2 columns → 1 column

**Responsive techniques**:
- CSS media queries in `styles.css`
- Flexible grid layouts (`display: grid`)
- Relative units (rem, %, vh/vw)
- Mobile-friendly touch targets

**Images**:
- Astro Image component handles responsive srcsets automatically
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
- Inline critical scripts (no extra HTTP requests)
- Preconnected external domains (Google Fonts)
- Minimal JavaScript (only what's needed)

**Deployment**:
- Netlify edge network (global CDN)
- Automatic cache invalidation on deploy
- HTTPS enforced

---

## Development Patterns

**File organization**:
- Pages in `src/pages/` (auto-routed)
- Reusable components in `src/components/`
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
