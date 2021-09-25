import React, { ReactElement, ReactNode } from 'react';
import cn from 'classnames';
import s from './Button.module.css';

export interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string
}

const Button = ({ children, onClick, className }: Props): ReactElement => {
  return (
    <button className={cn(s.root, className)} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
