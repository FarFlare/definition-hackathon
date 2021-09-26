import React, { FC, useState } from 'react';
import cn from 'classnames';
import Modal from 'react-modal';

import Percentage from 'src/components/Percentage/index';
import Button from 'src/components/Button';
import UserBadge from 'src/components/UserBadge/index';
import Input from 'src/components/Input/index';

import s from './CrowdBlock.module.css';

import close from 'src/assets/images/close.svg';
import eth from 'src/assets/images/eth_small.svg';


type PropsType = {
  title?: string;
  description?: string;
  price?: string;
}

const CrowdBlock: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deposit, setDeposit] = useState('0');
  return (
    <div className={s.root}>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className={s.modal}
        overlayClassName={s.overlay}
      >
        <div className={s.modalHeader}>
          <p className={s.modalTitle}>Strart a PARTY</p>
          <button className={s.closeButton}>
            <img src={close} alt="close" onClick={() => setIsOpen(false)}/>
          </button>
        </div>
        <Input 
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          label="deposite"
          className={s.mb12}
        />
        <Button>add Eth</Button>
      </Modal>
        <p className={s.title}>Qroud Party</p>
        <p className={s.description}>Description Description Description Description Description Description Description Descriptio DescriptionD escription</p>
        <div className={s.infoBlock}>
          <p className={cn(s.infoText, s.mb10)}>current price</p>
          <div className={s.ethBlock}>
            <div className={s.iconContainer}><img src={eth} alt="eth"/></div>
            <div className={s.ethColumn}>
              <p className={s.infoText}>1000</p>
              <p className={s.infoText}>ETH</p>
            </div>
          </div>
        </div>
        <div className={s.row}>
          <p className={s.text}>Collected</p>
          <p className={s.text}>Participants</p>
        </div>
        <div className={s.row}>
          <div className={s.text}>80%</div>
          <div className={s.text}>1000</div>
        </div>
        <Percentage className={s.percentage}/>
        <Button onClick={() => setIsOpen(true)}>+ Add funds</Button>
        <p className={s.funds}>Your funds: 3% / 0.5 ETH</p>
        <hr className={s.hr} />
        <p className={s.userTitle}>User Party Name</p>
        <UserBadge />
        <UserBadge />
        <UserBadge />
    </div>
  );
};

export default CrowdBlock;
