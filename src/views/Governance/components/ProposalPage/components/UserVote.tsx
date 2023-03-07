import Skeleton from "@mui/material/Skeleton";
import { Metric } from "@olympusdao/component-library";
import { formatBalance } from "src/helpers";
import { useUserVote } from "src/hooks/useVoting";

export const UserVote = ({ proposalId, voterAddress }: { proposalId: number; voterAddress: string }) => {
  const { data: voteValue, isLoading: isLoadingVoteValue } = useUserVote(proposalId, voterAddress);
  return (
    <>
      {isLoadingVoteValue && (
        <Skeleton>
          <Metric label={`You have previously voted on this proposal with `} metric={`1 vOHM`} />
        </Skeleton>
      )}
      {voteValue && (
        <>
          <Metric
            label={`You have previously voted on this proposal with `}
            metric={`${formatBalance(2, voteValue)} vOHM`}
          />
        </>
      )}
    </>
  );
};
