import React from 'react';
import cn from '@utils/classnames.ts';
import inputStyles from './Input.module.css';
import { InputBaseProps, InputProps } from './types.ts';

export interface InputTextProps<T> extends InputBaseProps<T> {
  prepend?: string;
  append?: string;
  type?:
    | 'text'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';
}

const InputText = <T,>({
  name,
  value = null,
  className = '',
  type = 'text',
  prepend = '',
  append = '',
  ...props
}: InputTextProps<T> & InputProps<T>) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cn(className, inputStyles.inputWrapper)}>
      {prepend !== '' && (
        <span
          className={inputStyles.prepend}
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          {prepend}
        </span>
      )}
      <input
        name={name}
        className={cn(inputStyles.input)}
        id={name}
        value={value.toString()}
        type={type}
        ref={inputRef}
        {...props}
      />
      {append !== '' && (
        <span
          className={inputStyles.append}
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          {append}
        </span>
      )}
    </div>
  );
};

export default InputText;
