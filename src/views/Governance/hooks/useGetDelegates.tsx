import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Environment } from "src/helpers/environment/Environment/Environment";

export type Voter = {
  id: string;
  address: string;
  latestVotingPowerSnapshot: {
    votingPower: string;
  };
  votesCasted: {
    proposalId: string;
    reason: string;
    support: number;
  }[];
  delegators: {
    id: string;
  }[];
};

export const useGetDelegates = () => {
  const query = gql`
    query {
      voters(
        orderBy: latestVotingPowerSnapshot__votingPower
        orderDirection: desc
        where: { latestVotingPowerSnapshot_not: null, latestVotingPowerSnapshot_: { votingPower_gt: 0.0001 } }
      ) {
        id
        address
        latestVotingPowerSnapshot {
          votingPower
        }
        delegators {
          id
        }
      }
    }
  `;

  return useQuery(["getDelegates"], async () => {
    try {
      const subgraphUrl = Environment.getGovernanceSubgraphUrl();
      const response = await request<{ voters: Voter[] }>(subgraphUrl, query);
      return response.voters;
    } catch (error) {
      console.error("useGetDelegates", error);
      return [];
    }
  });
};
