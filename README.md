# TranscriptSnap

**A free, local-only YouTube transcript cleaner for Chrome.** Pull the transcript from the video you're watching, strip the timestamps and caption clutter, and copy or download clean text.

No backend. No account. No network requests — not one.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pehnikkgaikdmpdmodoemfcifboopbil?label=chrome%20web%20store&color=0e7c6b)](https://chromewebstore.google.com/detail/transcriptsnap/pehnikkgaikdmpdmodoemfcifboopbil)
[![Users](https://img.shields.io/chrome-web-store/users/pehnikkgaikdmpdmodoemfcifboopbil?color=0e7c6b)](https://chromewebstore.google.com/detail/transcriptsnap/pehnikkgaikdmpdmodoemfcifboopbil)
[![Rate it](https://img.shields.io/badge/rate%20it-%E2%98%85%E2%98%85%E2%98%85%E2%98%85%E2%98%85-0e7c6b)](https://chromewebstore.google.com/detail/transcriptsnap/pehnikkgaikdmpdmodoemfcifboopbil/reviews)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

⬇️ **[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/transcriptsnap/pehnikkgaikdmpdmodoemfcifboopbil)**

🔗 **[Website](https://wushu75.github.io/TranscriptSnap/)** · **[Privacy policy](https://wushu75.github.io/TranscriptSnap/privacy.html)** · **[Report a bug](https://github.com/wushu75/TranscriptSnap/issues/new/choose)**

---

## See it work

The panel floats over the video you're watching. Click once, and the caption mess becomes clean text.

![Before and after: the floating panel in its Ready state beside the cleaned transcript](docs/screenshots/workflow.png)

| Click the panel | Get clean text |
| :---: | :---: |
| ![TranscriptSnap panel over a YouTube feed, ready to transcribe](docs/screenshots/step1-ready.png) | ![Cleaned transcript shown as paragraphs with copy and download buttons](docs/screenshots/step2-transcribed.png) |

---

## What it does

YouTube's built-in transcript is a wall of two-second fragments, repeated lines, `[Music]` cues and timestamps. TranscriptSnap turns that into prose:

| Before | After |
| --- | --- |
| `0:12  so the first thing you want to do is`<br>`0:14  [Music]`<br>`0:15  so the first thing you want to do is`<br>`0:17  open up the settings panel and then` | So the first thing you want to do is open up the settings panel and then scroll down to where it says export. |

- **One click** on any `youtube.com/watch` page
- **Copy transcript** or **Download .txt**
- **Timestamps toggle** — off for reading, on for citing
- **Status chip** that tells you where you are: Ready → Transcribing → Transcribed → Copied, or a plain-English error

## Privacy

The extension reads the transcript YouTube **already renders in the page DOM**. That's the whole mechanism — which is why it needs no API key, no server and no connection. Open DevTools → Network while you use it; you'll see nothing.

The only thing written to storage is one boolean: whether timestamps are shown.

## Install

### From the Chrome Web Store (recommended)

**[Add TranscriptSnap to Chrome](https://chromewebstore.google.com/detail/transcriptsnap/pehnikkgaikdmpdmodoemfcifboopbil)** — one click, updates automatically.

### From a release

1. Download `TranscriptSnap.zip` from the [latest release](https://github.com/wushu75/TranscriptSnap/releases/latest) and unzip it.
2. Go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.
5. Open any YouTube video with captions.

### From source

```bash
git clone https://github.com/wushu75/TranscriptSnap.git
```

Then load the `extension/` folder via **Load unpacked**, as above.

Works in Chrome, Edge, Brave, Opera and any Chromium browser with Manifest V3 support (Chrome 88+).

## Repository layout

```
extension/          The extension itself — this is what you load unpacked
  manifest.json     Manifest V3
  content.js        Extraction, cleaning, panel UI, state machine
  background.js     Service worker (toolbar badge only)
  popup.html/.js    Toolbar popup
  style.css         Shared styles for panel and popup
  icons/            16, 32, 48, 128 px
docs/               The website, served by GitHub Pages
.github/            Issue templates
TESTING.md          Manual test plan
store/              Store assets, promo tiles and the submission guide
test/               jsdom tests for extraction and cleaning
```

## Building the store zip

The zip must have `manifest.json` at its root, so zip the *contents* of `extension/`, not the folder:

```bash
cd extension && zip -r ../TranscriptSnap.zip . -x ".*" && cd ..
```

## Publishing

Store assets, listing copy and a step-by-step submission guide live in
**[store/SUBMISSION.md](store/SUBMISSION.md)**.

## Testing

```bash
npm install jsdom && node test/extraction.test.js
```

See **[TESTING.md](TESTING.md)** for the manual test plan — happy path, no-captions path, SPA navigation, dark mode and accessibility checks.

## Known limits

- Videos with captions disabled by the uploader have no transcript to extract. The extension says so rather than failing silently.
- Live streams only expose a transcript once captions are finalised.
- TranscriptSnap depends on YouTube's DOM structure. If YouTube changes its transcript markup, extraction can break — [open an issue](https://github.com/wushu75/TranscriptSnap/issues/new/choose) and it gets patched.
- Multi-language videos use whichever caption track YouTube has selected.

## Contributing

Bug reports and small, focused pull requests are welcome. Two rules that won't bend:

1. **No network calls.** Not for fonts, not for analytics, not for "just one API".
2. **No new permissions** without a strong justification in the PR description.

## Licence

MIT — see [LICENSE](LICENSE).

Not affiliated with, endorsed by or sponsored by YouTube or Google.
