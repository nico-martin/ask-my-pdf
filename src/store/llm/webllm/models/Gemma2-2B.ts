import Model from '../Model.ts';

const model = new Model({
  title: 'Gemma2-2B',
  url: 'https://uploads.nico.dev/mlc-llm-libs/gemma-2-2b-it-q4f16_1-MLC/',
  size: 1477070487,
  libUrl:
    'https://uploads.nico.dev/mlc-llm-libs/gemma-2-2b-it-q4f16_1-MLC/lib/gemma-2-2b-it-q4f16_1-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/google/gemma-2-2b',
  about:
    "Gemma2-2B, developed by Google Deepmind, is a lightweight large language model (LLM) built on the same research and technology as the powerful Gemini models. This means it inherits some of Gemini's capabilities while being designed for efficient operation on small devices.",
});

export default model;
