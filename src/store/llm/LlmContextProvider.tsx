import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CallbackData, context } from './llmContext.ts';
import { GenerationState } from './webllm/static/types.ts';
import { dispatchWorkerEvent, onWorkerEvent } from './worker/client.ts';
import { WorkerRequest, WorkerResponse } from './worker/types.ts';
import Gemma2B from './webllm/models/Gemma2B.ts';

const model = Gemma2B;

const LlmContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [workerBusy, setWorkerBusy] = React.useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = React.useState<string>(null);

  const worker = React.useRef(null);

  React.useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL('./worker/worker.ts', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    const onMessageReceived = (e: MessageEvent<WorkerResponse>) =>
      dispatchWorkerEvent(e.data);

    worker.current.addEventListener('message', onMessageReceived);
    return () =>
      worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const postWorkerMessage = (
    payload: WorkerRequest,
    cb: (data: WorkerResponse) => void
  ) => {
    worker.current.postMessage(payload);
    onWorkerEvent(payload.requestId, (data: WorkerResponse) => cb(data));
  };

  const initialize = (
    callback: (data: CallbackData) => void = () => {}
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      model.id === modelLoaded && resolve(true);
      generate('', callback)
        .then(() => resolve(true))
        .catch(reject);
    });
  };

  const generate = (
    prompt: string = '',
    callback: (data: CallbackData) => void = () => {}
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      setWorkerBusy(true);
      const requestId = uuidv4();

      postWorkerMessage(
        {
          model,
          prompt,
          rememberPreviousConversation: false,
          conversationConfig: {},
          requestId,
        },
        (data: WorkerResponse) => {
          switch (data.status) {
            case 'progress': {
              callback({
                feedback: GenerationState.INITIALIZING,
                output: '',
                progress: data.progress,
              });
              break;
            }
            case 'initDone': {
              callback({
                feedback: GenerationState.THINKING,
                output: '',
                progress: 100,
              });
              setModelLoaded(model.id);
              break;
            }
            case 'update': {
              callback({
                feedback: GenerationState.ANSWERING,
                output: data.output || '',
                progress: 100,
              });
              break;
            }
            case 'complete': {
              callback({
                feedback: GenerationState.COMPLETE,
                output: data.output || '',
                progress: 100,
                stats: data?.runtimeStats || null,
              });
              setWorkerBusy(false);
              setModelLoaded(model.id);
              resolve(data.output);
              break;
            }
            case 'error': {
              setWorkerBusy(false);
              reject(data.error);
              break;
            }
          }
        }
      );
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
