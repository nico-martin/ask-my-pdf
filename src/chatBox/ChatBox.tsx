import React from 'react';
import useLlm from '../store/llm/useLlm.ts';
import cn from '@utils/classnames.ts';
import styles from './ChatBox.module.css';
import Cookies from 'js-cookie';
import showdown from 'showdown';
import useRagContext from '@store/ragContext/useRagContext.ts';
import DownloadLlm from './DownloadLlm.tsx';
import LlmForm from './LlmForm.tsx';
import Model from '@store/llm/models/Model.ts';

const showdownConverter = new showdown.Converter();

const getLlmCookie = (model: Model) => model.id + '-loaded';

const ChatBox: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { entries, llmResponse, results } = useRagContext();
  const { initialize, model, ready } = useLlm();
  const [preloaded, setPreloaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (ready) return;
    setPreloaded(false);
    if (
      model.size === 0 ||
      (Cookies.get(getLlmCookie(model)) === 'loaded' &&
        Cookies.get('suppressLoaded') !== 'true')
    ) {
      setPreloaded(true);
      initialize();
    }
  }, [model]);

  return (
    <div
      className={cn(className, styles.root, {
        [styles.loaded]: (ready || preloaded) && entries.length !== 0,
      })}
    >
      {!ready && !preloaded ? (
        <DownloadLlm
          className={styles.downloadWrapper}
          onFinish={() =>
            Cookies.set(getLlmCookie(model), 'loaded', { expires: 365 })
          }
        />
      ) : entries.length === 0 ? (
        <p className={styles.addDocument}>
          Please add a document for which you have questions.
        </p>
      ) : (
        <div className={styles.promptWrapper}>
          <LlmForm className={styles.promptForm} />
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
                    {results.map((result, i) => (
                      <li className={styles.sourceEntry} key={i}>
                        <a
                          className={styles.sourceLink}
                          href={`#L${result[0].metadata.paragraphIndex}-${result[0].metadata.index}`}
                        >
                          <span className={styles.sourceText}>
                            {result[0].str}
                          </span>{' '}
                          ({Math.round(result[1] * 100)}%)
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
