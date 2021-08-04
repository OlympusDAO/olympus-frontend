import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { calcBondDetails, calculateUserBondDetails } from "../../actions/Bond.actions.js";
import { Grid, Backdrop, Paper, Box, Tab, Tabs, Typography } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeemV1 from "./BondRedeemV1";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";
import { useWeb3Context } from "src/hooks/web3Context";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Bond({ bond }) {
  const dispatch = useDispatch();
  const { provider, address } = useWeb3Context();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const marketPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].marketPrice;
  });
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  async function loadBondDetails() {
    if (provider) await dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: 1 }));

    if (provider && address) {
      await dispatch(calculateUserBondDetails({ address, bond, provider, networkID: 1 }));
    }
  }

  useEffect(() => {
    loadBondDetails();
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const changeView = (event, newView) => {
    setView(newView);
  };

  let bondToken = "DAI";
  if (bond.indexOf("frax") >= 0) bondToken = "FRAX";
  else if (bond.indexOf("eth") >= 0) bondToken = "ETH";

  return (
    <Grid container id="bond-view">
      <Backdrop open={true}>
        <Paper className="ohm-card ohm-modal">
          <BondHeader
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
            onSlippageChange={onSlippageChange}
            onRecipientAddressChange={onRecipientAddressChange}
          />

          <Box direction="row" className="bond-price-data-row">
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Bond Price
              </Typography>
              <Typography variant="h3" className="price" color="primary">
                {bond.indexOf("eth") >= 0 ? `$${trim(bondPrice, 2)}` : `${trim(bondPrice, 2)} ${bondToken}`}
              </Typography>
            </div>
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Market Price
              </Typography>
              <Typography variant="h3" color="primary" className="price">
                {bond.indexOf("eth") >= 0 ? `$${trim(marketPrice, 2)}` : `${trim(marketPrice, 2)} ${bondToken}`}
              </Typography>
            </div>
          </Box>

          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="bond tabs"
          >
            <Tab label="Bond" {...a11yProps(0)} />
            <Tab label="Redeem" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={view} index={0}>
            <BondPurchase bond={bond} slippage={slippage} />
          </TabPanel>
          <TabPanel value={view} index={1}>
            <BondRedeem bond={bond} />
          </TabPanel>
        </Paper>
      </Backdrop>
    </Grid>
  );
}

export default Bond;
