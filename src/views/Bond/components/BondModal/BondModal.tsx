import "src/views/BondV2/Bond.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, Modal, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { NetworkId } from "src/constants";
import { Token } from "src/helpers/contracts/Token";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { useWeb3Context } from "src/hooks/web3Context";
import { Bond, useBonds } from "src/views/Bond/hooks/useBonds";

import { BondDuration } from "../BondDuration";
import { BondInfoText } from "../BondInfoText";
import { BondPrice } from "../BondPrice";
import { BondInputArea } from "./components/BondInputArea/BondInputArea";
import { BondSettingsModal } from "./components/BondSettingsModal";

export const BondModalContainer: React.VFC = () => {
  const history = useHistory();
  const { networkId } = useWeb3Context();
  const { id } = useParams<{ id: string }>();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const { pathname } = useLocation();
  const isInverseBond = pathname.includes("/inverse/");

  const bonds = useBonds({ isInverseBond }).data;
  const bond = bonds?.find(bond => bond.id === id);

  if (!bond) return null;

  return <BondModal bond={bond} />;
};

const BondModal: React.VFC<{ bond: Bond }> = ({ bond }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { address } = useWeb3Context();
  const isInverseBond = pathname.includes("/inverse/");

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
          <TokenStack tokens={bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">{bond.quoteToken.name}</Typography>
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
            {isInverseBond ? "Instant Payout" : bond.isFixedTerm ? t`Fixed Term` : t`Fixed Expiration`}
          </Typography>

          {!isInverseBond && (
            <Box mt="4px">
              <Typography>
                <BondDuration duration={bond.duration} />
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
              {bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} />}
            </Typography>
          </div>

          <div className="bond-price-data">
            <Typography variant="h5" color="textSecondary">
              <Trans>Market Price</Trans>
            </Typography>

            <Typography variant="h3" color="primary" className="price">
              <TokenPrice token={bond.baseToken} />
            </Typography>
          </div>
        </Box>

        <BondInputArea bond={bond} slippage={slippage} recipientAddress={recipientAddress} />

        <Box mt="16px" className="help-text">
          <Typography variant="body2">
            <BondInfoText isInverseBond={isInverseBond} />
          </Typography>
        </Box>
      </>
    </Modal>
  );
};

const TokenPrice: React.VFC<{ token: Token }> = ({ token }) => {
  const price = useTokenPrice(NetworkId.MAINNET, token).data;
  return price ? <>${price.toString({ decimals: 2, format: true, trim: false })}</> : <Skeleton width={60} />;
};
