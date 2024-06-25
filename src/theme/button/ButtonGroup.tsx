import React from 'react';
import styles from './ButtonGroup.module.css';
import cn from '@utils/classnames.ts';

export enum ButtonGroupAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

const ButtonGroup: React.FC<{
  className?: string;
  children?: any;
  align?: ButtonGroupAlign;
}> = ({ className = '', children, align = ButtonGroupAlign.LEFT }) => (
  <div
    className={cn(
      className,
      styles.group,
      align === ButtonGroupAlign.RIGHT
        ? styles.alignRight
        : align === ButtonGroupAlign.CENTER
          ? styles.alignCenter
          : styles.alignLeft
    )}
  >
    {children}
  </div>
);

export default ButtonGroup;
