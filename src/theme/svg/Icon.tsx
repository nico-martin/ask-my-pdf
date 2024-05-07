import React from 'react';

import cn from '@utils/classnames';

import styles from './Icon.module.css';
import SVG from './SVG';
import { IconName } from './icons.ts';

const Icon: React.FC<{
  icon: IconName;
  className?: string;
  rotate?: 90 | 180 | 270 | false;
  spinning?: boolean;
  round?: boolean;
  circle?: boolean;
  [key: string]: any;
}> = ({
  icon,
  className = '',
  spinning = false,
  rotate = false,
  round = false,
  circle = false,
  ...props
}) => {
  return (
    <SVG
      className={cn(className, styles.icon, {
        [styles.rotate90]: rotate === 90,
        [styles.rotate180]: rotate === 180,
        [styles.rotate270]: rotate === 270,
        [styles.isSpinning]: spinning,
        [styles.isRound]: round,
        [styles.isCircle]: circle,
      })}
      icon={icon}
      {...props}
    />
  );
};

export default Icon;
