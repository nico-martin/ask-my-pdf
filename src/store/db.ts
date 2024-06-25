import VectorDB, {
  Entry,
  FeatureExtractionModel,
} from '@utils/vectorDB/VectorDB.ts';

interface EntryMetadata {
  index: number;
  paragraphIndex: number;
}

export type VectorDBEntry = Entry<EntryMetadata>;

export type Model = FeatureExtractionModel;

const db = new VectorDB<EntryMetadata>();

export default db;
