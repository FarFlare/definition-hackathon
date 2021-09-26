import { makeAutoObservable } from "mobx";
import Web3 from "web3";

import { TabsEnum } from 'src/constants/tabs';

import PoolAbi from "../../../../onchain/build/contracts/Pool.json";
import raribleStore from 'src/stores/raribleStore';
import { toEth } from 'src/utils/toEth';

const POOL_ADRESS = "0x984e5eAede2306Ae554f54dd57dB5d197Bd49426";

const { getOrder } = raribleStore;

class ChainStore {
  constructor() {
    makeAutoObservable(this);
  }

  address = "";
  poolContract!: any;
  connected = false;
  web3Loading = true;

  pools: any[] = [];
  pool!: any;
  poolLoading = true;

  depositeLoading = false;

  loadWeb3 = async (): Promise<void> => {
    try {
      this.web3Loading = true;
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
      this.connected = true;
      this.web3Loading = false;
    } catch (error) {
      this.web3Loading = false;
      throw error;
    }
  };

  loadBlockChain = async (): Promise<void> => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();

    this.address = accounts[0];

    const poolAbi = PoolAbi.abi;
    if (poolAbi) {
      // @ts-ignore
      const poolContract = new web3.eth.Contract(poolAbi, POOL_ADRESS);
      this.poolContract = poolContract;
    }
  };

  getPool = async (id: number): Promise<any> => {
    try {
      const pool = await this.poolContract.methods.get_pool(id).call();
      const order = await getOrder(`${pool.nft_address}:${pool.nft_id}`);
      const conf = {
        ...pool,
        price: toEth(+order.bestSellOrder.take.value),
        image: order.meta.image?.url.PREVIEW,
        percentage: (pool.total / +order.bestSellOrder.take.value) * 100,
        id,
        name: order.meta.name,
        description: order.meta.name,
      }
      console.log(conf, 'conf');
      this.pool = conf;
      return conf;
    } catch (error) {}
  };

  getPartyNumber = async (type: TabsEnum): Promise<void> => {
    try {
      this.poolLoading = true;
      this.pools = [];
      const id = await this.poolContract.methods.pool_id().call();
      console.log(id, 'pool number');
      if (+id) {
        for (let i = 1; i <= id; i++) {
          const pool = await this.getPool(id);
          if (type === TabsEnum.ALL) this.pools.push(pool);
          else {
            if (pool.participants.some((item: string) => item === this.address)) {
              this.pools.push(pool);
            }
          } 
        }
      } 
    } catch (error) {}
    finally {
      this.poolLoading = false;
    }
  };

  getUserData = async (userId: string, poolId: number): Promise<any> => {
    try {
      const userData = this.poolContract.methods.get_absolute(poolId, userId).call();
      return userData;
    } catch (error) {}
  }

  setDeposite = async (poolId: number, eth: string) => {
    try {
      this.depositeLoading = true
      this.poolContract.methods.set_deposit(poolId).send({
        from: this.address,
        value: window.web3.utils.toWei(eth, "ether"),
      });
    } catch (error) {}
    finally {
      this.depositeLoading = false;
    }
  }
}

export default new ChainStore();
