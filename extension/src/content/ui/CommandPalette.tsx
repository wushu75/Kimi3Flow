import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { KimiFlow } from '../../types';
import { fuzzyFilter } from '../fuzzy';

interface Props {
  flows: KimiFlow[];
  contextLabel: string;
  onSelect: (flow: KimiFlow) => void;
  onClose: () => void;
}

export function CommandPalette({ flows, contextLabel, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => fuzzyFilter(query, flows, (f) => `${f.label} ${f.description ?? ''}`),
    [query, flows],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the active row visible.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const flow = results[active];
      if (flow) onSelect(flow);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="k3f-overlay" onMouseDown={onClose}>
      <div className="k3f-palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="k3f-search-row">
          <span className="k3f-badge">{contextLabel}</span>
          <input
            ref={inputRef}
            className="k3f-input"
            placeholder="Type a command… (e.g. review, tests, explain)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="k3f-list" ref={listRef}>
          {results.length === 0 ? (
            <div className="k3f-empty">No commands match “{query}”.</div>
          ) : (
            results.map((flow, i) => (
              <div
                key={flow.id}
                className="k3f-item"
                data-active={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => onSelect(flow)}
              >
                <span className="k3f-item-label">{flow.label}</span>
                {flow.description && <span className="k3f-item-desc">{flow.description}</span>}
              </div>
            ))
          )}
        </div>

        <div className="k3f-hint">
          <span>
            <span className="k3f-kbd">↑</span> <span className="k3f-kbd">↓</span> navigate
          </span>
          <span>
            <span className="k3f-kbd">↵</span> run
          </span>
          <span>
            <span className="k3f-kbd">esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
}
