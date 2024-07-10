import cn from '@utils/classnames.ts';
import inputStyles from './Input.module.css';
import { InputBaseProps, InputProps } from './types.ts';
import styles from './InputRange.module.css';

export interface InputRangeProps<T> extends InputBaseProps<T> {
  max?: number;
  min?: number;
  step?: number;
  unit?: string;
}

const InputRange = <T,>({
  name,
  value = null,
  className = '',
  max = 100,
  min = 0,
  step = 1,
  unit = '',
  ...props
}: InputRangeProps<T> & InputProps<T>) => {
  return (
    <div className={cn(className, styles.wrapper)}>
      <span className={styles.value}>
        {value?.toString()}
        {unit}
      </span>
      <input
        name={name}
        className={cn(className, inputStyles.input, styles.input)}
        id={name}
        value={value?.toString()}
        type="range"
        max={max}
        min={min}
        step={step}
        {...props}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
};

export default InputRange;
