import React, { FC } from 'react'
import cn from 'classnames';

import s from './Card.module.css';
import eth from 'src/assets/images/Etherium.svg';
import Percentage from '../Percentage/index';

type PropsType = {
  title: string;
  collected: number;
  price: number;
  image: string;
  className?: string;
}

const Card: FC<PropsType> = ({ title, image, price, collected, className }) => {
  return (
    <div className={cn(s.root, className)}>
      <div className={s.previewContainer}>
        <img src={image} alt="preview" className={s.preview}/>
      </div>
      <p className={s.title}>
        {title}
      </p>
      <div className={s.priceBlock}>
        <div className={s.iconContainer}>
          <img src={eth} alt="eth" />
        </div>
        <p className={cn(s.price, s.mr14)}>ETH</p>
        <p className={s.price}>{price}</p>
      </div>
      <div className={s.collected}>
        <div className={s.collectedRow}>
          <p>Collected</p>
          <p>Participants</p>
        </div>
        <div className={s.collectedRow}>
          <p>80%</p>
          <p>1111</p>
        </div>
      </div>
      <Percentage />
    </div>
  )
}

export default Card
