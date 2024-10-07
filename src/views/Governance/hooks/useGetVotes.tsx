import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Environment } from "src/helpers/environment/Environment/Environment";

export const useGetVotes = ({ proposalId, support }: { proposalId?: string; support: number }) => {
  console.log(proposalId, support);
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

      const subgraphApiKey = Environment.getSubgraphApiKey();

      // `https://gateway.thegraph.com/api/${subgraphApiKey}/subgraphs/id/AQoLCXebY1Ga7DrqVaVQ85KMwS7iFof73tv9XMVGRtyJ`,
      const response = await request<votesResponse>(
        `https://api.studio.thegraph.com/query/46563/olympus-governor/version/latest/`,
        query,
      );

      console.log(response, "response");
      return response.voteCasts || [];
    },
    { enabled: !!proposalId && !!support },
  );
};
