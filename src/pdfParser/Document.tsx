import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Document.module.css';
import useRagContext from '@store/ragContext/useRagContext.ts';

const Document: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const { entries, pdfTitle, setPdfTitle, activeLines } = useRagContext();

  const defaultTitle = React.useMemo(() => pdfTitle, []);

  const preventEnter = (evt: KeyboardEvent) => {
    if (evt.which === 13) {
      evt.preventDefault();
    }
  };

  React.useEffect(() => {
    ref?.current && ref.current.addEventListener('keydown', preventEnter);
    return () => {
      ref?.current && ref.current.removeEventListener('keydown', preventEnter);
    };
  }, [ref]);

  React.useEffect(() => {
    const hashChange = () => {
      if (location.hash) {
        const hash = location.hash.slice(1).replace('L', '');
        const el = document.querySelector(`[data-line-number="${hash}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY - window.innerHeight / 2;
          window.scrollTo({
            top,
            behavior: 'smooth',
          });
        }
      }
    };
    window.addEventListener('hashchange', hashChange);
  }, []);

  return (
    <div className={cn(className, styles.root)}>
      <h2
        ref={ref}
        onKeyUp={(e) => setPdfTitle((e.target as HTMLElement).innerText)}
        contentEditable
        className={styles.title}
      >
        {defaultTitle}
      </h2>
      {entries.map((line, i) => (
        <p
          data-line-number={line.metadata.allLinesNumber}
          className={cn(styles.line, {
            [styles.lineActive]: activeLines.fuzzy.includes(
              line.metadata.allLinesNumber
            ),
            [styles.lineActiveExact]: activeLines.exact.includes(
              line.metadata.allLinesNumber
            ),
          })}
          key={i}
        >
          <span className={styles.lineNumber}>
            {line.metadata.pageNumber}.{line.metadata.lineNumber}
          </span>
          {line.str}
        </p>
      ))}
    </div>
  );
};

export default Document;
