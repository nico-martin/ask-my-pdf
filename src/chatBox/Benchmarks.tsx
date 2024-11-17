import React from 'react';
import cn from '@utils/classnames.ts';
import useRagContext from '@store/ragContext/useRagContext.ts';
import { formatMilliseconds } from '@utils/functions.ts';
import llm from '../store/llm/models';

import styles from './Benchmarks.module.css';
import useSettingsContext from '@store/settings/useSettingsContext.ts';
import { FEATURE_EXTRACTION_MODEL_METAS } from '@store/settings/constants.ts';

const Benchmarks: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { benchmarks } = useRagContext();
  const { settings } = useSettingsContext();
  return (
    <div className={cn(className, styles.root)}>
      <h3>Benchmarks</h3>
      <ul className={styles.list}>
        <li>
          PDF parsed in <b>{formatMilliseconds(benchmarks.pdfParsedMillis)}</b>{' '}
          with{' '}
          <a href="https://www.npmjs.com/package/pdfjs-dist" target="_blank">
            PDF.js
          </a>
        </li>
        <li>
          <b>{benchmarks.entriesVectorized}</b> strings vectorized in{' '}
          <b>{formatMilliseconds(benchmarks.entriesVectorizedMillis)}</b> using{' '}
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
          <b>{benchmarks.searchDbCount}</b> matching entries found in{' '}
          <b>{formatMilliseconds(benchmarks.searchDbMillis)}</b>
        </li>
        <li>
          Answer generated with{' '}
          <a href={llm.cardLink} target="_blank">
            {llm.title}
          </a>{' '}
          in <b>{formatMilliseconds(benchmarks.generatedMillis)}</b>
        </li>
      </ul>
    </div>
  );
};

export default Benchmarks;
