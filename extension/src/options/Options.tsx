import React, { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type KimiSettings } from '../types';

type Status = { kind: 'idle' | 'ok' | 'error' | 'busy'; message: string };

function apiOrigin(baseUrl: string): string | null {
  try {
    return new URL(baseUrl).origin + '/*';
  } catch {
    return null;
  }
}

export function Options() {
  const [settings, setSettings] = useState<KimiSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  useEffect(() => {
    chrome.storage.sync.get(DEFAULT_SETTINGS).then((s) => setSettings({ ...DEFAULT_SETTINGS, ...s } as KimiSettings));
  }, []);

  function update<K extends keyof KimiSettings>(key: K, value: KimiSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save() {
    setStatus({ kind: 'busy', message: 'Saving…' });
    await chrome.storage.sync.set(settings);

    // Ask for permission to call the configured API host, so the service
    // worker's fetch is not blocked by CORS.
    const origin = apiOrigin(settings.apiBaseUrl);
    if (origin) {
      try {
        const granted = await chrome.permissions.request({ origins: [origin] });
        setStatus({
          kind: granted ? 'ok' : 'error',
          message: granted
            ? 'Saved. Ready to use on GitHub.'
            : 'Saved, but host access was denied — requests may be blocked until you allow it.',
        });
      } catch {
        setStatus({ kind: 'ok', message: 'Saved.' });
      }
    } else {
      setStatus({ kind: 'error', message: 'Saved, but the API base URL looks invalid.' });
    }
  }

  async function test() {
    setStatus({ kind: 'busy', message: 'Testing connection…' });
    const base = settings.apiBaseUrl.replace(/\/+$/, '');
    try {
      const res = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.defaultModel,
          messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        setStatus({ kind: 'ok', message: 'Connection OK — API key and URL work.' });
      } else {
        const body = await res.text().catch(() => '');
        setStatus({ kind: 'error', message: `API error ${res.status}: ${body.slice(0, 200)}` });
      }
    } catch (e) {
      setStatus({
        kind: 'error',
        message: `Request failed: ${(e as Error).message}. Save first to grant host access, then retry.`,
      });
    }
  }

  return (
    <div className="wrap">
      <header>
        <div className="logo">K3</div>
        <div>
          <h1>Kimi3Flow</h1>
          <p className="sub">Configure your Kimi 3 endpoint. Keys are stored in your browser only.</p>
        </div>
      </header>

      <label className="field">
        <span>API base URL</span>
        <input
          type="text"
          value={settings.apiBaseUrl}
          placeholder="https://api.moonshot.ai/v1"
          onChange={(e) => update('apiBaseUrl', e.target.value)}
        />
        <small>OpenAI-compatible base URL. The extension calls <code>{'{base}'}/chat/completions</code>.</small>
      </label>

      <label className="field">
        <span>API key</span>
        <div className="key-row">
          <input
            type={showKey ? 'text' : 'password'}
            value={settings.apiKey}
            placeholder="sk-…"
            onChange={(e) => update('apiKey', e.target.value)}
          />
          <button type="button" className="ghost" onClick={() => setShowKey((v) => !v)}>
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>

      <label className="field">
        <span>Default model</span>
        <input
          type="text"
          value={settings.defaultModel}
          placeholder="kimi-3"
          onChange={(e) => update('defaultModel', e.target.value)}
        />
        <small>Used when a flow does not specify its own model.</small>
      </label>

      <div className="actions">
        <button className="primary" onClick={save} disabled={status.kind === 'busy'}>
          Save
        </button>
        <button className="ghost" onClick={test} disabled={status.kind === 'busy'}>
          Test connection
        </button>
      </div>

      {status.message && <div className={`status ${status.kind}`}>{status.message}</div>}

      <footer>
        <span>Open a PR, file, or issue on GitHub and press </span>
        <kbd>Ctrl/⌘ + Shift + K</kbd>
      </footer>
    </div>
  );
}
