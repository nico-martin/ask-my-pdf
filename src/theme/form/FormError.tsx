import React from 'react';
import styles from './FormError.module.css';
import cn from '@utils/classnames.ts';

const FormError: React.FC<{
  className?: string;
  children: React.ReactElement | string;
}> = ({ className = '', children }) => (
  <p className={cn(className, styles.root)}>{children}</p>
);

export default FormError;
