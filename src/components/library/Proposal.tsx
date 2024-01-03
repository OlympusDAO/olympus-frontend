import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { FC } from "react";
import Chip, { OHMChipProps } from "src/components/library/Chip";
import Icon from "src/components/library/Icon";

export type OHMProposalStatus =
  | "discussion" // created but not ready to activate
  | "ready to activate" // ready to activate for voting
  | "expired activation" // missed activation window
  | "active" // active for voting
  | "executed" // passed & executed / implemented
  | "draft"
  | "closed";
export interface OHMProposalProps {
  /**
   * Returns appropriate chip label and card styling depending on status passed
   */
  status: OHMProposalStatus;
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
  };
});

/**
 * Component for Displaying A Single Governance Proposal Card
 */
const Proposal: FC<OHMProposalProps> = ({
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

  const mapStatus = (status: OHMProposalProps["status"]) => {
    switch (status) {
      case "active":
        return "success" as OHMChipProps["template"];
      case "executed":
        return "purple" as OHMChipProps["template"];
      case "discussion":
      case "ready to activate":
        return "userFeedback" as OHMChipProps["template"];
      case "closed":
      case "expired activation":
        return "gray" as OHMChipProps["template"];
      case "draft":
        return "darkGray" as OHMChipProps["template"];
    }
  };

  type formattedVoteLabelType = {
    label: string;
    color?: any;
  };
  const FormattedVoteLabel = ({ label, color }: formattedVoteLabelType) => (
    <Typography mt="-18px" fontSize="12px" fontWeight="500" color={color}>
      {label}
    </Typography>
  );

  return (
    <StyledBox
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      status={status}
      alignContent="center"
      flexWrap="wrap"
    >
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          {chipLabel && <Chip label={chipLabel} template={mapStatus(status)} strong />}
          {voteEndDate && (
            <Box pl="9px" display="flex">
              <Icon
                name={insideTwelveHours ? "timeLeft" : "calendar"}
                style={{ fontSize: "18px", fill: theme.colors.gray[90] }}
              />

              <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
                {insideTwelveHours ? `ends in ${hoursLeft} Hours ${minutesLeft} minutes` : formattedEndDate}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography mt="6px" fontSize="15px" lineHeight="21px" fontWeight="500">
          {proposalTitle}
        </Typography>
        {publishedDate && (
          <Typography mt="6px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
            Posted On {formattedPublishedDate}
          </Typography>
        )}
      </Box>
      {totalVoteCount > 0 && (
        <Box display="flex" alignItems="center" flexDirection="column" mt="18px">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography fontSize="12px" color={theme.colors.primary[300]} fontWeight={500}>
              Accepted
            </Typography>
            <Typography>|</Typography>
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
    </StyledBox>
  );
};

export default Proposal;
