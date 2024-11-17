export interface InitializeCallbackData {
  progress: number;
  timeElapsed: number;
  text: string;
}

export interface GenerateCallbackStats {
  completion_tokens?: number;
  extra?: {
    decode_tokens_per_s: number;
    prefill_tokens_per_s: number;
  };
  prompt_tokens?: number;
  total_tokens?: number;
}

export interface GenerateCallbackData {
  output: string;
  stats?: GenerateCallbackStats;
}

export interface LlmInterface {
  initialize: (
    callback?: (data: InitializeCallbackData) => void
  ) => Promise<boolean>;
  generate: (
    prompt: string,
    callback: (data: GenerateCallbackData) => void
  ) => Promise<string>;
}
