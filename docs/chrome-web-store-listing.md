# Chrome Web Store listing — draft copy

## Title
```
Kimi3Flow – Kimi 3 on GitHub
```

## Short description (max 132 characters)
```
Use Kimi 3 on GitHub with one shortcut: summarise PRs, review code, explain files and plan issues without leaving your tab.
```

## Category
Developer Tools

## Long description
```
Kimi3Flow brings Kimi 3 to GitHub with a single keyboard shortcut. Summarise, review, and refactor code without leaving your tab.

Press Ctrl/Cmd + Shift + K on any GitHub pull request, file, or issue to open a fast command palette, pick a flow, and stream the answer into a slide-in side panel. Copy it as Markdown, copy it as a ready-to-paste GitHub comment, or insert it straight into the comment box.

CONTEXT-AWARE FLOWS
On pull requests:
• Summarise this PR in plain English
• Full code review (bugs, tests, security)
• Suggest additional test cases

On files:
• Explain this file to a junior dev
• Suggest refactors and cleanup

On issues:
• Outline implementation steps
• Draft clarifying questions as a comment

WHY YOU'LL LIKE IT
• One shortcut — a clean, searchable command palette, no context switching.
• Streaming answers in a side panel that never covers your code.
• Copy as Markdown, copy as a GitHub comment, or insert into the comment box.
• Free and open source. Prompts are plain JSON you can edit and extend.

BRING YOUR OWN KEY
Kimi3Flow uses your own Kimi 3 (OpenAI-compatible) API endpoint. Your API key is
stored locally in your browser and is only ever sent to the endpoint you
configure. No accounts, no tracking, no middle-man servers.

GETTING STARTED
1. Install the extension.
2. Open its Options page and enter your Kimi 3 API base URL, key, and model.
3. Open a PR, file, or issue on GitHub and press Ctrl/Cmd + Shift + K.

Open source on GitHub — contributions and new flows welcome.
```

## Permissions justification (for review notes)
```
- activeTab / scripting: interact with the GitHub tab the user explicitly invokes the palette on.
- storage: save the user's API base URL, key, and default model locally.
- host_permissions https://github.com/*: run the command palette and read PR/file/issue content on GitHub.
- optional_host_permissions: requested at runtime, only for the user's own configured API endpoint, so the extension can call it directly. Nothing is requested until the user saves settings.
```

## Privacy
```
Kimi3Flow does not collect, transmit, or sell any personal data. Settings
(including the API key) are stored with chrome.storage and never leave the
browser except as part of requests to the user-configured API endpoint. Page
content (diffs, files, issue text) is sent only to that endpoint, only when the
user runs a flow.
```

## Single purpose (required field)
```
Provide AI assistance (via Kimi 3) on GitHub pull request, file, and issue pages
through a command palette.
```
