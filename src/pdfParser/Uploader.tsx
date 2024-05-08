import React from 'react';
import cn from '@utils/classnames.tsx';

import styles from './Uploader.module.css';
import { Button, IconName } from '@theme';

const Uploader: React.FC<{
  onChange: (file: File) => void;
  className?: string;
  loading?: boolean;
}> = ({ onChange, className = '', loading = false }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
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
        onChange={async (e) => {
          onChange(e.target.files[0]);
        }}
      />
    </div>
  );
};

export default Uploader;
