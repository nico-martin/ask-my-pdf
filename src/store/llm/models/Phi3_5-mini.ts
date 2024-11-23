import Model from './Model.ts';

const phi3_5_mini = new Model({
  title: 'Phi3-5-mini',
  url: 'https://huggingface.co/mlc-ai/Phi-3.5-mini-instruct-q4f16_1-MLC',
  size: 2158444553,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_48/Phi-3.5-mini-instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct',
  about:
    'Phi-3.5-mini is a lightweight, state-of-the-art open model built upon datasets used for Phi-3 - synthetic data and filtered publicly available websites - with a focus on very high-quality, reasoning dense data. The model belongs to the Phi-3 model family and supports 128K token context length. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning, proximal policy optimization, and direct preference optimization to ensure precise instruction adherence and robust safety measures.',
});

export default phi3_5_mini;
