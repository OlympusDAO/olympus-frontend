import { Box, LinearProgress, Link, Skeleton, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { Chip } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { abbreviatedNumber } from "src/helpers";
import { mapProposalStatus, toCapitalCase } from "src/views/Governance/helpers";
import { useGetProposalDetails } from "src/views/Governance/hooks/useGetProposalDetails";

export const ProposalContainer = ({
  proposalId,
  title,
  createdAt,
}: {
  proposalId: number;
  title?: string;
  createdAt?: Date;
}) => {
  const { data: proposal, isLoading } = useGetProposalDetails({ proposalId });

  const formattedTitle = title?.split(/#+\s|\n/g)[1];

  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
  });

  const formattedPublishedDate = createdAt && dateFormat.format(createdAt);

  const theme = useTheme();
  if (isLoading || !proposal) {
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
  return (
    <TableRow>
      <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
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
        <Typography color={theme.colors.feedback.success} fontWeight={600}>
          {abbreviatedNumber.format(proposal.forCount)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={totalVotes > 0 ? (proposal.forCount / totalVotes) * 100 : 0}
          color="success"
        />
      </TableCell>
      <TableCell sx={{ fontSize: "15px", padding: "9px" }}>
        <Typography color={theme.colors.feedback.error} fontWeight={600}>
          {abbreviatedNumber.format(proposal.againstCount)}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={totalVotes > 0 ? (proposal.againstCount / totalVotes) * 100 : 0}
          color="error"
        />
      </TableCell>
      <TableCell sx={{ fontSize: "15px", padding: "9px" }} align="right">
        <Typography fontWeight={600}>{abbreviatedNumber.format(totalVotes)}</Typography>
      </TableCell>
    </TableRow>
  );
};
