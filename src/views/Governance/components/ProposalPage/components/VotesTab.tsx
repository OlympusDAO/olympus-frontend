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
import { BigNumber } from "ethers";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { formatBalance } from "src/helpers";
import { useGohmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useEndorse, useVote } from "src/hooks/useVoting";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

/**
 * parses proposal status & displays endorsements or votes
 * @TODO may be better to refactor this into separate components
 */
export const VotesTab = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();
  const networks = useTestableNetworks();
  const { isConnected } = useAccount();
  const gohmBalance = useGohmBalance()[networks.MAINNET].data;
  const [vote, setVote] = useState<string>("");
  const submitVote = useVote();
  const submitEndorsement = useEndorse();

  const StyledTableCell = styled(TableCell)(() => ({
    padding: "0px",
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "400",
  }));

  const handleVoteSubmission = () => {
    submitVote.mutate({ voteData: { proposalId: BigNumber.from(proposal.id), vote: vote === "yes" } });
  };

  const handleEndorseSubmission = () => {
    submitEndorsement.mutate({ proposalId: BigNumber.from(proposal.id) });
  };

  return (
    <Paper fullWidth>
      <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
        <Box display="flex" flexDirection="column">
          <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
            {proposal.isActive ? `Cast your vote` : `Endorsements`}
          </Typography>
        </Box>
        {isConnected && proposal.isActive ? (
          <Metric label="Your voting power" metric={`${formatBalance(2, gohmBalance)} gOHM`} />
        ) : isConnected && !proposal.isActive ? (
          <Metric label="Your voting power" metric={`1 Endorsement`} />
        ) : (
          <></>
        )}
        {proposal.isActive ? (
          <>
            <Box display="flex" flexDirection="row" justifyContent="center">
              <SecondaryButton
                sx={{ minWidth: "120px" }}
                disabled={!isConnected || !proposal.isActive}
                onClick={() => setVote("yes")}
              >
                Yes
              </SecondaryButton>
              <TertiaryButton
                sx={{ minWidth: "120px" }}
                disabled={!isConnected || !proposal.isActive}
                onClick={() => setVote("no")}
              >
                No
              </TertiaryButton>
            </Box>
            <WalletConnectedGuard>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <PrimaryButton sx={{ minWidth: "120px" }} disabled={!proposal.isActive} onClick={handleVoteSubmission}>
                  Vote
                </PrimaryButton>
              </Box>
            </WalletConnectedGuard>
          </>
        ) : (
          <>
            <WalletConnectedGuard>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <PrimaryButton
                  sx={{ minWidth: "120px" }}
                  disabled={!!proposal.isActive}
                  onClick={handleEndorseSubmission}
                >
                  Endorse
                </PrimaryButton>
              </Box>
            </WalletConnectedGuard>
          </>
        )}
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
    </Paper>
  );
};
