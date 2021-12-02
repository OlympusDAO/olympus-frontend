import { ElementType, ReactElement, useState } from "react";
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
  AccordionProps,
} from "@material-ui/core";
import { BigNumberish, BigNumber } from "ethers";

import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { addresses } from "src/constants";
import { trim, formatCurrency } from "src/helpers";

import { ReactComponent as MoreIcon } from "src/assets/icons/more.svg";
import { ReactComponent as sOhmTokenImg } from "src/assets/tokens/token_sOHM.svg";
import { ReactComponent as ohmTokenImg } from "src/assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "src/assets/tokens/token_33T.svg";
import { ReactComponent as wsOhmTokenImg } from "src/assets/tokens/token_wsOHM.svg";

import { addTokenToWallet } from "./addTokenToWallet";

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
  name: OHMToken;
  address: string;
  Icon: ElementType;
  userBalance: string;
  price: number;
  expanded: OHMToken | null;
  onChangeExpanded: (name: OHMToken) => void;
}

export type OHMToken = "OHM" | "33T" | "wsOHM" | "sOHM";

export const Token = ({ name, Icon, userBalance, price, address, expanded, onChangeExpanded }: TokenProps) => {
  const theme = useTheme();
  const { address: userAddress } = useWeb3Context();
  const userBalanceTotalValue = parseFloat(userBalance) * price || 0;
  return (
    <Accordion expanded={expanded === name} onChange={() => onChangeExpanded(name)}>
      <AccordionSummary expandIcon={<SvgIcon component={MoreIcon} color="disabled" />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Icon style={{ height: "28px", width: "28px", marginRight: theme.spacing(1) }} />
          <Typography>{name}</Typography>
        </Box>
        <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Typography variant="body2">{trim(Number(userBalance), 4)}</Typography>
          <Typography variant="body2" color="textSecondary">
            {formatCurrency(userBalanceTotalValue, 2)}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails style={{ margin: "auto", padding: theme.spacing(0.5, 0) }}>
        <Box className="ohm-pairs" style={{ width: "100%" }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => addTokenToWallet(name, address, userAddress)}
          >
            <Typography>Add to Wallet</Typography>
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const TokensList = () => {
  const userBalances = useAppSelector(state => state.account.balances);
  const marketPrice = useAppSelector(state => state.app.marketPrice) || 0;
  const currentIndex = useAppSelector(state => state.app.currentIndex);

  //   const { chainID } = useWeb3Context();
  const chainID = 4;
  const [expanded, setExpanded] = useState<OHMToken | null>(null);
  const expandedHandlers = {
    expanded,
    onChangeExpanded: (name: OHMToken) => setExpanded(expanded === name ? null : name),
  };

  return (
    <>
      <Token
        name="OHM"
        address={addresses[chainID].OHM_ADDRESS}
        price={marketPrice}
        Icon={ohmTokenImg}
        userBalance={userBalances.ohm}
        {...expandedHandlers}
      />
      <Token
        name="sOHM"
        address={addresses[chainID].SOHM_ADDRESS}
        price={marketPrice}
        Icon={sOhmTokenImg}
        userBalance={userBalances.sohm}
        {...expandedHandlers}
      />
      <Token
        name="wsOHM"
        address={addresses[chainID].WSOHM_ADDRESS}
        price={marketPrice * Number(currentIndex)}
        Icon={wsOhmTokenImg}
        userBalance={userBalances.wsohm}
        {...expandedHandlers}
      />
      <Token
        name="33T"
        address={addresses[chainID].PT_TOKEN_ADDRESS}
        price={marketPrice}
        Icon={t33TokenImg}
        userBalance={userBalances.pool}
        {...expandedHandlers}
      />
    </>
  );
};
