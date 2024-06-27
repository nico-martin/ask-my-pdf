import React from 'react';
import { Button, ButtonGroup, ButtonGroupAlign, IconName } from '../index';
import styles from './FormControls.module.css';
import cn from '@utils/classnames.ts';

interface Props {
  value?: string;
  submitIcon?: IconName;
  submitClassNameIconWrapper?: string;
  submitDisabled?: boolean;
  className?: string;
  align?: ButtonGroupAlign;
  loading?: boolean;
  resetText?: string;
  resetFunction?: () => void;
  resetDisabled?: boolean;
  customSubmit?: {
    text: string;
    icon: IconName;
    onClick: () => void;
  };
  [key: string]: any;
}

const FormControls: React.ForwardRefExoticComponent<Props> = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(
  (
    {
      value = 'Submit',
      submitIcon = null,
      submitClassNameIconWrapper = '',
      submitDisabled = false,
      className = '',
      align = ButtonGroupAlign.RIGHT,
      loading = false,
      resetText = 'Reset',
      resetFunction = null,
      resetDisabled = false,
      customSubmit = null,
      ...buttonProps
    },
    ref
  ) => (
    <ButtonGroup align={align} className={cn(styles.controls, className)}>
      {resetFunction && (
        <Button
          onClick={resetFunction}
          appearance="none"
          type="button"
          disabled={resetDisabled}
        >
          {resetText}
        </Button>
      )}
      {customSubmit ? (
        <Button
          type="button"
          icon={customSubmit.icon}
          onClick={() => customSubmit.onClick()}
          loading={loading}
        >
          {customSubmit.text}
        </Button>
      ) : (
        <Button
          {...buttonProps}
          loading={loading}
          type="submit"
          ref={ref}
          icon={submitIcon}
          disabled={submitDisabled}
          classNameIconWrapper={submitClassNameIconWrapper}
        >
          {value}
        </Button>
      )}
    </ButtonGroup>
  )
);

export default FormControls;
