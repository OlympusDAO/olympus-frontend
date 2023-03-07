import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Paper, VoteBreakdown } from "@olympusdao/component-library";
import { utils } from "ethers";
import { IAnyProposal, useActivationTimelines } from "src/hooks/useProposals";
import { useGetVotesCastByVoter, useGetVotesCastForProposalBySize } from "src/hooks/useVoting";
import { VotesCastEvent } from "src/typechain/OlympusGovernance";

/**
 * parses proposal status & displays votes breakdown
 */
export const VotesTab = ({ proposal }: { proposal: IAnyProposal }) => {
  // const { data: totalVoteSupply, isLoading: isLoadingTotalSupply } = useVotingSupply();
  const { data: votesCast } = useGetVotesCastForProposalBySize(proposal.id);
  const { data: timelines } = useActivationTimelines();

  const StyledTableCell = styled(TableCell)(() => ({
    padding: "0px",
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "400",
  }));

  const VoteTableRow = ({ voteEvent }: { voteEvent: VotesCastEvent }) => {
    const { data: votesByVoter } = useGetVotesCastByVoter(voteEvent.args.voter);
    const userVotes = utils.formatEther(voteEvent.args.userVotes);
    const percentVotingPower = Number(userVotes) / proposal.totalRegisteredVotes;

    return (
      <TableRow>
        <StyledTableCell data-rowId="voter-address">{voteEvent.args.voter}</StyledTableCell>
        <StyledTableCell align="right" data-rowId="proposals-voted">
          {votesByVoter.length}
        </StyledTableCell>
        <StyledTableCell align="right" data-rowId="total-votes">
          {utils.commify(userVotes)}
        </StyledTableCell>
        <StyledTableCell align="right" data-rowId="voting-power-percent">
          {`${(percentVotingPower * 100).toFixed(2)} %`}
        </StyledTableCell>
        <StyledTableCell align="right" data-rowId="voting-yes-no">
          {voteEvent.args.approve ? "Yes" : "No"}
        </StyledTableCell>
      </TableRow>
    );
  };

  return (
    <Paper fullWidth>
      <Box sx={{ marginTop: "24px" }}></Box>
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Vote Breakdown
      </Typography>
      <VoteBreakdown
        voteForLabel="Yes"
        voteForCount={proposal.yesVotes}
        voteAgainstLabel="No"
        voteAgainstCount={proposal.noVotes}
        voteParticipationLabel="Total Participants"
        totalHoldersCount={proposal.totalRegisteredVotes || 0}
        // TODO(appleseed): setup a config to make these quorum requirements (from the contract) easily modifiable
        quorum={proposal.totalRegisteredVotes * (timelines?.executionThresholdAsNumber || 0) || 0}
      />
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Top Voters
      </Typography>
      {votesCast && votesCast.length > 0 ? (
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Voter</StyledTableCell>
                <StyledTableCell align="right">Proposals voted</StyledTableCell>
                <StyledTableCell align="right">Total Votes (vOHM)</StyledTableCell>
                <StyledTableCell align="right">Voting Power</StyledTableCell>
                <StyledTableCell align="right">Yes/No</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{votesCast && votesCast.map(voteEvent => <VoteTableRow voteEvent={voteEvent} />)}</TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography fontSize="12px" lineHeight="22px">
          Zero Votes have been cast.
        </Typography>
      )}
    </Paper>
  );
};
