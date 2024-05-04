import { VectorStorage } from "vector-storage";
import {
  pipeline,
  env,
  FeatureExtractionPipeline,
  Tensor,
} from "@xenova/transformers";
import React from "react";
env.allowLocalModels = false;

const localEmbedTexts = async (texts: string[]): Promise<number[][]> => {
  const extractor: FeatureExtractionPipeline = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    {},
  );
  const getEmbedding = (text: string): Promise<Tensor> =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await extractor(text, {
          pooling: "mean",
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

  try {
    const embeddings = await Promise.all(texts.map(getEmbedding));
    return embeddings.map((e) => Array.from(e.data));
  } catch (error) {
    throw error;
  }
};

const vectorStoreLocal = new VectorStorage({
  embedTextsFn: localEmbedTexts,
  //openAIApiKey: "sk-proj-lShkOtd96oyTRnBbWGfaT3BlbkFJJZYtVnUCJi6fYUUXJWVW",
});

const texts = [
  "An external GPU is a graphics processor located outside of the housing of the computer, similar to a large external hard drive. External graphics processors are sometimes used with laptop computers. Laptops might have a substantial amount of RAM and a sufficiently powerful central processing unit (CPU), but often lack a powerful graphics processor, and instead have a less powerful but more energy-efficient on-board graphics chip. On-board graphics chips are often not powerful enough for playing video games, or for other graphically intensive tasks, such as editing video or 3D animation/rendering.",
  "PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5. PDF.js is community-driven and supported by Mozilla. Our goal is to create a general-purpose, web standards-based platform for parsing and rendering PDFs.",
  "Do you have some suggestion about replace openai api with some local npm package?",
  "Because WebGPU is not yet fully stable, nor have there ever been such large-scale AI models running on top of WebGPU, so we are testing the limit here. It may not work in your environment. So far, we have only tested it on Mac with M1/M2 GPUs in Chrome Canary (a nightly build of Chrome) because WebGPU is quite new. We have tested on Windows and it does not work at this moment due to possible driver issues. We anticipate the support broadens as WebGPU matures. Please check out the use instructions and notes below.",
  "Enter your prompt, click “Generate” – we are ready to go! The image generation will start after downloading and fetching the model parameters to local cache. The download may take a few minutes, only for the first run. The subsequent refreshes and runs will be faster.",
  "This project takes a step to change that status quo and bring more diversity to the ecosystem. There are a lot of reasons to get some (or all) of the computation to the client side. There are many possible benefits, such as cost reduction on the service provider side, as well as an enhancement for personalization and privacy protection. The development of personal computers (even mobile devices) is going in the direction that enables such possibilities. The client side is getting pretty powerful. For example, the latest MacBook Pro can have up to 96GB of unified RAM that can be used to store the model weights and a reasonably powerful GPU to run many of the workloads.",
];

const VectorSearch: React.FC = () => {
  const [results, setResults] = React.useState<
    Array<{ score: number; text: string }>
  >([]);
  const [query, setQuery] = React.useState<string>("");

  return (
    <div>
      <h1>App</h1>
      <input name="query" style={{ width: 500 }} />
      <button
        onClick={async () => {
          const query = (
            document.querySelector('input[name="query"]') as HTMLInputElement
          ).value;
          const results = await vectorStoreLocal.similaritySearch({
            query,
          });
          setQuery(query);
          setResults(
            results.similarItems.map((item) => ({
              score: item.score,
              text: item.text,
            })),
          );
        }}
      >
        search
      </button>
      <h2>Results</h2>
      <p>Query: {query}</p>
      <ul>
        {results.map((result, i) => (
          <li key={i}>
            <p>{result.text}</p>
            <p>
              Score: <b>{result.score}</b>
              <br />
              <br />
            </p>
          </li>
        ))}
      </ul>
      <button
        onClick={async () => {
          await Promise.all(
            texts.map((text) => vectorStoreLocal.addText(text, {})),
          );
        }}
      >
        load entries
      </button>
    </div>
  );
};

export default VectorSearch;
