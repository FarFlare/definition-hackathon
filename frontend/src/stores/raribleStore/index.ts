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
        url: `https://ethereum-api-staging.rarible.org/v0.1/nft-order/items/${id}`,
        withCredentials: false,
        params: {
          includeMeta: true,
        }
      });
      this.order = response.data;
      console.log(response, 'response');
      return response.data;
    } catch (error) {}
  }

  clearOrder = () => {
    this.order = null;
  }
};

export default new RaribleStore();
