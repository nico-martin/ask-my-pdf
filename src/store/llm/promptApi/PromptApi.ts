import { GenerateCallbackData, LlmInterface } from '@store/llm/types.ts';

export type CompletionMessage = {
  content: string;
  role: 'system' | 'user' | 'assistant';
  error?: string;
};

class PromptApi implements LlmInterface {
  private session: any;
  public messages: Array<CompletionMessage> = [];
  private systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  public initialize = async (): Promise<boolean> => {
    // @ts-ignore
    if (!ai) {
      throw new Error('The Prompt API is not available');
    }

    // @ts-ignore
    this.session = await ai.languageModel.create({
      systemPrompt: this.systemPrompt,
    });
    this.messages = [
      {
        content: this.systemPrompt,
        role: 'system',
      },
    ];
    return true;
  };

  public generate = async (
    text: string,
    callback: (data: GenerateCallbackData) => void
  ): Promise<string> => {
    this.messages = [
      ...this.messages,
      {
        content: text,
        role: 'user',
      },
    ];

    const stream = this.session.promptStreaming(text);
    let answer = '';
    for await (const chunk of stream) {
      answer = chunk;
      callback({ output: answer, stats: null, modelId: 'prompt-api' });
    }
    this.messages = [
      ...this.messages,
      {
        content: answer,
        role: 'assistant',
      },
    ];

    return answer;
  };
}

export default PromptApi;
