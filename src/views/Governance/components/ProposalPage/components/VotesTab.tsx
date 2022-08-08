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
  useTheme,
} from "@mui/material";
import {
  Metric,
  Paper,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  VoteBreakdown,
} from "@olympusdao/component-library";
// import { PrimaryButton, Radio, VoteBreakdown } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const VotesTab = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();

  const StyledTableCell = styled(TableCell)(() => ({
    padding: "0px",
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "400",
  }));

  return (
    <Paper fullWidth>
      <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
        <Box display="flex" flexDirection="column">
          <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
            Cast your vote
          </Typography>
        </Box>
        <Metric label="Your voting power" metric={"15,530.00 OHM"} />
        <Box display="flex" flexDirection="row" justifyContent="center">
          <SecondaryButton sx={{ minWidth: "120px" }}>Yes</SecondaryButton>
          <TertiaryButton sx={{ minWidth: "120px" }}>No</TertiaryButton>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <PrimaryButton sx={{ minWidth: "120px" }}>Vote</PrimaryButton>
        </Box>
      </Box>
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Vote Breakdown
      </Typography>
      <VoteBreakdown
        voteForLabel="Yes"
        voteAgainstLabel="No"
        voteParticipationLabel="Total Participants"
        voteForCount={proposal.yesVotes}
        voteAgainstCount={proposal.noVotes}
        totalHoldersCount={0}
        quorum={0}
      />
      <Typography fontSize="18px" lineHeight="28px" fontWeight="500" mt="21px">
        Top Voters
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
    </Paper>
  );
};
