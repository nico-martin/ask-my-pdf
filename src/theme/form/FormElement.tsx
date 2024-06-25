import { useController } from 'react-hook-form';
import styles from './FormElement.module.css';
import cn from '@utils/classnames.ts';
import InputText, { InputTextProps } from './InputText.tsx';
import InputSelect, { InputSelectProps } from './InputSelect.tsx';
import { FormElementProps, InputProps, InputType } from './types.ts';
import InputRange, { InputRangeProps } from './InputRange.tsx';
import InputToggle, { InputToggleProps } from './InputToggle.tsx';

const FormElement = <T,>({
  form,
  label,
  name,
  rules = {},
  input,
  className = '',
  inputClassName = '',
  stacked = false,
  Description,
  sanitizeValue = (value: any) => value,
  ...inputProps
}: FormElementProps<T>) => {
  const { field } = useController({
    control: form.control,
    name,
    rules,
  });

  const error =
    // @ts-ignore
    name in form?.formState?.errors ? form.formState.errors[name] : null;

  const inputBaseProps: InputProps<T> = {
    name,
    value: field.value,
    className: inputClassName,
    onBlur: (e) => e && field.onChange(sanitizeValue(e.target.value)),
    ...field,
  };

  return (
    <div
      className={cn(styles.container, className, {
        [styles.containerStacked]: stacked,
        //[styles.containerIsCheckBox]: Input.displayName === 'InputCheckbox',
      })}
    >
      <div className={styles.labelContainer}>
        <label htmlFor={name.toString()} className={styles.label}>
          {label}
          {'required' in rules && '*'}
        </label>
        {Description && <div className={styles.description}>{Description}</div>}
      </div>
      <div className={styles.content}>
        {input === InputType.SELECT ? (
          <InputSelect
            {...inputBaseProps}
            {...(inputProps as InputSelectProps<T>)}
          />
        ) : input === InputType.RANGE ? (
          <InputRange
            {...inputBaseProps}
            {...(inputProps as InputRangeProps<T>)}
          />
        ) : input === InputType.TOGGLE ? (
          <InputToggle
            {...inputBaseProps}
            {...(inputProps as InputToggleProps<T>)}
          />
        ) : (
          <InputText
            {...inputBaseProps}
            {...(inputProps as InputTextProps<T>)}
          />
        )}
        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    </div>
  );
};

export default FormElement;
