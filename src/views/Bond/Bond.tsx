import { ChangeEvent, Fragment, ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatCurrency, trim } from "../../helpers";
import { Backdrop, Box, Fade, Grid, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import { useAppSelector } from "src/hooks";
import { IAllBondData } from "src/hooks/Bonds";
import { NetworkID } from "src/lib/Bond";

type InputEvent = ChangeEvent<HTMLInputElement>;

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Bond = ({ bond }: { bond: IAllBondData }) => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [recipientAddress, setRecipientAddress] = useState<string>(address);

  const [view, setView] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | undefined>();

  const isBondLoading = useAppSelector<boolean>(state => state.bonding.loading ?? true);

  const onRecipientAddressChange = (e: InputEvent): void => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = (e: InputEvent): void => {
    return setSlippage(Number(e.target.value));
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const changeView = (newView: number): void => {
    setView(newView);
  };

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className="ohm-card ohm-modal">
              <BondHeader
                bond={bond}
                slippage={slippage}
                recipientAddress={recipientAddress}
                onSlippageChange={onSlippageChange}
                onRecipientAddressChange={onRecipientAddressChange}
              />

              <Box display="flex" flexDirection="row" className="bond-price-data-row">
                <div className="bond-price-data">
                  <Typography variant="h5" color="textSecondary">
                    Bond Price
                  </Typography>
                  <Typography variant="h3" className="price" color="primary">
                    {isBondLoading ? <Skeleton /> : formatCurrency(bond.bondPrice, 2)}
                  </Typography>
                </div>
                <div className="bond-price-data">
                  <Typography variant="h5" color="textSecondary">
                    Market Price
                  </Typography>
                  <Typography variant="h3" color="primary" className="price">
                    {isBondLoading ? <Skeleton /> : formatCurrency(bond.marketPrice, 2)}
                  </Typography>
                </div>
              </Box>

              <Tabs
                centered
                value={view}
                textColor="primary"
                indicatorColor="primary"
                onChange={() => changeView(view)}
                aria-label="bond tabs"
              >
                <Tab label="Bond" {...a11yProps(0)} />
                <Tab label="Redeem" {...a11yProps(1)} />
              </Tabs>

              <TabPanel value={view} index={0}>
                <BondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress} />
              </TabPanel>

              <TabPanel value={view} index={1}>
                <BondRedeem bond={bond} />
              </TabPanel>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
};

export const DisplayBondPrice = ({ bond }: { bond: IAllBondData }): ReactNode => {
  const { chainID }: { chainID: NetworkID } = useWeb3Context();

  if (typeof bond.isAvailable[chainID] == undefined || !bond.isAvailable[chainID]) {
    return <Fragment>--</Fragment>;
  }

  return (
    <Fragment>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(bond.bondPrice)}
    </Fragment>
  );
};

export const DisplayBondDiscount = ({ bond }: { bond: IAllBondData }): ReactNode => {
  const { chainID }: { chainID: NetworkID } = useWeb3Context();

  if (typeof bond.isAvailable === undefined || !bond.isAvailable[chainID]) {
    return <Fragment>--</Fragment>;
  }

  return <Fragment>{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</Fragment>;
};
export default Bond;
