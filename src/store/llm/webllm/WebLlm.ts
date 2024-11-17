import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/llm/types.ts';

import model from '../models';
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';

class WebLlm implements LlmInterface {
  private systemPrompt: string;
  private engine: MLCEngine = null;
  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  public initialize = async (
    callback: (data: InitializeCallbackData) => void
  ): Promise<boolean> => {
    this.engine = await CreateMLCEngine(model.id, {
      initProgressCallback: callback,
      appConfig: {
        model_list: [
          {
            model: model.url,
            model_id: model.id,
            model_lib: model.libUrl,
          },
        ],
      },
    });
    return true;
  };

  public generate = async (
    text: string,
    callback: (data: GenerateCallbackData) => void
  ): Promise<string> => {
    const chunks = await this.engine.chat.completions.create({
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 1,
      stream: true,
      stream_options: { include_usage: true },
    });

    let reply = '';
    for await (const chunk of chunks) {
      reply += chunk.choices[0]?.delta.content || '';
      if (chunk.usage) {
        callback({ output: reply, stats: chunk.usage });
      } else {
        callback({ output: reply });
      }
    }

    return await this.engine.getMessage();
  };
}

export default WebLlm;
