import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const STAKING_ADDRESSES = {
  [NetworkId.TESTNET_RINKEBY]: "0x06984c3a9eb8e3a8df02a4c09770d5886185792d",
  [NetworkId.MAINNET]: "0xB63cac384247597756545b500253ff8E607a8020",
};

export const GOHM_ADDRESSES = {
  [NetworkId.TESTNET_RINKEBY]: "0xcF2D6893A1CB459fD6B48dC9C41c6110B968611E",
  [NetworkId.MAINNET]: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
  [NetworkId.ARBITRUM]: "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1",
  [NetworkId.AVALANCHE]: "0x321e7092a180bb43555132ec53aaa65a5bf84251",
  [NetworkId.POLYGON]: "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
  [NetworkId.FANTOM]: "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
};

export const WSOHM_ADDRESSES = {
  [NetworkId.TESTNET_RINKEBY]: "0xe73384f11Bb748Aa0Bc20f7b02958DF573e6E2ad",
  [NetworkId.MAINNET]: "0xca76543cf381ebbb277be79574059e32108e3e65",
  [NetworkId.ARBITRUM]: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
  [NetworkId.AVALANCHE]: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
};

export const OHM_ADDRESS = {
  [NetworkId.MAINNET]: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
};

export const V1_OHM_ADDRESS = {
  [NetworkId.MAINNET]: "0x383518188c0c6d7730d91b2c03a03c837814a899",
};

export const SOHM_ADDRESS = {
  [NetworkId.MAINNET]: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
};

export const V1_SOHM_ADDRESS = {
  [NetworkId.MAINNET]: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
};
