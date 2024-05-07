import React from 'react';
import { Line } from '../pdfParser/types.ts';
import db from '../store/db.ts';
import useLlm from '../store/llm/useLlm.ts';
import cn from '@utils/classnames.tsx';

const ChatBox: React.FC<{ lines: Array<Line>; className?: string }> = ({
  lines,
  className = '',
}) => {
  const [results, setResults] = React.useState<Array<Array<Line>>>([]);
  const { generate } = useLlm();
  const [llmBusy, setLlmBusy] = React.useState<boolean>(false);
  const [downloadLLMProgress, setDownloadLLMProgress] =
    React.useState<number>(0);
  const [llmResponse, setLlmResponse] = React.useState<string>('');
  return (
    <div className={cn(className)}>
      <div>
        <input id="search" name="search" />
        <button
          disabled={llmBusy}
          onClick={async () => {
            setLlmBusy(true);
            const started = new Date();
            const query = (
              document.querySelector('input[name="search"]') as HTMLInputElement
            ).value;
            const results = await db.search(query);
            const ended = new Date();
            console.log('Time taken:', ended.getTime() - started.getTime());
            const extendedResults: Array<Array<Line>> = results.map((result) =>
              lines.filter(
                (line) =>
                  line.metadata.allLinesNumber >=
                    result.metadata.allLinesNumber - 3 &&
                  line.metadata.allLinesNumber <=
                    result.metadata.allLinesNumber + 3
              )
            );
            setResults(extendedResults);

            let prompt =
              'This are parts of the Terms and Conditions of Twitter:\n\n';

            extendedResults.forEach((result) => {
              prompt += result.map((line) => line.str).join(' ');
              prompt += '\n\n';
            });

            prompt += query;

            console.log(prompt);

            const t = await generate(prompt, (str) => {
              console.log(str);
              setDownloadLLMProgress(str.progress);
              setLlmResponse(str.output);
            });
            setLlmResponse(t);
            setLlmBusy(false);
          }}
        >
          {llmBusy
            ? downloadLLMProgress <= 1
              ? `download progress: ${Math.round(downloadLLMProgress * 100)}%`
              : 'Generating...'
            : 'Generate'}
        </button>
        {llmResponse !== '' && (
          <div>
            <h3>LLM Response</h3>
            <p>{llmResponse}</p>
          </div>
        )}
        {results.length !== 0 && (
          <div>
            <h3>Source</h3>
            <ul>
              {results.map((result) => (
                <li>
                  {result.map((line) => line.str).join(' ')}
                  <br />
                  <i>
                    {result[0].metadata.pageNumber} /{' '}
                    {result[0].metadata.lineNumber} -{' '}
                    {result[result.length - 1].metadata.pageNumber} /{' '}
                    {result[result.length - 1].metadata.lineNumber}
                  </i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
