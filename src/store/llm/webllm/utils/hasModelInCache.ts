import * as tvmjs from '@nico-martin/tvmjs';
import { MODEL_CACHE_SCOPE } from '../static/constants';
import Model from '../Model';

const hasModelInCache = async (model: Model): Promise<boolean> =>
  await tvmjs.hasNDArrayInCache(model.url, MODEL_CACHE_SCOPE);

export default hasModelInCache;
