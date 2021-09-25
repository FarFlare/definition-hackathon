import React from 'react'

import s from './UserBadge.module.css';

const UserBadge = () => {
  return (
    <div className={s.root}>
      <div className={s.nameBlock}>
        <div className={s.avatar}></div>
        <p className={s.name}>User</p>
      </div>
      <p className={s.price}>1000 ETH</p>
    </div>
  )
}

export default UserBadge
