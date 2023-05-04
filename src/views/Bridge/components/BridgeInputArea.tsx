import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { Icon, OHMTokenProps, PrimaryButton, SwapCard, SwapCollection, Token } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BRIDGE_CHAINS, MINTER_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useOhmBalance } from "src/hooks/useBalance";
import { useBridgeOhm } from "src/hooks/useBridging";
import { BridgeConfirmModal } from "src/views/Bridge/components/BridgeConfirmModal";
import { BridgeFees } from "src/views/Bridge/components/BridgeFees";
import { BridgeSettingsModal } from "src/views/Bridge/components/BridgeSettingsModal";
import { ChainPickerModal } from "src/views/Bridge/components/ChainPickerModal";
import { useBridgeableChains, useBridgeableTestableNetwork } from "src/views/Bridge/helpers";
import { useAccount, useNetwork } from "wagmi";

export const BridgeInputArea = () => {
  const { address } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const { data: chainDefaults, isInvalid } = useBridgeableChains();
  const bridgeMutation = useBridgeOhm();
  const network = useBridgeableTestableNetwork();
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[network];
  const [recipientAddress, setRecipientAddress] = useState<string>(address as string);
  const [amount, setAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recChainOpen, setRecChainOpen] = useState(false);
  const [sendChainOpen, setSendChainOpen] = useState(false);
  const [receivingChain, setReceivingChain] = useState<number>(chainDefaults?.defaultRecChain || 1);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
                  token={
                    <Token
                      name={BRIDGE_CHAINS[chain.id as keyof typeof BRIDGE_CHAINS].token as OHMTokenProps["name"]}
                      sx={{ width: "21px", height: "21px" }}
                    />
                  }
                  tokenName={BRIDGE_CHAINS[chain.id as keyof typeof BRIDGE_CHAINS].name}
                  tokenOnClick={() => setSendChainOpen(true)}
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
                  token={
                    <Token
                      name={BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS].token as OHMTokenProps["name"]}
                      sx={{ width: "21px", height: "21px" }}
                    />
                  }
                  tokenName={BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS].name}
                  tokenOnClick={() => setRecChainOpen(true)}
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
                spendAmount={!!amount ? new DecimalBigNumber(amount, 9) : new DecimalBigNumber("0", 9)}
              >
                <PrimaryButton
                  fullWidth
                  disabled={bridgeMutation.isLoading || !(Number(amount) > 0)}
                  onClick={() => setConfirmOpen(true)}
                >
                  {bridgeMutation.isLoading
                    ? "Bridging..."
                    : Number(amount) > 0
                    ? "Bridge"
                    : "Enter an amount to bridge"}
                </PrimaryButton>
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          )}
          <Box sx={{ padding: "15px 0" }}>
            <Typography
              variant="body1"
              style={{ lineHeight: 1.4, fontWeight: 300, fontSize: "12px", color: "#8A8B90", textAlign: "center" }}
            >
              When bridging <strong>OHM</strong>, the <strong>OHM</strong> on the sending chain gets burned and new{" "}
              <strong>OHM</strong> gets minted on the other side.
              <br />
              Bridge in peace OHMie.
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <BridgeFees amount={amount} receivingChain={receivingChain} recipientAddress={recipientAddress} />
          </Box>
        </Box>
      </Box>
      <BridgeConfirmModal
        isOpen={confirmOpen}
        handleConfirmClose={() => setConfirmOpen(false)}
        amount={amount}
        amountExceedsBalance={false}
        bridgeMutation={bridgeMutation}
        destinationChainId={receivingChain}
        recipientAddress={recipientAddress}
        handleSettingsOpen={() => setSettingsOpen(true)}
      />
      <BridgeSettingsModal
        open={settingsOpen}
        handleClose={() => setSettingsOpen(false)}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
      />
      <ChainPickerModal
        isOpen={recChainOpen}
        selectedChain={receivingChain}
        setSelectedChain={setReceivingChain}
        handleConfirmClose={() => setRecChainOpen(false)}
        variant="receive"
      />
      <ChainPickerModal
        isOpen={sendChainOpen}
        selectedChain={chain.id}
        setSelectedChain={setReceivingChain}
        handleConfirmClose={() => setSendChainOpen(false)}
        variant="send"
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
