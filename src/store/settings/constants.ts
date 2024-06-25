import { Settings } from './settingsContext.ts';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';

export const INITIAL_SETTINGS: Settings = {
  promptTemplate: `INSTRUCTIONS:
DOCUMENT contains parts of the {documentTitle}
Answer the users QUESTION using the DOCUMENT text below.
Keep your answer ground in the facts of the DOCUMENT.
If the DOCUMENT doesn’t contain the facts to answer the QUESTION return {NONE}
Answer in Markdown format

DOCUMENT:
{results}

QUESTION:
{question}`,
  resultsBeforeAndAfter: 5,
  similarityThreshold: 10,
  model: FeatureExtractionModel.ALL_MINILM_L6_V2,
};
