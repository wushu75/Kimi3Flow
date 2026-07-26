import React, { useMemo, useState } from 'react';
import type { KimiFlow, KimiFlowContext, StreamRequest, StreamResponse } from '../../types';
import { STREAM_PORT } from '../../types';
import { getPageContext, fillTemplate, detectContext } from '../github-context';
import { CommandPalette } from './CommandPalette';
import { ResultPanel } from './ResultPanel';

interface Props {
  flows: KimiFlow[];
  onRequestClose: () => void;
}

const CONTEXT_LABELS: Record<KimiFlowContext, string> = {
  pull_request: 'Pull Request',
  file: 'File',
  issue: 'Issue',
};

function insertIntoCommentBox(text: string): boolean {
  const selectors = [
    'textarea[name="comment[body]"]',
    'textarea#new_comment_field',
    'textarea[aria-label="Comment body"]',
    '[data-testid="comment-composer-input"] textarea',
    'textarea.js-comment-field',
  ];
  for (const sel of selectors) {
    const ta = document.querySelector<HTMLTextAreaElement>(sel);
    if (ta) {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
      const next = (ta.value ? ta.value + '\n\n' : '') + text;
      setter ? setter.call(ta, next) : (ta.value = next);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.focus();
      ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
  }
  return false;
}

export function Overlay({ flows, onRequestClose }: Props) {
  const context = useMemo(() => detectContext(location.pathname), []);
  const [view, setView] = useState<'palette' | 'result'>('palette');
  const [selected, setSelected] = useState<KimiFlow | null>(null);
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contextFlows = useMemo(
    () => (context ? flows.filter((f) => f.context === context) : []),
    [flows, context],
  );
  const contextLabel = context ? CONTEXT_LABELS[context] : 'Unsupported page';

  async function runFlow(flow: KimiFlow) {
    setSelected(flow);
    setView('result');
    setText('');
    setError(null);
    setStreaming(true);

    let prompt: string;
    try {
      const ctx = await getPageContext();
      prompt = fillTemplate(flow.promptTemplate, ctx.vars);
    } catch (e) {
      setError(`Could not read the page: ${(e as Error).message}`);
      setStreaming(false);
      return;
    }

    let acc = '';
    let port: chrome.runtime.Port;
    try {
      port = chrome.runtime.connect({ name: STREAM_PORT });
    } catch (e) {
      setError(`Extension context unavailable: ${(e as Error).message}`);
      setStreaming(false);
      return;
    }

    port.onMessage.addListener((msg: StreamResponse) => {
      if (msg.type === 'STREAM_DELTA') {
        acc += msg.text;
        setText(acc);
      } else if (msg.type === 'STREAM_DONE') {
        setStreaming(false);
        port.disconnect();
      } else if (msg.type === 'STREAM_ERROR') {
        setError(msg.error);
        setStreaming(false);
        port.disconnect();
      }
    });

    port.onDisconnect.addListener(() => setStreaming(false));

    const req: StreamRequest = {
      type: 'STREAM_START',
      prompt,
      model: flow.model ?? '',
      maxTokens: flow.maxTokens,
      temperature: flow.temperature,
    };
    port.postMessage(req);
  }

  if (view === 'result' && selected) {
    return (
      <div className="k3f-root">
        <ResultPanel
          title={selected.label}
          text={text}
          streaming={streaming}
          error={error}
          canInsert={context === 'pull_request' || context === 'issue'}
          onInsert={insertIntoCommentBox}
          onClose={onRequestClose}
        />
      </div>
    );
  }

  return (
    <div className="k3f-root">
      <CommandPalette
        flows={contextFlows}
        contextLabel={contextLabel}
        onSelect={runFlow}
        onClose={onRequestClose}
      />
    </div>
  );
}
