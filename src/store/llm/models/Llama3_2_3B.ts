import Model from './Model.ts';

const llama_3_2_3B = new Model({
  title: 'Llama-3.2-3B-IT',
  url: 'https://huggingface.co/mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC',
  size: 1823746859,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_48/Llama-3.2-3B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  cardLink: 'https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct',
  about:
    'The Llama 3.2 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction-tuned generative models in 1B and 3B sizes (text in/text out). The Llama 3.2 instruction-tuned text only models are optimized for multilingual dialogue use cases, including agentic retrieval and summarization tasks. They outperform many of the available open source and closed chat models on common industry benchmarks.',
});

export default llama_3_2_3B;
