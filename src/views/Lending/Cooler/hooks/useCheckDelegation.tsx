import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { GOHM__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useCheckDelegation = ({ address }: { address?: string }) => {
  const networks = useTestableNetworks();
  const provider = useProvider();

  const { data, isFetched, isLoading } = useQuery(
    ["checkDelegation", networks.MAINNET, address],
    async () => {
      const contract = GOHM__factory.connect(GOHM_ADDRESSES[networks.MAINNET], provider);
      if (!address) {
        return "";
      } else {
        const delegationAddress = await contract.delegates(address);
        return delegationAddress === ethers.constants.AddressZero ? "" : delegationAddress;
      }
    },
    { enabled: !!address },
  );
  return { data, isFetched, isLoading };
};
