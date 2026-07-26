import React, { useEffect, useRef, useState } from 'react';

interface Props {
  title: string;
  text: string;
  streaming: boolean;
  error: string | null;
  canInsert: boolean;
  onInsert: (text: string) => boolean;
  onClose: () => void;
}

export function ResultPanel({ title, text, streaming, error, canInsert, onInsert, onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pinnedBottom, setPinnedBottom] = useState(true);

  // Auto-scroll while streaming, unless the user scrolled up.
  useEffect(() => {
    const el = bodyRef.current;
    if (el && pinnedBottom) el.scrollTop = el.scrollHeight;
  }, [text, pinnedBottom]);

  function onScroll() {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setPinnedBottom(atBottom);
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function copy(content: string, label: string) {
    try {
      await navigator.clipboard.writeText(content);
      flash(label);
    } catch {
      flash('Copy failed — check clipboard permission');
    }
  }

  const asComment = `${text.trim()}\n\n<sub>🤖 Drafted with Kimi3Flow</sub>`;
  const hasContent = text.trim().length > 0;

  return (
    <div className="k3f-panel-wrap" onMouseDown={(e) => e.stopPropagation()}>
      <div className="k3f-panel-head">
        {streaming && <span className="k3f-spinner" />}
        <span className="k3f-panel-title" title={title}>
          {title}
        </span>
        <button className="k3f-icon-btn" title="Close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="k3f-panel-body" ref={bodyRef} onScroll={onScroll}>
        {error ? (
          <span className="k3f-error">⚠ {error}</span>
        ) : (
          text || (streaming ? 'Thinking…' : '')
        )}
      </div>

      <div className="k3f-panel-actions">
        <button
          className="k3f-btn k3f-btn-primary"
          disabled={!hasContent}
          onClick={() => copy(text, 'Copied as Markdown')}
        >
          Copy as Markdown
        </button>
        <button
          className="k3f-btn"
          disabled={!hasContent}
          onClick={() => copy(asComment, 'Copied as comment')}
        >
          Copy as GitHub comment
        </button>
        {canInsert && (
          <button
            className="k3f-btn"
            disabled={!hasContent}
            onClick={() => flash(onInsert(text) ? 'Inserted into comment box' : 'No comment box found')}
          >
            Insert into comment box
          </button>
        )}
      </div>

      {toast && <div className="k3f-toast">{toast}</div>}
    </div>
  );
}
