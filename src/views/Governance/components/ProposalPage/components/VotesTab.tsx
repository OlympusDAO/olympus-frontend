import {
  Box,
  Skeleton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { Metric, Paper, PrimaryButton, TertiaryButton, VoteBreakdown } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatBalance } from "src/helpers";
import { IAnyProposal } from "src/hooks/useProposals";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useUserVote, useVote, useVotingSupply } from "src/hooks/useVoting";
import { ActivateVoting } from "src/views/Governance/components/ProposalPage/components/ActivateVoting";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

/**
 * parses proposal status & displays votes
 */
export const VotesTab = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();
  const networks = useTestableNetworks();
  const { isConnected } = useAccount();
  const [vote, setVote] = useState<string>("");
  const submitVote = useVote();
  const { address: voterAddress } = useAccount();
  const { data: voteValue, isLoading: isLoadingVoteValue } = useUserVote(proposal.id, voterAddress as string);

  const handleVoteSubmission = () => {
    submitVote.mutate({ voteData: { proposalId: BigNumber.from(proposal.id), vote: vote === "yes" } });
  };

  return (
    <Paper fullWidth>
      <Box sx={{ marginTop: "24px" }}></Box>
      <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
        <Box display="flex" flexDirection="column">
          <ActivateVoting proposal={proposal} />
          <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
            Cast Your Vote
          </Typography>
        </Box>
        <>
          {voteValue && !voteValue.gt("0") && (
            <>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <TertiaryButton
                  template={vote === "yes" ? "secondary" : "tertiary"}
                  sx={{ minWidth: "120px" }}
                  disabled={!isConnected || !proposal.isActive}
                  onClick={() => setVote("yes")}
                >
                  Yes
                </TertiaryButton>
                <TertiaryButton
                  template={vote === "no" ? "secondary" : "tertiary"}
                  sx={{ minWidth: "120px" }}
                  disabled={!isConnected || !proposal.isActive}
                  onClick={() => setVote("no")}
                >
                  No
                </TertiaryButton>
              </Box>
              <WalletConnectedGuard>
                <Box display="flex" flexDirection="row" justifyContent="center">
                  <PrimaryButton
                    sx={{ minWidth: "120px" }}
                    disabled={!proposal.isActive}
                    onClick={handleVoteSubmission}
                  >
                    Vote <span style={{ textTransform: "capitalize" }}>&nbsp;{vote}</span>
                  </PrimaryButton>
                </Box>
              </WalletConnectedGuard>
            </>
          )}

          {voterAddress && proposal.isActive && <UserVote proposalId={proposal.id} voterAddress={voterAddress} />}
        </>
        {(proposal.state === "discussion" || proposal.state === "ready to activate") && (
          <p>This Proposal is not yet active for voting.</p>
        )}
        {proposal.state === "expired activation" && <p>This Proposal missed it's activation window.</p>}
      </Box>
      {/* {proposal.isActive && <VoteBreakdownAndTable proposal={proposal} />} */}
      <VoteBreakdownAndTable proposal={proposal} />
    </Paper>
  );
};

const UserVote = ({ proposalId, voterAddress }: { proposalId: number; voterAddress: string }) => {
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

const VoteBreakdownAndTable = ({ proposal }: { proposal: IAnyProposal }) => {
  const { data: totalVoteSupply, isLoading: isLoadingTotalSupply } = useVotingSupply();

  const StyledTableCell = styled(TableCell)(() => ({
    padding: "0px",
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "400",
  }));

  return (
    <>
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Vote Breakdown
      </Typography>
      <VoteBreakdown
        voteForLabel="Yes"
        voteForCount={proposal.yesVotes}
        voteAgainstLabel="No"
        voteAgainstCount={proposal.noVotes}
        voteParticipationLabel="Total Participants"
        totalHoldersCount={Number(formatBalance(2, totalVoteSupply)) || 0}
        // TODO(appleseed): setup a config to make these quorum requirements (from the contract) easily modifiable
        quorum={totalVoteSupply?.mul("0.33")?.toApproxNumber() || 0}
      />
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Top Voters
      </Typography>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Voter</StyledTableCell>
              <StyledTableCell align="right">Proposals voted</StyledTableCell>
              <StyledTableCell align="right">Total Votes</StyledTableCell>
              <StyledTableCell align="right">Voting Power</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableCell>name</StyledTableCell>
              <StyledTableCell align="right">52</StyledTableCell>
              <StyledTableCell align="right">26</StyledTableCell>
              <StyledTableCell align="right">9.06%</StyledTableCell>
              <StyledTableCell align="right">Delegate</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
