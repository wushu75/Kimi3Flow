// All UI styles live in a string so they can be injected into the shadow root,
// keeping GitHub's stylesheet and ours fully isolated from each other.

export const STYLES = `
:host, * { box-sizing: border-box; }

.k3f-root {
  --k3f-bg: #050608;
  --k3f-panel: #0d1017;
  --k3f-panel-2: #12161f;
  --k3f-border: #1e2530;
  --k3f-text: #e7ecf3;
  --k3f-dim: #8b94a3;
  --k3f-accent: #22d3ee;
  --k3f-accent-2: #38bdf8;
  --k3f-danger: #f87171;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--k3f-text);
  font-size: 14px;
  line-height: 1.5;
}

/* ---- Command palette ---- */
.k3f-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14vh;
  background: rgba(3, 5, 8, 0.55);
  backdrop-filter: blur(3px);
  animation: k3f-fade 120ms ease-out;
}

.k3f-palette {
  width: min(620px, 92vw);
  background: var(--k3f-panel);
  border: 1px solid var(--k3f-border);
  border-radius: 14px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 211, 238, 0.08);
  overflow: hidden;
  animation: k3f-pop 140ms cubic-bezier(0.2, 0.9, 0.3, 1);
}

.k3f-search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--k3f-border);
}

.k3f-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--k3f-accent);
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.k3f-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--k3f-text);
  font-size: 16px;
}
.k3f-input::placeholder { color: var(--k3f-dim); }

.k3f-list {
  max-height: 46vh;
  overflow-y: auto;
  padding: 6px;
}

.k3f-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 9px;
  cursor: pointer;
}
.k3f-item[data-active="true"] {
  background: var(--k3f-panel-2);
  outline: 1px solid rgba(34, 211, 238, 0.35);
}
.k3f-item-label { font-weight: 600; }
.k3f-item-desc { font-size: 12.5px; color: var(--k3f-dim); }

.k3f-empty { padding: 24px 16px; text-align: center; color: var(--k3f-dim); }

.k3f-hint {
  display: flex;
  gap: 14px;
  padding: 10px 16px;
  border-top: 1px solid var(--k3f-border);
  color: var(--k3f-dim);
  font-size: 12px;
}
.k3f-kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--k3f-panel-2);
  border: 1px solid var(--k3f-border);
  border-radius: 5px;
  padding: 1px 6px;
  font-size: 11px;
}

/* ---- Result panel ---- */
.k3f-panel-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(560px, 96vw);
  z-index: 2147483647;
  background: var(--k3f-panel);
  border-left: 1px solid var(--k3f-border);
  box-shadow: -18px 0 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  animation: k3f-slide 180ms cubic-bezier(0.2, 0.9, 0.3, 1);
}

.k3f-panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--k3f-border);
}
.k3f-panel-title { font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k3f-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(34, 211, 238, 0.25);
  border-top-color: var(--k3f-accent);
  animation: k3f-spin 700ms linear infinite;
}

.k3f-icon-btn {
  background: transparent;
  border: 1px solid var(--k3f-border);
  color: var(--k3f-dim);
  border-radius: 8px;
  width: 30px; height: 30px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.k3f-icon-btn:hover { color: var(--k3f-text); border-color: var(--k3f-accent); }

.k3f-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13.5px;
}
.k3f-panel-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--k3f-panel-2);
  padding: 1px 4px;
  border-radius: 4px;
}
.k3f-error { color: var(--k3f-danger); }

.k3f-panel-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-top: 1px solid var(--k3f-border);
}
.k3f-btn {
  background: var(--k3f-panel-2);
  border: 1px solid var(--k3f-border);
  color: var(--k3f-text);
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.k3f-btn:hover { border-color: var(--k3f-accent); }
.k3f-btn-primary {
  background: linear-gradient(135deg, var(--k3f-accent), var(--k3f-accent-2));
  border-color: transparent;
  color: #04212a;
}
.k3f-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.k3f-toast {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--k3f-panel-2);
  border: 1px solid var(--k3f-accent);
  color: var(--k3f-text);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
}

@keyframes k3f-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes k3f-pop { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes k3f-slide { from { transform: translateX(24px); opacity: 0.6; } to { transform: none; opacity: 1; } }
@keyframes k3f-spin { to { transform: rotate(360deg); } }
`;
