import React, { FC } from 'react';
import cn from 'classnames';

import { PercentEnum } from 'src/constants/percentage';

import s from './Percentage.module.css';

type PropsType = {
  number?: number;
  type?: PercentEnum,
  reverse?: boolean;
  small?: boolean;
  className?: string;
}

const Percentage: FC<PropsType> = ({ number, small, reverse, type, className }) => {
  return (
    <div 
      className={cn(s.root, 
        type === PercentEnum.DANGER && s.danger,
        small && s.small,
        className,
      )}
    >
      <div className={cn(s.main, type === PercentEnum.DANGER && s.main_danger)}>
        <div className={reverse ? s.main_reverse : s.main_dark}></div>
      </div>
    </div>
  );
};

export default Percentage;
