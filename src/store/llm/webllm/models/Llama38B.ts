import Model from '../Model';

const model = new Model({
  title: 'Llama3-8B',
  url: 'https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC/resolve/main/',
  size: 4536560114,
  libUrl:
    'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_34/Llama-3-8B-Instruct-q4f32_1-ctx1k_cs1k-webgpu.wasm',
  //requiredFeatures: ['shader-f16'],
  //vram_required_MB: 5295.70,
  //low_resource_required: true,
  cardLink: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B',
  about: 'Llama 3',
  /*
  "model_url": "",
  "model_id": "Llama-3-8B-Instruct-q4f32_1-1k",
  "model_lib_url": modelLibURLPrefix + modelVersion + "/Llama-3-8B-Instruct-q4f32_1-ctx1k_cs1k-webgpu.wasm",
  "vram_required_MB": 5295.70,
  "low_resource_required": true,*/
});

export default model;
