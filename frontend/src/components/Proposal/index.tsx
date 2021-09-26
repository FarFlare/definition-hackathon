import React, { FC } from "react";
import cn from 'classnames';

import Percentage from 'src/components/Percentage';
import Button from 'src/components/Button';

import { PercentEnum } from "src/constants/percentage";

import s from "./Proposal.module.css";

type PropsType = {
  title?: string;
  description?: string;
  voteAgree?: number;
  voteDisagree?: number;
  className?: string;
  onVote?: () => void;
}

const Proposal: FC<PropsType> = ({ title, description, voteAgree, voteDisagree, className }) => {
  return (
    <div className={cn(s.proposalRow, className)}>
      <div className={s.leftBlock}>
        <p className={s.proposalTitle}>asdasd</p>
        <p className={s.proposalDescription}>sadasdasd</p>
      </div>
      <div className={s.rightBlock}>
        <p className={s.voting}>Voting</p>
        <div className={cn(s.row, s.mb12)}>
          <Button outlined small className={s.button}>FOR</Button>
          <div className={s.percentBlock}>
            <p className={s.percentText}>3% / 0.5 RARI</p>
            <Percentage small className={s.percent} />
          </div>
        </div>
        <div className={s.row}>
          <Button small className={s.button}>AGAINST</Button>
          <div className={s.percentBlock}>
            <p className={s.percentText}>3% / 0.5 RARI</p>
            <Percentage small className={s.percent} type={PercentEnum.DANGER} reverse/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
