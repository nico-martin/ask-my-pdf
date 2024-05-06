export interface ConvTemplateConfig {
  system: string;
  roles: Array<string>;
  seps: Array<string>;
  separator_style: string;
  offset: number;
  stop_str: string;
  add_bos: boolean;
  stop_tokens: Array<number>;
}

export interface ChatConfig {
  // Only used in MLC
  mean_gen_len?: number;
  shift_fill_factor?: number;
  repetition_penalty?: number;

  top_p: number;
  temperature: number;
  max_gen_len?: number | null;
  bos_token_id?: number;

  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | Array<string>;
  n?: number;

  tokenizer_files: Array<string>;
  conv_config?: Partial<ConvTemplateConfig>;
  conv_template: string;
}

export type InitProgressCallback = (report: InitProgressCallbackReport) => void;

export type InitProgressCallbackReport = {
  progress: number;
  timeElapsed: number;
  text: string;
};

export type GenerateProgressCallback = (
  step: number,
  currentMessage: string
) => void;

export enum GenerationState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  THINKING = 'THINKING',
  ANSWERING = 'ANSWERING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface RuntimeStats {
  prefillTotalTokens: number;
  prefillTotalTime: number;
  prefillTokensPerSec: number;
  decodingTotalTokens: number;
  decodingTotalTime: number;
  decodingTokensPerSec: number;
}

export interface FullStats extends RuntimeStats {
  gpuAdapter: GPUAdapterInfo;
}

export type ChatCompletionFinishReason =
  | 'stop'
  | 'length'
  | 'tool_calls'
  | 'abort';
