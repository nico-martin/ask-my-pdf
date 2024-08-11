import { Settings } from './settingsContext.ts';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';

export const INITIAL_SETTINGS: Settings = {
  promptTemplate: `INSTRUCTIONS:
DOCUMENT contains parts of the {documentTitle}
Answer the users QUESTION using the DOCUMENT text below.
Keep your answer ground in the facts of the DOCUMENT.
If the DOCUMENT doesn’t contain the facts to answer the QUESTION, say that you can’t answer the question.
Answer in Markdown format

DOCUMENT:
{results}

QUESTION:
{question}`,
  resultsBeforeAndAfter: 3,
  maxNumberOfResults: 5,
  similarityThreshold: 60,
  featureExtractionModel: FeatureExtractionModel.ALL_MINILM_L6_V2,
};

export const FEATURE_EXTRACTION_MODEL_METAS: Record<
  FeatureExtractionModel,
  { name: string; url: string }
> = {
  [FeatureExtractionModel.ALL_MINILM_L6_V2]: {
    name: 'all-MiniLM-L6-v2',
    url: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2',
  },
  [FeatureExtractionModel.ALL_MPNET_BASE_V2]: {
    name: 'all-mpnet-base-v2',
    url: 'https://huggingface.co/sentence-transformers/all-mpnet-base-v2',
  },
  [FeatureExtractionModel.MIXEDBREAD_AI_EMBED_LARGE_V1]: {
    name: 'mxbai-embed-large-v1',
    url: 'https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1',
  },
  [FeatureExtractionModel.PARAPHRASE_MULTILINGUAL_MINILM_L12_V2]: {
    name: 'paraphrase-multilingual-MiniLM-L12-v2',
    url: 'https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
  },
};
