import Model from './Model.ts';

const model = new Model({
  title: 'Gemma2-2B',
  url: 'https://uploads.nico.dev/mlc-llm-libs/gemma-2-2b-it-q4f16_1-MLC/',
  size: 1477070487,
  libUrl:
    'https://uploads.nico.dev/mlc-llm-libs/gemma-2-2b-it-q4f16_1-MLC/lib/gemma-2-2b-it-q4f16_1-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/google/gemma-2-2b',
  about:
    "The Gemma2 2B model is a compact, state-of-the-art text generation model from Google's Gemma family. It excels in tasks like question answering, summarization, and reasoning, and is small enough to run on resource-limited devices, making advanced AI accessible and fostering innovation.",
});

export default model;
