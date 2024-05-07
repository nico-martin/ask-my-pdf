import React from 'react';
import PortalBox, { PortalBoxPropsI } from './PortalBox';

export interface ModalPropsI extends PortalBoxPropsI {}

const Modal: React.FC<ModalPropsI> = ({ children, ...props }) => (
  <PortalBox {...props}>{children}</PortalBox>
);

export default Modal;
