import { makeAutoObservable } from "mobx";
import Web3 from "web3";

const CONTRACT_ADDRESS = "0x91e9D25135fa1E414B4c49Ab89f9d823975EfF67";
const TOKEN_ADDRESS = "0x082AD51D87ccA280582E036D837D7677067b62a7";

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
