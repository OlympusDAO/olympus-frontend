import { useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { Icon, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BRIDGE_CHAINS, IChainAttrs, MINTER_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useOhmBalance } from "src/hooks/useBalance";
import { useBridgeOhm } from "src/hooks/useBridging";
import { BridgeConfirmModal } from "src/views/Bridge/components/BridgeConfirmModal";
import { ChainPickerModal } from "src/views/Bridge/components/ChainPickerModal";
import { useBridgeableChains, useBridgeableTestableNetwork } from "src/views/Bridge/helpers";

export const BridgeInputArea = () => {
  const { data: chainDefaults, isInvalid } = useBridgeableChains();
  const bridgeMutation = useBridgeOhm();
  const network = useBridgeableTestableNetwork();
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[network];
  const [amount, setAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recChainOpen, setRecChainOpen] = useState(false);
  const [receivingChain, setReceivingChain] = useState<number>(chainDefaults?.defaultRecChain || 1);
  const setMax = () => {
    if (!ohmBalance) return;
    setAmount(ohmBalance.toString());
  };

  useEffect(() => {
    if (bridgeMutation.isSuccess) setConfirmOpen(false);
  }, [bridgeMutation.isSuccess]);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <Box mb="21px">
            <SwapCollection
              UpperSwapCard={
                <SwapCard
                  id="from"
                  token={<SendingChainIcon />}
                  // tokenName={"OHM"}
                  info={`${ohmBalance?.toString({ decimals: 4, format: true, trim: true }) || "0.00"} ${"OHM"}`}
                  endString="Max"
                  endStringOnClick={setMax}
                  value={amount}
                  onChange={event => setAmount(event.currentTarget.value)}
                  inputProps={{ "data-testid": "fromInput" }}
                />
              }
              LowerSwapCard={
                <SwapCard
                  id="to"
                  token={<ReceivingChainIcon chainId={receivingChain} onClick={() => setRecChainOpen(true)} />}
                  // tokenName={"OHM"}
                  value={amount}
                  inputProps={{ "data-testid": "toInput" }}
                />
              }
            />
          </Box>
          {isInvalid ? (
            <SwitchChainBtn />
          ) : (
            <WalletConnectedGuard fullWidth>
              <TokenAllowanceGuard
                isVertical
                tokenAddressMap={OHM_ADDRESSES}
                spenderAddressMap={MINTER_ADDRESSES}
                approvalText={`Approve OHM for Bridging`}
                message={
                  <>
                    First time bridging <b>OHM</b>? <br /> Please approve Olympus DAO to use your <b>OHM</b> for
                    bridging.
                  </>
                }
              >
                <PrimaryButton fullWidth disabled={bridgeMutation.isLoading} onClick={() => setConfirmOpen(true)}>
                  {bridgeMutation.isLoading ? "Bridging..." : "Bridge"}
                </PrimaryButton>
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          )}
        </Box>
      </Box>
      <BridgeConfirmModal
        isOpen={confirmOpen}
        handleConfirmClose={() => setConfirmOpen(false)}
        amount={amount}
        amountExceedsBalance={false}
        bridgeMutation={bridgeMutation}
        destinationChainId={receivingChain}
      />
      <ChainPickerModal
        isOpen={recChainOpen}
        receivingChain={receivingChain}
        setReceivingChain={setReceivingChain}
        handleConfirmClose={() => setRecChainOpen(false)}
      />
    </Box>
  );
};

/** displays the icon AND switches chains */
const SwitchChainBtn = () => {
  const theme = useTheme();
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        if (!chain) return <></>;
        return (
          <PrimaryButton
            fullWidth
            // sx={{
            //   height: "39px",
            //   borderRadius: "6px",
            //   padding: "9px 18px",
            //   cursor: "pointer",
            //   background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
            // }}
            onClick={openChainModal}
          >
            {chain.unsupported && <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />}
            {`Switch to a Bridgeable Chain`}
          </PrimaryButton>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

/** displays the icon AND switches chains */
const SendingChainIcon = () => {
  const theme = useTheme();
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        if (!chain) return <></>;
        return (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              height: "39px",
              borderRadius: "6px",
              padding: "9px 18px",
              cursor: "pointer",
              background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
            }}
            onClick={openChainModal}
          >
            {chain.unsupported && <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />}
            {chain.hasIcon && (
              <div
                style={{
                  background: chain.iconBackground,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                {chain.iconUrl && (
                  <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 24, height: 24 }} />
                )}
              </div>
            )}{" "}
            {chain.name && chain.name}
          </Box>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

const ReceivingChainIcon = ({ chainId, onClick }: { chainId: number; onClick: () => void }) => {
  const theme = useTheme();
  const chain: IChainAttrs | undefined = BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS];

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        height: "39px",
        borderRadius: "6px",
        padding: "9px 18px",
        cursor: "pointer",
        background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
      }}
      onClick={onClick}
    >
      {!chain ? (
        <>
          <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />
          {" Unkown"}
        </>
      ) : (
        <>
          <div
            style={{
              background: chain.iconBackground,
              width: 24,
              height: 24,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            {chain.iconUrl && (
              <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 24, height: 24 }} />
            )}
          </div>{" "}
          {chain.name && chain.name}
        </>
      )}
    </Box>
  );
};
