import { Box, useTheme } from "@mui/material";
import React from "react";

export const VotingOutcomeBar = ({
  forVotes = 0,
  againstVotes = 0,
  abstainVotes = 0,
}: {
  forVotes?: number;
  againstVotes?: number;
  abstainVotes?: number;
}) => {
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (againstVotes / totalVotes) * 100 : 0;
  // Direct calculation to ensure total is always 100%
  const abstainPercentage = abstainVotes > 0 ? 100 - forPercentage - againstPercentage : 0;

  // Identifies the first and last segments to apply border radius appropriately
  const firstSegment = forVotes > 0 ? "forVotes" : againstVotes > 0 ? "againstVotes" : "abstainVotes";
  const lastSegment = abstainVotes > 0 ? "abstainVotes" : againstVotes > 0 ? "againstVotes" : "forVotes";

  const getBorderRadius = (segment: "forVotes" | "againstVotes" | "abstainVotes") => {
    if (segment === firstSegment && segment === lastSegment) {
      // Only one segment is visible
      return { borderRadius: 8 };
    } else if (segment === firstSegment) {
      return { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 };
    } else if (segment === lastSegment) {
      return { borderTopRightRadius: 8, borderBottomRightRadius: 8 };
    }
    return {};
  };

  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center" width="100%" height="7px" borderRadius={8} bgcolor={theme.colors.gray[500]}>
      {/* For votes */}
      <Box
        width={`${forPercentage}%`}
        sx={{
          ...getBorderRadius("forVotes"),
          transition: "width 0.3s ease",
        }}
        bgcolor={theme.colors.feedback.success} // Consider "success.main" for "for" votes
        height="100%"
      />
      {/* Against votes */}
      <Box
        width={`${againstPercentage}%`}
        bgcolor={theme.colors.feedback.error} // Consider "error.main" for "against" votes
        height="100%"
        sx={{
          ...getBorderRadius("againstVotes"),
          transition: "width 0.3s ease",
        }}
      />
      {/* Abstain votes */}
      <Box
        width={`${abstainPercentage}%`}
        bgcolor={theme.colors.gray[500]} // Consider "warning.main" for "abstain" votes
        height="100%"
        sx={{
          ...getBorderRadius("abstainVotes"),
          transition: "width 0.3s ease",
        }}
      />
    </Box>
  );
};
