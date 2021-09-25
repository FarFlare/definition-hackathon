import React, { FC } from 'react';
import cn from 'classnames';

import s from './Percentage.module.css';

type PropsType = {
  className?: string;
}

const Percentage: FC<PropsType> = ({ className }) => {
  return (
    <div className={cn(s.root, className)}>
      <div className={s.main}>
        <div className={s.main_dark}></div>
      </div>
    </div>
  );
};

export default Percentage;
