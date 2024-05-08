import React from 'react';
import cn from '@utils/classnames.tsx';
import { Line } from './types.ts';
import styles from './Document.module.css';

const Document: React.FC<{
  className?: string;
  lines: Array<Line>;
  title?: string;
  setTitle?: (title: string) => void;
  activeLines: {
    exact: Array<number>;
    fuzzy: Array<number>;
  };
}> = ({ className = '', lines, title, setTitle, activeLines }) => {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const defaultTitle = React.useMemo(() => title, []);

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
        onKeyUp={(e) => setTitle((e.target as HTMLElement).innerText)}
        contentEditable
        className={styles.title}
      >
        {defaultTitle}
      </h2>
      {lines.map((line, i) => (
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
