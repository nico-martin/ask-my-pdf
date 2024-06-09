import React from 'react';
import cn from '@utils/classnames.ts';

import styles from './Uploader.module.css';
import { Button, IconName } from '@theme';
import useRagContext from '@store/ragContext/useRagContext.ts';

const Uploader: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { parsePdf } = useRagContext();
  return (
    <div className={cn(className, styles.root)}>
      <Button
        className={styles.button}
        classNameIconWrapper={styles.buttonIconWrapper}
        onClick={() => {
          inputRef.current?.click();
        }}
        icon={IconName.FILE_DOCUMENT_OUTLINE}
        loading={loading}
      >
        Read PDF
      </Button>
      <input
        ref={inputRef}
        className={styles.input}
        type="file"
        accept=".pdf"
        onChange={async (e) => {
          setLoading(true);
          await parsePdf(e.target.files[0]);
          setLoading(false);
        }}
      />
      <p className={styles.info}>
        "Ask my PDF" works best with long sections of text. If the document
        contains graphics or tables, the information may not be correctly
        recognized and assigned to the question.
      </p>
    </div>
  );
};

export default Uploader;
