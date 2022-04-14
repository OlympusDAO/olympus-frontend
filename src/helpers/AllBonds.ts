import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { NetworkId } from "src/constants";
import { LPBond } from "src/lib/Bond";

export const ohm_dai = new LPBond({
  name: "ohm_dai_lp",
  displayName: "OHM-DAI LP",
  bondToken: "DAI",
  payoutToken: "OHM",
  v2Bond: true,
  bondIconSvg: ["OHM", "DAI"],
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      // TODO: add correct bond address when it's created
      bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
      reserveAddress: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const allBonds = [ohm_dai];

export default allBonds;
