import { ChangeEventHandler } from 'react';
import cn from '@utils/classnames.ts';
import inputStyles from './Input.module.css';
import { InputBaseProps, InputProps } from './types.ts';

export interface InputSelectProps<T> extends InputBaseProps<T> {
  options: Record<string, string>;
  optionGroups?: Record<string, Record<string, string>>;
  optionProps?: (value: string, label: string) => Record<string, any>;
  emptyOption?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

const InputSelect = <T,>({
  name,
  value = null,
  className = '',
  options,
  optionGroups = null,
  optionProps = () => ({}),
  emptyOption = false,
  onChange,
  ...props
}: InputSelectProps<T> & InputProps<T>) => {
  return (
    <div className={cn(className, inputStyles.inputWrapper)}>
      <select
        value={value.toString()}
        id={name}
        name={name}
        className={cn(className, inputStyles.input)}
        onChange={onChange}
        {...props}
      >
        {emptyOption && <option value="" {...optionProps('', '')} />}
        {optionGroups
          ? Object.entries(optionGroups || {}).map(([label, options]) => (
              <optgroup label={label}>
                {Object.entries(options || {}).map(([value, label]) => (
                  <option
                    value={value}
                    key={value}
                    {...optionProps(value, String(label))}
                  >
                    {label}
                  </option>
                ))}
              </optgroup>
            ))
          : Object.entries(options || {}).map(([value, label]) => (
              <option
                value={value}
                key={value}
                {...optionProps(value, String(label))}
              >
                {label}
              </option>
            ))}
      </select>
    </div>
  );
};

export default InputSelect;
