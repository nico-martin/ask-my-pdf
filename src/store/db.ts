import VectorDB from "../vectorDB/VectorDB.ts";

const db = new VectorDB<{
  pageNumber: number;
  lineNumber: number;
  allLinesNumber: number;
}>();

export default db;
