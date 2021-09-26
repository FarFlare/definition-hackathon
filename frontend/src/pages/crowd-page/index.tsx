import React, { FC, useEffect, useState } from "react";
import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import Loader from 'react-loader-spinner';
import { useLocation } from "react-router-dom";

import CrowdBlock from "src/components/CrowdBlock";
import Layout from 'src/components/Layout';
import Button from 'src/components/Button';
import Proposal from 'src/components/Proposal';
import Input from 'src/components/Input';
import TextArea from 'src/components/TextArea';

import { toEth } from 'src/utils/toEth';

import chainStore from 'src/stores/chainStore';

import s from "./CrowdPage.module.css";

import rarible from "src/assets/images/rarible.svg";
import close from 'src/assets/images/close.svg';

const CrowdPage: FC = observer(() => {
  const { 
    getPool,
    getUserData,
    setDeposite,
    getDaoContract,
    createProposal,
    getAllProposals,
    pool,
    poolContract,
    address,
    depositeLoading,
    daoContract,
    proposals,
    voteFor,
  } = chainStore;

  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [poolId, setPoolId] = useState(0);
  const [myCrowd, setMyCrowd] = useState(0);
  const [userData, setUserData] = useState<any[]>([]);
  const [addLoading, setAddLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (poolContract) {
      const id = +location.pathname.split('/')[2]
      setPoolId(id)
      getPool(id);
      getDaoContract(id);
    }
  }, [location.pathname, getPool, getDaoContract, getAllProposals, poolContract]);

  useEffect(() => {
    getAllProposals();
  }, [daoContract, getAllProposals]);

  useEffect(() => {
    const getAllUserData = async () => {
      const promises = pool.participants.map(async (item: string) => {
        let eth = await getUserData(item, poolId);
        return {
          eth: toEth(+eth),
          user: item,
        }
      });

      const all = await Promise.all(promises);
      setUserData(all);
    };

    if (pool && pool.participants) {
      getAllUserData()
    }

    const getMyCrowd = async () => {
      const myCrowd = await getUserData(address, poolId);
      setMyCrowd(myCrowd);
    }

    getMyCrowd();
  }, [pool, getUserData, poolId, address]);

  const handleDeposite = async (value: string) => {
    await setDeposite(poolId, value);
    setIsOpen(false);
  };

  const createNewProposal = async () => {
    setAddLoading(true);
    const hash = await createProposal(header, description, pool.nft_address, pool.nft_id);
    await window.web3.eth.getTransaction(
      hash.transactionHash,
      async (error, trans) => {
        setIsOpen(false);
        setAddLoading(false);
        getPool(poolId);
      }
    );
  };

  const vote = async (value: boolean, id: number) => {
    const hash = await voteFor(id, value);
    await window.web3.eth.getTransaction(
      hash.transactionHash,
      async (error, trans) => {
        getAllProposals();
      }
    );
  }

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
        <Button loading={addLoading} onClick={createNewProposal} className={s.button}>Add Proposal</Button>
      </Modal>
      {pool ? <>
        <div className={s.root}>
          <div className={s.nftBlock}>
            <div className={s.titleBlock}>
              <p className={s.title}>{pool.name}</p>
              <a className={s.rari} href={`https://rarible.com/token/${pool.nft_address}:${pool.nft_id}?tab=bids`}>
                <img src={rarible} alt="rarible" />
              </a>
            </div>
            <div className={s.user}>
              <div className={s.avatar}></div>
              <div className={s.name}>name</div>
            </div>
            <div className={s.imageContainer}>
              <img className={s.img} alt="nft" src={pool.image} />
            </div>
            <Button onClick={() => setIsOpen(true)}>Add Proposal</Button>
          </div>
          <CrowdBlock 
            price={pool.price}
            percentage={pool.percentage}
            participants={pool.participants.length}
            title={pool.party_name}
            description={pool.description}
            onDeposite={handleDeposite}
            myCrowd={myCrowd}
            userData={userData}
            loading={depositeLoading}
          />
        </div>
        <div className={s.proposalBlock}>
          {proposals.map((item: any) => <Proposal 
            title={item.title}
            description={item.description}
            voteAgree={+item.votes_for}
            voteDisagree={+item.votes_against}
            id={item.id}
            onVote={vote}
            />)}
        </div>
      </>: <div className={s.loaderContainer}>
        <Loader
          type="Puff"
          color="#6200E8"
          height={100}
          width={100}
          timeout={3000}
        />
      </div> }
    </Layout>
  );
});

export default CrowdPage;
