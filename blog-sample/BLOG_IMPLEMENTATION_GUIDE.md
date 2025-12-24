# Blog Redesign Implementation Guide

## Overview

This document contains everything needed to implement a redesigned blog index and blog post layout for Jorge's personal Astro site. The design direction was developed through a collaborative design process, and these are the final specifications.

---

## Design System Reference

The site uses these existing design tokens — **do not change these**, just reference them:

```css
--color-primary: #2D6A4F;        /* Forest green - accent color */
--color-primary-light: #40916C;  /* Lighter green for hover states */
--color-bg: #FAF8F2;             /* Cream background */
--color-bg-warm: #F0EBE3;        /* Warmer cream for subtle highlights */
--color-text: #1a1a1a;           /* Primary text */
--color-text-muted: #6b6b6b;     /* Secondary text */
--color-text-light: #999;        /* Tertiary text (dates, meta) */
--color-border: #e0ddd5;         /* Borders and dividers */

--font-serif: 'Instrument Serif', Georgia, serif;  /* Headings, titles */
--font-sans: 'Source Sans 3', -apple-system, sans-serif;  /* Body text */
```

---

## Part 1: Blog Index Page

### File to modify
`src/pages/blog/index.astro`

### Design concept
"Compact List with Warm Hover" — A dense, confident list of posts where the latest post gets slightly elevated treatment with a summary. Hover states add warmth and interactivity with a green left-accent bar and subtle gradient background.

### Structure

```
┌─────────────────────────────────────────┐
│ Blog (section label)                    │
│ Thoughts and musings (h1)               │
│ Subtitle text...                        │
├─────────────────────────────────────────┤
│ LATEST (label)                          │
│ Post Title (larger, serif)              │
│ December 20, 2025                       │
│ Summary blurb from frontmatter...       │
├─────────────────────────────────────────┤
│ Dec 15, 2025    Post title here         │
│ Dec 8, 2025     Another post title      │
│ Nov 29, 2025    Yet another title       │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Key specifications

**Container:**
- Max-width: 700px (matches existing site content width)

**Header:**
- Section label: "Blog" in small caps, primary green, 0.8rem, uppercase, letter-spaced
- H1: Instrument Serif, 2.5rem, normal weight
- Subtitle: Source Sans 3, 1.1rem, muted color

**Featured "Latest" post:**
- Label: "LATEST" in tiny uppercase (0.7rem), primary green, letter-spaced
- Title: Instrument Serif, 1.5rem
- Date: Source Sans 3, 0.85rem, light color
- Summary: Source Sans 3, 0.95rem, muted color — pulled from the post's `description` frontmatter field
- Separated from list below with a bottom border
- Hover state: subtle gradient background (rgba of primary color at 0.04 opacity) + 3px green left border that fades in

**Post list:**
- Each row: Date on left (fixed ~110px width), title on right
- Date: Source Sans 3, 0.85rem, light color (e.g., "Dec 15, 2025")
- Title: Instrument Serif, 1.2rem
- Vertical padding: ~0.85rem per row (dense but not cramped)
- Hover state: same as featured post (gradient + left accent bar)

**Responsive (mobile ≤600px):**
- Stack date above title instead of side-by-side
- Reduce title size slightly

### Hover interaction CSS

```css
.post-item {
  position: relative;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  padding: 0.85rem 1.5rem;
  transition: all 0.2s ease;
}

.post-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.post-item:hover {
  background: linear-gradient(to right, rgba(45, 106, 79, 0.04), transparent);
}

.post-item:hover::before {
  opacity: 1;
}

.post-item:hover .post-title {
  color: var(--color-primary);
}
```

### Astro implementation notes

1. Query all blog posts and sort by date descending
2. Separate the first (latest) post from the rest
3. Render the latest post in the "featured" section with its `description` from frontmatter
4. Render remaining posts in the compact list format
5. Format dates nicely (e.g., "Dec 15, 2025" for list, "December 15, 2025" for featured)

---

## Part 2: Blog Post Layout

### File to modify
`src/layouts/BlogPost.astro`

### Design concept
Clean, readable single-column layout optimized for short-to-medium essays. Prominent blockquotes, clean image captions, and support for embedded videos.

### Key specifications

**Container:**
- Max-width: 600px (narrower than index for better readability)
- Generous padding (4rem vertical on desktop, 2rem on mobile)

**Post header:**
- "Back to blog" link at top with left arrow icon, muted color, hover to primary
- H1: Instrument Serif, 2.5rem, normal weight, line-height 1.2
- Date: Source Sans 3, 0.9rem, light color

**Body text:**
- Font: Source Sans 3, 1.1rem, line-height 1.75
- Paragraph margin-bottom: 1.5rem
- Links: Primary green with underline, underline-offset 2px

**Headings in content:**
- H2: Instrument Serif, 1.6rem, margin-top 2.5rem
- H3: Instrument Serif, 1.3rem, margin-top 2rem

**Blockquotes (prominent style):**
- Left border: 4px solid primary green
- Background: subtle gradient (primary color at 0.04 opacity fading to transparent)
- Padding: 1.5rem top/bottom, 1.75rem left
- Quote text: Instrument Serif, 1.35rem, italic
- Attribution: Source Sans 3, 0.9rem, muted, prefixed with "— "
- Vertical margin: 2.5rem

**Images with captions:**
- Use `<figure>` and `<figcaption>` elements
- Image: full width, border-radius 4px
- Caption: Source Sans 3, 0.85rem, muted color, margin-top 0.75rem
- Figure margin: 2.5rem vertical

**Embedded videos:**
- Responsive 16:9 container using padding-bottom trick
- Border-radius 4px
- Caption below in same style as image captions

**Post footer:**
- Top border (1px, border color)
- "Back to blog" link with arrow
- Margin-top: 4rem, padding-top: 2rem

### Responsive (mobile ≤600px)
- H1: 2rem
- Body text: 1rem
- Blockquote text: 1.15rem
- Tighter padding throughout

### Markdown rendering notes

Astro will render markdown content automatically. The CSS should target:
- `.post-content p`
- `.post-content h2`, `.post-content h3`
- `.post-content blockquote`
- `.post-content figure`, `.post-content figcaption`
- `.post-content img`
- `.post-content a`
- `.post-content ul`, `.post-content ol`, `.post-content li`
- `.post-content strong`, `.post-content em`

For videos, the user will need to manually wrap YouTube embeds in a div with class `video-embed`. Example in markdown:

```html
<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Video title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<p class="video-caption">Caption text here.</p>
```

---

## Part 3: CSS Organization

### Recommendation
Add all new blog-specific styles to `public/styles.css` in a clearly commented section:

```css
/* ========================================
   BLOG STYLES
   ======================================== */

/* Blog Index */
/* ... */

/* Blog Post */
/* ... */
```

Alternatively, you can use Astro's scoped `<style>` tags within each component, but since the site already uses a global stylesheet, staying consistent is probably cleaner.

---

## Part 4: Files Reference

Two HTML mockup files were created during the design process. These show the exact visual implementation and can be opened in a browser for reference:

1. **blog-concept-combined.html** — The blog index page mockup
2. **blog-post-mockup.html** — The blog post page mockup

Use these as the source of truth for styling details. The CSS in these files can be adapted directly into the Astro implementation.

---

## Summary Checklist

- [ ] Update `src/pages/blog/index.astro` with new markup and structure
- [ ] Update `src/layouts/BlogPost.astro` with new post layout
- [ ] Add blog CSS to `public/styles.css` (or scope within components)
- [ ] Test featured post pulls `description` from frontmatter correctly
- [ ] Test hover states on index page
- [ ] Test blockquote, image/caption, and video embed rendering on post page
- [ ] Test responsive behavior at ≤600px breakpoint
- [ ] Verify all colors/fonts match existing design system

---

## Questions?

If anything is unclear, reference the HTML mockup files first — they represent the approved design direction. The visual output should match those mockups exactly.
