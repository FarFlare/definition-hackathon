import React, { FC } from "react";
import cn from 'classnames';
import BigNumber from 'bignumber.js'

import Percentage from 'src/components/Percentage';
import Button from 'src/components/Button';

import { PercentEnum } from "src/constants/percentage";

import s from "./Proposal.module.css";

type PropsType = {
  title?: string;
  description?: string;
  voteAgree: number;
  voteDisagree: number;
  className?: string;
  onVote: (value: boolean, id: number) => void;
  id: number;
}

const Proposal: FC<PropsType> = ({ title, description, voteAgree, voteDisagree, id, onVote, className }) => {
  const all = new BigNumber("100000000000000000000");
  const bigFor = new BigNumber(voteAgree);
  let votePercent = new BigNumber(0);
  const hundred = new BigNumber(100);
  votePercent = bigFor.dividedBy(all).multipliedBy(hundred);
  
  const bigAgainst = new BigNumber(voteDisagree);
  let againstPercent = new BigNumber(0);
  againstPercent = bigAgainst.dividedBy(all).multipliedBy(hundred);

  console.log(againstPercent);
  console.log(voteDisagree)

  return (
    <div className={cn(s.proposalRow, className)}>
      <div className={s.leftBlock}>
        <p className={s.proposalTitle}>{title}</p>
        <p className={s.proposalDescription}>{description}</p>
      </div>
      <div className={s.rightBlock}>
        <p className={s.voting}>Voting</p>
        <div className={cn(s.row, s.mb12)}>
          <Button outlined small className={s.button} onClick={() => onVote(true, id)}>FOR</Button>
          <div className={s.percentBlock}>
            <p className={s.percentText}>{`${votePercent}% / ${bigFor.toString().substr(0, 3)}... TOKEN`} </p>
            <Percentage small className={s.percent} number={bigFor.toNumber()}/>
          </div>
        </div>
        <div className={s.row}>
          <Button small className={s.button} onClick={() => onVote(false, id)}>AGAINST</Button>
          <div className={s.percentBlock}>
            <p className={s.percentText}>{`${againstPercent}% / ${bigAgainst.toString().substr(0, 3)}... TOKEN`}</p>
            <Percentage small className={s.percent} type={PercentEnum.DANGER} reverse number={againstPercent.toNumber()}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
