import { useQuery } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import { OlympusGovernorBravo__factory } from "src/typechain";
import { ProposalCreatedEventObject } from "src/typechain/OlympusGovernorBravo";

export const useGetProposals = () => {
  const archiveProvider = Providers.getArchiveStaticProvider(NetworkId.MAINNET);
  // const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const contractAddress = GOVERNANCE_CONTRACT.addresses[NetworkId.MAINNET];
  const contract = OlympusGovernorBravo__factory.connect(contractAddress, archiveProvider);

  return useQuery(
    ["getProposals", NetworkId.MAINNET],
    async () => {
      const proposals: { createdAtBlock: Date; details: ProposalCreatedEventObject; title: string; txHash: string }[] =
        [];
      let blockNumber = await archiveProvider.getBlockNumber();
      const startBlock = Environment.getGovernanceStartBlock();
      const chunkSize = 10000; //RPC limit
      // Fetch the last proposal ID
      const lastProposalId = (await contract.proposalCount()).toNumber();

      // If there are no proposals, return an empty array
      if (lastProposalId === 0) {
        console.log("No proposals found.");
        return proposals;
      }
      let foundProposalId1 = false;

      while (blockNumber > startBlock && !foundProposalId1) {
        const fromBlock = Math.max(blockNumber - chunkSize, startBlock);

        const proposalCreatedEvents = await contract.queryFilter(
          contract.filters.ProposalCreated(),
          fromBlock,
          blockNumber,
        );

        // Process each event
        for (const item of proposalCreatedEvents) {
          const timestamp = (await archiveProvider.getBlock(item.blockNumber)).timestamp;

          if (item.decode) {
            const details = { ...item.decode(item.data), values: item.args[3] } as ProposalCreatedEventObject;

            // Stop if we hit proposal ID 1
            if (Number(details.id) === 1) {
              foundProposalId1 = true;
              break;
            }

            proposals.push({
              createdAtBlock: new Date(timestamp * 1000),
              details,
              title: details.description.split(/#+\s|\n/g)[1] || `${details.description.slice(0, 20)}...`,
              txHash: item.transactionHash,
            });
          }
        }

        // Move to the next block range (going backwards)
        blockNumber = fromBlock - 1;
      }
      console.log("Proposals found:", proposals.length);

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
