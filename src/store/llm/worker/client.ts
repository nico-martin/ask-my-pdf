import { WorkerResponse } from './types';

export const getWorkerEventKey = (requestId: string): string =>
  `webllmworker-${requestId}`;

export const dispatchWorkerEvent = (data: WorkerResponse) => {
  const requestId = data.requestId;
  const event = new CustomEvent(getWorkerEventKey(requestId), {
    detail: data,
  });
  document.dispatchEvent(event);
};

export const onWorkerEvent = (
  requestId: string,
  callback: (data: WorkerResponse) => void
) =>
  document.addEventListener(getWorkerEventKey(requestId), (e) => {
    callback((e as CustomEvent<WorkerResponse>).detail);
  });
