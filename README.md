<p align="center">
  <img src="assets/icon1024.png" width="96" alt="Kimi3Flow icon" />
</p>

<h1 align="center">Kimi3Flow</h1>

<p align="center"><strong>Use Kimi 3 on any website in one shortcut.</strong></p>

Kimi3Flow is a free, open-source browser extension (Chrome / Edge) that brings
**Kimi 3 to GitHub** with a single keyboard shortcut. Summarise, review, and
refactor code without leaving your tab.

Press <kbd>Ctrl/⌘ + Shift + K</kbd> on any GitHub **pull request**, **file**, or
**issue** page to open a command palette, pick a flow, and stream the result
into a side panel — then copy it as Markdown or drop it straight into a comment.

---

## Features

- **Command palette** — dark, minimal, centred, with fuzzy search.
- **Context-aware flows** — different commands for PRs, files, and issues.
- **Streaming results** in a slide-in side panel.
- **Copy as Markdown**, **Copy as GitHub comment**, or **Insert into comment box**.
- **JSON-driven flows** — add or edit prompts in `extension/src/flows/github.json`.
- **Bring your own key** — your Kimi 3 API key is stored locally in your browser and never leaves it except to call your configured endpoint.

## Flows included (v0)

| Context | Command |
| --- | --- |
| Pull request | Summarise this PR in plain English |
| Pull request | Full code review (bugs, tests, security) |
| Pull request | Suggest additional test cases |
| File | Explain this file to a junior dev |
| File | Suggest refactors and cleanup |
| Issue | Outline implementation steps |
| Issue | Draft clarifying questions as a comment |

## Usage

![Kimi3Flow demo](docs/demo.gif)

> Replace `docs/demo.gif` with a real screen recording — see
> [`docs/screenshots.md`](docs/screenshots.md) for how to capture one.

1. Open a GitHub PR, file, or issue.
2. Press <kbd>Ctrl/⌘ + Shift + K</kbd> (or click the toolbar icon).
3. Type to filter, then <kbd>↵</kbd> to run a flow.
4. Watch the response stream in, then copy or insert it.

---

## Install

### From the Chrome Web Store

> _Coming soon — listing link placeholder:_ **https://chromewebstore.google.com/detail/kimi3flow/PLACEHOLDER**

### From source (developer mode)

```bash
git clone https://github.com/YOUR_ORG/kimi3flow.git
cd kimi3flow
npm install
npm run build      # outputs the loadable extension to extension/dist/
```

Then load it:

1. Open `chrome://extensions` (or `edge://extensions`).
2. Toggle **Developer mode** on.
3. Click **Load unpacked** and select the `extension/dist` folder.

Run `npm run dev` for a rebuild-on-save watch mode.

## Set your Kimi 3 API key

1. Right-click the Kimi3Flow toolbar icon → **Options** (or open the extension's
   details → **Extension options**).
2. Fill in:
   - **API base URL** — your OpenAI-compatible Kimi 3 endpoint, e.g.
     `https://api.moonshot.ai/v1`. The extension calls `{base}/chat/completions`.
   - **API key** — your Kimi 3 key.
   - **Default model** — e.g. `kimi-3`.
3. Click **Save**. You'll be asked to grant access to the API host so requests
   aren't blocked by the browser — accept it.
4. Optionally click **Test connection** to confirm everything works.

## How it works

```
GitHub tab
  └─ content script  ── detects PR / file / issue, extracts diff / file / body
       ├─ command palette + result panel  (React, isolated in a shadow DOM)
       └─ opens a Port to the service worker
             └─ service worker  ── holds your key, calls {base}/chat/completions
                                    with stream:true and relays tokens back
```

Prompts live in [`extension/src/flows/github.json`](extension/src/flows/github.json)
and are matched to the page context. `{{diff}}`, `{{file_contents}}`,
`{{issue_body}}`, and `{{title}}` placeholders are filled from the page.

## Contributing

Contributions welcome — this project is intentionally small and easy to extend.
The most common change is **adding a flow**: append an entry to `github.json`
(see [`docs/github-flows.md`](docs/github-flows.md)). No build changes needed.

## License

[MIT](LICENSE)
