import React, { FC, useState } from "react";
import { observer } from 'mobx-react-lite';
import cn from 'classnames';

import Input from 'src/components/Input/index';
import Button from 'src/components/Button/index';

import raribleStore from 'src/stores/raribleStore';

import s from "./Modal.module.css";

import close from "src/assets/images/close.svg";
import eth from "src/assets/images/Etherium.svg"

type PropsType = {
  onClose: () => void;
}

const ModalContent: FC<PropsType> = observer(({ onClose }) => {
  const { getOrder } = raribleStore;

  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log();
    const urlSplit = url.split('/');
    if (urlSplit[2] !== 'rarible.com' && urlSplit[3] !== 'token') {
      console.log('err');
    } else {
      getOrder(urlSplit[4].split('?')[0]);
    }
  }

  return (
    <>
      <div className={s.modalHeader}>
        <p className={s.modalTitle}>Strart a PARTY</p>
        <button className={s.closeButton}>
          <img src={close} alt="close" onClick={onClose}/>
        </button>
      </div>
      <form onSubmit={onSubmit} id="data">
        <Input
          className="mb18"
          label="What’s your party name?"
          id="name"
          placeholder="Qroud Party"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="mb18"
          label="If you win, what’s your token?"
          id="token"
          placeholder="$HOLDER"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Input
          className="mb18"
          label="The auction URL is"
          id="url"
          placeholder="https://zora.co/void/123"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button className={s.button} form="data" type="submit">Preview</Button>
      </form>
      {/* <div className={s.nftContainer}>
        <div className={s.nftTitleRow}>
          <p className={s.nftTtile}>asdasd</p>
        </div>
        <div className={s.userContainer}>
          <div className={s.userAvatar}></div>
          <div className={s.userName}>asdasdas</div>
        </div>
        <div className={s.nftImageContainer}>
          <div className={s.nftImage}></div>
        </div>
        <div className={s.priceBlock}>
          <div className={cn(s.priceColumn, s.aiend)}>
            <p className={s.price}>CURRENT</p>
            <p className={s.price}>PRICE</p>
          </div>
          <div className={s.iconContainer}>
            <img src={eth} alt="eth" />
          </div>
          <div className={s.priceColumn}>
            <p className={s.price}>10000</p>
            <p className={s.price}>ETH</p>
          </div>
        </div>
      </div> */}
    </>
  );
});

export default ModalContent;
