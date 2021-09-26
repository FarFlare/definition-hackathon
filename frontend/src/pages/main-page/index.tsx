import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Modal from "react-modal";
import cn from "classnames";
import Loader from "react-loader-spinner";

import Card from "src/components/Card";
import Layout from "src/components/Layout";
import Button from "src/components/Button/index";
import ModalContent from "./components/ModalContent";

import raribleStore from "src/stores/raribleStore";
import chainStore from "src/stores/chainStore";

import { TabsEnum } from "src/constants/tabs";

import s from "./Main.module.css";

import plus from "src/assets/images/plus.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const MainPage: FC = observer(() => {
  const { order } = raribleStore;
  const { getPartyNumber, clearPool, poolContract, pools, poolLoading } = chainStore;

  const [activeTab, setActiveTab] = useState(TabsEnum.ALL);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (poolContract) {
      clearPool();
      getPartyNumber(activeTab);
    }
  }, [poolContract, activeTab, getPartyNumber, clearPool]);

  console.log(pools, 'pools');

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
        <ModalContent onClose={() => setIsOpen(false)} onSuccess={() => {
          clearPool();
          getPartyNumber(activeTab);
        }}/>
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
      {poolLoading ? <div className={s.loaderContainer}>
        <Loader
          type="Puff"
          color="#6200E8"
          height={100}
          width={100}
          timeout={3000}
        />
      </div> : pools && pools.length ? <div className={s.root}>
        {pools.map(({ id, party_name, total, participants, percentage, image, price,  }) => {
          return (
            <Card
              id={id}
              price={price}
              collected={percentage}
              title={party_name}
              image={image}
              participants={participants?.length}
              className={s.mb60}
            />
          );
        })}
      </div> : <div className={s.loaderContainer}>
        <p className={s.emptyTitle}>There is no parties yet!</p>
        <Button outlined onClick={() => setIsOpen(true)}>Try to start a new one</Button>
      </div>}
    </Layout>
  );
});

export default MainPage;
