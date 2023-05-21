import { Box, Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import { TertiaryButton } from "src/components/library/Button";
import TokenStack, { OHMTokenStackProps } from "src/components/library/TokenStack";

const PREFIX = "AssetCard";

const classes = {
  container: `${PREFIX}-container`,
  assetTitle: `${PREFIX}-assetTitle`,
  assetValue: `${PREFIX}-assetValue`,
  label: `${PREFIX}-label`,
  assetBalance: `${PREFIX}-assetBalance`,
  green: `${PREFIX}-green`,
  red: `${PREFIX}-red`,
  assetLabel: `${PREFIX}-assetLabel`,
  default: `${PREFIX}-default`,
};

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== "ctaText" && prop !== "ctaOnClick",
})<OHMAssetCardProps>(({ ctaText, ctaOnClick, theme }) => ({
  [`&.${classes.container}`]: {
    background: theme.colors.paper.card,
    borderRadius: "9px",
    margin: "9px 0px",
    padding: "12px",
    minHeight: "66px",
    "&:hover": {
      background: ctaText && ctaOnClick ? theme.colors.paper.cardHover : theme.colors.paper.card,
      "& .label": {
        color: ctaText && ctaOnClick ? theme.colors.gray[40] : "",
      },
    },
  },

  [`& .${classes.assetTitle}`]: {
    marginLeft: "7px",
    fontWeight: 600,
    lineHeight: "20px",
  },

  [`& .${classes.assetValue}`]: {
    fontWeight: 600,
    lineHeight: "20px",
  },

  [`& .${classes.label}`]: {
    lineHeight: "18px",
    color: theme.colors.gray[90],
  },

  [`& .${classes.assetBalance}`]: {
    lineHeight: "18px",
    color: theme.colors.gray[40],
  },

  [`& .${classes.green}`]: {
    color: theme.colors.feedback.pnlGain,
  },

  [`& .${classes.red}`]: {
    color: theme.colors.feedback.error,
  },

  [`& .${classes.assetLabel}`]: {
    fontWeight: 400,
    color: theme.colors.gray[90],
    marginLeft: "5px",
  },
}));

export interface OHMAssetCardProps {
  /* Token Name */
  token?: OHMTokenStackProps["tokens"];
  /* Time Remaining text (vesting or staking) */
  timeRemaining?: string;
  /* USD Value of Underlying */
  assetValue?: string | number;
  /* Balance of Underlying */
  assetBalance?: string | number;
  /* Profit or Loss */
  pnl?: string | number;
  /* Label next to Token Symbol */
  label?: string;
  pnlColor?: "green" | "red";
  ctaText?: string;
  lineThreeLabel?: string;
  lineThreeValue?: string | number;
  ctaOnClick?: () => void;
}

/**
 * Asset Card Component for Wallet.
 */
const AssetCard: FC<OHMAssetCardProps> = ({
  token,
  assetValue,
  assetBalance,
  pnl = 0,
  timeRemaining,
  pnlColor,
  label,
  ctaText,
  ctaOnClick,
  lineThreeLabel,
  lineThreeValue,
  ...props
}) => {
  const [cardClick, setCardClick] = useState(false);

  const posOrNegative = (number: number | string) => {
    const toNumber = typeof number === "string" ? Number(number.replace(/[^0-9.-]+/g, "")) : number;
    if (toNumber < 0) {
      return "red";
    } else if (toNumber > 0) return "green";
    return "default";
  };

  const pnlClass = posOrNegative(pnl);
  return (
    <StyledBox className={classes.container} ctaText={ctaText} ctaOnClick={ctaOnClick}>
      <Grid container direction="row" onClick={() => setCardClick(!cardClick)}>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <TokenStack tokens={token} style={{ fontSize: "21px" }} />
            <Typography className={classes.assetTitle}>{token}</Typography>
            <Typography className={classes.assetLabel}>{label}</Typography>
          </Box>
          <Box mt={"3px"}>
            {timeRemaining && (
              <Typography className={`${classes.label} label`} variant="body2">
                {timeRemaining}
              </Typography>
            )}
          </Box>
          {lineThreeLabel && (
            <Box mt={"3px"}>
              <Typography className={`${classes.label} label`} variant="body2">
                {lineThreeLabel}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item container justifyContent="flex-end" xs={6}>
          <Box display="flex" flexDirection="column" mt={"4px"} justifyContent="flex-end" justifyItems="right">
            <Box display="flex" alignItems="center" justifyContent="flex-end" textAlign="right">
              <Typography variant="body2" className={classes[pnlClass]} style={{ marginRight: "4px" }}>
                {pnl}
              </Typography>
              {assetValue ? (
                <Typography className={classes.assetValue}>{assetValue}</Typography>
              ) : (
                <Skeleton width="50px" style={{ marginLeft: "4px", lineHeight: "18px" }} />
              )}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="flex-end" textAlign="right">
              {assetBalance ? (
                <Typography className={classes.assetBalance} variant="body2">
                  {assetBalance}
                </Typography>
              ) : (
                <Skeleton width="50px" style={{ lineHeight: "18px" }} />
              )}
            </Box>
            {lineThreeValue && (
              <Box display="flex" alignItems="center" justifyContent="flex-end" textAlign="right">
                <Typography className={classes.assetBalance} variant="body2">
                  {lineThreeValue}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      {cardClick && ctaOnClick && ctaText && (
        <Box display="flex" flexDirection="row" justifyContent="center" textAlign="center" mt={"4px"}>
          <TertiaryButton size="small" onClick={ctaOnClick}>
            {ctaText}
          </TertiaryButton>
        </Box>
      )}
    </StyledBox>
  );
};

export default AssetCard;
