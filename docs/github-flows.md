# GitHub flows

Flows are the commands shown in the palette. They live in a single JSON file:

```
extension/src/flows/github.json
```

Each flow is matched to the page context (pull request, file, or issue), and its
prompt template is filled with content extracted from the page.

## Schema

```ts
export type KimiFlowContext = 'pull_request' | 'file' | 'issue';

export interface KimiFlow {
  id: string;            // unique, stable id
  label: string;         // shown in the palette
  context: KimiFlowContext;
  description?: string;  // shown under the label
  promptTemplate: string;// prompt with {{placeholders}}
  model?: string;        // overrides the default model for this flow
  maxTokens?: number;
  temperature?: number;
}
```

## Placeholders

Templates use `{{name}}` tokens, filled from the current page:

| Placeholder | Available on | Value |
| --- | --- | --- |
| `{{title}}` | all | PR title, file path, or issue title |
| `{{diff}}` | pull requests | unified diff (fetched from `<pr>.diff`) |
| `{{file_contents}}` | files | full text of the file being viewed |
| `{{issue_body}}` | issues | the issue description (first comment) |
| `{{url}}` | all | the page URL |

If a placeholder has no value on the current page, it is replaced with
`[no <name> found on this page]` so the prompt still makes sense.

## Example

```json
{
  "id": "pr_full_review",
  "label": "Full code review (bugs, tests, security)",
  "context": "pull_request",
  "description": "Ask Kimi 3 to review this PR for bugs, missing tests, and security edge cases.",
  "promptTemplate": "You are an expert code reviewer using Kimi 3. Given this pull request diff, review it for bugs, edge cases, missing tests, and security issues.\n\nRespond in Markdown with sections:\n1. High-risk issues\n2. Suggested tests\n3. Refactoring suggestions\n\nPull Request Diff:\n{{diff}}",
  "model": "kimi-3",
  "maxTokens": 2048,
  "temperature": 0.3
}
```

## Adding a flow

1. Append a new object to the array in `github.json`.
2. Give it a unique `id` and the right `context`.
3. Write a `promptTemplate` using the placeholders above.
4. Rebuild (`npm run build`) or let `npm run dev` pick it up, then reload the
   extension. The command appears automatically on matching pages.

No code changes are required — the content script loads and filters the JSON at
runtime.

## Tips for good flows

- Ask for **Markdown** output; the panel and copy buttons assume it.
- Keep `temperature` low (0.2–0.4) for review/analysis, higher for drafting.
- Set `maxTokens` to fit the expected answer; larger diffs cost more.
- For "comment" style flows (e.g. clarifying questions), instruct the model to
  return **only** the comment body so *Insert into comment box* works cleanly.
