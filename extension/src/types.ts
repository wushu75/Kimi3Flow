// Shared types used across content script, background worker and options page.

export type KimiFlowContext = 'pull_request' | 'file' | 'issue';

export interface KimiFlow {
  id: string;
  label: string;
  context: KimiFlowContext;
  description?: string;
  promptTemplate: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/** Values extracted from a GitHub page, used to fill prompt placeholders. */
export interface PageContext {
  context: KimiFlowContext | null;
  /** Human-readable title (PR title, file path, or issue title). */
  title: string;
  /** Placeholder values keyed by name, e.g. { diff, file_contents, issue_body }. */
  vars: Record<string, string>;
  /** Original page URL. */
  url: string;
}

/** Persisted extension settings. */
export interface KimiSettings {
  apiBaseUrl: string;
  apiKey: string;
  defaultModel: string;
}

export const DEFAULT_SETTINGS: KimiSettings = {
  // OpenAI-compatible endpoint. Kimi / Moonshot exposes one at /v1.
  apiBaseUrl: 'https://api.moonshot.ai/v1',
  apiKey: '',
  defaultModel: 'kimi-3',
};

// ---- Messaging contracts ----

/** Sent from the service worker to a tab when the shortcut fires. */
export interface TogglePaletteMessage {
  type: 'TOGGLE_PALETTE';
}

/** Ping from content script to check settings are present. */
export interface GetSettingsMessage {
  type: 'GET_SETTINGS';
}

export type RuntimeMessage = TogglePaletteMessage | GetSettingsMessage;

/** Request opened over a long-lived Port to stream a completion. */
export interface StreamRequest {
  type: 'STREAM_START';
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

/** Chunks streamed back over the Port. */
export type StreamResponse =
  | { type: 'STREAM_DELTA'; text: string }
  | { type: 'STREAM_DONE' }
  | { type: 'STREAM_ERROR'; error: string };

export const STREAM_PORT = 'kimi-stream';
