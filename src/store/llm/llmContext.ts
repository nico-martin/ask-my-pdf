import React from "react";

import { RuntimeStats } from "./webllm/static/types.ts";

export interface CallbackData {
  feedback: string;
  progress: number;
  output: string;
  stats?: RuntimeStats;
}

export interface Context {
  initialize: (callback: (data: CallbackData) => void) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: CallbackData) => void,
  ) => Promise<string>;
  ready: boolean;
  busy: boolean;
}

export const context = React.createContext<Context>({
  initialize: async () => true,
  generate: async () => "",
  ready: false,
  busy: false,
});
