# SEO Improvements Todo

This document outlines SEO improvements to implement for jmiralva.me to improve search engine visibility and social sharing.

---

## High Priority (Quick Wins)

### 1. Add Sitemap Support
**Impact**: High - Helps search engines discover all pages
**Effort**: Low - Astro has a built-in integration

**Steps:**
```bash
npm install @astrojs/sitemap
```

Then update `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jmiralva.me',
  integrations: [sitemap()],
});
```

This automatically generates `/sitemap.xml` with all pages.

---

### 2. Fix Blog Post Meta Tags
**Impact**: High - Proper social sharing and SEO for each post
**Effort**: Medium

**Current Issue:**
- Blog posts don't pass custom `ogImage` or `canonicalURL` to BaseLayout
- Each post should have its own canonical URL and OG image

**Solution:**
Update `src/layouts/BlogPost.astro` to pass proper meta tags:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
}

const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
const canonicalURL = `https://jmiralva.me/blog/${Astro.url.pathname.split('/').pop()}`;
const ogImage = heroImage || 'https://jmiralva.me/assets/headshot.jpg';

// ... rest of component
---

<BaseLayout
  title={`${title} | Jorge Mir Alvarez`}
  description={description}
  canonicalURL={canonicalURL}
  ogImage={ogImage}
>
  <!-- content -->
</BaseLayout>
```

Also add article-specific Open Graph tags in BaseLayout for blog posts.

---

### 3. Add Structured Data (JSON-LD)
**Impact**: High - Google rich results, better search appearance
**Effort**: Medium

**What to add:**

**A. Person Schema (Homepage)**
Add to `src/pages/index.astro`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jorge Mir Alvarez",
  "url": "https://jmiralva.me",
  "jobTitle": "Product Manager",
  "description": "Product manager based in Chicago, specializing in customer research and building great products",
  "sameAs": [
    "https://www.linkedin.com/in/jmiralva/",
    "https://twitter.com/jmiralva",
    "https://www.instagram.com/jmiralva/"
  ]
}
</script>
```

**B. BlogPosting Schema (Blog Posts)**
Add to `src/layouts/BlogPost.astro`:
```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "image": ogImage,
  "datePublished": pubDate.toISOString(),
  "dateModified": (updatedDate || pubDate).toISOString(),
  "author": {
    "@type": "Person",
    "name": "Jorge Mir Alvarez",
    "url": "https://jmiralva.me"
  },
  "publisher": {
    "@type": "Person",
    "name": "Jorge Mir Alvarez"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": canonicalURL
  }
})} />
```

---

## Medium Priority

### 4. Add robots.txt
**Impact**: Medium - Guides search engine crawlers
**Effort**: Low

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://jmiralva.me/sitemap.xml
```

---

### 5. Add Article Meta Tags for Blog Posts
**Impact**: Medium - Better social sharing on Facebook/LinkedIn
**Effort**: Low

Update `BaseLayout.astro` to support article-specific OG tags:

```astro
---
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalURL?: string;
  ogType?: 'website' | 'article';
  publishedTime?: Date;
  modifiedTime?: Date;
}

const {
  // ... existing props
  ogType = 'website',
  publishedTime,
  modifiedTime
} = Astro.props;
---

<head>
  <!-- ... existing meta tags ... -->

  <meta property="og:type" content={ogType}>

  {ogType === 'article' && publishedTime && (
    <meta property="article:published_time" content={publishedTime.toISOString()}>
  )}
  {ogType === 'article' && modifiedTime && (
    <meta property="article:modified_time" content={modifiedTime.toISOString()}>
  )}
  {ogType === 'article' && (
    <meta property="article:author" content="Jorge Mir Alvarez">
  )}
</head>
```

Then update BlogPost.astro to pass these:
```astro
<BaseLayout
  ogType="article"
  publishedTime={pubDate}
  modifiedTime={updatedDate}
  {...otherProps}
>
```

---

### 6. Optimize Image Alt Text
**Impact**: Medium - Accessibility and image SEO
**Effort**: Low

**Action Items:**
- Review all blog posts and ensure images have descriptive alt text
- Update project images in `projects.astro` to have meaningful alt text
- Avoid generic alt text like "image" or "photo"

Example:
```astro
<!-- Bad -->
<img src="..." alt="app screenshot">

<!-- Good -->
<img src="..." alt="Wanderlust travel app showing personalized destination recommendations">
```

---

## Low Priority (Nice to Have)

### 7. Add Reading Time to Blog Posts
**Impact**: Low - User experience improvement
**Effort**: Low

Could add a `readingTime` field to frontmatter or calculate it automatically from word count.

---

### 8. Add RSS Feed
**Impact**: Low - For RSS subscribers
**Effort**: Low

Astro has a built-in RSS integration:
```bash
npm install @astrojs/rss
```

Create `src/pages/rss.xml.js` following Astro docs.

---

### 9. Performance Optimizations
**Current Status**: Already excellent due to Astro static generation + image optimization

**Additional optimizations:**
- Add `rel="preconnect"` for external domains (already done for Google Fonts)
- Consider adding `loading="lazy"` to below-fold images (Astro Image does this automatically)
- Consider adding a service worker for offline support (overkill for this site)

---

## Current SEO Strengths

✅ Proper meta tags (title, description, canonical)
✅ Open Graph tags for social sharing
✅ Twitter Card tags
✅ Semantic HTML with proper heading hierarchy
✅ Mobile responsive (viewport meta tag)
✅ Fast load times (static generation + image optimization)
✅ HTTPS (via Netlify)
✅ Proper URL structure (clean, readable URLs)

---

## Implementation Priority Order

1. **Sitemap** (5 min) - Biggest bang for buck
2. **Structured data for blog posts** (30 min) - High SEO impact
3. **Fix blog post meta tags** (20 min) - Important for social sharing
4. **robots.txt** (2 min) - Quick win
5. **Person schema on homepage** (10 min) - Establishes your presence
6. **Article meta tags** (15 min) - Enhances blog SEO
7. **Review image alt text** (30 min) - Accessibility + SEO
8. **RSS feed** (optional, 20 min)

**Total estimated time**: ~2 hours for all high and medium priority items

---

## Testing After Implementation

1. **Google Search Console**: Submit sitemap, check for crawl errors
2. **Structured Data Testing Tool**: https://validator.schema.org/
3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **Lighthouse**: Run audit in Chrome DevTools (should score 95+ in SEO)
6. **PageSpeed Insights**: https://pagespeed.web.dev/

---

## Notes

- All changes maintain the current design and don't affect visual appearance
- Focus on technical SEO improvements, not content changes
- Astro's static generation already gives excellent Core Web Vitals scores
- These improvements help search engines understand and index your content better
