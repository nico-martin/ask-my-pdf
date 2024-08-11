import React from 'react';

import { InitProgressCallback } from '@mlc-ai/web-llm/lib/types';
import { CompletionUsage } from '@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion';

export interface CallbackData {
  output: string;
  stats?: CompletionUsage;
}

export interface Context {
  initialize: (callback?: InitProgressCallback) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: CallbackData) => void
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
}

export const context = React.createContext<Context>({
  initialize: async () => true,
  generate: async () => '',
  ready: false,
  busy: false,
});
