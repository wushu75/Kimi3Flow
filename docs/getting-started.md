# Getting started

This guide takes you from a clone to a working extension with Kimi 3 responses
streaming on GitHub.

## 1. Prerequisites

- Node.js 18+ and npm.
- A Kimi 3 API key from an OpenAI-compatible endpoint.
- Chrome or Edge (any recent version).

## 2. Build

```bash
npm install
npm run build
```

This bundles the TypeScript/React source into `extension/dist/`, which is the
complete, loadable, zip-ready extension folder.

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | One-off production build into `extension/dist/`. |
| `npm run dev` | Watch mode — rebuilds on save (reload the extension to pick up changes). |
| `npm run typecheck` | Type-check with `tsc --noEmit`. |
| `npm run zip` | Build, then package `extension/dist/` into `kimi3flow.zip`. |

## 3. Load in the browser

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. **Load unpacked** → choose `extension/dist`.

The Kimi3Flow icon appears in your toolbar. During development, after
`npm run build`/`dev`, click the **reload** icon on the extension card to pick
up new code.

## 4. Configure your key

Open the extension **Options** page and set:

- **API base URL** — e.g. `https://api.moonshot.ai/v1`
- **API key**
- **Default model** — e.g. `kimi-3`

Click **Save** and accept the host-access prompt. This grants the service worker
permission to call your API host directly (otherwise the browser blocks the
request via CORS). Use **Test connection** to verify.

Your key is stored with `chrome.storage.sync` (your browser profile) and is only
ever sent to the endpoint you configured.

## 5. Try it

1. Visit any GitHub pull request, file (`/blob/...`), or issue.
2. Press <kbd>Ctrl/⌘ + Shift + K</kbd>.
3. Pick a flow and watch it stream.

## Troubleshooting

- **Palette doesn't open** — make sure you're on `https://github.com/*`. Check
  the shortcut isn't overridden at `chrome://extensions/shortcuts`. You can also
  click the toolbar icon to toggle the palette.
- **"No API key set"** — set it on the Options page.
- **CORS / request blocked** — re-open Options and click **Save** to (re)grant
  host access for your API base URL.
- **Empty diff / file** — GitHub's DOM changes over time; the extension fetches
  the PR `.diff` (same-origin) and reads file text from the blob view. Very large
  inputs are truncated to keep requests within model limits.
