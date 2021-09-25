import { makeAutoObservable } from "mobx";
import axios from 'axios';

class RaribleStore {
  constructor() {
    makeAutoObservable(this);
  }

  order!: any;

  getOrder = async (id: string) => {
    try {
      const response = await axios({
        url: `https://ethereum-api.rarible.org/v0.1/nft-order/items/${id}`,
        withCredentials: false,
        params: {
          includeMeta: true,
        }
      });

      console.log(response, 'response');
    } catch (error) {}
  }
};

export default new RaribleStore();
