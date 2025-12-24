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
- Common scripts (nav scroll shadow effect)
- Slot for page-specific scripts
- This eliminates the previous duplication of nav/footer across HTML files

### Reusable Components
The site uses reusable components for repeated content:
- **ProjectCard.astro**: Displays project cards with image, title, description, and tech stack
- **TestimonialCard.astro**: Displays testimonial quotes with attribution
- Both components accept props, making it easy to add new items by just updating data arrays

### Data-Driven Pages
Projects and testimonials are data-driven:
- **Projects**: Data defined as an array in `projects.astro` frontmatter, mapped to `ProjectCard` components
- **Testimonials**: Data defined as an array in `testimonials.astro` frontmatter, mapped to `TestimonialCard` components
- To add a new project/testimonial, just add an object to the array - no HTML duplication needed

### Image Optimization
All images in `src/assets/` are automatically optimized by Astro:
- Converted to WebP format for 90%+ file size reduction
- Resized to specified dimensions
- Lazy loaded with modern attributes (`loading="lazy"`, `decoding="async"`)
- Content-hashed filenames for cache busting
- Images in `public/` are copied as-is without optimization

### JavaScript Organization
JavaScript is organized for optimal performance:
- **Common scripts**: Nav scroll effect is in `BaseLayout.astro` (runs on all pages)
- **Page-specific scripts**: Fade-in animations only load on pages that need them
- **Inline scripts**: All scripts use `is:inline` to avoid bundling overhead
- No external script files - all JavaScript is inlined in page HTML

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

## Important Notes

- **Build process**: This is an Astro site with a build step (not a static HTML site)
- **Component architecture**: Navigation, footer, project cards, and testimonials use reusable components
- **Data-driven content**: Projects and testimonials are defined as data arrays, not hardcoded HTML
- **Image optimization**: Images in `src/assets/` are automatically optimized to WebP (90%+ size reduction)
- **Performance optimizations**:
  - Page-specific JavaScript only loads where needed
  - Lazy loading for images
  - Inline scripts to avoid bundling overhead
- **Content collections**: Blog posts use Astro's content collections for type safety
- **Markdown support**: Blog posts are written in Markdown with frontmatter
- **Static output**: Despite using Astro, the site is fully static (no server-side rendering)
- **Dependencies**: Managed via npm; keep `package.json` and `package-lock.json` in sync
- **Git**: Single branch (`main`) with clean commits
