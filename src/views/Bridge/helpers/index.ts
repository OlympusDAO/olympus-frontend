import { BRIDGEABLE_CHAINS } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { useNetwork } from "wagmi";

/** will return undefined if not a bridgeable chain... */
export const chainDetails = (currentChain: NetworkId) => {
  return BRIDGEABLE_CHAINS[currentChain as keyof typeof BRIDGEABLE_CHAINS];
};

export const useBridgeableChains = () => {
  const { chain = { id: 1 } } = useNetwork();
  const data = chainDetails(chain.id);
  console.log("data", data);
  return {
    data,
    isInvalid: !data,
  };
};
