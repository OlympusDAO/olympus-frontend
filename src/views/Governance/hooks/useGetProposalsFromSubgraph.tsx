import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { normalizeProposal } from "src/views/Governance/helpers/normalizeProposal";
import { Proposal } from "src/views/Governance/hooks/useGetProposalFromSubgraph";

export const useGetProposalsFromSubgraph = () => {
  const query = gql`
    query {
      proposalCreateds(orderBy: proposalId, orderDirection: desc) {
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

  type Proposals = {
    proposalCreateds: Proposal[];
  };

  return useQuery(["getProposals"], async () => {
    try {
      const subgraphUrl = Environment.getGovernanceSubgraphUrl();
      const response = await request<Proposals>(subgraphUrl, query);

      return response.proposalCreateds.map(normalizeProposal);
    } catch (error) {
      console.error("useGetProposalsFromSubgraph", error);
      return [];
    }
  });
};
