![Ask my PDF](https://pdf.nico.dev/twitter.jpg)

# Ask my PDF

A Webapp that uses Retrieval Augmented Generation (RAG) and Large Language Models to interact with a PDF directly in the browser.

[pdf.nico.dev](https://pdf.nico.dev)

There are three main pillars this tool is based on:

## 1. Read the PDF

**Ask my PDF** uses [PDF.js](https://www.npmjs.com/package/pdfjs-dist) to process a PDF locally and split the content up into separate lines.

## 2. Vector Search

Individual paragraphs and then sentences are extracted from the document and will be mapped to a multi-dimensional dense vector space using [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) with [TransformersJS](https://github.com/xenova/transformers.js). Those entries are then stored in an in-memory [VectorDB](https://gist.github.com/nico-martin/64f2ae35ed9a0f890ef50c8d119a6222) directly in the browser.

As soon as a query is submitted, it is also vectorized and the cosine similarity search is used to find the most similar text sections, together with the lines surrounding them, so as not to lose the context.

## 3. LLM answer generation

The text sections found this way together with the query and a few instructions are then used as the input prompt to the [Gemma2-2B](https://huggingface.co/google/gemma-2-2b) or [Gemma2-9B](https://huggingface.co/google/gemma-2-9b), compiled to WebAssembly and WebGPU using [MLC LLM](https://llm.mlc.ai/), which will then generate a response.  
If available, also the [Prompt API](https://github.com/explainers-by-googlers/prompt-api) can be used to generate text. The Prompt API is an experimental project by Google Chrome, so it is only available in a few browsers yet.