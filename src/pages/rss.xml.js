import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) =>
    new Date(b.data.pubDate) - new Date(a.data.pubDate)
  );

  return rss({
    title: 'Jorge Mir Alvarez | Blog',
    description: 'Infrequent reflections on software, life, culture, and whatever is on my mind',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
