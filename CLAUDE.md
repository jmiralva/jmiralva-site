# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
│   │   ├── projects.astro  # Projects page
│   │   ├── testimonials.astro
│   │   └── blog/
│   │       ├── index.astro         # Blog index/listing
│   │       └── [...slug].astro     # Dynamic blog post route
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Shared layout (nav, footer, meta)
│   │   └── BlogPost.astro      # Blog post layout
│   └── content/
│       ├── config.ts           # Content collection schema
│       └── blog/               # Markdown blog posts
│           └── *.md
├── public/                 # Static assets (copied to dist/)
│   ├── styles.css          # Global stylesheet
│   ├── script.js           # Client-side JavaScript
│   ├── headshot.jpg        # Profile photo
│   └── assets/
│       ├── favicons/       # Favicon files
│       └── projects/       # Project screenshots
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── netlify.toml            # Netlify build configuration
```

## Key Architecture Patterns

### Astro Pages and Routing
Astro uses file-based routing in the `src/pages/` directory:
- `index.astro` → `/`
- `about.astro` → `/about`
- `projects.astro` → `/projects`
- `testimonials.astro` → `/testimonials`
- `blog/index.astro` → `/blog`
- `blog/[...slug].astro` → `/blog/{slug}` (dynamic routes for blog posts)

### Shared Layout Component
All pages use `BaseLayout.astro` which provides:
- HTML document structure with meta tags
- Navigation bar with links to all pages
- Footer with social links
- Consistent styling and JavaScript includes
- This eliminates the previous duplication of nav/footer across HTML files

### Blog System
Blog posts are written in Markdown and stored in `src/content/blog/`:
- Each post has frontmatter with `title`, `description`, `pubDate`, and optional `heroImage`
- Posts are rendered using the `BlogPost.astro` layout
- Blog index automatically lists all posts sorted by date
- Content collections provide type-safe access to post metadata

### Design System
The site uses a cohesive design system defined in CSS variables in `public/styles.css`:
- **Color palette**: Forest green (`#2D6A4F`) as primary accent, cream/beige backgrounds (`#FAF8F2`, `#F0EBE3`)
- **Typography**: Instrument Serif for headings, Source Sans 3 for body text
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Layout**: Fixed navigation bar, max-width content containers

### Responsive Design
The site is fully responsive with breakpoints at:
- 968px: Switches hero layout from side-by-side to stacked, simplifies testimonials grid
- 600px: Further reduces spacing and font sizes for mobile

### Client-Side JavaScript
JavaScript in `public/script.js` handles:
- Smooth scrolling for anchor links
- Intersection Observer for testimonial/project card fade-in animations
- Navigation shadow on scroll
- Project card click handling

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

### Adding Project Cards
- Edit `src/pages/projects.astro`
- Add new project images to `public/assets/projects/`
- Follow the existing card structure

### Updating Testimonials
- Edit `src/pages/testimonials.astro`
- Add new `<blockquote>` elements with appropriate classes

## Important Notes

- **Build process**: This is now an Astro site with a build step (not a static HTML site)
- **No component duplication**: Navigation and footer are defined once in `BaseLayout.astro`
- **Content collections**: Blog posts use Astro's content collections for type safety
- **Markdown support**: Blog posts are written in Markdown with frontmatter
- **Static output**: Despite using Astro, the site is fully static (no server-side rendering)
- **Dependencies**: Managed via npm; keep `package.json` and `package-lock.json` in sync
- **Git**: Single branch (`main`) with clean commits
