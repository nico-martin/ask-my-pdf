import Model from './Model.ts';

const gemma2_9B = new Model({
  title: 'Gemma2-9B',
  url: 'https://uploads.nico.dev/mlc-llm-libs/gemma-2-9b-it_q4f16_MLC/',
  size: 4677059380,
  libUrl:
    'https://uploads.nico.dev/mlc-llm-libs/gemma-2-9b-it_q4f16_MLC/lib/gemma-2-9b-it-q4f16_1-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/google/gemma-2-9b-it',
  about:
    "The Gemma2 9B model is a compact, state-of-the-art text generation model from Google's Gemma family. It excels in tasks like question answering, summarization, and reasoning, and is small enough to run on resource-limited devices, making advanced AI accessible and fostering innovation.",
});

export default gemma2_9B;
