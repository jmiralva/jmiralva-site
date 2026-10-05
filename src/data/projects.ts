// Side projects, newest first. The home page flips through them using `summary`;
// /projects shows the full `description` and `techStack` (both may contain HTML links).
import type { ImageMetadata } from 'astro';
import socialcalImg from '../assets/projects/socialcal-best-day.png';
import wanderlustImg from '../assets/projects/wanderlust-travel-app.png';
import platesImg from '../assets/projects/plates-with-p-chicago-restaurant-week-guide.png';
import notionImg from '../assets/projects/notion-job-search-workspace.png';

export interface Project {
  title: string;
  /** One plain-text sentence for the home page */
  summary: string;
  description: string;
  url: string;
  image: ImageMetadata;
  altText: string;
  techStack: string;
}

export const projects: Project[] = [
  {
    title: 'SocialCal',
    summary: 'Find the best days to meet up with friends.',
    description: 'Find the best days to meet up with friends. Create a calendar, share the link, and see which dates work for the most people. Free, with no sign-up or accounts.',
    url: 'https://socialcal.rsvp/',
    image: socialcalImg,
    altText: "SocialCal calendar for a fall camping trip, with friends' available days marked and Friday, October 16 circled as the best day",
    techStack: 'Built with Claude Code on Cloudflare Pages with Pages Functions and a D1 database for the API. It\'s available open source on <a href="https://github.com/jmiralva/SocialCal" target="_blank" rel="noopener noreferrer">GitHub</a>.'
  },
  {
    title: 'Wanderlust',
    summary: 'An AI travel planner that helps you find the perfect destination for your next trip and discover things to do there.',
    description: 'An AI travel planner that helps you find the perfect destination for your next trip and discover things to do there.',
    url: 'https://wnderlust.lovable.app/',
    image: wanderlustImg,
    altText: 'Wanderlust travel app showing personalized destination recommendations with AI-powered suggestions',
    techStack: 'Built using Lovable and Supabase. Integrates with OpenAI for travel recommendations and content, Unsplash for location images, and Google Maps for the origin autocomplete.'
  },
  {
    title: 'Plates With P\'s Chicago Restaurant Week 2026 Guide',
    summary: 'A collaboration with Chicago influencer Paige Serena to identify the best deals for Chicago Restaurant Week 2026.',
    description: 'A collaboration with Chicago influencer <a href="https://www.instagram.com/paigeserena/" target="_blank" rel="noopener noreferrer">Paige Serena</a> to identify the best deals for Chicago Restaurant Week 2026. Featured on Block Club Chicago\'s <a href="https://blockclubchicago.org/2026/01/20/looking-for-chicago-restaurant-week-2026-deals-these-chicagoans-found-them/" target="_blank" rel="noopener noreferrer">Restaurant Week feature</a>.',
    url: 'https://pwp-chicago-restaurant-week.netlify.app/',
    image: platesImg,
    altText: 'Chicago Restaurant Week 2026 guide showing a curated list of restaurant deals with pricing and menu details',
    techStack: 'Paige built a spreadsheet breaking down the restaurants, and I used Claude Opus to turn it into a website.'
  },
  {
    title: 'Job Tracking Workspace',
    summary: 'A complete job tracking workspace for candidates applying to jobs.',
    description: 'A complete job tracking workspace for candidates applying to jobs. Candidates can track job applications, interviews, updates to their processes, from a centralized space. The project is available as pay-what-you-want on Gumroad.',
    url: 'https://jmiralva.gumroad.com/l/notion-job-search-workspace',
    image: notionImg,
    altText: 'Notion job search workspace dashboard displaying application tracking, interview status, and job listing database',
    techStack: 'Built entirely in Notion, and uses the <a href="https://savetonotion.so/" target="_blank" rel="noopener noreferrer">Save to Notion</a> Chrome extension to save job listings to a database.'
  }
];
