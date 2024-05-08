import Generator from '../webllm/Generator.ts';
import Model from '../webllm/Model.ts';
import {
  ConvTemplateConfig,
  InitProgressCallback,
} from '../webllm/static/types.ts';
import { WorkerRequest, WorkerResponse } from './types';

const postMessage = (e: WorkerResponse) => self.postMessage(e);

class GeneratorInstance {
  public model: Model = null;
  private static instance: GeneratorInstance = null;
  private generator: Generator = null;
  private conversationConfig: Partial<ConvTemplateConfig> = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GeneratorInstance();
    }
    return this.instance;
  }

  public async loadGenerator(
    model: Model,
    conversationConfig: Partial<ConvTemplateConfig>,
    callback: InitProgressCallback
  ): Promise<Generator> {
    if (
      model.id === this.model?.id &&
      JSON.stringify(conversationConfig) ===
        JSON.stringify(this.conversationConfig) &&
      this.generator
    ) {
      return this.generator;
    }
    if (this.generator) {
      await this.generator.unload();
    }

    const generator = new Generator(model, conversationConfig);
    generator.setInitProgressCallback(callback);
    await generator.load();

    this.model = model;
    this.conversationConfig = conversationConfig;
    this.generator = generator;
    return this.generator;
  }
}

self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const instance = GeneratorInstance.getInstance();
  try {
    const generator = await instance.loadGenerator(
      event.data.model,
      event.data.conversationConfig,
      (x) => {
        postMessage({
          status: 'progress',
          requestId: event.data.requestId,
          progress: x.progress,
          timeElapsed: x.timeElapsed,
          text: x.text,
        });
      }
    );

    if (!event.data.prompt) {
      postMessage({
        status: 'complete',
        requestId: event.data.requestId,
      });
      return;
    }

    postMessage({
      status: 'initDone',
      requestId: event.data.requestId,
    });

    const output = await generator.generate(
      event.data.prompt,
      (_step, message) => {
        postMessage({
          status: 'update',
          requestId: event.data.requestId,
          output: message,
          runtimeStats: generator.getRuntimeStats(),
        });
      },
      event.data.rememberPreviousConversation
    );
    postMessage({
      status: 'complete',
      requestId: event.data.requestId,
      output,
      runtimeStats: generator.getRuntimeStats(),
    });
  } catch (e) {
    console.log('error', e);
    postMessage({
      status: 'error',
      requestId: event.data.requestId,
      // @ts-ignore
      error: e.message,
    });
  }
});
