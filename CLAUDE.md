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
- **Styling**: Custom CSS with CSS variables, responsive design using media queries
- **Fonts**: Google Fonts (Instrument Serif, Source Sans 3)
- **Icons**: Font Awesome 6.5.1
- **Deployment**: Netlify (configured via `netlify.toml`)
- **Build**: Node.js (npm) with Astro CLI

## Site Structure

```
/
├── src/
│   ├── pages/              # Astro pages (generate routes)
│   │   ├── index.astro     # Home page
│   │   ├── about.astro     # About page
│   │   ├── projects.astro  # Projects page (data-driven)
│   │   ├── testimonials.astro  # Testimonials page (data-driven)
│   │   └── blog/
│   │       ├── index.astro         # Blog index/listing
│   │       └── [...slug].astro     # Dynamic blog post route
│   ├── components/         # Reusable components
│   │   ├── ProjectCard.astro       # Project card component
│   │   └── TestimonialCard.astro   # Testimonial card component
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

   <BaseLayout title="Page Title" description="Description">
     <main>
       <!-- Your content -->
     </main>
   </BaseLayout>
   ```
3. Add navigation link to `BaseLayout.astro` if needed

### Updating Navigation
- Edit the `.nav-links` section in `src/layouts/BaseLayout.astro`
- Changes automatically apply to all pages

### Updating Social Links
- Edit the `.social-links` section in `src/layouts/BaseLayout.astro`
- Changes automatically apply to all pages

### Adding a New Project
1. Add project image to `src/assets/projects/`
2. Import the image in `src/pages/projects.astro`:
   ```javascript
   import newProjectImg from '../assets/projects/new-project.png';
   ```
3. Add project object to the `projects` array:
   ```javascript
   {
     title: 'Project Name',
     description: 'What it does',
     url: 'https://project-url.com',
     image: newProjectImg,
     altText: 'Descriptive alt text for accessibility and SEO',
     techStack: 'How it was built'
   }
   ```
4. The `ProjectCard` component will automatically render it

### Adding a New Testimonial
Add a testimonial object to the `testimonials` array in `src/pages/testimonials.astro`:
```javascript
{
  quote: "What they said about you",
  name: "Person Name",
  nameUrl: "https://linkedin.com/in/person",
  role: "Their Title, Company",
  className: "testimonial-11"  // Increment the number
}
```
The `TestimonialCard` component will automatically render it

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

**Reusable Components**: `ProjectCard` and `TestimonialCard` components accept props, making it easy to add items by updating data arrays.

**Data-Driven Pages**: Projects and testimonials are defined as arrays of objects, then mapped to components - no HTML duplication.

**Image Optimization**: Images in `src/assets/` are automatically converted to WebP, resized, lazy loaded, and cache-busted.

📚 **For detailed architecture patterns**, see [ARCHITECTURE.md](context/ARCHITECTURE.md)

## Important Notes

- **Build process required**: This is an Astro site with a build step (not a static HTML site)
- **Component architecture**: Navigation, footer, project cards, and testimonials use reusable components
- **Image locations matter**: `src/assets/` for optimized images, `public/` for static files
- **Content collections**: Blog posts use Astro's content collections for type safety
- **Static output**: Site is fully static (no server-side rendering)
- **Dependencies**: Managed via npm; keep `package.json` and `package-lock.json` in sync
- **Git workflow**: Single `main` branch with clean commits
- **Session logging**: At the end of each work session, update `context/SESSION_LOG.md` with work done, decisions made, and any important context for next session
