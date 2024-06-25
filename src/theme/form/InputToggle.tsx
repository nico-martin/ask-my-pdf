import cn from '@utils/classnames.ts';
import inputStyles from './Input.module.css';
import { InputBaseProps, InputProps } from './types.ts';
import styles from './InputToggle.module.css';
import React from 'react';

export interface InputToggleProps<T> extends InputBaseProps<T> {}

const InputToggle = <T,>({
  name,
  value = null,
  className = '',
  ...props
}: InputToggleProps<T> & InputProps<T>) => {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cn(className, styles.wrapper)}>
      <input
        name={name}
        className={cn(className, inputStyles.input, styles.input)}
        id={name}
        checked={Boolean(value)}
        type="checkbox"
        {...props}
        ref={ref}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <span className={styles.track} onClick={() => ref?.current?.click()}>
        <span className={styles.thumb} />
      </span>
    </div>
  );
};

export default InputToggle;
