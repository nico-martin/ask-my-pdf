import Model from '../webllm/Model.ts';
import { ConvTemplateConfig, RuntimeStats } from '../webllm/static/types.ts';

export type WorkerRequest = {
  model: Model;
  conversationConfig: Partial<ConvTemplateConfig>;
  requestId: string;
  prompt?: string;
  rememberPreviousConversation?: boolean;
};

export type InitProgressEvent = {
  status: 'progress';
  requestId: string;
  progress: number;
  timeElapsed: number;
  text: string;
};

export type InitDoneEvent = {
  status: 'initDone';
  requestId: string;
};

export type ErrorEvent = {
  status: 'error';
  requestId: string;
  error: string;
};

export type UpdateEvent = {
  status: 'update';
  requestId: string;
  output: string;
  runtimeStats: RuntimeStats;
};

export type CompleteEvent = {
  status: 'complete';
  requestId: string;
  output?: string;
  runtimeStats?: RuntimeStats;
};

export type WorkerResponse =
  | InitProgressEvent
  | InitDoneEvent
  | ErrorEvent
  | UpdateEvent
  | CompleteEvent;
