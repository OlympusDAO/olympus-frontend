import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Voter } from "src/views/Governance/hooks/useGetDelegates";

export const useGetDelegate = ({ id }: { id: string }) => {
  const query = gql`
    query {
      voter(id: "${id}") {
        address
        latestVotingPowerSnapshot {
          votingPower
        }
        votesCasted {
          proposalId
          reason
          support
        }
        delegators {
          id
        }
      }
    }
  `;

  return useQuery(["getDelegate", id], async () => {
    try {
      const subgraphUrl = "https://api.studio.thegraph.com/query/46563/olympus-governor/version/latest/";
      const response = await request<{ voter: Voter }>(subgraphUrl, query);
      return response.voter;
    } catch (error) {
      console.error("useGetDelegates", error);
    }
  });
};
