export interface Benchmarks {
  pdfParsedMillis: number;
  entriesVectorized: number;
  entriesVectorizedMillis: number;
  searchDbCount: number;
  searchDbMillis: number;
  generatedMillis: number;
}

export interface ActiveLines {
  exact: Array<number>;
  fuzzy: Array<number>;
}
