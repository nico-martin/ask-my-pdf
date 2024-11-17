import React from 'react';

import { context } from './llmContext.ts';
import model from './models';
import WebLlm from '@store/llm/webllm/WebLlm.ts';
import PromptApi from '@store/llm/promptApi/PromptApi.ts';
import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/llm/types.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);

  const llmInterface: LlmInterface = React.useMemo(
    () =>
      model.title === 'PromptAPI'
        ? new PromptApi('You are a helpful AI assistant.')
        : new WebLlm('You are a helpful AI assistant.'),
    []
  );

  const initialize = (
    callback: (data: InitializeCallbackData) => void = () => {}
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      llmInterface
        .initialize(callback)
        .then(() => {
          setModelLoaded('web');
          resolve(true);
        })
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });
  };

  const generate = (
    prompt: string = '',
    callback: (data: GenerateCallbackData) => void = () => {}
  ): Promise<string> =>
    new Promise(async (resolve, reject) => {
      setWorkerBusy(true);
      try {
        const fullReply = await llmInterface.generate(prompt, (data) =>
          callback({
            output: data.output,
            stats: null,
          })
        );
        setWorkerBusy(false);
        resolve(fullReply);
      } catch (e) {
        setWorkerBusy(false);
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
