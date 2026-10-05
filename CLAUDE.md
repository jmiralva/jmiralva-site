# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Common Tasks** (in this file):
- [Writing blog posts](#writing-blog-posts)
- [Adding a project](#adding-a-new-project)
- [Adding a testimonial](#adding-a-new-testimonial)
- [Updating navigation](#updating-navigation)
- [Adding optimized images](#adding-optimized-images)
- [Local development](#local-development)

**Architecture Details** (separate file):
- [Design system](context/ARCHITECTURE.md#design-system)
- [Component patterns](context/ARCHITECTURE.md#reusable-components)
- [Blog system architecture](context/ARCHITECTURE.md#blog-system)
- [Responsive design](context/ARCHITECTURE.md#responsive-design)
- [JavaScript organization](context/ARCHITECTURE.md#javascript-organization)

---

## Project Overview

This is a personal portfolio website for Jorge Mir Alvarez, a product manager based in Chicago. The site is deployed on Netlify and includes pages for home, about, projects, testimonials, and a blog.

## Tech Stack

- **Framework**: Astro 5.16+ (static site generator)
- **Content**: Markdown for blog posts, Astro components for pages
- **Styling**: Custom CSS with CSS variables, responsive design using media queries. Riso two-ink print look (see [Design system](context/ARCHITECTURE.md#design-system))
- **Fonts**: Google Fonts (Bricolage Grotesque for display, Newsreader for body text)
- **Icons**: Font Awesome Free icons embedded as inline SVGs in `src/data/social.ts` (no icon font loaded)
- **Deployment**: Netlify (configured via `netlify.toml`)
- **Build**: Node.js (npm) with Astro CLI

## Site Structure

```
/
├── src/
│   ├── pages/              # Astro pages (generate routes)
│   │   ├── index.astro     # Home page (hero, project crate, testimonial snippets, recent posts)
│   │   ├── about.astro     # About page
│   │   ├── projects.astro  # Projects page (data-driven)
│   │   ├── testimonials.astro  # Testimonials page (data-driven)
│   │   ├── rss.xml.js      # RSS feed
│   │   └── blog/
│   │       ├── index.astro         # Blog index/listing
│   │       └── [...slug].astro     # Dynamic blog post route
│   ├── components/         # Reusable components
│   │   ├── ProjectCrate.astro      # Home page project "record crate" flipper
│   │   ├── ProjectCard.astro       # Project row on /projects
│   │   ├── TestimonialCard.astro   # Testimonial quote
│   │   └── PostList.astro          # Dated list of blog posts
│   ├── data/               # Shared content used by several pages
│   │   ├── projects.ts     # Side projects
│   │   ├── testimonials.ts # Testimonials (+ which ones the home page features)
│   │   └── social.ts       # Footer social links and icons
│   ├── utils/
│   │   └── posts.ts        # Sorted blog posts and date formatting
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Shared layout (nav, footer, meta)
│   │   └── BlogPost.astro      # Blog post layout
│   ├── assets/             # Images for optimization (processed by Astro)
│   │   ├── headshot.jpg    # Profile photo
│   │   └── projects/       # Project screenshots
│   └── content/
│       ├── config.ts           # Content collection schema
│       └── blog/               # Markdown blog posts
│           └── *.md
├── public/                 # Static assets (copied to dist/ as-is)
│   ├── styles.css          # Global stylesheet
│   └── assets/
│       └── favicons/       # Favicon files
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── netlify.toml            # Netlify build configuration
```

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies (first time only)
npm run dev              # Start dev server at http://localhost:4321/
npm run build            # Build for production (output to dist/)
npm run preview          # Preview production build locally
```

### Making Changes

**Updating page content:**
- Edit the relevant `.astro` file in `src/pages/`
- Changes are automatically reloaded in dev mode

**Writing blog posts:**
1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter:
   ```markdown
   ---
   title: 'Post Title'
   description: 'Brief description'
   pubDate: 2025-12-23
   heroImage: '/path/to/image.jpg'  # optional
   ---

   Your markdown content here...
   ```
3. Save and the post will appear on the blog index

**Modifying shared layout:**
- Edit `src/layouts/BaseLayout.astro` to change nav, footer, or meta tags
- Changes apply to all pages automatically

**Styling:**
- Edit `public/styles.css` for global styles
- Add component-specific styles using `<style>` tags in `.astro` files

### Deployment
Netlify automatically builds and deploys when pushing to the main branch:
1. Runs `npm run build` (configured in `netlify.toml`)
2. Publishes the `dist/` directory
3. Site is live at https://jmiralva.me

## Common Modifications

### Adding a New Page
1. Create `src/pages/pagename.astro`
2. Import and use `BaseLayout`:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   ---

   <BaseLayout title="Page Title" description="Description" canonicalURL="https://jmiralva.me/pagename/">
     <header class="page-head">
       <div class="wrap">
         <h1 class="page-title">Page Title</h1>
         <p class="page-intro">Optional intro line</p>
       </div>
     </header>
     <div class="wrap page-body">
       <!-- Your content -->
     </div>
   </BaseLayout>
   ```
   Don't add a `<main>` tag: `BaseLayout` already wraps every page in `<main id="main">` (the skip link targets it).
   Write page addresses with a trailing slash (`/pagename/`), in links and in `canonicalURL`: Netlify redirects `/pagename` to `/pagename/`.
3. Add the page to the `navLinks` list in `BaseLayout.astro` if it belongs in the nav

### Updating Navigation
- Edit the `navLinks` list in `src/layouts/BaseLayout.astro`
- Changes automatically apply to all pages

### Updating Social Links
- Edit the `socialLinks` array in `src/data/social.ts` (label, URL, and the icon's SVG path from Font Awesome Free)
- Changes automatically apply to the footer on all pages

### Adding a New Project
1. Add project image to `src/assets/projects/` (portrait or landscape both work; images sit in a fixed frame)
2. Import the image in `src/data/projects.ts`:
   ```javascript
   import newProjectImg from '../assets/projects/new-project.png';
   ```
3. Add a project object to the `projects` array (newest first):
   ```javascript
   {
     title: 'Project Name',
     summary: 'One plain-text sentence for the home page',
     description: 'What it does',
     url: 'https://project-url.com',
     image: newProjectImg,
     altText: 'Descriptive alt text for accessibility and SEO',
     techStack: 'How it was built'
   }
   ```
4. It appears automatically in the home page crate and on /projects. The crate shows up to four sleeves at once; any extras wait at the back until someone flips to them

### Adding a New Testimonial
Add a testimonial object to the `testimonials` array in `src/data/testimonials.ts`:
```javascript
{
  quote: "What they said about you",
  snippet: "Optional short excerpt for the home page",
  name: "Person Name",
  nameUrl: "https://linkedin.com/in/person",
  role: "Their Title, Company"
}
```
It appears on /testimonials automatically. To feature it on the home page, add the name to `homeFeaturedNames` in the same file. If a snippet starts or ends mid-sentence, show the cut with "…".

### Adding Optimized Images
1. Place images in `src/assets/` (NOT `public/`)
2. Import the image:
   ```javascript
   import myImage from '../assets/my-image.jpg';
   ```
3. Use Astro's `Image` component:
   ```astro
   import { Image } from 'astro:assets';
   <Image src={myImage} alt="Description" width={800} height={600} />
   ```
4. Astro will automatically optimize, resize, and convert to WebP

## Core Architecture Patterns

**Astro Pages and Routing**: File-based routing in `src/pages/` - each `.astro` file becomes a route. Dynamic routes use `[...slug]` pattern.

**Shared Layout Component**: `BaseLayout.astro` provides HTML structure, navigation, footer, meta tags, and SEO enhancements for all pages.

**Reusable Components**: `ProjectCrate`, `ProjectCard`, `TestimonialCard` and `PostList` accept props, making it easy to add items by updating data arrays.

**Data-Driven Pages**: Projects, testimonials and social links live in `src/data/` as arrays of objects, mapped to components on every page that needs them - no HTML duplication.

**Image Optimization**: Images in `src/assets/` are automatically converted to WebP, resized, lazy loaded, and cache-busted.

📚 **For detailed architecture patterns**, see [ARCHITECTURE.md](context/ARCHITECTURE.md)

## Important Notes

- **Build process required**: This is an Astro site with a build step (not a static HTML site)
- **Component architecture**: Navigation, footer, project cards, and testimonials use reusable components
- **Design rules**: Pink (`--pink`) is decoration only and never used for text. Keep the copy free of record-sleeve puns; the music nod lives in the visuals
- **Image locations matter**: `src/assets/` for optimized images, `public/` for static files
- **Content collections**: Blog posts use Astro's content collections for type safety
- **Static output**: Site is fully static (no server-side rendering)
- **Dependencies**: Managed via npm; keep `package.json` and `package-lock.json` in sync
- **Git workflow**: Single `main` branch with clean commits
- **Session logging**: At the end of each work session, update `context/SESSION_LOG.md` with work done, decisions made, and any important context for next session
