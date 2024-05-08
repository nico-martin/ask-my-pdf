import React from 'react';
import { Line } from '../pdfParser/types.ts';
import db from '../store/db.ts';
import useLlm from '../store/llm/useLlm.ts';
import cn from '@utils/classnames.tsx';
import styles from './ChatBox.module.css';
import { Button, IconName, Modal } from '@theme';
import Gemma2B from '@store/llm/webllm/models/Gemma2B.ts';
import { formatBytes, nl2br } from '@utils/functions.ts';
import Cookies from 'js-cookie';
import showdown from 'showdown';
import { VectorizedEntry } from '@store/vectorDB/VectorDB.ts';
const LLM_COOKIE = 'llmLoaded';
const showdownConverter = new showdown.Converter();

const ChatBox: React.FC<{
  lines: Array<Line>;
  className?: string;
  setActiveLines: (activeLines: {
    exact: Array<number>;
    fuzzy: Array<number>;
  }) => void;
  pdfTitle?: string;
}> = ({ lines, className = '', setActiveLines, pdfTitle }) => {
  const { generate, initialize } = useLlm();
  const [llmBusy, setLlmBusy] = React.useState<boolean>(false);
  const [downloadLLMRunning, setDownloadLLMRunning] =
    React.useState<boolean>(false);
  const [downloadLLMProgress, setDownloadLLMProgress] =
    React.useState<number>(0);
  const [results, setResults] = React.useState<Array<[Line, number]>>([]);
  const [llmResponse, setLlmResponse] = React.useState<string>('');
  const [prompt, setPrompt] = React.useState<string>('');
  const [promptModal, setPromptModal] = React.useState<boolean>(false);
  const [llmLoaded, setLlmLoaded] = React.useState<boolean>(
    Cookies.get(LLM_COOKIE) === 'loaded'
  );

  return (
    <div
      className={cn(className, styles.root, {
        [styles.loaded]: llmLoaded && lines.length !== 0,
      })}
    >
      {!llmLoaded ? (
        <div className={styles.downloadWrapper}>
          <Button
            icon={IconName.CREATION}
            onClick={async () => {
              setDownloadLLMRunning(true);
              await initialize((str) => {
                setDownloadLLMProgress(str.progress);
              });
              setDownloadLLMRunning(false);
              setLlmLoaded(true);
              Cookies.set(LLM_COOKIE, 'loaded', { expires: 365 });
            }}
            contentWidth={292}
            classNameIconWrapper={styles.buttonIconWrapper}
          >
            download Gemma 2b (
            {downloadLLMRunning
              ? `${Math.round(downloadLLMProgress * 100)}%`
              : formatBytes(Gemma2B.size)}
            )
          </Button>
          <p className={styles.modelDescription}>{Gemma2B.about}</p>
        </div>
      ) : lines.length === 0 ? (
        <p className={styles.addDocument}>
          Please add a document for which you have questions.
        </p>
      ) : (
        <div className={styles.promptWrapper}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLlmBusy(true);
              setPrompt('');
              const started = new Date();
              const query = (
                document.querySelector(
                  'textarea[name="search"]'
                ) as HTMLInputElement
              ).value;
              const results = await db.search(query);
              const ended = new Date();
              console.log('Time taken:', ended.getTime() - started.getTime());
              const activeLines: Array<number> = [];
              const fuzzyLines: Array<number> = [];

              const entries: Array<string> = [];
              setResults(results);
              results.map((result) => {
                let entry = '';
                [...Array(7).keys()].forEach((i) => {
                  const line = lines.find(
                    (line) =>
                      line.metadata.allLinesNumber ===
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
                entries.push(entry);
              });

              setActiveLines({ exact: activeLines, fuzzy: fuzzyLines });

              let prompt = `These are parts of the ${pdfTitle}:\n\n`;

              entries.forEach((result) => {
                prompt += `"${result}"`;
                prompt += '\n\n';
              });

              prompt += query;
              prompt += '\n\nAnswer in Markdown format.';

              setPrompt(prompt);

              const t = await generate(prompt, (str) => {
                setDownloadLLMProgress(str.progress);
                setLlmResponse(str.output);
              });
              setLlmResponse(t);
              setLlmBusy(false);
            }}
            className={styles.promptForm}
          >
            <label>
              <span>What do you want to know?</span>
              <textarea id="search" name="search" className={styles.search} />
            </label>
            <Button
              icon={IconName.CREATION}
              loading={llmBusy}
              classNameIconWrapper={styles.buttonIconWrapper}
            >
              Let's go
            </Button>
            {!llmBusy && Boolean(prompt) && (
              <button
                className={styles.showPromptButton}
                onClick={() => setPromptModal(true)}
                type="button"
              >
                ?
              </button>
            )}
            {promptModal && (
              <Modal close={() => setPromptModal(false)} title="Prompt">
                <p dangerouslySetInnerHTML={{ __html: nl2br(prompt) }} />
              </Modal>
            )}
          </form>
          {llmResponse !== '' && (
            <div className={styles.response}>
              <div
                className={styles.responseText}
                dangerouslySetInnerHTML={{
                  __html: showdownConverter.makeHtml(llmResponse),
                }}
              />
              {!llmBusy && (
                <div className={styles.source}>
                  <h3 className={styles.sourceTitle}>Sources</h3>
                  <ul className={styles.sourceList}>
                    {results.map((result) => (
                      <li className={styles.sourceEntry}>
                        <a
                          className={styles.sourceLink}
                          href={`#L${result[0].metadata.allLinesNumber}`}
                        >
                          Page {result[0].metadata.pageNumber}, Line{' '}
                          {result[0].metadata.lineNumber} (
                          {Math.round(result[1] * 100)}%)
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
