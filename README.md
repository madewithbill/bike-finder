![Bikefinder wordmark over image of a black bike.](./.github/thumbnail.avif)

**A sizing and recommendation tool for cyclists, demonstrating proficiency in building Vue.js applications with Typescript.**

[View the demo.](https://mwb-bike-finder.vercel.app/)

_This is a work in progress and will continue to grow in scope, polish, and functionality. Sourced images from Unsplash and Trek are used solely for the purpose of this demo._

## Usage

![Screenshot of the Bikefinder app finding road bike measurements.](./.github/app-screen.avif)

The project has two primary features:

1. **Size Calculator**: Select a bike type and enter relevant measurements for an alpha size. This is simply based on sourced sizing charts.

   Results also come with conditional notes based on the type of bike that was chosen.

2. **Bike Recommendations**: Based on bike type selection, a carousel dynamically displays related bikes to encourage an intuitive shopping experience.

## Tooling

Bikefinder is built with Vue 3 and TypeScript alongside these primary dependencies for development and user experience.

- **[Supabase](https://supabase.com/)** and its Data API for storing and fetching bike data, in addition to a Supabase Storage bucket for images.
- **[Embla Carousel](https://www.embla-carousel.com/)** for a lightweight, interactive carousel.
- **[Tailwind CSS](https://tailwindcss.com/)** for rapid utility styling and responsiveness.
- Vue techniques used: Reactive state, computed properties, conditional rendering, event handling, watchers, lifecycle hooks, single-file components, passing props.

## Project Setup

```sh
pnpm install
```

### Configure environment variables

Create a `.env.local` file in the project root with your Supabase project's URL and publishable key:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```
