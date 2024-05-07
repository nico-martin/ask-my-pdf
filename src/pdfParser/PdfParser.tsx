import React from 'react';
import getLinesFromPdf from './getLinesFromPdf.ts';
import { Line } from './types.ts';
import db from '../store/db.ts';
import cn from '@utils/classnames.tsx';

const PdfParser: React.FC<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
  lines: Array<Line>;
  setLines: (lines: Array<Line>) => void;
  className?: string;
}> = ({ loading, setLoading, lines, setLines, className = '' }) => {
  return (
    <div className={cn(className)}>
      <input
        type="file"
        onChange={async (e) => {
          const started = new Date();
          setLoading(true);
          const lines = await getLinesFromPdf(e.target.files[0]);
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
        }}
      />

      {loading ? (
        <p>parsing the file...</p>
      ) : (
        lines.length > 0 && (
          <React.Fragment>
            <h2>Content of the file</h2>
            {lines.map((line, i) => (
              <p key={i} style={{ margin: 0 }}>
                <span style={{ opacity: 0.5 }}>
                  {line.metadata.pageNumber}/{line.metadata.lineNumber}
                </span>
                {line.str}
              </p>
            ))}
          </React.Fragment>
        )
      )}
      {}
    </div>
  );
};

export default PdfParser;
