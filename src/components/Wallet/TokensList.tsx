import { ElementType, ReactElement } from "react";
import {
  SvgIcon,
  Button,
  Typography,
  Box,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails,
  withStyles,
  useTheme,
} from "@material-ui/core";
import { BigNumberish } from "ethers";

import { TOKEN_DECIMALS } from "src/constants";
import { useAppSelector } from "src/hooks";
import { formatCurrency } from "src/helpers";
import { segmentUA } from "src/helpers/userAnalyticHelpers";

import { ReactComponent as MoreIcon } from "src/assets/icons/more.svg";
import { ReactComponent as sOhmTokenImg } from "src/assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "src/assets/tokens/token_33T.svg";
import { ReactComponent as wsOhmTokenImg } from "src/assets/tokens/token_wsOHM.svg";
import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

export const addTokenToWallet =
  (tokenSymbol: "OHM" | "33T" | "wsOHM" | "sOHM", tokenAddress: string, userAddress: string) => async () => {
    if (!window.ethereum) return;

    const host = window.location.origin;
    const tokenDecimals = tokenSymbol === "wsOHM" ? 18 : TOKEN_DECIMALS; // 9;
    const tokenImagePath = {
      OHM: OhmImg,
      sOHM: SOhmImg,
      wsOHM: WsOhmImg,
      "33T": token33tImg,
    }[tokenSymbol];

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: `${host}/${tokenImagePath}`,
          },
        },
      });
      segmentUA({
        address: userAddress,
        type: "Add Token",
        tokenName: tokenSymbol,
      });
    } catch (error) {
      console.log(error);
    }
  };

const Accordion = withStyles({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    minHeight: "36px",
    height: "36px",
    padding: theme.spacing(0),
    "&$expanded": {
      padding: theme.spacing(0),
      minHeight: "36px",
    },
  },
  content: {
    margin: 0,
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

interface TokenProps {
  name: string;
  Icon: ElementType;
  userBalance: BigNumberish;
  price: BigNumberish;
}

export const Token = ({ name, Icon, userBalance, price }: TokenProps) => {
  const theme = useTheme();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<SvgIcon component={MoreIcon} />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Icon style={{ height: "25px", width: "25px", marginRight: theme.spacing(1) }} />
          <Typography>{name}</Typography>
        </Box>
        <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Typography variant="body2">{userBalance}</Typography>
          <Typography variant="body2" color="textSecondary">
            $0
          </Typography>
          {/* <Typography align="left">{formatCurrency(userBalance * price)}</Typography> */}
        </Box>
      </AccordionSummary>
      <AccordionDetails style={{ margin: "auto", padding: 0 }}>
        <Box className="ohm-pairs" style={{ width: "100%" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            // onClick={toggleDrawer("sOHMtx")}
            color="secondary"
          >
            <Typography align="left"> Transaction History</Typography>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            min-height="60px"
            // onClick={toggleDrawer("sOHMLHIW")}
            color="secondary"
          >
            <Typography align="left"> Learn how it works</Typography>
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#272D36", color: "#386794", width: "33%", minHeight: "50px" }}
            color="secondary"
            // onClick={toggleDrawer("sOHMZaps")}
          >
            <Typography align="left"> Zap</Typography>
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const TokensList = () => {
  const ohmBalance = useAppSelector(state => state.account.balances?.ohm);
  const sOhmBalance = useAppSelector(state => state.account.balances?.sohm);
  const wsOhmBalance = useAppSelector(state => state.account.balances?.wsohm);
  const poolBalance = useAppSelector(state => state.account.balances?.pool);

  const marketPrice = useAppSelector(state => state.app.marketPrice) || 0;

  return (
    <>
      <Token name="OHM" price={marketPrice} Icon={ohmTokenImg} userBalance={ohmBalance} />
      <Token name="sOHM" price={marketPrice} Icon={sOhmTokenImg} userBalance={sOhmBalance} />
      <Token name="wsOHM" price={marketPrice} Icon={wsOhmTokenImg} userBalance={wsOhmBalance} />
      <Token name="33T" price={marketPrice} Icon={t33TokenImg} userBalance={poolBalance} />
    </>
  );
};
