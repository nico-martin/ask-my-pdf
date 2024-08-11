export interface RuntimeStats {
  prefillTotalTokens: number;
  prefillTotalTime: number;
  prefillTokensPerSec: number;
  decodingTotalTokens: number;
  decodingTotalTime: number;
  decodingTokensPerSec: number;
}

export enum GenerationState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  THINKING = 'THINKING',
  ANSWERING = 'ANSWERING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}
