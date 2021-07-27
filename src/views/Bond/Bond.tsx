import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { calcBondDetails, calculateUserBondDetails } from "../../actions/Bond.actions";
import { Grid, Backdrop, Paper, Box, Tab, Tabs, Typography } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeemV1 from "./BondRedeemV1";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useAppSelector } from "src/hooks";

interface IBondProps {
  readonly bond: string;
  readonly address: string;
  readonly provider: StaticJsonRpcProvider | undefined;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Bond({ bond, address, provider }: IBondProps) {
  const dispatch = useDispatch();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(""); // TS-REFACTOR: quantity is never updated

  const marketPrice = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].marketPrice) || 0;
  });
  const bondPrice = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondPrice) || 0;
  });

  const onRecipientAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    return setSlippage(Number(e.target.value));
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

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

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
          <Box className="bond-price-data-row">
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Bond Price
              </Typography>
              <Typography variant="h3" className="price" color="primary">
                {trim(bondPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
              </Typography>
            </div>
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Market Price
              </Typography>
              <Typography variant="h3" color="primary" className="price">
                {trim(marketPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
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
            {/* <Tab label="Redeem v1" {...a11yProps(2)} disabled /> */}
          </Tabs>

          <TabPanel value={view} index={0}>
            <BondPurchase provider={provider} address={address} bond={bond} slippage={slippage} />
          </TabPanel>
          <TabPanel value={view} index={1}>
            <BondRedeem provider={provider} address={address} bond={bond} />
          </TabPanel>
          <TabPanel value={view} index={2}>
            <BondRedeemV1 provider={provider} address={address} bond={bond + "_v1"} />
          </TabPanel>
        </Paper>
      </Backdrop>
    </Grid>
  );
}

export default Bond;
