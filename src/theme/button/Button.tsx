import React from 'react';

import cn from '@utils/classnames';

import { IconName } from '../svg/icons.ts';
import { Icon } from '../index';
import styles from './Button.module.css';

interface BaseButtonProps {
  children?: React.JSX.Element | React.JSX.Element[] | string | string[];
  className?: string;
  classNameIcon?: string;
  classNameIconWrapper?: string;
  icon?: IconName;
  iconRight?: boolean;
  loading?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

interface AnchorButtonProps extends BaseButtonProps {
  href: string;
}

interface ButtonProps extends BaseButtonProps {
  onClick?: () => void;
}

const Button: React.FC<AnchorButtonProps | ButtonProps> = ({
  children = '',
  className = '',
  classNameIcon = '',
  classNameIconWrapper = '',
  onClick = () => {},
  icon = null,
  iconRight = false,
  loading = false,
  disabled = false,
  contentWidth = 0,
  href = '',
  ...props
}) =>
  React.createElement(
    href ? 'a' : 'button',
    {
      ...props,
      disabled: disabled || loading,
      className: cn(className, styles.button, {
        [styles.buttonIsDisabled]: disabled,
        [styles.buttonIsLoading]: loading,
        [styles.buttonHasNoText]: children === '',
        [styles.buttonIconRight]: Boolean(iconRight),
      }),
      ...(href ? { href } : {}),
      ...(onClick ? { onClick } : {}),
    },
    <React.Fragment>
      <div className={styles.bkg} />
      {Boolean(icon) && (
        <span
          className={cn(styles.iconWrapper, classNameIconWrapper, {
            [styles.iconLoading]: loading,
          })}
        >
          <Icon
            className={cn(styles.icon, classNameIcon)}
            icon={loading ? IconName.LOADING : icon}
            spinning={loading}
          />
        </span>
      )}
      <span
        className={styles.content}
        style={{ ...(contentWidth ? { width: contentWidth } : {}) }}
      >
        {children}
      </span>
    </React.Fragment>
  );

export default Button;
