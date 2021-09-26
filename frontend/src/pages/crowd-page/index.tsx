import React, { FC, useState } from "react";
import Modal from 'react-modal';

import CrowdBlock from "src/components/CrowdBlock";
import Layout from 'src/components/Layout';
import Button from 'src/components/Button';
import Proposal from 'src/components/Proposal';
import Input from 'src/components/Input';
import TextArea from 'src/components/TextArea';

import s from "./CrowdPage.module.css";

import rarible from "src/assets/images/rarible.svg";
import close from 'src/assets/images/close.svg';


const CrowdPage: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Layout>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className={s.modal}
        overlayClassName={s.overlay}
      >
        <div className={s.modalHeader}>
          <p className={s.modalTitle}>Add proposal</p>
          <button className={s.closeButton}>
            <img src={close} alt="close" onClick={() => setIsOpen(false)}/>
          </button>
        </div>
        <Input 
          label="Header" 
          placeholder="header" 
          value={header} 
          onChange={(e) => setHeader(e.target.value)}
          className={s.mb12}
        />
        <TextArea
          label="Description"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={s.mb18}
        />
        <Button className={s.button}>Add Proposal</Button>
      </Modal>
      <div className={s.root}>
        <div className={s.nftBlock}>
          <div className={s.titleBlock}>
            <p className={s.title}>Party name</p>
            <a className={s.rari} href="https://rarible.com/token/0x60f80121c31a0d46b5279700f9df786054aa5ee5:1344762?tab=bids">
              <img src={rarible} alt="rarible" />
            </a>
          </div>
          <div className={s.user}>
            <div className={s.avatar}></div>
            <div className={s.name}>name</div>
          </div>
          <div className={s.imageContainer}>
            <img className={s.img} alt="nft" src="https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png" />
          </div>
          <Button onClick={() => setIsOpen(true)}>Add Proposal</Button>
        </div>
        <CrowdBlock />
      </div>
      <div className={s.proposalBlock}>
        <Proposal />
        <Proposal />
      </div>
    </Layout>
  );
};

export default CrowdPage;
