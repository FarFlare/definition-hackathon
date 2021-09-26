import React from 'react';

import s from './Navbar.module.css';
import eth from 'src/assets/images/Etherium.svg'

const Navbar = () => {
  return (
    <div className={s.root}>
      <p className={s.logo}>CROWD PROTCOL</p>
      <div className={s.priceBlock}>
        <div className={s.price}>1000</div>
        <div className={s.iconContainer}>
          <img src={eth} alt="eth" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
