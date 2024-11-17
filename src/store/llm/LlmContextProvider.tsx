import React from 'react';

import { context } from './llmContext.ts';
import models from './models';
import WebLlm from '@store/llm/webllm/WebLlm.ts';
import PromptApi from '@store/llm/promptApi/PromptApi.ts';
import {
  GenerateCallbackData,
  InitializeCallbackData,
  LlmInterface,
} from '@store/llm/types.ts';
import useSettingsContext from '@store/settings/useSettingsContext.ts';

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);
  const { settings } = useSettingsContext();
  const model = React.useMemo(
    () =>
      models.find((m) => m.model.id === settings.languageModelId)?.model ||
      models[0].model,
    [settings.languageModelId]
  );

  const llmInterface: LlmInterface = React.useMemo(
    () =>
      model.id === 'prompt-api'
        ? new PromptApi('You are a helpful AI assistant.')
        : new WebLlm('You are a helpful AI assistant.', model),
    [model]
  );

  const initialize = (
    callback: (data: InitializeCallbackData) => void = () => {}
  ): Promise<boolean> =>
    new Promise((resolve, reject) => {
      llmInterface
        .initialize(callback)
        .then(() => {
          setModelLoaded(model.id);
          resolve(true);
        })
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });

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
        ready: modelLoaded === model.id,
        busy: workerBusy,
        initialize,
        generate,
        model,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default LlmContextProvider;
