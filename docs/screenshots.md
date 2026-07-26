# Screenshots & demo capture

The Chrome Web Store needs at least one **1280×800** (or 640×400) screenshot.
Aim for 3–5 that show the core flows.

## Recommended shots

1. **PR review flow** — a PR page with the palette open on "Full code review",
   then the side panel streaming a review.
2. **File explanation flow** — a `/blob/` page with "Explain this file to a
   junior dev" running.
3. **Issue → implementation steps** — an issue page with the plan in the panel.
4. **Options page** — showing the clean settings screen.

## Capturing at exactly 1280×800

Use a dedicated Chrome window sized to the viewport:

```bash
# macOS/Linux: launch a clean profile at the right size
google-chrome --new-window --window-size=1280,860 --user-data-dir=/tmp/k3f-shots
```

(The extra ~60px accounts for the toolbar; the *page* viewport should be
1280×800. Verify with `window.innerWidth/innerHeight` in DevTools and adjust.)

Then:

1. Load the unpacked extension (`extension/dist`) in this profile.
2. Set your API key in Options.
3. Navigate to a demo PR/file/issue, trigger the flow, and screenshot.

### Scripted capture (optional)

If you prefer automation, use Puppeteer with a persistent context so the
extension loads:

```js
import puppeteer from 'puppeteer';

const pathToExtension = 'extension/dist';
const browser = await puppeteer.launch({
  headless: false,
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--window-size=1280,800',
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto('https://github.com/OWNER/REPO/pull/1');
// Trigger the palette via the toolbar action or dispatch the command,
// then: await page.screenshot({ path: 'shot-pr.png' });
```

## Demo GIF for the README

Record a short screen capture (e.g. with [`asciinema`] for terminals or any
screen recorder for the browser), then convert to GIF:

```bash
# from an mp4 screen recording
ffmpeg -i demo.mp4 -vf "fps=12,scale=960:-1:flags=lanczos" -loop 0 docs/demo.gif
```

Keep it under ~8 seconds and a few MB. Reference it from the README (already
wired up as `docs/demo.gif`).
