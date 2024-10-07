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
  const query = gql`
    query {
        proposalCreated(id: ${proposalId}) {
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
      try {
        const subgraphUrl = Environment.getGovernanceSubgraphUrl();
        const response = await request<ProposalResponse>(subgraphUrl, query);
        if (!response.proposalCreated) {
          return null;
        }
        return normalizeProposal(response.proposalCreated);
      } catch (error) {
        console.error("useGetProposalFromSubgraph", error);
        return null;
      }
    },
    { enabled: !!proposalId },
  );
};
