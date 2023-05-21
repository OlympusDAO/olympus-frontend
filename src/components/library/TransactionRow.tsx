import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { animated, useSpring } from "@react-spring/web";
import { FC, useState } from "react";
import { TextButton } from "src/components/library/Button";
import Icon from "src/components/library/Icon";
import TokenStack, { OHMTokenStackProps } from "src/components/library/TokenStack";

const PREFIX = "TransactionRow";

const classes = {
  root: `${PREFIX}-root`,
  assetName: `${PREFIX}-assetName`,
  gray90: `${PREFIX}-gray90`,
  details: `${PREFIX}-details`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  // "@global": {
  //   ".wallet-transaction-row:nth-child(odd) .row-details": {
  //     background: "transparent",
  //   },
  // },
  [`& .${classes.root}`]: {
    backgroundColor: theme.colors.paper.card,
    borderRadius: "6px",
    padding: "6px 10px 6px 9px",
  },

  [`& .${classes.assetName}`]: {
    fontWeight: 400,
    lineHeight: "20px",
  },

  [`& .${classes.gray90}`]: {
    color: theme.colors.gray[90],
    lineHeight: "18px",
  },

  [`& .${classes.details}`]: {
    marginTop: "-50px",
    backgroundColor: theme.colors.paper.cardHover,
    padding: "1px 10px 1px 13px",
    "& .MuiButton-text": {
      fontSize: "1rem",
      paddingLeft: "0px",
      marginLeft: "0px",
    },
  },
}));

export interface OHMTransactionRowProps {
  assetName: OHMTokenStackProps["tokens"];
  transactionDetails?: string;
  quantity?: string | number;
  usdValue?: string | number;
  hrefText?: string;
  href?: string;
}

/**
 * Component for Displaying Wallet Transaction Row
 */
const TransactionRow: FC<OHMTransactionRowProps> = ({
  assetName,
  transactionDetails,
  quantity,
  usdValue,
  hrefText,
  href,
}) => {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <Root>
      <Box className={`wallet-transaction-row`}>
        <animated.div style={{ opacity: opacity.to(o => 1 - o), transform }}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={`${classes.root} row-details`}
          >
            <Box display="flex" alignItems="center">
              <TokenStack tokens={assetName} style={{ fontSize: "32px" }} />
              <Box display="flex" flexDirection="column" ml={1}>
                <Typography className={classes.assetName}>
                  {assetName?.map((asset, index) =>
                    assetName.length === index + 1 ? `${asset} ${assetName.length > 1 ? `LP` : ""}` : `${asset}-`,
                  )}
                </Typography>
                <Typography variant="body2" className={classes.gray90}>
                  {transactionDetails}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box display="flex" flexDirection="column" textAlign="right">
                <Typography className={classes.assetName}>{quantity}</Typography>
                <Typography variant="body2" className={classes.gray90}>
                  {usdValue}
                </Typography>
              </Box>
              <Icon name="more" style={{ marginLeft: "7px", cursor: "pointer" }} onClick={() => setFlipped(f => !f)} />
            </Box>
          </Box>
        </animated.div>
        <animated.div style={{ opacity, transform: transform.to(t => `${t} rotateX(180deg)`) }}>
          {flipped && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              className={`${classes.root} ${classes.details}`}
            >
              <Box display="flex" alignItems="center" flexGrow={1} justifyContent="space-around">
                <TextButton href={href} target="_blank">
                  {hrefText}
                </TextButton>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon name="x" style={{ cursor: "pointer" }} onClick={() => setFlipped(f => !f)} />
              </Box>
            </Box>
          )}
        </animated.div>
      </Box>
    </Root>
  );
};

export default TransactionRow;
