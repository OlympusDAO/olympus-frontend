import { Box, Link, Skeleton, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { Chip } from "@olympusdao/component-library";
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { abbreviatedNumber } from "src/helpers";
import { VotingOutcomeBar } from "src/views/Governance/Components/VotingOutcomeBar";
import { mapProposalStatus, toCapitalCase } from "src/views/Governance/helpers";
import { useGetContractParameters } from "src/views/Governance/hooks/useGetContractParameters";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";

export const ProposalContainer = ({
  proposalId,
  title,
  createdAt,
  active,
  proposals,
  setProposals,
  setIsLoading,
  proposalsCount,
}: {
  proposalId: number;
  title?: string;
  createdAt?: Date;
  active?: boolean;
  proposals: number[];
  setProposals: React.Dispatch<React.SetStateAction<number[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  proposalsCount: number;
}) => {
  const { data: proposal, isLoading } = useGetProposalDetails({ proposalId });
  const { data: parameters } = useGetContractParameters();

  const formattedTitle = title?.split(/#+\s|\n/g)[1];

  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedPublishedDate = createdAt && dateFormat.format(createdAt);

  const theme = useTheme();
  useEffect(() => {
    if (proposal) {
      if (
        (active && (proposal.status === "Active" || proposal.status === "Pending")) ||
        (!active && proposal.status !== "Active" && proposal.status !== "Pending")
      ) {
        setProposals(prev => [...prev, proposalId]);
      }
    }
  }, [proposal]);

  useEffect(() => {
    if (proposal && parameters && !isLoading) {
      if (proposalsCount === proposalId) {
        setIsLoading(false);
      }
    }
  }, [isLoading, proposal, parameters, proposalsCount, proposalId]);
  if (isLoading || !proposal || !parameters) {
    return (
      <TableRow>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Skeleton width="100%"></Skeleton>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Skeleton width="100%"></Skeleton>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Skeleton width="100%"></Skeleton>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Skeleton width="100%"></Skeleton>
        </TableCell>
      </TableRow>
    );
  }

  const totalVotes = proposal.forCount + proposal.abstainCount + proposal.againstCount;
  const approvalPercentage = (proposal.forCount / (proposal.forCount + proposal.againstCount)) * 100 || 0;
  const aboveQuorum = Boolean(proposal.forCount > proposal.quorumVotes);

  const totalSupply =
    proposal?.quorumVotes && parameters?.proposalQuorumPercent
      ? proposal?.quorumVotes / (parameters?.proposalQuorumPercent / 100)
      : 0;
  const quorumPercentage = (proposal.forCount / totalSupply) * 100 || 0;
  const approvalThresholdDenominator =
    (proposal.forCount + proposal.againstCount) * (parameters?.proposalApprovalThreshold / 100);
  const aboveThreshold = Boolean(approvalThresholdDenominator && proposal.forCount > approvalThresholdDenominator);

  if (
    (active && (proposal.status === "Active" || proposal.status === "Pending")) ||
    (!active && proposal.status !== "Active" && proposal.status !== "Pending")
  ) {
    return (
      <TableRow>
        <TableCell sx={{ fontSize: "15px", paddingX: "9px", paddingY: "21px" }}>
          <Box display="flex" flexDirection="column" gap="3px">
            <Link to={`/governance/proposals/${proposalId}`} component={RouterLink}>
              <Typography fontWeight={600}>{formattedTitle}</Typography>
            </Link>
            <Box display="flex" alignItems="center" gap="9px">
              <Chip label={toCapitalCase(proposal.status)} template={mapProposalStatus(proposal.status)} size="small" />
              <Typography fontSize="12px" color={theme.colors.gray[40]}>
                {formattedPublishedDate}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Typography
            color={aboveThreshold ? theme.colors.feedback.success : theme.colors.feedback.error}
            fontWeight={600}
          >
            {approvalPercentage.toFixed(0)}%
          </Typography>
          <Box mt="6px">
            <VotingOutcomeBar
              forVotes={aboveThreshold ? proposal.forCount : 0}
              againstVotes={aboveThreshold ? 0 : proposal.forCount}
              abstainVotes={proposal.againstCount}
              threshold={`${parameters?.proposalApprovalThreshold.toString()}%`}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
          <Typography
            color={aboveQuorum ? theme.colors.feedback.success : theme.colors.feedback.error}
            fontWeight={600}
          >
            {quorumPercentage.toFixed(0)}%
          </Typography>
          <Box mt="6px">
            <VotingOutcomeBar
              forVotes={aboveQuorum ? proposal.forCount : 0}
              againstVotes={aboveQuorum ? 0 : proposal.forCount}
              abstainVotes={totalSupply - proposal.forCount}
              threshold={`${parameters?.proposalQuorumPercent.toString()}%`}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
          <Typography fontWeight={600}>{abbreviatedNumber.format(totalVotes)}</Typography>
        </TableCell>
      </TableRow>
    );
  }
  return <></>;
};
