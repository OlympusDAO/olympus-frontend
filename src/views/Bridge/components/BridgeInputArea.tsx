import { Avatar, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { Icon, OHMTokenProps, PrimaryButton, SwapCard, SwapCollection, Token } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { SolanaWalletConnectedGuard } from "src/components/SolanaWalletConnectedGuard";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import {
  BRIDGE_CHAINS,
  BRIDGEABLE_CHAINS,
  CCIP_BRIDGE_ADDRESSES,
  MINTER_ADDRESSES,
  OHM_ADDRESSES,
} from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useOhmBalance } from "src/hooks/useBalance";
import { useBridgeOhmFromSolana } from "src/hooks/useBridgeOhmFromSolana";
import { useBridgeOhm, useBridgeOhmToSolana } from "src/hooks/useBridging";
import { useSolanaOhmBalance } from "src/hooks/useSolanaBalance";
import { NetworkId } from "src/networkDetails";
import { BridgeConfirmModal } from "src/views/Bridge/components/BridgeConfirmModal";
import { BridgeFees } from "src/views/Bridge/components/BridgeFees";
import { BridgeSettingsModal } from "src/views/Bridge/components/BridgeSettingsModal";
import { ChainPickerModal } from "src/views/Bridge/components/ChainPickerModal";
import { useBridgeableChains, useBridgeableTestableNetwork } from "src/views/Bridge/helpers";
import { useAccount } from "wagmi";

interface BridgeInputAreaProps {
  sendingChain: number;
  setSendingChain: React.Dispatch<React.SetStateAction<number>>;
  receivingChain: number;
  setReceivingChain: React.Dispatch<React.SetStateAction<number>>;
}

export const BridgeInputArea = ({
  sendingChain,
  setSendingChain,
  receivingChain,
  setReceivingChain,
}: BridgeInputAreaProps) => {
  const { address } = useAccount();
  const { data: chainDefaults, isInvalid } = useBridgeableChains();
  const bridgeOhmMutation = useBridgeOhm();
  const bridgeOhmFromSolanaMutation = useBridgeOhmFromSolana();
  const bridgeOhmToSolanaMutation = useBridgeOhmToSolana();

  // Choose the right bridging hook based on source and destination chains
  const bridgeMutation =
    sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET
      ? bridgeOhmFromSolanaMutation // Solana → EVM
      : receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET
        ? bridgeOhmToSolanaMutation // EVM → Solana
        : bridgeOhmMutation; // EVM → EVM
  const network = useBridgeableTestableNetwork();

  // Get appropriate balance based on sending chain
  const evmOhmBalance = useOhmBalance()[network];
  const solanaOhmBalance = useSolanaOhmBalance(
    sendingChain === NetworkId.SOLANA
      ? NetworkId.SOLANA
      : sendingChain === NetworkId.SOLANA_DEVNET
        ? NetworkId.SOLANA_DEVNET
        : undefined,
  );

  const ohmBalance =
    sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET
      ? solanaOhmBalance?.data || new DecimalBigNumber("0", 9)
      : evmOhmBalance?.data || new DecimalBigNumber("0", 9);

  const [recipientAddress, setRecipientAddress] = useState<string>(address as string);
  const [amount, setAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recChainOpen, setRecChainOpen] = useState(false);
  const [sendChainOpen, setSendChainOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { connected } = useWallet();

  // Only show Solana wallet connect button if sendingChain is Solana (SVM->EVM)
  const showSolanaWallet =
    (sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET) &&
    !(receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET);

  const setMax = () => {
    if (!ohmBalance) return;
    setAmount(ohmBalance.toString());
  };

  useEffect(() => {
    if (bridgeMutation.isSuccess) setConfirmOpen(false);
  }, [bridgeMutation.isSuccess]);

  useEffect(() => {
    setReceivingChain(chainDefaults?.defaultRecChain || 1);
  }, [sendingChain, chainDefaults?.defaultRecChain]);

  useEffect(() => {
    const available = BRIDGEABLE_CHAINS[sendingChain as keyof typeof BRIDGEABLE_CHAINS]?.availableChains;
    if (available && available.length > 0) {
      setReceivingChain(available[0]);
    }
  }, [sendingChain]);

  //update recipient address if address changes
  useEffect(() => {
    if (address) {
      setRecipientAddress(address);
    }
  }, [address]);

  // Determine spender for TokenAllowanceGuard
  const spenderAddressMap =
    receivingChain === NetworkId.SOLANA_DEVNET || receivingChain === NetworkId.SOLANA
      ? CCIP_BRIDGE_ADDRESSES
      : MINTER_ADDRESSES;

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const bridgeForm = (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <Box mb="21px">
            <SwapCollection
              UpperSwapCard={
                <SwapCard
                  id="from"
                  token={
                    BRIDGE_CHAINS[sendingChain as keyof typeof BRIDGE_CHAINS]?.token === "BASE" ? (
                      <Avatar src="/assets/images/base.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : BRIDGE_CHAINS[sendingChain as keyof typeof BRIDGE_CHAINS]?.token === "BERACHAIN" ? (
                      <Avatar src="/assets/images/berachain.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET ? (
                      <Avatar src="/assets/images/solana.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : (
                      <Token
                        name={BRIDGE_CHAINS[sendingChain as keyof typeof BRIDGE_CHAINS]?.token as OHMTokenProps["name"]}
                        sx={{ width: "21px", height: "21px" }}
                      />
                    )
                  }
                  tokenName={BRIDGE_CHAINS[sendingChain as keyof typeof BRIDGE_CHAINS]?.name}
                  tokenOnClick={() => setSendChainOpen(true)}
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
                    BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS]?.token === "BASE" ? (
                      <Avatar src="/assets/images/base.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS]?.token === "BERACHAIN" ? (
                      <Avatar src="/assets/images/berachain.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET ? (
                      <Avatar src="/assets/images/solana.svg" sx={{ width: "20px", height: "20px" }} />
                    ) : (
                      <Token
                        name={
                          BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS]?.token as OHMTokenProps["name"]
                        }
                        sx={{ width: "21px", height: "21px" }}
                      />
                    )
                  }
                  tokenName={BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS]?.name}
                  tokenOnClick={() => setRecChainOpen(true)}
                  value={amount}
                  inputProps={{ "data-testid": "toInput" }}
                />
              }
            />
          </Box>
          {isInvalid ? (
            <SwitchChainBtn />
          ) : sendingChain === NetworkId.SOLANA || sendingChain === NetworkId.SOLANA_DEVNET ? (
            <SolanaWalletConnectedGuard fullWidth>
              <PrimaryButton
                fullWidth
                disabled={
                  bridgeMutation.isLoading || !(Number(amount) > 0) || Number(amount) > Number(ohmBalance.toString())
                }
                onClick={handleOpenConfirm}
              >
                {bridgeMutation.isLoading ? "Bridging..." : Number(amount) > 0 ? "Bridge" : "Enter an amount to bridge"}
              </PrimaryButton>
            </SolanaWalletConnectedGuard>
          ) : (
            <WalletConnectedGuard fullWidth>
              <TokenAllowanceGuard
                isVertical
                tokenAddressMap={OHM_ADDRESSES}
                spenderAddressMap={spenderAddressMap}
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
                  onClick={handleOpenConfirm}
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
            {recipientAddress &&
              receivingChain !== NetworkId.SOLANA &&
              receivingChain !== NetworkId.SOLANA_DEVNET &&
              sendingChain !== NetworkId.SOLANA &&
              sendingChain !== NetworkId.SOLANA_DEVNET && (
                <BridgeFees amount={amount} receivingChain={receivingChain} recipientAddress={recipientAddress} />
              )}
          </Box>
        </Box>
      </Box>
      <>
        {confirmOpen && (
          <BridgeConfirmModal
            isOpen={confirmOpen}
            handleConfirmClose={() => setConfirmOpen(false)}
            amount={amount}
            amountExceedsBalance={false}
            bridgeMutation={bridgeMutation}
            destinationChainId={receivingChain}
            sourceChainId={sendingChain}
            recipientAddress={
              receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET ? "" : recipientAddress
            }
            handleSettingsOpen={() => setSettingsOpen(true)}
          />
        )}
        {settingsOpen && (
          <BridgeSettingsModal
            open={settingsOpen}
            handleClose={() => setSettingsOpen(false)}
            recipientAddress={recipientAddress}
            setRecipientAddress={setRecipientAddress}
          />
        )}
        <ChainPickerModal
          isOpen={recChainOpen}
          selectedChain={receivingChain}
          setSelectedChain={setReceivingChain}
          handleConfirmClose={() => setRecChainOpen(false)}
          variant="receive"
          baseChain={sendingChain}
        />
        <ChainPickerModal
          isOpen={sendChainOpen}
          selectedChain={sendingChain}
          setSelectedChain={setSendingChain}
          handleConfirmClose={() => setSendChainOpen(false)}
          variant="send"
          baseChain={sendingChain}
        />
      </>
    </Box>
  );

  return (
    <>
      {showSolanaWallet && connected && (
        <Box mb={2} display="flex" justifyContent="center">
          <WalletMultiButton />
        </Box>
      )}
      {bridgeForm}
    </>
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
          <PrimaryButton fullWidth onClick={openChainModal}>
            {chain.unsupported && <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />}
            {`Switch to a Bridgeable Chain`}
          </PrimaryButton>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};
