import { Box, Chip, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Icon from "src/components/library/Icon";

const PREFIX = "InfoCard";

const classes = {
  container: `${PREFIX}-container`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  chip: `${PREFIX}-chip`,
  timeRemaining: `${PREFIX}-timeRemaining`,
};

const StyledBox = styled(Box, { shouldForwardProp: prop => prop !== "status" && prop !== "href" })<OHMInfoCardProps>(
  ({ theme, status, href }) => ({
    [`&.${classes.container}`]: {
      background: theme.colors.paper.card,
      borderRadius: "9px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      maxHeight: "300px",
      "& a": {
        cursor: href ? "pointer" : "default",
      },
      "&:hover": {
        background: theme.colors.paper.cardHover,
      },
      "& a:hover": {
        color: "unset",
      },
    },

    [`& .${classes.title}`]: {
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "20px",
    },

    [`& .${classes.content}`]: {
      marginTop: "9px",
      lineHeight: "18px",
      whiteSpace: "pre-line",
    },

    [`& .${classes.chip}`]: {
      background: status === "active" ? theme.colors.feedback.success : theme.colors.gray[500],
      color: theme.colors.gray[10],
      borderRadius: "16px",
      height: "21px",
      "& span": {
        fontSize: "12px",
        lineHeight: "18px",
        fontWeight: 500,
      },
    },

    [`& .${classes.timeRemaining}`]: {
      fontSize: "12px",
      lineHeight: "18px",
      color: theme.colors.gray[90],
    },
  }),
);

export interface OHMInfoCardProps {
  status?: "active" | "closed" | "passed" | "failed";
  statusLabel?: string;
  title?: string;
  content?: string | ReactElement | JSX.Element;
  timeRemaining?: string;
  href?: string;
}

/**
 * Component for Displaying InfoCard
 */
const InfoCard: FC<OHMInfoCardProps> = ({ status, title, content, timeRemaining, statusLabel, href }) => {
  return (
    <StyledBox
      display="flex"
      flexDirection="column"
      p="18px"
      mb="15px"
      className={classes.container}
      href={href}
      status={status}
    >
      <Link href={href} target="_blank" underline="hover">
        {status && statusLabel && (
          <Box mb="9px">
            <Chip label={statusLabel} className={classes.chip} />
          </Box>
        )}

        <Box>
          <Typography className={classes.title}>{title}</Typography>
        </Box>
        <Box className={classes.content}>{content}</Box>
        <Box display="flex" className={classes.timeRemaining} mt="9px" alignItems="center">
          {status === "active" && <Icon name="clock" style={{ marginRight: "9px", fontSize: "12px" }} />}
          {status === "passed" && (
            <Icon name="check-circle" style={{ marginRight: "9px", fontSize: "12px", color: "#94B9A1" }} />
          )}
          {timeRemaining}
        </Box>
      </Link>
    </StyledBox>
  );
};

export default InfoCard;
