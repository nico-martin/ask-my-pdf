import React from 'react';

import cn from '@utils/classnames';

import icons, { IconName } from './icons.ts';

const SVG = ({
  icon,
  className = '',
  ...props
}: {
  icon: IconName;
  className?: string;
  [key: string]: any;
}) => {
  const LoadedIcon = React.useMemo(
    () => (icon in icons ? icons[icon] : null),
    [icon]
  );

  return LoadedIcon ? (
    <span className={cn(className)} {...props}>
      <LoadedIcon />
    </span>
  ) : null;
};

export default SVG;
