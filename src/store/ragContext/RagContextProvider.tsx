import React from 'react';

import Context from './ragContext';
import db, { VectorDBEntry } from '@store/db.ts';
import { ActiveLines, Benchmarks } from '@store/ragContext/types.ts';
import useLlm from '@store/llm/useLlm.ts';

import PdfParserClass from '@utils/PdfParser/PdfParser.ts';
import useSettingsContext from '@store/settings/useSettingsContext.ts';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';

const RagContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { generate } = useLlm();
  const [entries, setEntries] = React.useState<Array<VectorDBEntry>>([]);
  const [pdfTitle, setPdfTitle] = React.useState<string>('');
  const [file, setFile] = React.useState<File>(null);
  const [entriesProcessingLoading, setEntriesProcessingLoading] =
    React.useState<boolean>(false);
  const [entriesProcessing, setEntriesProcessing] = React.useState<{
    processed: number;
    total: number;
  }>({ processed: 0, total: 0 });
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
  const [modelLoading, setModelLoading] = React.useState<boolean>(false);
  const [modelError, setModelError] = React.useState<string>(null);
  const [activeLines, setActiveLines] = React.useState<ActiveLines>({
    exact: [],
    fuzzy: [],
  });
  const activeModel = React.useRef<FeatureExtractionModel>(null);
  const { settings } = useSettingsContext();

  const resetChat = () => {
    setLlmResponse('');
    setPrompt('');
    setActiveLines({ exact: [], fuzzy: [] });
    setBenchmarks({
      pdfParsedMillis: 0,
      entriesVectorized: 0,
      entriesVectorizedMillis: 0,
      searchDbCount: 0,
      searchDbMillis: 0,
      generatedMillis: 0,
    });
  };

  React.useEffect(() => {
    setModelError(null);
    if (activeModel?.current === settings.featureExtractionModel) return;
    activeModel.current = settings.featureExtractionModel;
    setModelLoading(true);
    resetChat();
    db.setModel(settings.featureExtractionModel)
      .then(() => {
        setModelLoading(false);
        file && parsePdf(file);
      })
      .catch((e) => {
        console.log(e);
        setModelLoading(false);
        setModelError(e.toString());
      });
  }, [settings.featureExtractionModel]);

  const setBenchmark = (key: keyof Benchmarks, value: number) =>
    setBenchmarks((benchmarks) => ({ ...benchmarks, [key]: value }));

  const parsePdf = async (file: File) => {
    const started = new Date();
    setEntries([]);
    setPdfTitle('');
    setEntriesProcessingLoading(true);
    setEntriesProcessing({ processed: 0, total: 0 });
    try {
      const parser = new PdfParserClass(file);
      const { paragraphs, metadata } = await parser.parsePdf();
      // @ts-ignore
      const title = metadata.info.Title || file.name;
      setBenchmark('pdfParsedMillis', new Date().getTime() - started.getTime());
      const startedVector = new Date();
      db.clear();
      const entries = await db.addEntries(
        paragraphs.reduce(
          (acc, paragraph) => [
            ...acc,
            ...paragraph.sentences.map((sentence) => ({
              str: sentence.str,
              metadata: {
                index: sentence.index,
                paragraphIndex: sentence.paragraphIndex,
              },
            })),
          ],
          []
        ),
        (processed: number, total: number) =>
          setEntriesProcessing({ processed, total })
      );
      setBenchmark('entriesVectorized', entries.length);
      setBenchmark(
        'entriesVectorizedMillis',
        new Date().getTime() - startedVector.getTime()
      );

      setEntries(entries);
      setPdfTitle(title);
      setFile(file);
      setEntriesProcessingLoading(false);
    } catch (error) {
      setEntriesProcessingLoading(false);
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
    const results = await db.search(
      query,
      settings.maxNumberOfResults,
      settings.similarityThreshold / 100
    );
    setBenchmark('searchDbMillis', new Date().getTime() - started.getTime());
    setBenchmark('searchDbCount', results.length);
    setResults(results);

    const activeLines: Array<string> = [];
    const fuzzyLines: Array<string> = [];

    const foundEntries: Array<string> = [];
    results.map((result) => {
      let entry = '';
      [...Array(settings.resultsBeforeAndAfter * 2 + 1).keys()].forEach((i) => {
        const line = entries.find(
          (entry) =>
            entry.metadata.paragraphIndex ===
              result[0].metadata.paragraphIndex &&
            entry.metadata.index ===
              result[0].metadata.index + (i - settings.resultsBeforeAndAfter)
        );
        if (line) {
          entry += ' ' + line.str;
          if (i - settings.resultsBeforeAndAfter === 0) {
            activeLines.push(
              line.metadata.paragraphIndex + '-' + line.metadata.index
            );
          } else {
            fuzzyLines.push(
              line.metadata.paragraphIndex + '-' + line.metadata.index
            );
          }
        }
      });
      foundEntries.push(entry);
    });
    setActiveLines({ exact: activeLines, fuzzy: fuzzyLines });

    const prompt = settings.promptTemplate
      .replace('{documentTitle}', pdfTitle)
      .replace(
        '{results}',
        foundEntries.map((result) => `"${result}"`).join('\n\n')
      )
      .replace('{question}', query);

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
        entriesProcessing,
        entriesProcessingLoading,
        benchmarks,
        entries,
        prompt,
        llmResponse,
        processQuery,
        results,
        activeLines,
        modelLoading,
        modelError,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default RagContextProvider;
