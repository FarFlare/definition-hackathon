import React, { FC } from 'react';
import cn from 'classnames';

import s from './Input.module.css';

type PropsType = {
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<PropsType> = ({ label, id, placeholder, value, onChange, className }) => {
  return (
    <div className={cn(s.root, className)}>
      <label htmlFor={id} className={s.label}>{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} id={id} className={s.input} />
    </div>
  );
};

export default Input;
