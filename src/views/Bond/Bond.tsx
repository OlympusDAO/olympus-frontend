import "./Bond.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Fade, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, Modal, Tab, TabPanel, Tabs, TokenStack } from "@olympusdao/component-library";
import { ChangeEvent, Fragment, ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAppSelector } from "src/hooks";
import { IAllBondData } from "src/hooks/Bonds";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";

import { formatCurrency, trim } from "../../helpers";
import useEscape from "../../hooks/useEscape";
import AdvancedSettings from "../BondV2/AdvancedSettings";
import BondPurchase from "./BondPurchase";
import BondRedeem from "./BondRedeem";

type InputEvent = ChangeEvent<HTMLInputElement>;

const Bond = ({ bond }: { bond: IAllBondData }) => {
  const history = useHistory();
  const { provider, address, networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const [slippage, setSlippage] = useState<number>(0.5);
  const [recipientAddress, setRecipientAddress] = useState<string>(address);

  const [view, setView] = useState<number>(0);
  const [quantity] = useState<number | undefined>();

  const isBondLoading = useAppSelector<boolean>(state => state.bonding.loading ?? true);

  const onRecipientAddressChange = (e: InputEvent): void => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = (e: InputEvent): void => {
    return setSlippage(Number(e.target.value));
  };

  const onClickAway = (): void => {
    history.push(`/bonds-v1`);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  useEscape(() => {
    if (advOpen) handleAdvClose;
    else history.push(`/bonds-v1`);
  });

  const changeView: any = (event: ChangeEvent<any>, value: string | number): void => {
    setView(Number(value));
  };

  const [advOpen, setadvOpen] = useState<boolean>(false);
  const handleAdvOpen = () => setadvOpen(true);
  const handleAdvClose = () => setadvOpen(false);

  const advSettings = (
    <>
      <Icon name="settings" style={{ cursor: "pointer" }} onClick={handleAdvOpen} />
      <AdvancedSettings
        open={advOpen}
        handleClose={handleAdvClose}
        slippage={slippage}
        recipientAddress={recipientAddress}
        onRecipientAddressChange={onRecipientAddressChange}
        onSlippageChange={onSlippageChange}
      />
    </>
  );
  const headerContent = (
    <Box display="flex" flexDirection="row">
      <TokenStack tokens={bond.bondIconSvg} />
      <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
        <Typography variant="h5">{`${bond.displayName} (v1 Bond)`}</Typography>
      </Box>
    </Box>
  );
  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container>
        <Modal
          minHeight="auto"
          id="bond-view"
          open={true}
          onClose={onClickAway}
          closePosition="left"
          headerContent={headerContent}
          topRight={advSettings}
        >
          <>
            <Box display="flex" flexDirection="row" className="bond-price-data-row">
              <div className="bond-price-data">
                <Typography variant="h5" color="textSecondary">
                  <Trans>Bond Price</Trans>
                </Typography>
                <Typography variant="h3" className="price" color="primary">
                  <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.name} bond={bond} />}</>
                </Typography>
              </div>
              <div className="bond-price-data">
                <Typography variant="h5" color="textSecondary">
                  <Trans>Market Price</Trans>
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
              onChange={changeView}
              aria-label="bond tabs"
            >
              <Tab
                aria-label="bond-tab-button"
                label={t({
                  id: "do_bond",
                  comment: "The action of bonding (verb)",
                })}
              />
              <Tab aria-label="redeem-tab-button" label={t`Redeem`} />
            </Tabs>

            <TabPanel value={view} index={0}>
              <BondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress} />
            </TabPanel>

            <TabPanel value={view} index={1}>
              <BondRedeem bond={bond} />
            </TabPanel>
          </>
        </Modal>
      </Grid>
    </Fade>
  );
};

export const DisplayBondPrice = ({ bond }: { bond: IAllBondData }): ReactElement => {
  const { networkId } = useWeb3Context();

  if (typeof bond.bondPrice === undefined || !bond.getBondability(networkId)) {
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

export const DisplayBondDiscount = ({ bond }: { bond: IAllBondData }): ReactElement => {
  const { networkId } = useWeb3Context();

  if (typeof bond.bondDiscount === undefined || !bond.getBondability(networkId)) {
    return <Fragment>--</Fragment>;
  }

  return <Fragment>{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</Fragment>;
};
export default Bond;
