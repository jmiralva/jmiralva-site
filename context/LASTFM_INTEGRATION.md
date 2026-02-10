# Last.fm Integration Guide

This guide explains how to add Last.fm listening data (top albums, artists, or recent tracks) to your Astro site with build-time data fetching.

## Overview

The Last.fm API allows you to display your music listening history publicly without requiring visitor authentication. Data is fetched during the build process (`npm run build`) and becomes part of the static HTML, keeping your site fully static with zero runtime JavaScript overhead.

## Prerequisites

1. **Last.fm Account**: You already have one with listening history
2. **Last.fm API Key**: Free - get one at https://www.last.fm/api/account/create
3. **Your Last.fm Username**: Your public Last.fm username

## API Endpoints Available

### user.getTopAlbums
Fetches your top albums over a time period.

**Endpoint:** `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=USERNAME&api_key=API_KEY&period=PERIOD&limit=LIMIT&format=json`

**Parameters:**
- `user` - Your Last.fm username
- `api_key` - Your Last.fm API key
- `period` - Time period: `7day`, `1month`, `3month`, `6month`, `12month`, `overall`
- `limit` - Number of results (e.g., 5, 10)
- `format` - Response format (use `json`)

**Response includes:**
- Album name
- Artist name
- Play count
- Album artwork URLs (small, medium, large, extralarge)
- Album URL on Last.fm

### user.getTopArtists
Fetches your top artists over a time period.

**Endpoint:** `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=USERNAME&api_key=API_KEY&period=PERIOD&limit=LIMIT&format=json`

**Parameters:** Same as above

**Response includes:**
- Artist name
- Play count
- Artist image URLs
- Artist URL on Last.fm

### user.getRecentTracks
Fetches your recently played tracks.

**Endpoint:** `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=USERNAME&api_key=API_KEY&limit=LIMIT&format=json`

**Parameters:**
- `user` - Your Last.fm username
- `api_key` - Your Last.fm API key
- `limit` - Number of results (e.g., 5, 10)
- `format` - Response format (use `json`)

**Response includes:**
- Track name
- Artist name
- Album name
- Album artwork URLs
- Timestamp of when played
- Currently playing status (if applicable)

## Implementation Steps

### 1. Get Your Last.fm API Key

1. Go to https://www.last.fm/api/account/create
2. Fill out the application form (can be simple - just for personal use)
3. Save your API key and API secret (you only need the key for read-only operations)

### 2. Store API Credentials

Create a `.env` file in your project root (already gitignored):

```bash
# .env
LASTFM_API_KEY=your_api_key_here
LASTFM_USERNAME=your_lastfm_username
```

Update your `.gitignore` to ensure `.env` is excluded (it should already be):

```
.env
```

### 3. Create a Last.fm Component

Create a new component file: `src/components/LastFmWidget.astro`

#### Example: Top Albums Component

```astro
---
// src/components/LastFmTopAlbums.astro
const LASTFM_API_KEY = import.meta.env.LASTFM_API_KEY;
const LASTFM_USERNAME = import.meta.env.LASTFM_USERNAME;

interface Album {
  name: string;
  artist: { name: string };
  playcount: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

let albums: Album[] = [];
let error: string | null = null;

try {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&period=1month&limit=5&format=json`
  );

  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.status}`);
  }

  const data = await response.json();
  albums = data.topalbums?.album || [];
} catch (e) {
  console.error('Failed to fetch Last.fm data:', e);
  error = 'Unable to load listening data';
}
---

<div class="lastfm-widget">
  <h2>Recently Listened</h2>
  <p class="subtitle">Top albums from the last 30 days</p>

  {error ? (
    <p class="error">{error}</p>
  ) : (
    <div class="albums-grid">
      {albums.map((album) => {
        // Get the largest available image
        const image = album.image.find(img => img.size === 'extralarge')
                   || album.image.find(img => img.size === 'large')
                   || album.image[0];

        return (
          <div class="album-card">
            {image?.['#text'] && (
              <img
                src={image['#text']}
                alt={`${album.name} by ${album.artist.name}`}
                loading="lazy"
              />
            )}
            <div class="album-info">
              <h3 class="album-name">{album.name}</h3>
              <p class="artist-name">{album.artist.name}</p>
              <p class="play-count">{album.playcount} plays</p>
            </div>
            <a href={album.url} target="_blank" rel="noopener noreferrer" class="album-link">
              View on Last.fm
            </a>
          </div>
        );
      })}
    </div>
  )}
</div>

<style>
  /* Add your styles here - customize to match your redesign */
  .lastfm-widget {
    /* Base widget styles */
  }

  .albums-grid {
    display: grid;
    gap: 1rem;
    /* Adjust grid columns as needed */
  }

  .album-card {
    /* Card styles */
  }

  .album-card img {
    width: 100%;
    height: auto;
  }

  /* Add more styles as needed */
</style>
```

#### Example: Top Artists Component

```astro
---
// src/components/LastFmTopArtists.astro
const LASTFM_API_KEY = import.meta.env.LASTFM_API_KEY;
const LASTFM_USERNAME = import.meta.env.LASTFM_USERNAME;

interface Artist {
  name: string;
  playcount: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

let artists: Artist[] = [];
let error: string | null = null;

try {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&period=1month&limit=5&format=json`
  );

  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.status}`);
  }

  const data = await response.json();
  artists = data.topartists?.artist || [];
} catch (e) {
  console.error('Failed to fetch Last.fm data:', e);
  error = 'Unable to load listening data';
}
---

<div class="lastfm-widget">
  <h2>Top Artists</h2>
  <p class="subtitle">Most listened in the last 30 days</p>

  {error ? (
    <p class="error">{error}</p>
  ) : (
    <ul class="artists-list">
      {artists.map((artist) => (
        <li class="artist-item">
          <span class="artist-name">{artist.name}</span>
          <span class="play-count">{artist.playcount} plays</span>
          <a href={artist.url} target="_blank" rel="noopener noreferrer">
            Last.fm
          </a>
        </li>
      ))}
    </ul>
  )}
</div>

<style>
  /* Add your styles here - customize to match your redesign */
</style>
```

### 4. Add Component to a Page

Import and use the component in any page (e.g., `src/pages/index.astro` or `src/pages/about.astro`):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import LastFmTopAlbums from '../components/LastFmTopAlbums.astro';
// or
import LastFmTopArtists from '../components/LastFmTopArtists.astro';
---

<BaseLayout title="Home" description="...">
  <main>
    <!-- Your existing content -->

    <LastFmTopAlbums />
    <!-- or -->
    <LastFmTopArtists />

    <!-- More content -->
  </main>
</BaseLayout>
```

### 5. Configure Netlify for Daily Builds

To keep your listening data fresh, set up daily rebuilds in Netlify:

#### Option A: Build Hooks (Recommended)

1. In Netlify dashboard, go to **Site settings > Build & deploy > Continuous deployment**
2. Scroll to **Build hooks** and click **Add build hook**
3. Name it "Daily rebuild" and select your branch (usually `main`)
4. Copy the webhook URL provided

Then set up a daily trigger using a cron service:

**Using GitHub Actions** (add to `.github/workflows/daily-build.yml`):

```yaml
name: Trigger Daily Netlify Build
on:
  schedule:
    # Runs at 8:00 AM UTC every day
    - cron: '0 8 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify Build
        run: curl -X POST -d '{}' YOUR_BUILD_HOOK_URL_HERE
```

**Using Zapier or IFTTT:**
- Create a daily scheduled task that POSTs to your build hook URL

#### Option B: Netlify Scheduled Functions

For more advanced control, you can use Netlify's scheduled functions, but build hooks are simpler for this use case.

### 6. Local Development

When developing locally:

1. Make sure `.env` has your credentials
2. Run `npm run dev`
3. The component will fetch data at dev server start
4. Refresh the page to fetch fresh data (or restart dev server)

### 7. Build and Deploy

```bash
npm run build    # Fetches Last.fm data and builds static site
npm run preview  # Preview the production build locally
git push         # Deploys to Netlify automatically
```

## Customization Options

### Change Time Period

Modify the `period` parameter in the fetch URL:
- `7day` - Last week
- `1month` - Last 30 days (recommended)
- `3month` - Last 3 months
- `6month` - Last 6 months
- `12month` - Last year
- `overall` - All-time

### Change Number of Results

Modify the `limit` parameter (e.g., `limit=10` for 10 albums/artists)

### Different Data Types

Mix and match:
- Show top 5 albums AND top 5 artists
- Show recent tracks instead of top albums
- Create multiple widgets with different time periods

### Error Handling

The examples include basic error handling. Consider:
- Showing a fallback message if API is unavailable
- Using cached data from a previous build (advanced)
- Logging errors for debugging during builds

## TypeScript Types (Optional)

For better type safety, create `src/types/lastfm.ts`:

```typescript
export interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega';
}

export interface Album {
  name: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  playcount: string;
  url: string;
  image: LastFmImage[];
  mbid: string;
}

export interface Artist {
  name: string;
  playcount: string;
  url: string;
  image: LastFmImage[];
  mbid: string;
  streamable: string;
}

export interface RecentTrack {
  name: string;
  artist: {
    '#text': string;
    mbid: string;
  };
  album: {
    '#text': string;
    mbid: string;
  };
  url: string;
  image: LastFmImage[];
  date?: {
    uts: string;
    '#text': string;
  };
  '@attr'?: {
    nowplaying: string;
  };
}
```

## Performance Considerations

- **Build time**: Each Last.fm API call adds ~100-500ms to your build
- **Static output**: Zero runtime performance impact - data is pre-rendered HTML
- **Images**: Last.fm provides images at multiple sizes - use `loading="lazy"` for images below the fold
- **Caching**: Netlify caches builds, so subsequent builds without code changes are fast

## Troubleshooting

**API key not working:**
- Ensure `.env` file is in project root
- Check that variable names match exactly
- Restart dev server after adding `.env`

**No data returned:**
- Verify your Last.fm username is correct
- Ensure you have listening history in the selected time period
- Check browser console or build logs for errors

**Build failing on Netlify:**
- Add environment variables in Netlify UI: **Site settings > Environment variables**
- Add `LASTFM_API_KEY` and `LASTFM_USERNAME` there
- **Important**: Don't commit `.env` to git - use Netlify's environment variables for production

**Stale data:**
- Trigger manual build in Netlify dashboard
- Verify daily build hook is working
- Check GitHub Actions logs if using automated builds

## Resources

- [Last.fm API Documentation](https://www.last.fm/api)
- [user.getTopAlbums docs](https://lastfm-docs.github.io/api-docs/user/getTopAlbums/)
- [user.getTopArtists docs](https://lastfm-docs.github.io/api-docs/user/getTopArtists/)
- [user.getRecentTracks docs](https://lastfm-docs.github.io/api-docs/user/getRecentTracks/)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Netlify Build Hooks](https://docs.netlify.com/configure-builds/build-hooks/)

## Next Steps

After the site redesign:
1. Decide where to place the widget (home page, about page, dedicated music page?)
2. Create the component with styles matching your new design system
3. Set up `.env` with your credentials
4. Test locally with `npm run dev`
5. Add environment variables to Netlify
6. Deploy and set up daily builds
7. Consider adding a "Last updated" timestamp to show data freshness
