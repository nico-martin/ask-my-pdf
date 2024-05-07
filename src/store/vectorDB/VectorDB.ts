import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";

export interface Entry<T> {
  str: string;
  metadata: T;
}

export interface VectorizedEntry<T> extends Entry<T> {
  vector: Array<number>;
  vectorMagnitude: number;
}

class VectorDB<T = {}> {
  public entries: Array<VectorizedEntry<T>> = [];
  private extractor: FeatureExtractionPipeline = null;

  public constructor() {
    this.loadExtractor();
  }

  private loadExtractor = async () => {
    this.extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        device: "webgpu",
        dtype: "fp32",
      },
    );
  };

  public async addEntries(entries: Array<Entry<T>>): Promise<void> {
    const embeddings = await this.embedTexts(entries.map((entry) => entry.str));
    entries.map((entry, i) => {
      this.entries.push({
        str: entry.str,
        metadata: entry.metadata,
        vector: embeddings[i],
        vectorMagnitude: this.calculateMagnitude(embeddings[i]),
      });
    });
  }

  public async search(
    query: string,
    numberOfResults: number = 5,
  ): Promise<Array<VectorizedEntry<T>>> {
    const [queryEmbedding] = await this.embedTexts([query]);
    const queryMagnitude = this.calculateMagnitude(queryEmbedding);
    const scores = this.calculateSimilarityScores(
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

  private async embedTexts(
    texts: Array<string>,
  ): Promise<Array<Array<number>>> {
    try {
      const started = new Date();
      const output = await this.extractor(texts, {
        pooling: "mean",
        normalize: true,
      });
      console.log(
        "Time taken to embed:",
        new Date().getTime() - started.getTime(),
      );
      return output.tolist();
    } catch (error) {
      throw error;
    }
  }

  private calculateMagnitude(embedding: number[]): number {
    let sumOfSquares = 0;
    for (const val of embedding) {
      sumOfSquares += val * val;
    }
    return Math.sqrt(sumOfSquares);
  }

  private calculateSimilarityScores<T>(
    entries: Array<VectorizedEntry<T>>,
    queryVector: number[],
    queryMagnitude: number,
  ): Array<[VectorizedEntry<T>, number]> {
    return entries.map((entry) => {
      let dotProduct = 0;
      if (!entry.vector) {
        return null;
      }
      for (let i = 0; i < entry.vector.length; i++) {
        dotProduct += entry.vector[i] * queryVector[i];
      }
      let score = this.getCosineSimilarityScore(
        dotProduct,
        entry.vectorMagnitude!,
        queryMagnitude,
      );
      score = this.normalizeScore(score); // Normalize the score
      return [entry, score];
    });
  }

  private getCosineSimilarityScore(
    dotProduct: number,
    magnitudeA: number,
    magnitudeB: number,
  ): number {
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private normalizeScore(score: number): number {
    return (score + 1) / 2;
  }
}

export default VectorDB;
