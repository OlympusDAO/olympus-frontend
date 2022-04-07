import { addresses, NetworkId } from "src/constants";

export const isSupportedChain = (networkId: NetworkId): boolean => {
  return !!addresses[networkId] && !!addresses[networkId].ZAP;
};
