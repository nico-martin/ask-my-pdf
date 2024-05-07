import React from 'react';
import styles from './ShadowBox.module.css';
import cn from '@utils/classnames.tsx';

export interface ShadowBoxPropsI {
  title?: string;
  subtitle?: string;
  children?: React.ReactElement | React.ReactElement[] | string;
  close: Function;
  size?: 'large' | 'small' | 'medium' | 'x-large';
  className?: string;
  classNameContent?: string;
  preventClose?: boolean;
  setCloseButton?: (button: HTMLButtonElement) => void;
}

const ShadowBox: React.FC<ShadowBoxPropsI> = ({
  title,
  subtitle,
  children,
  close,
  size = 'large',
  className = '',
  classNameContent = '',
  preventClose,
  setCloseButton = null,
}) => {
  const [show, setShow] = React.useState<boolean>(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    closeRef?.current && setCloseButton && setCloseButton(closeRef.current);
  }, [closeRef]);

  React.useEffect(() => {
    window.setTimeout(() => setShow(true), 10);
    return () => {
      setShow(false);
    };
  }, []);

  const onClose = () => {
    if (preventClose) {
      return;
    }
    setShow(false);
    window.setTimeout(() => {
      close();
    }, 200);
  };

  return (
    <div
      className={cn(className, styles.root, {
        [styles.isSmall]: size === 'small',
        [styles.isMedium]: size === 'medium',
        [styles.isXLarge]: size === 'x-large',
        [styles.preventClose]: preventClose,
      })}
      data-visible={show}
    >
      <div className={styles.shadow} onClick={onClose} />
      <article className={styles.box}>
        <header className={cn(styles.header)}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <button ref={closeRef} className={styles.close} onClick={onClose}>
            close
          </button>
        </header>
        <div className={cn(styles.content, classNameContent)}>{children}</div>
      </article>
    </div>
  );
};

export default ShadowBox;
