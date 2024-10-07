import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { normalizeProposal } from "src/views/Governance/helpers/normalizeProposal";

export type Proposal = {
  proposalId: string;
  proposer: string;
  targets: string[];
  signatures: string[];
  calldatas: string[];
  transactionHash: string;
  description: string;
  blockTimestamp: string;
  blockNumber: string;
  startBlock: string;
  values: string[];
};

type ProposalResponse = {
  proposalCreated: Proposal;
};

export const useGetProposalFromSubgraph = ({ proposalId }: { proposalId?: string }) => {
  const tempProposalId = "0x01000000";
  const query = gql`
    query {
        proposalCreated(id: "${tempProposalId}") {
            proposalId
            proposer
            targets
            signatures
            calldatas
            transactionHash
            description
            blockTimestamp
            blockNumber
            startBlock
            values 
        }
    }
`;

  return useQuery(
    ["getProposal", proposalId],
    async () => {
      const subgraphApiKey = Environment.getSubgraphApiKey();
      const response = await request<ProposalResponse>(
        `https://api.studio.thegraph.com/query/46563/olympus-governor/version/latest/`,
        query,
      );

      return normalizeProposal(response.proposalCreated);
    },
    { enabled: !!proposalId },
  );
};
