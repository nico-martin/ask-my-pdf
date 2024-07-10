import React from 'react';
import cn from '@utils/classnames.ts';

import styles from './Uploader.module.css';
import { Button, Icon, IconName, Message, MESSAGE_TYPE } from '@theme';
import useRagContext from '@store/ragContext/useRagContext.ts';

const Uploader: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const infosRef = React.useRef<HTMLDivElement>(null);
  const {
    parsePdf,
    modelLoading,
    modelError,
    entriesProcessing,
    entriesProcessingLoading,
  } = useRagContext();

  React.useEffect(() => {
    if (infosRef?.current) {
      infosRef.current.style.height = infosRef.current.offsetHeight + 'px';
    }
  }, [infosRef]);

  return (
    <div className={cn(className, styles.root)}>
      <Button
        disabled={modelLoading}
        className={styles.button}
        classNameIconWrapper={styles.buttonIconWrapper}
        onClick={() => {
          inputRef.current?.click();
        }}
        icon={IconName.FILE_DOCUMENT_OUTLINE}
        loading={entriesProcessingLoading}
      >
        Read PDF
      </Button>
      <input
        ref={inputRef}
        className={styles.input}
        type="file"
        accept=".pdf"
        onChange={async (e) => {
          await parsePdf(e.target.files[0]);
        }}
      />
      {modelError ? (
        <Message type={MESSAGE_TYPE.ERROR}>
          <p>
            Embedding Model could not be loaded. Please change the the model in
            the settings and try again.
            <br />
            <br />
            {modelError}
          </p>
        </Message>
      ) : (
        <p className={styles.info} ref={infosRef}>
          {modelLoading ? (
            <span className={styles.modelLoading}>
              <Icon
                className={styles.modelLoadingIcon}
                icon={IconName.LOADING}
                spinning
              />
              <span>model loading...</span>
            </span>
          ) : entriesProcessingLoading ? (
            entriesProcessing.total > 0 ? (
              <span className={styles.process}>
                Preparing the vectorDB (
                {Math.round(
                  (100 / entriesProcessing.total) * entriesProcessing.processed
                )}
                %)
              </span>
            ) : (
              <span>Parsing the document..</span>
            )
          ) : (
            <span>
              "Ask my PDF" works best with long sections of text. If the
              document contains graphics or tables, the information may not be
              correctly recognized and assigned to the question.
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default Uploader;
