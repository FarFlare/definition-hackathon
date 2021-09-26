import React, { FC } from 'react';
import cn from 'classnames';

import s from './TextArea.module.css';

type PropsType = {
  id?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const TextArea: FC<PropsType> = ({ id, label, placeholder, value, onChange, className }) => {
  return (
    <div className={cn(s.root, className)}>
      <label htmlFor={id} className={s.label}>{label}</label>
      <textarea placeholder={placeholder} value={value} onChange={onChange} className={s.input} />
    </div>
  )
}

export default TextArea
