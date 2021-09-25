import React, { FC } from "react";
import CrowdBlock from "src/components/CrowdBlock/index";
import UserBadge from "src/components/UserBadge/index";
import Layout from 'src/components/Layout';

import s from "./CrowdPage.module.css";

import rarible from "src/assets/images/rarible.svg";

const CrowdPage: FC = () => {
  return (
    <Layout>
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
            <div className={s.img}>
              <img alt="nft" />
            </div>
          </div>
        </div>
        <CrowdBlock />
      </div>
    </Layout>
  );
};

export default CrowdPage;
