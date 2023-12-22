import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { GOHM__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useCheckDelegation = ({ coolerAddress }: { coolerAddress?: string }) => {
  const networks = useTestableNetworks();
  const provider = useProvider();

  const { data, isFetched, isLoading } = useQuery(
    ["checkDelegation", networks.MAINNET, coolerAddress],
    async () => {
      const contract = GOHM__factory.connect(GOHM_ADDRESSES[networks.MAINNET], provider);
      if (!coolerAddress) {
        return "";
      } else {
        const delegationAddress = await contract.delegates(coolerAddress);
        return delegationAddress === ethers.constants.AddressZero ? "" : delegationAddress;
      }
    },
    { enabled: !!coolerAddress },
  );
  return { data, isFetched, isLoading };
};
