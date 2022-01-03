import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const STAKING_ADDRESSES: AddressMap = {
  [NetworkId.TESTNET_RINKEBY]: "0x06984c3a9eb8e3a8df02a4c09770d5886185792d",
  [NetworkId.MAINNET]: "0xB63cac384247597756545b500253ff8E607a8020",
};
