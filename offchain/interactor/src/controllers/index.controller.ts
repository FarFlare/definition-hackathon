import {Controller, Get, Post, Body} from 'routing-controllers';
import {createRaribleSdk} from "@rarible/protocol-ethereum-sdk";
import {Web3Ethereum} from "@rarible/web3-ethereum";
import Pool from "../../../../onchain/build/contracts/Pool.json";
import HDWalletProvider from "@truffle/hdwallet-provider";
import BigNumber from "bignumber.js";
const fetch = require("fetch");
const axios = require('axios').default;
const Web3 = require('web3');

const infura_id = "3c9a3a365f2441f6b1d68cfb6c998a25"; // Please don't use it, it's mine!
const private_key = "0xe8c3f96f68f03ce68d6d55ec406e0960a6fb29f675ff51f10666b4e52e3e866f";  // 0xF52B67C2241B0F7ab3b7643a0c78DAd0cB39a6A4

// Setting provider
const web3Provider = new HDWalletProvider({
  privateKeys: [private_key],
  providerOrUrl: `https://rinkeby.infura.io/v3/${infura_id}`
});
const provider = new Web3(web3Provider)
const web3Ethereum = new Web3Ethereum({web3: provider})
const rarible = createRaribleSdk(web3Ethereum, "rinkeby", {fetchApi: fetch})

// Setting contracts to interact
const pool_abi = Pool.abi;
const pool_address = "0x984e5eAede2306Ae554f54dd57dB5d197Bd49426";
const pool_contract = new provider.eth.Contract(pool_abi, pool_address);

@Controller()
export class HealthController {
  @Get('/health')
  index() {
    return JSON.stringify({"status": "up"})
  }
}

@Controller()
export class BuyoutController {
  @Post('/buyout')
  async buyout(@Body() body: any) {
    let item = body.item;
    let pool_id = body.pool_id;
    let item_data = await axios.get(`https://ethereum-api-staging.rarible.org/v0.1/nft-order/items/${item}`);
    const leftOrder = item_data.data.bestSellOrder;
    let item_price = leftOrder.take.value;
    let pool_total = await pool_contract.methods.get_total(pool_id).call();
    await pool_contract.methods.get_funds_for_buyout(pool_id).send({from: (await provider.eth.getAccounts())[0]});
    console.log("Funded!")

    pool_total = new BigNumber(pool_total);
    item_price = new BigNumber(item_price);

    if (pool_total.comparedTo(item_price)) {
      rarible.order.fill(
        {
          payouts: [],
          originFees: [],
          amount: 1,
          infinite: true,
          order: leftOrder
        }
      ).then(a => a.build().runAll())
        .then(console.log)
        .catch(console.log)
    } else {
      return JSON.stringify({"pool_total": pool_total, "item_price": item_price});
    }
  }
}

@Controller()
export class SellController {
  @Post('/sell')
  async buyout(@Body() body: any) {
    return JSON.stringify({"status": "Of course sold"});
  }
}
