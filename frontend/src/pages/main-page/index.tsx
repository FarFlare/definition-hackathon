import React, { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import Modal from 'react-modal';
import cn from 'classnames';

import Card from "src/components/Card";
import Layout from "src/components/Layout";
import Button from "src/components/Button/index";
import ModalContent from './components/ModalContent';

import raribleStore from 'src/stores/raribleStore';

import { TabsEnum } from "src/constants/tabs";

import s from "./Main.module.css";

import plus from "src/assets/images/plus.svg";

const NFTS_MOCK = [
  {
    title: "Reusable components available for every layout",
    price: 13123,
    image: "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
    collected: 123,
  },
  {
    title: "Reusable components available for every layout",
    price: 13123,
    image: "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
    collected: 123,
  },
  {
    title: "Reusable components available for every layout",
    price: 13123,
    image: "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
    collected: 123,
  },
  {
    title: "Reusable components available for every layout",
    price: 13123,
    image: "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
    collected: 123,
  },
];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const MainPage: FC = observer(() => {
  const { order } = raribleStore;

  const [activeTab, setActiveTab] = useState(TabsEnum.ALL);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  return (
    <Layout>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
        preventScroll={false}
        className={cn(s.modal, order && s.modalLarge)}
        overlayClassName={s.overlay}
      >
        <ModalContent onClose={() => setIsOpen(false)}/>
      </Modal>
      <div className={s.buttonRow}>
        <Button
          active={activeTab === TabsEnum.ALL}
          onClick={() => setActiveTab(TabsEnum.ALL)}
          outlined
          className={s.mr24}
        >
          ALL PARTIES
        </Button>
        <Button
          active={activeTab === TabsEnum.MY}
          outlined
          onClick={() => setActiveTab(TabsEnum.MY)}
        >
          MY PARTIES
        </Button>
        <div className={s.addButtonContainer}>
          <p className={s.buttonText}>START A PARTY</p>
          <button className={s.addButton} onClick={() => setIsOpen(true)}>
            <img src={plus} alt="plus" />
          </button>
        </div>
      </div>
      <div className={s.root}>
        {NFTS_MOCK.map(({ title, price, collected, image }) => {
          return (
            <Card
              price={price}
              collected={collected}
              title={title}
              image={image}
              className={s.mb60}
            />
          );
        })}
      </div>
    </Layout>
  );
});

export default MainPage;
