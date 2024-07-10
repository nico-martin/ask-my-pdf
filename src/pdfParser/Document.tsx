import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Document.module.css';
import useRagContext from '@store/ragContext/useRagContext.ts';
import { VectorDBEntry } from '@store/db.ts';

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
        const el = document.querySelector(`[data-sentence-key="${hash}"]`);
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

  const groupedEntries = React.useMemo(() => {
    return entries.reduce(
      (acc: Record<number, Array<VectorDBEntry>>, entry) => ({
        ...acc,
        [entry.metadata.paragraphIndex]: [
          ...(acc[entry.metadata.paragraphIndex] || []),
          entry,
        ],
      }),
      {}
    );
  }, []);

  return (
    <div className={cn(className, styles.root)}>
      <h2
        suppressContentEditableWarning={true}
        ref={ref}
        onKeyUp={(e) => setPdfTitle((e.target as HTMLElement).innerText)}
        contentEditable
        className={styles.title}
      >
        {defaultTitle}
      </h2>
      <div className={styles.content}>
        {Object.values(groupedEntries).map((entries, i) => (
          <p className={styles.paragraph} key={i}>
            {entries.map((entry) => {
              const key = `${entry.metadata.paragraphIndex}-${entry.metadata.index}`;
              return (
                <span
                  className={cn(styles.sentence, {
                    [styles.sentenceActive]: activeLines.fuzzy.includes(key),
                    [styles.sentenceActiveExact]:
                      activeLines.exact.includes(key),
                  })}
                  data-sentence-key={key}
                  key={key}
                >
                  {entry.str}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Document;
