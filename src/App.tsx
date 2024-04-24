import React from "react";
import ReactDOM from "react-dom/client";
import { VectorStorage } from "vector-storage";
import {
  pipeline,
  env,
  FeatureExtractionPipeline,
  Tensor,
} from "@xenova/transformers";
env.allowLocalModels = false;

const root = document.getElementById("app");

const test =
  "An external GPU is a graphics processor located outside of the housing of the computer, similar to a large external hard drive. External graphics processors are sometimes used with laptop computers. Laptops might have a substantial amount of RAM and a sufficiently powerful central processing unit (CPU), but often lack a powerful graphics processor, and instead have a less powerful but more energy-efficient on-board graphics chip. On-board graphics chips are often not powerful enough for playing video games, or for other graphically intensive tasks, such as editing video or 3D animation/rendering.";

const localEmbedTexts = async (texts: string[]): Promise<number[][]> => {
  const extractor: FeatureExtractionPipeline = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    {},
  );
  const getEmbedding = (text: string): Promise<Tensor> =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await extractor(text);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

  try {
    const embeddings = await Promise.all(texts.map(getEmbedding));
    return embeddings.map((e) => e.data) as number[][];
  } catch (error) {
    throw error;
  }
};

const vectorStore = new VectorStorage({
  embedTextsFn: localEmbedTexts,
});

const App: React.FC = () => {
  // Create an instance of VectorStorage

  return (
    <div>
      <h1>App</h1>
      <p>{test}</p>
      <button
        onClick={async () => {
          const r = await vectorStore.addText(
            test + Math.floor(Math.random() * 1000),
            {
              category: "example",
            },
          );
          console.log(r);
        }}
      >
        analyze
      </button>
      <button
        onClick={async () => {
          const results = await vectorStore.similaritySearch({
            query: "What is a GPU?",
          });
          console.log(results);
        }}
      >
        {" "}
        find
      </button>
    </div>
  );
};

root && ReactDOM.createRoot(root).render(<App />);
