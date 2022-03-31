import "src/views/BondV2/Bond.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, Modal, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { formatCurrency } from "src/helpers";
import { Bond } from "src/helpers/bonds/Bond";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useOhmPrice } from "src/hooks/usePrices";
import { useWeb3Context } from "src/hooks/web3Context";
import { useBondData } from "src/views/Bond/hooks/useBondData";

import { useActiveBonds } from "../../hooks/useActiveBonds";
import { BondDuration } from "../BondDuration";
import { BondInfoText } from "../BondInfoText";
import { BondPrice } from "../BondPrice";
import { BondInputArea } from "./components/BondInputArea/BondInputArea";
import { BondSettingsModal } from "./components/BondSettingsModal";

export const BondModalContainer: React.VFC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const bonds = useActiveBonds().data;
  const { networkId } = useWeb3Context();
  const { id } = useParams<{ id: string }>();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  if (!bonds) return null;

  const bond = bonds.find(bond => bond.id === id);

  if (!bond) return null;

  return <BondModal bond={bond} isInverseBond={pathname.includes("/inverse/")} />;
};

const BondModal: React.VFC<{ bond: Bond; isInverseBond: boolean }> = props => {
  const history = useHistory();
  const { address } = useWeb3Context();

  const info = useBondData(props.bond).data;

  const [slippage, setSlippage] = useState("0.5");
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") isSettingsOpen ? setSettingsOpen(false) : history.push("/bonds");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, isSettingsOpen]);

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  return (
    <Modal
      open
      id="bond-view"
      minHeight="auto"
      closePosition="left"
      onClose={() => history.push(`/bonds`)}
      topRight={<Icon name="settings" style={{ cursor: "pointer" }} onClick={() => setSettingsOpen(true)} />}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={props.bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">{props.bond.quoteToken.name}</Typography>
          </Box>
        </Box>
      }
    >
      <>
        <BondSettingsModal
          slippage={slippage}
          open={isSettingsOpen}
          recipientAddress={recipientAddress}
          handleClose={() => setSettingsOpen(false)}
          onRecipientAddressChange={event => setRecipientAddress(event.currentTarget.value)}
          onSlippageChange={event => setSlippage(event.currentTarget.value)}
        />

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography>
            {props.isInverseBond ? "Instant Payout" : info?.isFixedTerm ? t`Fixed Term` : t`Fixed Expiration`}
          </Typography>

          {!props.isInverseBond && (
            <Box mt="4px">
              <Typography>
                <BondDuration duration={info?.duration} />
              </Typography>
            </Box>
          )}
        </Box>

        <Box display="flex" flexDirection="row" className="bond-price-data-row">
          <div className="bond-price-data">
            <Typography variant="h5" color="textSecondary">
              <Trans>Bond Price</Trans>
            </Typography>

            <Typography variant="h3" className="price" color="primary">
              {info?.isSoldOut ? "--" : <BondPrice price={info?.price.inUsd} />}
            </Typography>
          </div>

          <div className="bond-price-data">
            <Typography variant="h5" color="textSecondary">
              <Trans>Market Price</Trans>
            </Typography>

            <Typography variant="h3" color="primary" className="price">
              <OhmPrice />
            </Typography>
          </div>
        </Box>

        <BondInputArea bond={props.bond} slippage={slippage} recipientAddress={recipientAddress} />

        <Box mt="16px" className="help-text">
          <Typography variant="body2">
            <BondInfoText isInverseBond={props.isInverseBond} />
          </Typography>
        </Box>
      </>
    </Modal>
  );
};

const OhmPrice = () => {
  const price = useOhmPrice().data;
  return price ? <>{formatCurrency(price, 2)}</> : <Skeleton width={60} />;
};
