import { makeAutoObservable } from "mobx";
import Web3 from "web3";

const POOL_ADRESS = "0x2fc1B8aC2645B2ad4D4c8475a34C7f3d3b23D5ea";

class ChainStore {
  constructor() {
    makeAutoObservable(this);
  }

  address = "";
  distributorContract!: any;
  tokenContract!: any;
  connected = false;
  web3Loading = true;

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

    // const distributorAbi = Distributor.abi;
    // const tokenAbi = DonateToken.abi;
    // if (distributorAbi) {
    //   // @ts-ignore
    //   const distributorContract = new web3.eth.Contract(distributorAbi, CONTRACT_ADDRESS);
    //   this.distributorContract = distributorContract;
    // }
    // if (tokenAbi) {
    //   // @ts-ignore
    //   const tokenContract = new web3.eth.Contract(tokenAbi, TOKEN_ADDRESS);
    //   this.tokenContract = tokenContract;
    // }
  };
}

export default new ChainStore();
