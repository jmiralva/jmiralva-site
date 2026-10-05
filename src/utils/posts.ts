import { getCollection } from 'astro:content';

/** All blog posts, newest first */
export async function getSortedPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Formats a post date, e.g. "Nov 1, 2024" (short) or "November 1, 2024" (long).
 * Dates in frontmatter are read as midnight UTC, so format them in UTC too;
 * otherwise a build in a US time zone shows the day before.
 */
export function formatDate(date: Date, month: 'short' | 'long' = 'short') {
  return date.toLocaleDateString('en-us', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Date in YYYY-MM-DD form for <time datetime> */
export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
