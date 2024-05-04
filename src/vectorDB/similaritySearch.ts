export const calculateSimilarityScores = <T>(
  entries: Array<Entry<T>>,
  queryVector: number[],
  queryMagnitude: number,
): Array<[Entry<T>, number]> =>
  entries.map((entry) => {
    const dotProduct = entry.vector!.reduce(
      (sum, val, i) => sum + val * queryVector[i],
      0,
    );
    let score = getCosineSimilarityScore(
      dotProduct,
      entry.vectorMagnitude!,
      queryMagnitude,
    );
    score = normalizeScore(score); // Normalize the score
    return [entry, score];
  });

const getCosineSimilarityScore = (
  dotProduct: number,
  magnitudeA: number,
  magnitudeB: number,
): number => dotProduct / (magnitudeA * magnitudeB);

const normalizeScore = (score: number): number => (score + 1) / 2;
