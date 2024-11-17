// @ts-ignore
import { FeatureExtractionPipeline, pipeline } from '@huggingface/transformers';

export interface Entry<T> {
  str: string;
  metadata: T;
}

export interface VectorizedEntry<T> extends Entry<T> {
  vector: Array<number>;
  vectorMagnitude: number;
}

export enum FeatureExtractionModel {
  ALL_MINILM_L6_V2 = 'Xenova/all-MiniLM-L6-v2',
  ALL_MPNET_BASE_V2 = 'Xenova/all-mpnet-base-v2',
  MIXEDBREAD_AI_EMBED_LARGE_V1 = 'mixedbread-ai/mxbai-embed-large-v1',
  PARAPHRASE_MULTILINGUAL_MINILM_L12_V2 = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
}

class VectorDB<T = {}> {
  public entries: Array<VectorizedEntry<T>> = [];
  private extractor: FeatureExtractionPipeline = null;
  private model: FeatureExtractionModel =
    FeatureExtractionModel.ALL_MINILM_L6_V2;

  public async setModel(model: FeatureExtractionModel): Promise<void> {
    this.model = model;
    await this.loadExtractor();
  }

  private loadExtractor = async () => {
    this.extractor = await pipeline('feature-extraction', this.model, {
      device: 'webgpu',
      dtype: 'fp32',
    });
  };

  public async addEntries(
    entries: Array<Entry<T>>,
    callback: (processed: number, total: number) => void = null
  ): Promise<Array<Entry<T>>> {
    const chunkSize = 100;
    const chunks = [];
    const numberOfChunks = Math.ceil(entries.length / chunkSize);
    console.log(`adding ${entries.length} entries in ${numberOfChunks} chunks`);
    for (let i = 0; i < entries.length; i += chunkSize) {
      chunks.push(
        await this.embedTexts(
          entries.slice(i, i + chunkSize).map((entry) => entry.str)
        )
      );
      callback && callback(i / chunkSize + 1, numberOfChunks);
    }
    const embeddings = chunks.flat();
    entries.map((entry, i) => {
      this.entries.push({
        str: entry.str,
        metadata: entry.metadata,
        vector: embeddings[i],
        vectorMagnitude: this.calculateMagnitude(embeddings[i]),
      });
    });
    return this.entries;
  }

  public async search(
    query: string,
    numberOfResults: number = 5,
    similarityThreshold: number = 0.6
  ): Promise<Array<[VectorizedEntry<T>, number]>> {
    const [queryEmbedding] = await this.embedTexts([query]);
    const queryMagnitude = this.calculateMagnitude(queryEmbedding);
    const scores = this.calculateSimilarityScores(
      this.entries,
      queryEmbedding,
      queryMagnitude
    );
    const sorted = scores.sort((a, b) => b[1] - a[1]);
    const similarityFiltered = sorted.filter(
      (entry) => entry[1] > similarityThreshold
    );
    return similarityFiltered.slice(0, numberOfResults);
  }

  public clear(): void {
    this.entries = [];
  }

  private async embedTexts(
    texts: Array<string>
  ): Promise<Array<Array<number>>> {
    try {
      const output = await this.extractor(texts, {
        pooling: 'mean',
        normalize: true,
      });
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
    queryMagnitude: number
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
        queryMagnitude
      );
      score = this.normalizeScore(score); // Normalize the score
      return [entry, score];
    });
  }

  private getCosineSimilarityScore(
    dotProduct: number,
    magnitudeA: number,
    magnitudeB: number
  ): number {
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private normalizeScore(score: number): number {
    return (score + 1) / 2;
  }
}

export default VectorDB;
