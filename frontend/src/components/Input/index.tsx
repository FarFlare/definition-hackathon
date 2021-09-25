import React, { ReactElement } from 'react';
import cn from 'classnames';

import s from './Input.module.css';

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | string[]
  name?: string;
  id?: string;
  className?: string;
}

const Input = ({ className, ...restProps}: Props): ReactElement => {
  return (
    <input className={cn(s.root, className)} {...restProps} />
  )
}

export default Input;
