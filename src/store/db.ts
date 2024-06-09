import VectorDB, { Entry } from '@utils/vectorDB/VectorDB.ts';

interface EntryMetadata {
  index: number;
  paragraphIndex: number;
}

export type VectorDBEntry = Entry<EntryMetadata>;

const db = new VectorDB<EntryMetadata>();

export default db;
