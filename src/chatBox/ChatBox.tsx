import React from 'react';
import useLlm from '../store/llm/useLlm.ts';
import cn from '@utils/classnames.ts';
import styles from './ChatBox.module.css';
import Cookies from 'js-cookie';
import showdown from 'showdown';
import useRagContext from '@store/ragContext/useRagContext.ts';
import DownloadLlm from './DownloadLlm.tsx';
import LlmForm from './LlmForm.tsx';

const LLM_COOKIE = 'llmLoaded';
const showdownConverter = new showdown.Converter();

const ChatBox: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { entries, llmResponse, results } = useRagContext();
  const { initialize } = useLlm();
  const [llmLoaded, setLlmLoaded] = React.useState<boolean>(
    Cookies.get(LLM_COOKIE) === 'loaded'
  );

  React.useEffect(() => {
    window.setTimeout(() => initialize((e) => console.log('init', e)), 200);
  }, []);

  return (
    <div
      className={cn(className, styles.root, {
        [styles.loaded]: llmLoaded && entries.length !== 0,
      })}
    >
      {!llmLoaded ? (
        <DownloadLlm
          className={styles.downloadWrapper}
          onFinish={() => {
            setLlmLoaded(true);
            Cookies.set(LLM_COOKIE, 'loaded', { expires: 365 });
          }}
        />
      ) : entries.length === 0 ? (
        <p className={styles.addDocument}>
          Please add a document for which you have questions.
        </p>
      ) : (
        <div className={styles.promptWrapper}>
          <LlmForm />
          {llmResponse !== '' && (
            <div className={styles.response}>
              <div
                className={styles.responseText}
                dangerouslySetInnerHTML={{
                  __html: showdownConverter.makeHtml(llmResponse),
                }}
              />
              {results.length !== 0 && (
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
