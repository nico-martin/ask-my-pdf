import React from 'react';

import { CallbackData, context } from './llmContext.ts';
import model from './webllm/models';
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import { InitProgressCallback } from '@mlc-ai/web-llm/lib/types';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);
  const [engine, setEngine] = React.useState<MLCEngine>(null);

  const initialize = (
    callback: InitProgressCallback = () => {}
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      model.id === modelLoaded && resolve(true);
      CreateMLCEngine(model.id, {
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
      })
        .then((engine) => {
          setEngine(engine);
          setModelLoaded(model.id);
          resolve(true);
        })
        .catch(reject);
    });
  };

  const generate = (
    prompt: string = '',
    callback: (data: CallbackData) => void = () => {}
  ): Promise<string> =>
    new Promise(async (resolve, reject) => {
      setWorkerBusy(true);

      try {
        const chunks = await engine.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: prompt },
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

        const fullReply = await engine.getMessage();
        setWorkerBusy(false);
        resolve(fullReply);
      } catch (e) {
        reject(e);
      }
    });

  return (
    <context.Provider
      value={{
        ready: Boolean(modelLoaded),
        busy: workerBusy,
        initialize,
        generate,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
