import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Skeleton, Typography } from "@mui/material";
import { Metric, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { NetworkId } from "src/constants";
import { formatNumber } from "src/helpers";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { BondInputArea } from "src/views/Bond/components/BondModal/components/BondInputArea/BondInputArea";
import { BondSettingsModal } from "src/views/Bond/components/BondModal/components/BondSettingsModal";
import { BondPrice } from "src/views/Bond/components/BondPrice";
import { Bond } from "src/views/Bond/hooks/useBond";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import { useAccount, useNetwork } from "wagmi";

export const BondModalContainer: React.VFC = () => {
  const navigate = useNavigate();
  const { chain = { id: 1 } } = useNetwork();
  const { id } = useParams<{ id: string }>();
  usePathForNetwork({ pathName: "bonds", networkID: chain.id, navigate });

  const { pathname } = useLocation();
  const isInverseBond = pathname.includes("/inverse/");
  const bonds = useLiveBonds({ isInverseBond }).data;
  const bond = bonds?.find(bond => bond.id === id);

  if (!bond) return null;

  return <BondModal bond={bond} />;
};

export const BondModal: React.VFC<{ bond: Bond }> = ({ bond }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { address = "" } = useAccount();
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
    //TODO: Settings need to go in the confirm modal.
    //   topLeft={<Icon name="settings" style={{ cursor: "pointer" }} onClick={() => setSettingsOpen(true)} />}

    <Box>
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Link component={RouterLink} to="/bonds">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                  Back
                </Typography>
              </Box>
            </Link>

            <TokenStack tokens={bond.quoteToken.icons} sx={{ fontSize: "27px" }} />
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography variant="h4" fontWeight={500}>
                {bond.quoteToken.name}
              </Typography>
            </Box>
          </Box>
        }
      ></PageTitle>

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
            label={`Bond Price`}
            tooltip={isInverseBond ? "Amount you will receive for 1 OHM" : undefined}
            metric={
              bond.isSoldOut ? (
                "--"
              ) : (
                <BondPrice
                  price={bond.price.inBaseToken}
                  isInverseBond={isInverseBond}
                  symbol={isInverseBond ? bond.baseToken.name : bond.quoteToken.name}
                />
              )
            }
          />
          <Metric
            label="Market Price"
            metric={
              <TokenPrice
                token={bond.baseToken}
                isInverseBond={isInverseBond}
                baseSymbol={bond.baseToken.name}
                quoteSymbol={bond.quoteToken.name}
              />
            }
          />
          <Metric
            label={isInverseBond ? "Premium" : "Discount"}
            metric={<BondDiscount discount={bond.discount} textOnly />}
          />
        </Box>

        <Box width="100%" mt="24px">
          <BondInputArea
            isInverseBond={isInverseBond}
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
            handleSettingsOpen={() => setSettingsOpen(true)}
          />
        </Box>

        <Box mt="24px" textAlign="center" width={["100%", "70%"]}>
          <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}></Typography>
        </Box>
      </Box>
    </Box>
  );
};

const TokenPrice: React.VFC<{ token: Token; isInverseBond?: boolean; baseSymbol: string; quoteSymbol: string }> = ({
  token,
  isInverseBond,
  quoteSymbol,
  baseSymbol,
}) => {
  const { data: priceToken = new DecimalBigNumber("0") } = useTokenPrice({ token, networkId: NetworkId.MAINNET });
  const { data: ohmPrice = 0 } = useOhmPrice();
  const sameToken = quoteSymbol === baseSymbol;
  const price = sameToken
    ? formatNumber(1, 2)
    : isInverseBond
    ? formatNumber(ohmPrice, 2)
    : `${formatNumber(Number(priceToken.toString({ decimals: 2, format: true, trim: false })), 2)}`;
  return price ? (
    <>
      {price} {isInverseBond ? baseSymbol : quoteSymbol}
    </>
  ) : (
    <Skeleton width={60} />
  );
};
