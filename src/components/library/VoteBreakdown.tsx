import { Box, LinearProgress, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { FC } from "react";

export interface OHMVoteBreakdownProps {
  /**
   * Text Label: For Vote
   */
  voteForLabel?: string;
  /**
   * Text Label: Against Vote
   */
  voteAgainstLabel?: string;
  /**
   * Text Label: Participaation
   */
  voteParticipationLabel?: string;
  /**
   * Number of Votes For
   */
  voteForCount?: number;
  /**
   * Number of Votes Against
   */
  voteAgainstCount?: number;
  /**
   * Number of Wallets that can vote
   */
  totalHoldersCount?: number;
  /**
   * Number of Votes Needed for Quorum
   */
  quorum?: number;
}

type ProgressBar = {
  barColor?: string;
};

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: prop => prop !== "status",
})<ProgressBar>(({ theme, barColor }) => {
  return {
    borderRadius: "5px",
    height: "7px",
    "&.MuiLinearProgress-colorPrimary": {
      backgroundColor: theme.colors.gray[500],
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: barColor,
      },
    },
  };
});

/**
 * Component for Displaying Vote Breakdowns
 */
const VoteBreakdown: FC<OHMVoteBreakdownProps> = ({
  voteForLabel,
  voteAgainstLabel,
  voteParticipationLabel,
  voteForCount = 0,
  totalHoldersCount = 0,
  voteAgainstCount = 0,
  quorum = 0,
}) => {
  const VoteThresholdLine = styled("div")(({ theme }) => ({
    borderLeft: `2px solid ${theme.colors.gray[10]}`,
    height: "85px",
    position: "absolute",
    left: `${(quorum / totalHoldersCount) * 100}%`,
    marginLeft: "-3px",
    top: "20px",
    zIndex: 10,
  }));

  const theme = useTheme();
  const totalVotes = voteForCount + voteAgainstCount;
  const VoteLabel = ({ label = "", votes = 0, voteDenominator = 0 }) => {
    const percentage = (votes / voteDenominator || 0).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 0,
    });

    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return (
      <Box width="100%">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography color={theme.colors.gray[40]} fontSize="12px">
            {label}
          </Typography>
          <Typography color={theme.colors.gray[90]} fontSize="12px">
            {formatter.format(votes)} ({percentage})
          </Typography>
        </Box>
      </Box>
    );
  };
  return (
    <>
      <Box mb="18px" mt="18px">
        <Box position="relative">
          {quorum ? (
            <>
              <VoteThresholdLine />
              <Typography fontWeight={500} paddingLeft={`${(quorum / totalHoldersCount) * 100 - 2}%`}>
                Threshold
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Box>
        <VoteLabel label={voteForLabel} votes={voteForCount} voteDenominator={totalVotes} />
        <StyledLinearProgress
          variant="determinate"
          value={(voteForCount / totalHoldersCount || 0) * 100}
          barColor={theme.colors.feedback.success}
        />
      </Box>
      {voteAgainstLabel ? (
        <Box mb="18px">
          <VoteLabel label={voteAgainstLabel} votes={voteAgainstCount} voteDenominator={totalVotes} />
          <StyledLinearProgress
            variant="determinate"
            value={(voteAgainstCount / totalHoldersCount || 0) * 100}
            barColor={theme.colors.feedback.error}
          />
        </Box>
      ) : (
        <></>
      )}
      <Box>
        <VoteLabel label={voteParticipationLabel} votes={totalVotes} voteDenominator={totalHoldersCount} />
        <StyledLinearProgress
          variant="determinate"
          value={(totalVotes / totalHoldersCount || 0) * 100}
          barColor={theme.colors.gray[90]}
        />
      </Box>
    </>
  );
};

export default VoteBreakdown;
