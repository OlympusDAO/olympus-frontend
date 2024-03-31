import { CheckCircle } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import { abbreviatedNumber } from "src/helpers";
import { VotingOutcomeBar } from "src/views/Governance/Components/VotingOutcomeBar";
import { useGetContractParameters } from "src/views/Governance/hooks/useGetContractParameters";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";

export const CurrentVotes = ({ proposalId }: { proposalId: number }) => {
  const { data: proposalDetails } = useGetProposalDetails({ proposalId });
  const { data: parameters } = useGetContractParameters();
  const theme = useTheme();

  const approvalThresholdDenominator =
    proposalDetails &&
    parameters &&
    (proposalDetails?.forCount + proposalDetails?.againstCount) * (parameters?.proposalApprovalThreshold / 100);
  const aboveThreshold = Boolean(
    proposalDetails && approvalThresholdDenominator && proposalDetails.forCount > approvalThresholdDenominator,
  );
  const aboveQuorum = Boolean(proposalDetails && proposalDetails.forCount > proposalDetails.quorumVotes);
  return (
    <Paper enableBackground>
      <Typography fontSize="21px" fontWeight={600} mb="15px">
        Current Votes
      </Typography>
      <Box display="flex" flexDirection="column" gap="15px">
        <Box display="flex" justifyContent={"space-between"} alignItems="center">
          <Box display="flex" alignItems="center" gap={"3px"}>
            {aboveThreshold && <CheckCircle color="success" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />}
            <Typography fontWeight="500">Approval Threshold</Typography>
          </Box>
          <Typography>
            {abbreviatedNumber.format(proposalDetails?.forCount || 0)} of{" "}
            {abbreviatedNumber.format(approvalThresholdDenominator || 0)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent={"space-between"}>
          <Box display="flex" alignItems="center" gap={"3px"}>
            {aboveQuorum && <CheckCircle color="success" viewBox="0 0 24 24" sx={{ fontSize: "15px" }} />}
            <Typography fontWeight="500">Quorum</Typography>
          </Box>

          <Typography>
            {abbreviatedNumber.format(proposalDetails?.forCount || 0)} of{" "}
            {abbreviatedNumber.format(proposalDetails?.quorumVotes || 0)}
          </Typography>
        </Box>
        <VotingOutcomeBar
          forVotes={proposalDetails?.forCount}
          againstVotes={proposalDetails?.againstCount}
          abstainVotes={proposalDetails?.abstainCount}
        />

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
      </Box>
    </Paper>
  );
};
