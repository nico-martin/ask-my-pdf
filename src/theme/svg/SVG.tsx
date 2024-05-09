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
    <figure className={cn(className)} {...props}>
      <LoadedIcon />
    </figure>
  ) : null;
};

export default SVG;
