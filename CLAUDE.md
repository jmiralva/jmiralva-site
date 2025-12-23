# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio website for Jorge Mir Alvarez, a product manager based in Chicago. The site is deployed on Netlify and consists of three main pages: home, about, and testimonials.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, and JavaScript (no framework)
- **Deployment**: Netlify (configured via `netlify.toml`)
- **Styling**: Custom CSS with CSS variables, responsive design using media queries
- **Fonts**: Google Fonts (Instrument Serif, Source Sans 3)
- **Icons**: Font Awesome 6.5.1

## Site Structure

```
/
├── index.html           # Home page with hero section
├── about/
│   └── index.html       # About page with bio and interests
├── testimonials/
│   └── index.html       # Testimonials page with colleague quotes
├── assets/
│   └── headshot.jpg     # Profile photo
├── styles.css           # Global styles (shared across all pages)
├── script.js            # Shared JavaScript functionality
└── netlify.toml         # Netlify configuration
```

## Key Architecture Patterns

### URL Structure
The site uses Netlify's automatic pretty URLs feature. Each section is a folder with an `index.html` file:
- `/` → `index.html`
- `/about` → `about/index.html`
- `/testimonials` → `testimonials/index.html`

### Shared Resources
All pages share:
- `styles.css` - Single global stylesheet with CSS variables for theming
- `script.js` - Shared JavaScript for smooth scrolling, intersection observer animations, and navigation effects
- Identical navigation and footer components (duplicated in each HTML file)

### Design System
The site uses a cohesive design system defined in CSS variables in `styles.css`:
- **Color palette**: Forest green (`#2D6A4F`) as primary accent, cream/beige backgrounds (`#FAF8F2`, `#F0EBE3`)
- **Typography**: Instrument Serif for headings, Source Sans 3 for body text
- **Spacing**: Consistent spacing scale using CSS custom properties (`--space-*`)
- **Layout**: Fixed navigation bar, max-width content containers (`--max-width: 1200px`)

### Responsive Design
The site is fully responsive with breakpoints at:
- 968px: Switches hero layout from side-by-side to stacked, simplifies testimonials grid
- 600px: Further reduces spacing and font sizes for mobile

### Animations
- CSS keyframe animations for hero section fade-in effects
- JavaScript Intersection Observer for testimonial fade-in on scroll
- Navigation shadow appears on scroll past 100px

## Development Workflow

Since this is a static site with no build process:

1. **Local development**: Open `index.html` directly in a browser or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Making changes**: Edit HTML, CSS, or JS files directly and refresh the browser

3. **Deployment**: Netlify automatically deploys from the git repository. The publish directory is `.` (root).

## Common Modifications

### Updating Content
- **Personal info**: Edit text directly in the relevant HTML file
- **Social links**: Update the `.social-links` section in the footer (duplicated in all three HTML files)
- **Testimonials**: Add new `<blockquote>` elements in `testimonials/index.html` with appropriate grid classes (`.testimonial-N`)

### Styling Changes
All styling is centralized in `styles.css`. Key sections:
- Line 4-29: CSS variables for colors, fonts, and spacing
- Line 72-118: Navigation styles
- Line 136-214: Hero section
- Line 297-377: Testimonials grid layout

### Adding New Pages
1. Create a new folder with an `index.html` file
2. Copy navigation and footer from existing pages
3. Update relative paths for `styles.css` and `script.js` (use `../` as needed)
4. Add navigation link to all existing pages

## Important Notes

- **No build process**: This is a static site with no compilation, bundling, or preprocessing
- **Duplicated components**: Navigation and footer are copy-pasted across all three HTML files. Changes must be made in all locations.
- **External dependencies**: Font Awesome and Google Fonts are loaded from CDNs
- **Git**: Single branch with clean commits; site is the repository name (`jmiralva`)