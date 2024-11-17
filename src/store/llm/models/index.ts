import gemma22b from './Gemma2-2B.ts';
import promptApi from './PromptAPI.ts';
import Model from '@store/llm/models/Model.ts';

const models: Array<{ model: Model; available: boolean }> = [
  // @ts-ignore
  { model: promptApi, available: Boolean(window.ai.languageModel) },
  { model: gemma22b, available: true },
].filter((m) => m.available);

export default models;
