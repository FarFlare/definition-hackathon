import React, { FC } from 'react'

import s from './UserBadge.module.css';

type PropsType = {
  name?: string;
  number?: string;
}

const UserBadge: FC<PropsType> = ({ name, number }) => {
  return (
    <div className={s.root}>
      <div className={s.nameBlock}>
        <div className={s.avatar}></div>
        <p className={s.name}>{name}</p>
      </div>
      <p className={s.price}>{number} ETH</p>
    </div>
  )
}

export default UserBadge
