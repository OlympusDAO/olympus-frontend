import { t, Trans } from "@lingui/macro";
import { Box, Skeleton, Typography } from "@mui/material";
import { Icon, Metric, Modal, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { NetworkId } from "src/constants";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { useWeb3Context } from "src/hooks/web3Context";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";

import { Bond } from "../../hooks/useBond";
import { BondDiscount } from "../BondDiscount";
import { BondDuration } from "../BondDuration";
import { BondInfoText } from "../BondInfoText";
import { BondPrice } from "../BondPrice";
import { BondInputArea } from "./components/BondInputArea/BondInputArea";
import { BondSettingsModal } from "./components/BondSettingsModal";

export const BondModalContainer: React.VFC = () => {
  const navigate = useNavigate();
  const { networkId } = useWeb3Context();
  const { id } = useParams<{ id: string }>();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, navigate });

  const { pathname } = useLocation();
  const isInverseBond = pathname.includes("/inverse/");

  const bonds = useLiveBonds({ isInverseBond }).data;
  const bond = bonds?.find(bond => bond.id === id);

  if (!bond) return null;

  return <BondModal bond={bond} />;
};

const BondModal: React.VFC<{ bond: Bond }> = ({ bond }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { address } = useWeb3Context();
  const isInverseBond: boolean = pathname.includes("/inverse/");

  const [slippage, setSlippage] = useState("0.5");
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") isSettingsOpen ? setSettingsOpen(false) : navigate("/bonds");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, isSettingsOpen]);

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  return (
    <Modal
      open
      minHeight="auto"
      closePosition="right"
      onClose={() => navigate(`/bonds`)}
      topLeft={<Icon name="settings" style={{ cursor: "pointer" }} onClick={() => setSettingsOpen(true)} />}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">{bond.quoteToken.name}</Typography>
          </Box>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <BondSettingsModal
          slippage={slippage}
          open={isSettingsOpen}
          recipientAddress={recipientAddress}
          handleClose={() => setSettingsOpen(false)}
          onRecipientAddressChange={event => setRecipientAddress(event.currentTarget.value)}
          onSlippageChange={event => setSlippage(event.currentTarget.value)}
        />

        <Box display="flex" flexDirection="row" justifyContent="space-between" width={["100%", "70%"]} mt="24px">
          <Metric
            label={t`Bond Price`}
            tooltip={isInverseBond ? "Amount you will receive for 1 OHM" : undefined}
            metric={bond.isSoldOut ? "--" : <BondPrice price={bond.price.inUsd} isInverseBond={isInverseBond} />}
          />
          <Metric
            label={t`Market Price`}
            metric={<TokenPrice token={bond.baseToken} isInverseBond={isInverseBond} />}
          />
          <Metric label={t`ROI`} metric={<BondDiscount discount={bond.discount} textOnly />} />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-around" width={["100%", "70%"]} mt="24px">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              color="textSecondary"
              style={{ fontSize: "15px", fontWeight: 600, lineHeight: "21px", marginBottom: "3px" }}
            >
              <Trans>You Give</Trans>
            </Typography>
            <TokenStack tokens={bond.quoteToken.icons} />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              color="textSecondary"
              style={{ fontSize: "15px", fontWeight: 600, lineHeight: "21px", marginBottom: "3px" }}
            >
              Vested
            </Typography>
            <Box display="flex" flexGrow={1} alignItems="center">
              <Typography style={{ lineHeight: "20px" }}>
                {isInverseBond ? t`Instantly` : <BondDuration duration={bond.duration} />}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              color="textSecondary"
              style={{ fontSize: "15px", fontWeight: 600, lineHeight: "21px", marginBottom: "3px" }}
            >
              <Trans>You Get</Trans>
            </Typography>
            <Typography style={{ lineHeight: "20px" }}>
              <TokenStack tokens={bond.baseToken.icons} />
            </Typography>
          </Box>
        </Box>

        <Box width="100%" mt="24px">
          <BondInputArea
            isInverseBond={isInverseBond}
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
          />
        </Box>

        <Box mt="24px" textAlign="center" width={["100%", "70%"]}>
          <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
            <BondInfoText isInverseBond={isInverseBond} />
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

const TokenPrice: React.VFC<{ token: Token; isInverseBond?: boolean }> = ({ token, isInverseBond }) => {
  const { data: priceToken = new DecimalBigNumber("0") } = useTokenPrice({ token, networkId: NetworkId.MAINNET });
  const { data: ohmPrice = 0 } = useOhmPrice();
  const price = isInverseBond ? priceToken.mul(new DecimalBigNumber(ohmPrice.toString())) : priceToken;
  return price ? <>${price.toString({ decimals: 2, format: true, trim: false })}</> : <Skeleton width={60} />;
};
