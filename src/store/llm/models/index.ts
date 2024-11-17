import gemma22b from './Gemma2-2B.ts';
import promptApi from './PromptAPI.ts';

// @ts-ignore
export default Boolean(window.ai) ? promptApi : gemma22b;
