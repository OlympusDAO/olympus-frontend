import { Token } from "src/helpers/contracts/Token/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { getCoingeckoPrice } from "src/helpers/misc/getCoingeckoPrice";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";

import { OHM_ADDRESSES } from "../addresses";
import { OHM_DAI_POOL, OHM_LUSD_POOL } from "./pools";

export const OHM_TOKEN = new Token({
  icons: ["OHM"],
  name: "OHM",
  decimals: 9,
  addresses: OHM_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  async getPrice() {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_DAI_POOL.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [ohm, dai] = await contract.getReserves();

    return new DecimalBigNumber(dai.div(ohm), 9);
  },
});

export const WETH_TOKEN = new Token({
  icons: ["wETH"],
  name: "wETH",
  decimals: 18,
  addresses: {
    [NetworkId.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  purchaseUrl: "",
  async getPrice() {
    const price = await getCoingeckoPrice(NetworkId.MAINNET, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");

    return new DecimalBigNumber(price.toString(), 0);
  },
});

export const LUSD_OHM_LP_TOKEN = new Token({
  icons: ["LUSD", "OHM"],
  name: "LUSD-OHM LP",
  decimals: 18,
  purchaseUrl: "",
  addresses: {
    [NetworkId.MAINNET]: "0x46E4D8A1322B9448905225E52F914094dBd6dDdF",
  },
  async getPrice() {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_LUSD_POOL.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [reserves, totalSupply] = await Promise.all([contract.getReserves(), contract.totalSupply()]);
    const [lusd, ohm] = reserves;

    const _ohm = new DecimalBigNumber(ohm, OHM_TOKEN.decimals);
    const _lusd = new DecimalBigNumber(lusd, 18);
    const _totalSupply = new DecimalBigNumber(totalSupply, 18);

    const ohmPerUsd = _lusd.div(_ohm, 9);

    const totalValueOfLpInUsd = _ohm.mul(ohmPerUsd, 9).add(_lusd);

    return totalValueOfLpInUsd.div(_totalSupply, 9);
  },
});

export const OHM_DAI_LP_TOKEN = new Token({
  name: "OHM-DAI LP",
  icons: ["OHM", "DAI"],
  decimals: 18,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
  addresses: {
    [NetworkId.MAINNET]: "0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c",
  },
  async getPrice() {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_DAI_POOL.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [reserves, totalSupply] = await Promise.all([contract.getReserves(), contract.totalSupply()]);
    const [ohm, dai] = reserves;

    const _ohm = new DecimalBigNumber(ohm, OHM_TOKEN.decimals);
    const _dai = new DecimalBigNumber(dai, 18);
    const _totalSupply = new DecimalBigNumber(totalSupply, 18);

    const ohmPerUsd = _dai.div(_ohm, 9);

    const totalValueOfLpInUsd = _ohm.mul(ohmPerUsd, 9).add(_dai);

    return totalValueOfLpInUsd.div(_totalSupply, 9);
  },
});
