import React, { FC } from 'react';
import cn from 'classnames';

import s from './Button.module.css';

type PropsType = {
  active?: boolean;
  onClick?: (e: any) => void;
  outlined?: boolean
  type?: "button" | "submit" | "reset" | undefined;
  form?: string;
  small?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: FC<PropsType> = ({ active, loading, onClick, className, outlined, form, type, small, children }) => {
  return (
    <button 
      className={cn(s.root, outlined && s.outlined, active && s.active, small && s.small, loading && s.disabled, className)}
      onClick={onClick}
      form={form}
      type={type}
      disabled={loading}
    >
      {children}
    </button>
  );
};

export default Button;
