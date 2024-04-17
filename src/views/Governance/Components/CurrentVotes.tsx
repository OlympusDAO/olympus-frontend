import { CheckCircle, HighlightOffOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { abbreviatedNumber } from "src/helpers";
import { VotingOutcomeBar } from "src/views/Governance/Components/VotingOutcomeBar";
import { useGetContractParameters } from "src/views/Governance/hooks/useGetContractParameters";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";
import { useGetReceipt } from "src/views/Governance/hooks/useGetReceipt";

export const CurrentVotes = ({ proposalId, onVoteClick }: { proposalId: number; onVoteClick: () => void }) => {
  const { data: proposalDetails } = useGetProposalDetails({ proposalId });
  const { data: parameters } = useGetContractParameters();
  const { data: getReceipt } = useGetReceipt({ proposalId });
  const hasVoted = getReceipt?.hasVoted;
  const support = getReceipt?.support === 0 ? "Against" : getReceipt?.support === 1 ? "For" : "Abstain";

  const theme = useTheme();

  const approvalThresholdDenominator =
    proposalDetails &&
    parameters &&
    (proposalDetails?.forCount + proposalDetails?.againstCount) * (parameters?.proposalApprovalThreshold / 100);
  const aboveThreshold = Boolean(
    proposalDetails && approvalThresholdDenominator && proposalDetails.forCount > approvalThresholdDenominator,
  );
  const aboveQuorum = Boolean(proposalDetails && proposalDetails.forCount > proposalDetails.quorumVotes);

  const approvalPercentage = proposalDetails
    ? (proposalDetails.forCount / (proposalDetails.forCount + proposalDetails.againstCount)) * 100
    : 0;

  const totalSupply =
    proposalDetails?.quorumVotes && parameters?.proposalQuorumPercent
      ? proposalDetails?.quorumVotes / (parameters?.proposalQuorumPercent / 100)
      : 0;
  const quorumPercentage = (proposalDetails && (proposalDetails?.forCount / totalSupply) * 100) || 0;

  const totalVotes =
    (proposalDetails && proposalDetails?.forCount + proposalDetails?.againstCount + proposalDetails?.abstainCount) || 0;

  return (
    <Paper enableBackground>
      <Typography fontSize="21px" fontWeight={600} mb="15px">
        Progress
      </Typography>
      <Box display="flex" flexDirection="column" gap="15px">
        <Box display="flex" justifyContent={"space-between"} alignItems="baseline" gap="12px">
          <Box display="flex" alignItems="center" gap={"3px"}>
            {aboveThreshold ? (
              <CheckCircle color="success" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />
            ) : (
              <HighlightOffOutlined color="error" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />
            )}
            <Typography fontWeight="500">Approval</Typography>
          </Box>
          {parameters?.proposalThresholdPercent && proposalDetails?.forCount && proposalDetails.quorumVotes && (
            <Tooltip title={`${approvalPercentage.toFixed(0)}% of voting gOHM voted FOR`}>
              <Box flexGrow={1}>
                <VotingOutcomeBar
                  forVotes={aboveThreshold ? proposalDetails?.forCount : 0}
                  againstVotes={aboveThreshold ? 0 : proposalDetails?.forCount}
                  abstainVotes={proposalDetails?.againstCount}
                  threshold={`${parameters?.proposalApprovalThreshold.toString()}%`}
                />
              </Box>
            </Tooltip>
          )}
        </Box>
        <Box display="flex" justifyContent={"space-between"} alignItems="baseline" gap="12px">
          <Box display="flex" alignItems="center" gap={"3px"}>
            {aboveQuorum ? (
              <CheckCircle color="success" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />
            ) : (
              <HighlightOffOutlined color="error" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />
            )}
            <Typography fontWeight="500">Quorum</Typography>
          </Box>
          {parameters?.proposalQuorumPercent && proposalDetails?.forCount && proposalDetails.quorumVotes && (
            <Tooltip
              title={`${quorumPercentage.toFixed(0)}% of total gOHM Supply (${totalSupply.toFixed(2)} gOHM) voted FOR`}
            >
              <Box flexGrow={1}>
                <VotingOutcomeBar
                  forVotes={aboveQuorum ? proposalDetails?.forCount : 0}
                  againstVotes={aboveQuorum ? 0 : proposalDetails.forCount}
                  abstainVotes={totalSupply - proposalDetails?.forCount}
                  threshold={`${parameters?.proposalQuorumPercent.toString()}%`}
                />
              </Box>
            </Tooltip>
          )}
        </Box>

        <Box display="flex" justifyContent={"space-between"}>
          <Typography fontWeight="500" color={theme.colors.feedback.success}>
            For
          </Typography>
          <Typography>{abbreviatedNumber.format(proposalDetails?.forCount || 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <Typography fontWeight="500" color={theme.colors.feedback.error}>
            Against
          </Typography>
          <Typography>{abbreviatedNumber.format(proposalDetails?.againstCount || 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <Typography fontWeight="500">Abstain</Typography>
          <Typography>{abbreviatedNumber.format(proposalDetails?.abstainCount || 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <Typography fontWeight="500">Total Votes</Typography>
          <Typography>{abbreviatedNumber.format(totalVotes || 0)}</Typography>
        </Box>
        <VotingOutcomeBar
          forVotes={proposalDetails?.forCount}
          againstVotes={proposalDetails?.againstCount}
          abstainVotes={proposalDetails?.abstainCount}
        />
        <WalletConnectedGuard fullWidth buttonText="Connect to Vote">
          <PrimaryButton onClick={onVoteClick} disabled={hasVoted || proposalDetails?.status !== "Active"}>
            {hasVoted ? `Already Voted (${support})` : "Vote"}
          </PrimaryButton>
        </WalletConnectedGuard>
      </Box>
    </Paper>
  );
};
