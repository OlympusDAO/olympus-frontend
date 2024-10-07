import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Environment } from "src/helpers/environment/Environment/Environment";

export const useGetVotes = ({ proposalId, support }: { proposalId?: string; support: number }) => {
  return useQuery(
    ["getVotes", proposalId, support],
    async () => {
      const query = gql`
        query MyQuery {
          voteCasts(orderBy: votes, orderDirection: desc, where: {proposalId: ${proposalId}, support: ${support} }) {
            votes
            voter
            reason
            support
            transactionHash
          }
        }
      `;

      type votesResponse = {
        voteCasts: {
          votes: string;
          voter: string;
          reason: string;
          support: number;
          transactionHash: string;
        }[];
      };

      const subgraphUrl = Environment.getGovernanceSubgraphUrl();
      const response = await request<votesResponse>(subgraphUrl, query);

      return response.voteCasts || [];
    },
    { enabled: !!proposalId && !!support },
  );
};
