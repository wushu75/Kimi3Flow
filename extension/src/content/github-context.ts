import type { KimiFlowContext, PageContext } from '../types';

/** Classify the current GitHub URL into a flow context. */
export function detectContext(pathname: string): KimiFlowContext | null {
  // /{owner}/{repo}/pull/{n}[/files|/commits|...]
  if (/^\/[^/]+\/[^/]+\/pull\/\d+/.test(pathname)) return 'pull_request';
  // /{owner}/{repo}/issues/{n}
  if (/^\/[^/]+\/[^/]+\/issues\/\d+/.test(pathname)) return 'issue';
  // /{owner}/{repo}/blob/{branch}/{path...}
  if (/^\/[^/]+\/[^/]+\/blob\/.+/.test(pathname)) return 'file';
  return null;
}

function firstText(selectors: string[]): string {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  return '';
}

function truncate(text: string, max = 24000): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + `\n\n... [truncated ${text.length - max} characters]`;
}

/** Fetch the raw unified diff for the current PR (same-origin, includes cookies). */
async function fetchPrDiff(pathname: string): Promise<string> {
  const match = pathname.match(/^(\/[^/]+\/[^/]+\/pull\/\d+)/);
  if (!match) return '';
  const diffUrl = `${location.origin}${match[1]}.diff`;
  try {
    const res = await fetch(diffUrl, { credentials: 'include' });
    if (res.ok) {
      const text = await res.text();
      if (text.trim()) return text;
    }
  } catch {
    /* fall through to DOM scraping */
  }
  return scrapeVisibleDiff();
}

/** Fallback: scrape whatever diff is rendered on the Files changed tab. */
function scrapeVisibleDiff(): string {
  const files = Array.from(document.querySelectorAll('.file, [data-testid="file-diff"]'));
  const parts: string[] = [];
  for (const file of files) {
    const name = file
      .querySelector('.file-header [title], .file-info a, [data-testid="file-name"]')
      ?.textContent?.trim();
    const lines = Array.from(file.querySelectorAll('.blob-code-inner, .diff-text-inner'))
      .map((l) => l.textContent ?? '')
      .join('\n');
    if (name || lines) parts.push(`--- ${name ?? 'file'} ---\n${lines}`);
  }
  return parts.join('\n\n');
}

/** Read the full file text from a blob page. */
function extractFileContents(): string {
  // New blob view keeps the full raw text in a hidden textarea.
  const textarea = document.querySelector<HTMLTextAreaElement>('#read-only-cursor-text-area');
  if (textarea?.value) return textarea.value;
  if (textarea?.textContent) return textarea.textContent;

  // Old blob view: reconstruct from rendered lines.
  const lines = Array.from(document.querySelectorAll('.blob-code-inner, .react-code-text'))
    .map((l) => l.textContent ?? '')
    .join('\n');
  return lines;
}

function extractFilePath(pathname: string): string {
  const match = pathname.match(/^\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : pathname;
}

/** Build the full page context for the active tab. */
export async function getPageContext(): Promise<PageContext> {
  const { pathname, href } = location;
  const context = detectContext(pathname);
  const vars: Record<string, string> = { url: href };
  let title = document.title;

  if (context === 'pull_request') {
    title = firstText([
      '.js-issue-title',
      'bdi.js-issue-title',
      '[data-testid="issue-title"]',
      'h1 .markdown-title',
    ]) || title;
    vars.title = title;
    vars.diff = truncate(await fetchPrDiff(pathname));
  } else if (context === 'file') {
    title = extractFilePath(pathname);
    vars.title = title;
    vars.file_contents = truncate(extractFileContents());
  } else if (context === 'issue') {
    title = firstText([
      '.js-issue-title',
      'bdi.js-issue-title',
      '[data-testid="issue-title"]',
      'h1 .markdown-title',
    ]) || title;
    vars.title = title;
    vars.issue_body = truncate(
      firstText([
        '[data-testid="issue-body"] .markdown-body',
        '.js-comment-body',
        '.comment-body',
        '.markdown-body',
      ]),
    );
  }

  return { context, title, vars, url: href };
}

/** Replace {{placeholder}} tokens in a prompt template with context values. */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined && value !== '' ? value : `[no ${key} found on this page]`;
  });
}
