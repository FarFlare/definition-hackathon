import React, { FC } from 'react'
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

import Percentage from 'src/components/Percentage';

import { round } from 'src/utils/round';

import s from './Card.module.css';
import eth from 'src/assets/images/Etherium.svg';

type PropsType = {
  id: string;
  title: string;
  collected: number;
  price: number;
  image?: string;
  participants: number;
  className?: string;
}

const Card: FC<PropsType> = ({
  id,
  title,
  image = "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
  price,
  collected = 0,
  participants = 0,
  className 
}) => {
  const { push } = useHistory();
  return (
    <div className={cn(s.root, className)} onClick={() => push(`id/${id}`)}>
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
          <p>{round(collected, 1)}%</p>
          <p>{participants}</p>
        </div>
      </div>
      <Percentage number={collected} />
    </div>
  )
}

export default Card
