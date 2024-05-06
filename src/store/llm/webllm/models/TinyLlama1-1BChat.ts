import Model from '../Model';

const model = new Model({
  title: 'TinyLlama-1-1B-chat',
  url: 'https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v0.4-q0f16-MLC/resolve/main/',
  size: 2206894175,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/TinyLlama-1.1B-Chat-v0.4/TinyLlama-1.1B-Chat-v0.4-q0f16-ctx2k-webgpu.wasm',
  requiredFeatures: ['shader-f16'],
  //vram_required_MB: 5063.52,
  //low_resource_required: false,
  cardLink: '',
});

export default model;
