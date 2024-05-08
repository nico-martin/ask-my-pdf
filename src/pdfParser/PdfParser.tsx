import React from 'react';
import getLinesFromPdf from './getLinesFromPdf.ts';
import { Line } from './types.ts';
import db from '../store/db.ts';
import cn from '@utils/classnames.tsx';
import Uploader from './Uploader.tsx';
import styles from './PdfParser.module.css';
import Document from './Document.tsx';

const PdfParser: React.FC<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
  lines: Array<Line>;
  setLines: (lines: Array<Line>) => void;
  className?: string;
  title?: string;
  setTitle?: (title: string) => void;
  activeLines: {
    exact: Array<number>;
    fuzzy: Array<number>;
  };
}> = ({
  loading,
  setLoading,
  lines,
  setLines,
  className = '',
  title,
  setTitle,
  activeLines,
}) => {
  return (
    <div className={cn(className)}>
      {lines.length === 0 ? (
        <Uploader
          className={styles.uploader}
          loading={loading}
          onChange={async (file) => {
            const started = new Date();
            setLoading(true);
            const { title, lines } = await getLinesFromPdf(file);

            db.clear();
            await db.addEntries(
              lines.map((line) => ({ str: line.str, metadata: line.metadata }))
            );
            setLoading(false);
            const ended = new Date();
            console.log('Time taken:', ended.getTime() - started.getTime());
            console.log('Number of lines:', lines.length);
            console.log(
              'Number of characters:',
              lines.reduce((acc, line) => acc + line.str.length, 0)
            );
            setLines(lines);
            setTitle(title);
          }}
        />
      ) : (
        lines.length > 0 && (
          <Document
            lines={lines}
            title={title}
            setTitle={setTitle}
            activeLines={activeLines}
          />
        ) /*(
          <React.Fragment>
            {lines.map((line, i) => (
              <p key={i} style={{ margin: 0 }}>
                <span style={{ opacity: 0.5 }}>
                  {line.metadata.pageNumber}/{line.metadata.lineNumber}
                </span>
                {line.str}
              </p>
            ))}
          </React.Fragment>
        )*/
      )}
      {}
    </div>
  );
};

export default PdfParser;
