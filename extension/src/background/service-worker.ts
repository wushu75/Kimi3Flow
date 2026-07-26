import {
  DEFAULT_SETTINGS,
  STREAM_PORT,
  type KimiSettings,
  type StreamRequest,
  type StreamResponse,
} from '../types';

// ---- Toggle the palette from the keyboard shortcut or toolbar icon ----

function togglePaletteInTab(tabId?: number) {
  if (typeof tabId === 'number') {
    chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_PALETTE' }).catch(() => {
      // No content script on this page (e.g. not github.com) — ignore.
    });
  }
}

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'toggle-palette') togglePaletteInTab(tab?.id);
});

chrome.action.onClicked.addListener((tab) => togglePaletteInTab(tab?.id));

// ---- Settings ----

async function loadSettings(): Promise<KimiSettings> {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored } as KimiSettings;
}

// ---- Streaming completions over a long-lived Port ----

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== STREAM_PORT) return;

  port.onMessage.addListener((msg: StreamRequest) => {
    if (msg.type === 'STREAM_START') {
      void streamCompletion(port, msg);
    }
  });
});

function send(port: chrome.runtime.Port, msg: StreamResponse) {
  try {
    port.postMessage(msg);
  } catch {
    // Port already closed by the content script; nothing to do.
  }
}

async function streamCompletion(port: chrome.runtime.Port, req: StreamRequest) {
  const settings = await loadSettings();

  if (!settings.apiKey) {
    send(port, {
      type: 'STREAM_ERROR',
      error: 'No API key set. Open the Kimi3Flow options page and add your Kimi 3 API key.',
    });
    return;
  }

  const base = settings.apiBaseUrl.replace(/\/+$/, '');
  const url = `${base}/chat/completions`;
  const model = req.model || settings.defaultModel;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: req.prompt }],
        max_tokens: req.maxTokens,
        temperature: req.temperature,
        stream: true,
      }),
    });
  } catch (e) {
    send(port, {
      type: 'STREAM_ERROR',
      error:
        `Request to ${url} failed: ${(e as Error).message}. ` +
        `If this is a CORS/permission error, open the options page and grant access to the API host.`,
    });
    return;
  }

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    send(port, {
      type: 'STREAM_ERROR',
      error: `API returned ${res.status} ${res.statusText}. ${detail.slice(0, 300)}`,
    });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by newlines; process complete lines.
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const raw of lines) {
        const line = raw.trim();
        if (!line || !line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') {
          send(port, { type: 'STREAM_DONE' });
          return;
        }
        try {
          const json = JSON.parse(data);
          const delta: string =
            json.choices?.[0]?.delta?.content ??
            json.choices?.[0]?.message?.content ??
            '';
          if (delta) send(port, { type: 'STREAM_DELTA', text: delta });
        } catch {
          // Ignore keep-alive or partial JSON fragments.
        }
      }
    }
    send(port, { type: 'STREAM_DONE' });
  } catch (e) {
    send(port, { type: 'STREAM_ERROR', error: `Stream interrupted: ${(e as Error).message}` });
  }
}
