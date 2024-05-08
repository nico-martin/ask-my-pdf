import VectorDB, { Entry } from '@utils/vectorDB/VectorDB.ts';

interface EntryMetadata {
  pageNumber: number;
  lineNumber: number;
  allLinesNumber: number;
}

export type VectorDBEntry = Entry<EntryMetadata>;

const db = new VectorDB<EntryMetadata>();

export default db;
