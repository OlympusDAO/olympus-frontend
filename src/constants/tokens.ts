import { ERC20 } from "src/helpers/contracts/ERC20";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";

import { OHM_ADDRESSES, OHM_DAI_LP_ADDRESSES, OHM_LUSD_LP_ADDRESSES, OHM_WETH_LP_ADDRESSES } from "./addresses";
import { OHM_DAI_LP, OHM_LUSD_LP } from "./pools";

export const OHM_TOKEN = new ERC20({
  icons: ["OHM"],
  name: "OHM",
  decimals: 9,
  addresses: OHM_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  getPrice: async () => {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_DAI_LP.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [ohm, dai] = await contract.getReserves();

    return new DecimalBigNumber(dai.div(ohm), 9);
  },
});

export const OHM_WETH_LP_TOKEN = new ERC20({
  icons: ["OHM", "wETH"],
  name: "OHM-ETH LP",
  decimals: 18,
  addresses: OHM_WETH_LP_ADDRESSES,
  purchaseUrl: "",
  async getPrice() {
    return new DecimalBigNumber("19563703.22", 2);
  },
});

export const OHM_LUSD_LP_TOKEN = new ERC20({
  icons: ["OHM", "LUSD"],
  name: "OHM-LUSD LP",
  decimals: 18,
  purchaseUrl: "",
  addresses: OHM_LUSD_LP_ADDRESSES,
  async getPrice() {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_LUSD_LP.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [reserves, totalSupply] = await Promise.all([contract.getReserves(), contract.totalSupply()]);
    const [lusd, ohm] = reserves;

    const _ohm = new DecimalBigNumber(ohm, OHM_TOKEN.decimals);
    const _lusd = new DecimalBigNumber(lusd, 18);
    const _totalSupply = new DecimalBigNumber(totalSupply, 18);

    const ohmPerUsd = await OHM_TOKEN.getPrice(NetworkId.MAINNET);

    const totalValueOfLpInUsd = _ohm.mul(ohmPerUsd, 9).add(_lusd);

    return totalValueOfLpInUsd.div(_totalSupply, 9);
  },
});

export const OHM_DAI_LP_TOKEN = new ERC20({
  name: "OHM-DAI LP",
  icons: ["OHM", "DAI"],
  decimals: 18,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
  addresses: OHM_DAI_LP_ADDRESSES,
  async getPrice() {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = OHM_DAI_LP.getEthersContract(NetworkId.MAINNET).connect(provider);

    const [reserves, totalSupply] = await Promise.all([contract.getReserves(), contract.totalSupply()]);
    const [ohm, dai] = reserves;

    const _ohm = new DecimalBigNumber(ohm, 9);
    const _dai = new DecimalBigNumber(dai, 18);
    const _totalSupply = new DecimalBigNumber(totalSupply, 18);

    const ohmPerUsd = _dai.div(_ohm, 9);

    const totalValueOfLpInUsd = _ohm.mul(ohmPerUsd, 9).add(_dai);

    return totalValueOfLpInUsd.div(_totalSupply, 9);
  },
});
