# GitHub Pages Replay Viewer Architecture

This `docs/` folder contains a **fully static** replay viewer that can run on GitHub Pages.

## What I found by tracing existing replay code

The current replay frontend in this repo (`client/replay.pokemonshowdown.com/src`) loads:

- Individual replay files from `/<replayid>.json`.
- Replay list/search data from API routes like `/api/replays/search` and `/api/replays/recent`.
- Login data from `/check-login.php`.

That means:

- **Replay playback itself can be static** (a browser can render a log or replay JSON directly).
- **Search/login/private replay management cannot be purely static** because those routes require server-side APIs and auth.

## Static architecture (works on GitHub Pages)

- `index.html`:
  - Provides UI controls.
  - Loads battle engine scripts/CSS from `https://play.pokemonshowdown.com`.
- `replay-viewer.js`:
  - Accepts replay input from URL, file upload, or pasted text.
  - Supports both `.json` replay payloads (`{ log: ... }`) and plain `.log` text.
  - Instantiates `Battle` and provides core replay controls (play/pause/reset/seek/switch side/speed/theme/sound).
  - Supports a configurable sprite base URL (including your `pokemon-sprites` GitHub repo) by overriding `Dex.resourcePrefix` and `Dex.fxPrefix` at runtime.

## Deployment

1. Enable GitHub Pages for this repo, source = `main` (or your branch) and folder = `/docs`.
2. Put your replay files under `docs/replays/` (or any path under `docs/`).
3. Open your page and load replay URLs like:
   - `./replays/my-battle.json`
   - `./replays/my-battle.log`
4. You can also auto-load with query string:
   - `https://<user>.github.io/<repo>/?source=./replays/my-battle.json`
5. To force custom sprites, set the `sprites` query parameter:
   - `https://<user>.github.io/<repo>/?source=./replays/my-battle.json&sprites=https://raw.githubusercontent.com/jrodparker-dev/pokemon-sprites/main/`

## When you need an always-on server

You only need a backend if you want:

- replay search/index pages,
- account-aware private replay access,
- replay upload endpoints,
- analytics/rating-backed filtering.

For pure playback of known files, static hosting is enough.
