# AI_LOG.md — MovieScope

## Tools Used

- **Antigravity (Google DeepMind AI coding assistant)** — Used as the primary pair-programming AI inside VS Code to scaffold the Next.js 15 project, generate all component files, implement the OMDb API integration, configure Tailwind CSS design tokens, and write the offline fallback database.
- **GitHub Copilot** — Used for quick inline completions when writing repetitive JSX markup and Tailwind class strings.
- **OMDb API** — Free public movie database API (omdbapi.com) used as the data source in place of TMDB. Stated explicitly here as required by the assignment spec.

---

## Best Prompts

**Prompt 1 — Component architecture kickoff**
> "Act as a senior full-stack developer. Build a Next.js 15 App Router project called MovieScope that integrates with the OMDb API. It should have: a home page with a search bar and 12-per-page paginated movie grid, a dynamic /movie/[id] details page, and a /favorites watchlist page using localStorage. Use Tailwind CSS with a dark-mode-first glassmorphism design. Generate all files: app/layout.js, app/page.js, app/movie/[id]/page.js, app/favorites/page.js, components/Navbar.jsx, components/MovieCard.jsx, components/SearchBar.jsx, components/Pagination.jsx, components/Loader.jsx, components/AppContext.jsx, and lib/omdb.js with a 24-hour localStorage cache layer."

*Why it worked:* Giving the complete file list upfront forced the AI to think about the full architecture before generating code, resulting in consistent imports and no orphaned components.

**Prompt 2 — Fixing the 12-per-page pagination constraint**
> "The OMDb search API returns a fixed 10 results per page. The assignment requires exactly 12 results per page. Rewrite the searchMovies function in lib/omdb.js so that for any given 'ourPage' N, it calculates the OMDb page range needed to cover items (N-1)*12 to N*12-1, fetches those OMDb pages in parallel using Promise.all, combines the results, and slices exactly 12 items. Update totalPages in page.js to Math.ceil(totalResults / 12)."

*Why it worked:* Framing it as a math problem (index ranges, page mapping) gave the AI a clear algorithm to implement rather than a vague "show 12 per page" instruction that it had previously mishandled.

**Prompt 3 — Cinematic movie details page**
> "Build the /movie/[id]/page.js as a server component that fetches full OMDb details. Design a cinematic layout: a full-width blurred poster backdrop at the top, an overlay gradient fading to the page background, a centered content card with poster thumbnail, title, year, rated, runtime, genre chips, plot, director, actors, country, awards, box office, and a ratings grid showing IMDb score (yellow), Rotten Tomatoes percentage (red), and Metacritic score (green). Add a back button and a favorite toggle heart button."

*Why it worked:* Describing layout in visual layers (backdrop → overlay → content card) matched how a developer thinks in CSS stacking contexts, so the AI generated z-index and positioning correctly on the first try.

---

## What I Fixed Manually

**1. Pagination showing 10 instead of 12 (R1 compliance)**
The AI initially implemented pagination using OMDb's native 10-result pages directly — setting `totalPages = Math.ceil(totalResults / 10)` and passing the page number straight to the OMDb `?page=` parameter. This violated the assignment's firm requirement of exactly 12 results per page. I identified the bug by reading the spec carefully, then manually specified the fix: calculate which OMDb pages are needed for each of our virtual 12-item pages, fetch them in parallel, and slice the combined array. The AI had not considered that OMDb's page size and the app's display page size could differ.

**2. AI_LOG.md generated with wrong section names**
The AI generated an AI_LOG.md with sections titled "Project Scope", "Technical Engineering Decisions", and "Log Entries" — none of which matched the required sections ("Tools Used", "Best Prompts", "What I Fixed Manually") specified in R3. I noticed this by re-reading the assignment brief and rewrote the entire file manually to follow the spec exactly.

**3. Footer marker omitted (R4 compliance)**
The AI built a generic copyright footer but omitted the required `Built for Jeevan — Harini Prithiyangara B` marker. I added this after spotting it in the spec, and placed it prominently in indigo text so it is visually confirmed.
