import React from 'react';
import styles from './Message.module.css';
import cn from '@utils/classnames.ts';
export enum MESSAGE_TYPE {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

const Message: React.FC<{
  className?: string;
  children: string | React.ReactElement | Array<React.ReactElement>;
  type?: MESSAGE_TYPE;
}> = ({ className = '', children, type = MESSAGE_TYPE.INFO }) => (
  <div
    className={cn(styles.root, className, {
      [styles.error]: type === MESSAGE_TYPE.ERROR,
      [styles.success]: type === MESSAGE_TYPE.SUCCESS,
      [styles.warning]: type === MESSAGE_TYPE.WARNING,
    })}
  >
    <div className={styles.bkg} />
    <div className={styles.content}>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  </div>
);

export default Message;
