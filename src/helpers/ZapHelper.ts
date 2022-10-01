import { NetworkId } from "src/constants";
import { ZAP_ADDRESSES } from "src/constants/addresses";

export const isSupportedChain = (networkId: NetworkId): boolean => {
  return !!ZAP_ADDRESSES[networkId as keyof typeof ZAP_ADDRESSES];
};
