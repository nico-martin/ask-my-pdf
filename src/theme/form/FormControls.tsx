import React from 'react';
import { Button, ButtonGroup, ButtonGroupAlign, IconName } from '../index';
import styles from './FormControls.module.css';
import cn from '@utils/classnames.ts';

interface Props {
  value?: string;
  className?: string;
  align?: ButtonGroupAlign;
  loading?: boolean;
  resetText?: string;
  resetFunction?: () => void;
  customSubmit?: {
    text: string;
    icon: IconName;
    onClick: () => void;
  };
  [key: string]: any;
}

const FormControls = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(
  (
    {
      value = 'Submit',
      className = '',
      align = ButtonGroupAlign.LEFT,
      loading = false,
      resetText = 'Reset',
      resetFunction = null,
      customSubmit = null,
      ...buttonProps
    },
    ref
  ) => (
    <ButtonGroup align={align} className={cn(styles.controls, className)}>
      {resetFunction && align === 'right' && (
        <Button onClick={resetFunction} appearance="none" type="button">
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
        <Button {...buttonProps} loading={loading} type="submit" ref={ref}>
          {value}
        </Button>
      )}
      {resetFunction && align !== 'right' && (
        <Button onClick={resetFunction} appearance="none" type="button">
          {resetText}
        </Button>
      )}
    </ButtonGroup>
  )
);

export default FormControls;
