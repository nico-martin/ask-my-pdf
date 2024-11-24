import React from 'react';
import cn from '@utils/classnames.ts';
import useRagContext from '@store/ragContext/useRagContext.ts';
import { formatMilliseconds } from '@utils/functions.ts';

import styles from './Benchmarks.module.css';
import useSettingsContext from '@store/settings/useSettingsContext.ts';
import { FEATURE_EXTRACTION_MODEL_METAS } from '@store/settings/constants.ts';
import models from '@store/llm/models';

const Benchmarks: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { processMeta } = useRagContext();
  const { settings } = useSettingsContext();

  const model =
    models.find((model) => model.model.id === processMeta?.modelId) ||
    models[0];

  return !processMeta?.benchmarks ? null : (
    <div className={cn(className, styles.root)}>
      <h3>Benchmarks</h3>
      <ul className={styles.list}>
        <li>
          PDF parsed in{' '}
          <b>{formatMilliseconds(processMeta.benchmarks.pdfParsedMillis)}</b>{' '}
          with{' '}
          <a href="https://www.npmjs.com/package/pdfjs-dist" target="_blank">
            PDF.js
          </a>
        </li>
        <li>
          <b>{processMeta.benchmarks.entriesVectorized}</b> strings vectorized
          in{' '}
          <b>
            {formatMilliseconds(processMeta.benchmarks.entriesVectorizedMillis)}
          </b>{' '}
          using{' '}
          <a
            href={
              FEATURE_EXTRACTION_MODEL_METAS[settings.featureExtractionModel]
                .url
            }
            target="_blank"
          >
            {
              FEATURE_EXTRACTION_MODEL_METAS[settings.featureExtractionModel]
                .name
            }
          </a>{' '}
          with{' '}
          <a href="https://github.com/xenova/transformers.js" target="_blank">
            TransformersJS
          </a>{' '}
          and stored in{' '}
          <a
            href="https://gist.github.com/nico-martin/64f2ae35ed9a0f890ef50c8d119a6222"
            target="_blank"
          >
            VectorDB.ts
          </a>
        </li>
        <li>
          <b>{processMeta.benchmarks.searchDbCount}</b> matching entries found
          in <b>{formatMilliseconds(processMeta.benchmarks.searchDbMillis)}</b>
        </li>
        <li>
          Answer generated with{' '}
          <a href={model.model.cardLink} target="_blank">
            {model.model.title}
          </a>{' '}
          in <b>{formatMilliseconds(processMeta.benchmarks.generatedMillis)}</b>
        </li>
      </ul>
    </div>
  );
};

export default Benchmarks;
