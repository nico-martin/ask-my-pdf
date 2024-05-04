import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { calculateSimilarityScores } from "./similaritySearch.ts";

const extractor: FeatureExtractionPipeline = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
  {},
);

class VectorDB<T = {}> {
  public entries: Array<Entry<T>> = [];
  public __constructor() {}

  public async addEntry(entry: string, metadata: T): Promise<void> {
    const embedding = await this.embedText(entry);

    this.entries.push({
      str: entry,
      metadata: metadata,
      vector: embedding,
      vectorMagnitude: this.calculateMagnitude(embedding),
    });
  }

  public async search(
    query: string,
    numberOfResults: number = 5,
  ): Promise<Array<Entry<T>>> {
    const queryEmbedding = await this.embedText(query);
    const queryMagnitude = this.calculateMagnitude(queryEmbedding);
    const scores = calculateSimilarityScores(
      this.entries,
      queryEmbedding,
      queryMagnitude,
    );
    const sorted = scores.sort((a, b) => b[1] - a[1]);
    const results = sorted.slice(0, numberOfResults);
    return results.map((result) => result[0]);
  }

  public clear(): void {
    this.entries = [];
  }

  private async embedText(text: string): Promise<number[]> {
    try {
      const response = await extractor(text, {
        pooling: "mean",
      });
      return Array.from(response.data);
    } catch (error) {
      throw error;
    }
  }

  private calculateMagnitude(embedding: number[]): number {
    return Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  }
}

export default VectorDB;
