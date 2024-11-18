import Model from '@store/llm/models/Model.ts';
import Cookies from 'js-cookie';

const getLlmCookie = (model: Model) => model.id + '-loaded';

export const getLlmDownloaded = (model: Model) =>
  Cookies.get(getLlmCookie(model)) === 'loaded' &&
  Cookies.get('suppressLoaded') !== 'true';

export const setLlmDownloaded = (model: Model) =>
  Cookies.set(getLlmCookie(model), 'loaded', { expires: 365 });
