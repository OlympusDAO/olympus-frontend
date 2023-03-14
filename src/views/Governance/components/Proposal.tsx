import { ChevronRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chip, Icon } from "@olympusdao/component-library";
import { FC } from "react";
import { PStatus } from "src/hooks/useProposals";
import { mapProposalStatus } from "src/views/Governance/components/ProposalPage/ProposalPage";

interface OHMProposalProps {
  /**
   * Returns appropriate chip label and card styling depending on status passed
   */
  status: PStatus;
  /**
   * Label for the Chip
   */
  chipLabel?: string;
  /**
   * Voting End Date
   */
  voteEndDate: Date;
  /**
   * Title of the Proposal;
   */
  proposalTitle: string;
  /**
   * Date Proposa was Published
   */
  publishedDate: Date;
  /**
   * Count of Votes For
   */
  votesFor?: number;
  /**
   * Count of Votes Against
   */
  votesAgainst?: number;
  /**
   * Count of Quorum needed
   */
  quorum?: number;
}

type BoxProps = {
  status: OHMProposalProps["status"];
};

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== "status",
})<BoxProps>(({ theme, status }) => {
  return {
    background: status === "active" ? theme.colors.paper.cardHover : theme.colors.paper.card,
    borderRadius: "9px",
    padding: "18px",
    width: "100%",
  };
});

/**
 * Component for Displaying A Single Governance Proposal Card
 */
export const Proposal: FC<OHMProposalProps> = ({
  status,
  chipLabel,
  voteEndDate,
  proposalTitle,
  publishedDate,
  quorum = 0,
  votesAgainst = 0,
  votesFor = 0,
}) => {
  const theme = useTheme();
  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
  });
  const formattedEndDate = dateFormat.format(voteEndDate);
  const formattedPublishedDate = dateFormat.format(publishedDate);

  const currentDate = Date.now();
  const twelveHours = 43200000;
  const timeLeft = Number(voteEndDate) - currentDate;
  const insideTwelveHours = timeLeft > 0 && timeLeft <= twelveHours;
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  //calculate votes

  const totalVoteCount = votesAgainst + votesFor;

  type formattedVoteLabelType = {
    label: string;
    color?: any;
  };
  const FormattedVoteLabel = ({ label, color }: formattedVoteLabelType) => (
    <Typography mt="-18px" fontSize="12px" fontWeight="500" color={color}>
      {label}
    </Typography>
  );

  const VoteThresholdBar = () => {
    return (
      <>
        {totalVoteCount > 0 && (
          <Box display="flex" alignItems="center" flexDirection="column">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Typography fontSize="12px" fontWeight={500} lineHeight="20px">
                Threshold
              </Typography>
              <Typography fontSize="10px" fontWeight={500} lineHeight="18px">
                |
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              width="323px"
              borderRadius="8px"
              alignItems="center"
              mt="-18px"
              justifyContent="space-between"
              sx={{ backgroundColor: theme.colors.gray[90] }}
            >
              <Box
                width={`calc(161.5px * ${votesFor}/${quorum})`}
                height="5px"
                borderRadius="8px 0 0 8px"
                sx={{
                  backgroundColor: theme.colors.feedback.success,
                }}
              >
                <FormattedVoteLabel label="Yes" color={theme.colors.feedback.success} />
              </Box>
              {/* <Box
            sx={{
              backgroundColor: theme.colors.gray[90],
              height: "5px",
              width: `calc(323px)`,
            }}
            textAlign="center"
          ></Box> */}
              <Box
                width={`calc(161.5px * ${votesAgainst}/${quorum})`}
                sx={{
                  backgroundColor: theme.colors.feedback.error,
                  height: "5px",
                }}
                textAlign="end"
              >
                <FormattedVoteLabel label="No" color={theme.colors.feedback.error} />
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  };
  return (
    <StyledBox
      className="proposal-dash-row-container"
      display="flex"
      flexDirection="column"
      status={status}
      alignContent="center"
      flexWrap="wrap"
      gap={1}
    >
      <Box display="flex" flexDirection="column" alignContent="center" flexWrap="wrap" gap={0} sx={{ width: "100%" }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent={"space-between"}
          sx={{ width: "100%" }}
        >
          <Typography mt="6px" fontSize="15px" lineHeight="21px" fontWeight="500">
            {proposalTitle}
          </Typography>
          {chipLabel && <Chip label={chipLabel} template={mapProposalStatus(status)} strong />}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent={"space-between"}
          sx={{ width: "100%" }}
        >
          <>
            <Typography variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
              {publishedDate && `Posted On ${formattedPublishedDate} `}
            </Typography>

            <Box pl="9px" display="flex" gap={1}>
              {voteEndDate && (
                <>
                  <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
                    {insideTwelveHours ? `ends in ${hoursLeft} Hours ${minutesLeft} minutes` : formattedEndDate}
                  </Typography>
                  <Icon
                    name={insideTwelveHours ? "timeLeft" : "calendar"}
                    style={{ fontSize: "18px", fill: theme.colors.gray[90] }}
                  />
                </>
              )}
            </Box>
          </>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent={"space-between"}
        sx={{ width: "100%" }}
      >
        <Box>
          <VoteThresholdBar />
        </Box>
        <Box display={`flex`} flexDirection="row" gap={1} alignItems="center">
          <Typography color={theme.colors.primary[300]} fontSize="15px" lineHeight="21px" fontWeight="500">
            View Proposal
          </Typography>
          <ChevronRight color={"action"} viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
        </Box>
      </Box>
    </StyledBox>
  );
};
