import React, { FormEventHandler } from 'react';

const Form = ({
  className = '',
  children,
  onSubmit,
  ...rest
}: {
  className?: string;
  children?: Array<React.ReactElement> | React.ReactElement;
  onSubmit: FormEventHandler<HTMLFormElement>;
  [key: string]: any;
}) => (
  <form className={className} onSubmit={onSubmit} {...rest}>
    {children}
  </form>
);

export default Form;
