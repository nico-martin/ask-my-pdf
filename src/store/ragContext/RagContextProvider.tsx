import React from 'react';

import Context from './ragContext';
import getLinesFromPdf from '@utils/pdf/getLinesFromPdf.ts';
import db, { VectorDBEntry } from '@store/db.ts';
import { ActiveLines, Benchmarks } from '@store/ragContext/types.ts';
import useLlm from '@store/llm/useLlm.ts';

const RagContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { generate } = useLlm();
  const [entries, setEntries] = React.useState<Array<VectorDBEntry>>([]);
  const [pdfTitle, setPdfTitle] = React.useState<string>('');
  const [benchmarks, setBenchmarks] = React.useState<Benchmarks>({
    pdfParsedMillis: 0,
    entriesVectorized: 0,
    entriesVectorizedMillis: 0,
    searchDbCount: 0,
    searchDbMillis: 0,
    generatedMillis: 0,
  });
  const [prompt, setPrompt] = React.useState<string>('');
  const [llmResponse, setLlmResponse] = React.useState<string>('');
  const [results, setResults] = React.useState<Array<[VectorDBEntry, number]>>(
    []
  );
  const [activeLines, setActiveLines] = React.useState<ActiveLines>({
    exact: [],
    fuzzy: [],
  });

  const setBenchmark = (key: keyof Benchmarks, value: number) =>
    setBenchmarks((benchmarks) => ({ ...benchmarks, [key]: value }));

  const parsePdf = async (file: File) => {
    const started = new Date();
    try {
      const { title, lines } = await getLinesFromPdf(file);
      setBenchmark('pdfParsedMillis', new Date().getTime() - started.getTime());
      const startedVector = new Date();
      db.clear();
      const entries = await db.addEntries(
        lines.map((line) => ({ str: line.str, metadata: line.metadata }))
      );
      setBenchmark('entriesVectorized', entries.length);
      setBenchmark(
        'entriesVectorizedMillis',
        new Date().getTime() - startedVector.getTime()
      );

      setEntries(entries);
      setPdfTitle(title);
    } catch (error) {
      console.error(error);
      alert('Error parsing PDF');
      return;
    }
  };

  const processQuery = async (query: string) => {
    setPrompt('');
    setActiveLines({ exact: [], fuzzy: [] });
    setResults([]);
    const started = new Date();
    const results = await db.search(query);
    setBenchmark('searchDbMillis', new Date().getTime() - started.getTime());
    setBenchmark('searchDbCount', results.length);
    setResults(results);

    const activeLines: Array<number> = [];
    const fuzzyLines: Array<number> = [];

    const foundEntries: Array<string> = [];
    results.map((result) => {
      let entry = '';
      [...Array(7).keys()].forEach((i) => {
        const line = entries.find(
          (entry) =>
            entry.metadata.allLinesNumber ===
            result[0].metadata.allLinesNumber + (i - 3)
        );
        if (line) {
          entry += line.str;
          if (i - 3 === 0) {
            activeLines.push(line.metadata.allLinesNumber);
          } else {
            fuzzyLines.push(line.metadata.allLinesNumber);
          }
        }
      });
      foundEntries.push(entry);
    });
    setActiveLines({ exact: activeLines, fuzzy: fuzzyLines });

    let prompt = `These are parts of the ${pdfTitle}:\n\n`;

    foundEntries.forEach((result) => {
      prompt += `"${result}}"`;
      prompt += '\n\n';
    });

    prompt += query;
    prompt += '\n\nAnswer in Markdown format.';

    setPrompt(prompt);

    const startedLlm = new Date();
    const t = await generate(prompt, (str) => setLlmResponse(str.output));
    setBenchmark(
      'generatedMillis',
      new Date().getTime() - startedLlm.getTime()
    );
    setLlmResponse(t);
  };

  return (
    <Context.Provider
      value={{
        pdfTitle,
        setPdfTitle,
        parsePdf,
        benchmarks,
        entries,
        prompt,
        llmResponse,
        processQuery,
        results,
        activeLines,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default RagContextProvider;
