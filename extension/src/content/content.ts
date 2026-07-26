import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { KimiFlow, RuntimeMessage } from '../types';
import { Overlay } from './ui/Overlay';
import { STYLES } from './ui/styles';
import flowsData from '../flows/github.json';

const flows = flowsData as KimiFlow[];

const HOST_ID = 'kimi3flow-host';
let root: Root | null = null;
let visible = false;

function ensureHost(): HTMLElement {
  let host = document.getElementById(HOST_ID);
  if (host) return host;

  host = document.createElement('div');
  host.id = HOST_ID;
  // Sit above everything; the inner UI positions itself.
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.zIndex = '2147483647';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = STYLES;
  shadow.appendChild(style);

  const mount = document.createElement('div');
  shadow.appendChild(mount);
  root = createRoot(mount);
  return host;
}

function render() {
  ensureHost();
  root?.render(
    visible
      ? React.createElement(Overlay, { flows, onRequestClose: close })
      : null,
  );
}

function open() {
  visible = true;
  render();
}

function close() {
  visible = false;
  render();
}

function toggle() {
  visible ? close() : open();
}

chrome.runtime.onMessage.addListener((message: RuntimeMessage) => {
  if (message.type === 'TOGGLE_PALETTE') toggle();
});

// Close on Escape even if focus is outside the shadow root.
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && visible) {
    close();
  }
});
