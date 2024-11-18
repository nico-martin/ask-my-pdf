import gemma2_9b from './Gemma2-9B.ts';
import gemma2_2b from './Gemma2-2B.ts';
//import gemma2_27b from './Gemma2-27B.ts';
import promptApi from './PromptAPI.ts';
import Model from '@store/llm/models/Model.ts';

const models: Array<{ model: Model; available: boolean }> = [
  // @ts-ignore
  { model: promptApi, available: Boolean(window?.ai?.languageModel) },
  { model: gemma2_2b, available: true },
  { model: gemma2_9b, available: true },
  /*{ model: gemma2_27b, available: true },*/
].filter((m) => m.available);

export default models;
