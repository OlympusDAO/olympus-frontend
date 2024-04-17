import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { GOHM__factory } from "src/typechain";
import { useAccount, useProvider, useQuery } from "wagmi";

export const useGetVotingWeight = ({ startBlock }: { startBlock?: number }) => {
  const archiveProvider = useProvider();
  const { address } = useAccount();
  const networks = useTestableNetworks();

  return useQuery(
    ["votingWeight", address, startBlock],
    async () => {
      const currentBlock = await archiveProvider.getBlock("latest");
      if (!address) return "0";
      const contract = GOHM__factory.connect(GOHM_ADDRESSES[networks.MAINNET], archiveProvider);
      //votes at activation
      const currentVotes = await contract.getCurrentVotes(address);

      //if we're not activated yet
      if ((startBlock && currentBlock.number < startBlock) || !startBlock) {
        return formatEther(currentVotes);
      } else {
        //we're activated and need to return how contract determines weight. votes at activation or current votes, whichever is less
        const originalVotes = await contract.getPriorVotes(address, BigNumber.from(startBlock));
        const votes = originalVotes.gt(currentVotes) ? originalVotes : currentVotes;
        return formatEther(votes);
      }
    },
    { enabled: !!archiveProvider && !!address },
  );
};
