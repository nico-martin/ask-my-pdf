import React from 'react';
import {
  GenerateCallbackData,
  InitializeCallbackData,
} from '@store/llm/types.ts';
import Model from '@store/llm/models/Model.ts';

export interface Context {
  initialize: (
    callback?: (data: InitializeCallbackData) => void
  ) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: GenerateCallbackData) => void
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
  model: Model;
}

export const context = React.createContext<Context>({
  initialize: async () => true,
  generate: async () => '',
  ready: false,
  busy: false,
  model: null,
});
