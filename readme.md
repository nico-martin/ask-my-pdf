![Ask my PDF](https://pdf.nico.dev/twitter.jpg)

# Ask my PDF

A Webapp that uses Retrieval Augmented Generation (RAG) and Large Language Models to interact with a PDF directly in the browser.

[pdf.nico.dev](https://pdf.nico.dev)

There are three main pillars this tool is based on:

## 1. Read the PDF

**Ask my PDF** uses [PDF.js](https://www.npmjs.com/package/pdfjs-dist) to process a PDF locally and split the content up into separate lines.

## 2. Vector Search

Every line will be mapped to a 384 dimensional dense vector space using [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) with [TransformersJS](https://github.com/xenova/transformers.js). Those entries are then stored in an in-memory [VectorDB](https://gist.github.com/nico-martin/64f2ae35ed9a0f890ef50c8d119a6222) directly in the browser.

As soon as a query is submitted, it is also vectorized and the cosine similarity search is used to find the most similar text sections, together with the lines surrounding them, so as not to lose the context.

## 3. LLM answer generation

The text sections found this way together with the query and a few instructions are then used as the input prompt to the [Gemma-2B](https://huggingface.co/google/gemma-2b) LLM, compiled to WebAssembly and WebGPU using [MLC LLM](https://llm.mlc.ai/), which will then generate a response.