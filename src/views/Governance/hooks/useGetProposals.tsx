import { useQuery } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { ProposalCreatedEventObject } from "src/typechain/OlympusGovernorBravo";
import { useProvider } from "wagmi";

export const useGetProposals = () => {
  const archiveProvider = useProvider();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(
    ["getProposals", NetworkId.MAINNET],
    async () => {
      // using EVENTS
      const proposalCreatedEvents = await contract.queryFilter(contract.filters.ProposalCreated(), 19520392);

      const proposals = Promise.all(
        proposalCreatedEvents.map(async item => {
          const timestamp = (await archiveProvider.getBlock(item.blockNumber)).timestamp;
          if (item.decode) {
            const details = { ...item.decode(item.data), values: item.args[3] } as ProposalCreatedEventObject;
            return {
              createdAtBlock: new Date(timestamp * 1000),
              details,
              title: details.description.split(/#+\s|\n/g)[1] || `${details.description.slice(0, 20)}...`,
              txHash: item.transactionHash,
            };
          }
        }),
      );
      return proposals;
    },
    { enabled: !!archiveProvider && !!contract },
  );
};

export const useGetProposal = ({ proposalId }: { proposalId: number }) => {
  const proposals = useGetProposals();
  return useQuery(
    ["getProposal", NetworkId.MAINNET, proposalId],
    async () => {
      return proposals.data?.find(item => Number(item?.details.id) === proposalId);
    },
    { enabled: !!proposals.data },
  );
};
