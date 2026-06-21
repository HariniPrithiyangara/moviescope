# MovieScope 🎬

MovieScope is a premium movie finder web application built using **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **Lucide React**. It integrates with the **OMDb API** to query movies and details, features a local-storage **favorites/watchlist manager**, supports **dark/light modes**, and implements a **client-side caching layer** to stay within the API's daily request limit.

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-moviescope--three.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://moviescope-three.vercel.app/)

> 🌐 **[https://moviescope-three.vercel.app/](https://moviescope-three.vercel.app/)**

---

## Features

- 🔍 **Dynamic Movie Search**: Quick search by title, director, or actor, with hover glows and interactive suggested tag chips (`Interstellar`, `Dune`, `Oppenheimer`, `The Batman`).
- 🌟 **Dynamic Details Page**: Cinematic layout featuring a large blurred backdrop of the movie poster, details (Cast, Director, Country, Awards, Box Office), and custom score grids (IMDb, Rotten Tomatoes, Metacritic).
- ❤️ **Favorites Watchlist**: Add or remove movies to/from your watchlist. Watchlist statuses persist across reloads using `localStorage`.
- 🌓 **Theme Customization**: Beautiful dark-mode default theme (rich slate, glassmorphism, gradient accents, smooth transitions) with the option to toggle to a clean, elegant light-mode.
- ⚡ **Client-Side Cache Layer**: Saves previous search results and movie details in `localStorage` for 24 hours. Navigating between search pages or clicking details triggers **zero** additional API requests.
- 📦 **Offline Fallback Database**: A local database containing 20 popular movies with full metadata, ratings, and high-quality posters. If the OMDb API goes offline or the rate-limit is exceeded, search and details seamlessly fall back to local data.
- 📱 **Fully Responsive Layout**: Built with custom grid breakpoints for fluid rendering on mobile, tablet, and desktop viewports.
- 🌀 **Premium Skeletons**: Custom layout loaders for the main grids and dynamic details page.
- 🔔 **Toast Alerts**: Seamless, animated confirmation alerts appearing at the bottom-right corner.

---

## Technical Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS.
- **Icons**: Lucide React.
- **State Management**: React Hooks (useState, useEffect) + Context API.
- **Storage**: `localStorage` (theme preferences + favorites + OMDb API cache).
- **API**: OMDb API (`http://www.omdbapi.com/`).

---

## File Structure

```text
moviescope/
│
├── app/
│   ├── layout.js              # Server Layout with fonts & SEO metadata
│   ├── page.js                # Search landing page (client component)
│   ├── movie/[id]/page.js     # Cinematic movie details page
│   └── favorites/page.js      # Watchlist listings page
│
├── components/
│   ├── AppContext.jsx         # Context Provider (Theme, Favorites, Toasts)
│   ├── MovieCard.jsx          # Custom interactive cards
│   ├── SearchBar.jsx          # Input form with autocomplete tags
│   ├── Pagination.jsx         # Ellipsis pagination controls
│   ├── Loader.jsx             # Skeletons and page spinners
│   └── Navbar.jsx             # Navigation header & theme switcher
│
├── lib/
│   └── omdb.js                # OMDb client & Offline database fallback
│
├── AI_LOG.md                  # Developer logs & design decisions
├── README.md                  # Installation & documentation guide
└── .env.local                 # Public API Key config
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher (Tested on v24.14.0)
- **NPM**: v9 or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd moviescope
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Configure your API key. Create a `.env.local` file in the root folder and add your OMDb API key:
   ```env
   NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
   ```

### Running Locally

To run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To validate and build the production bundle:
```bash
npm run build
```
You can preview the built bundle locally using:
```bash
npm run start
```

---

## API Request Safeguard & Offline Fallback

To verify the offline fallback mechanism works without hitting the actual OMDb API:
1. Open [lib/omdb.js](file:///lib/omdb.js) and temporarily change the `API_KEY` to an invalid string (e.g., `'invalid_key'`).
2. Search for any movie or query. The client will alert you that it is running in fallback mode with a yellow alert banner and serve high-fidelity details from its local database.
