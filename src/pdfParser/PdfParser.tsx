import React from 'react';
import cn from '@utils/classnames.ts';
import Uploader from './Uploader.tsx';
import styles from './PdfParser.module.css';
import Document from './Document.tsx';
import useRagContext from '@store/ragContext/useRagContext.ts';

const PdfParser: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { entries } = useRagContext();
  return (
    <div className={cn(className)}>
      {entries.length === 0 ? (
        <Uploader className={styles.uploader} />
      ) : (
        entries.length > 0 && <Document />
      )}
    </div>
  );
};

export default PdfParser;
