import {
  ControllerRenderProps,
  Path,
  PathValue,
  RegisterOptions,
  UseFormReturn,
} from 'react-hook-form';
import React from 'react';
import { InputTextProps } from './InputText.tsx';
import { InputSelectProps } from './InputSelect.tsx';
import { InputRangeProps } from './InputRange.tsx';
import { InputToggleProps } from './InputToggle.tsx';
import { InputTextareaProps } from './InputTextarea.tsx';

export interface InputBaseProps<T> {
  name: Path<T>;
  value?: PathValue<T, Path<T>>;
  className?: string;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export type InputProps<T> = Omit<ControllerRenderProps<T>, 'onBlur'> &
  InputBaseProps<T>;

export enum InputType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RANGE = 'range',
  TOGGLE = 'toggle',
}

interface FormElementBaseProps<T> {
  form?: UseFormReturn<T>;
  label?: string;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  className?: string;
  inputClassName?: string;
  stacked?: boolean;
  Description?: React.ReactElement | string | Array<React.ReactElement>;
  Informations?: React.ReactElement | string | Array<React.ReactElement>;
  sanitizeValue?: (value: any) => any;
}

interface FormElementInputTextProps<T>
  extends FormElementBaseProps<T>,
    InputTextProps<T> {
  input: InputType.TEXT;
}

interface FormElementInputTextareaProps<T>
  extends FormElementBaseProps<T>,
    InputTextareaProps<T> {
  input: InputType.TEXTAREA;
}

interface FormElementInputSelectProps<T>
  extends FormElementBaseProps<T>,
    InputSelectProps<T> {
  input: InputType.SELECT;
}

interface FormElementInputRangeProps<T>
  extends FormElementBaseProps<T>,
    InputRangeProps<T> {
  input: InputType.RANGE;
}

interface FormElementInputToggleProps<T>
  extends FormElementBaseProps<T>,
    InputToggleProps<T> {
  input: InputType.TOGGLE;
}

export type FormElementProps<T> =
  | FormElementInputTextareaProps<T>
  | FormElementInputTextProps<T>
  | FormElementInputSelectProps<T>
  | FormElementInputRangeProps<T>
  | FormElementInputToggleProps<T>;
