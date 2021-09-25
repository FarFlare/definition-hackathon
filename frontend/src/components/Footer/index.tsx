import React from 'react';

import s from './Footer.module.css';

const Footer = () => {
  return (
    <div className={s.root}>
      <p className={s.link}>FAQ</p>
      <p className={s.link}>Donate to a star</p>
      <p className={s.link}>About us</p>
    </div>
  )
}

export default Footer;
