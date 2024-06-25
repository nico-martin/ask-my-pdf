import cn from '@utils/classnames.ts';
import inputStyles from './Input.module.css';
import { InputBaseProps, InputProps } from './types.ts';

export interface InputTextareaProps<T> extends InputBaseProps<T> {
  rows?: number;
}

const InputTextarea = <T,>({
  name,
  value = null,
  className = '',
  rows = 4,
  ...props
}: InputTextareaProps<T> & InputProps<T>) => (
  <div className={cn(className, inputStyles.inputWrapper)}>
    <textarea
      name={name}
      className={cn(className, inputStyles.input, inputStyles.textarea)}
      id={name}
      value={value.toString()}
      rows={rows}
      {...props}
    />
  </div>
);

export default InputTextarea;
