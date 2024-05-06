import Model from '../Model';

const model = new Model({
  title: 'RedPajama-INCITE-Chat-3B-v1',
  url: 'https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC/resolve/main/',
  size: 1570720002,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f16_1-ctx2k-webgpu.wasm',
  //vram_required_MB: 2972.09,
  //low_resource_required: false,
  requiredFeatures: ['shader-f16'],
  cardLink: '',
});

export default model;
