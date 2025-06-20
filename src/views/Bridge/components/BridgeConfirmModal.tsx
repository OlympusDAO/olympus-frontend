import { Box, FormControl, InputLabel, OutlinedInput, Typography } from "@mui/material";
import {
  Icon,
  InfoNotification,
  Modal,
  OHMTokenProps,
  PrimaryButton,
  Token,
  WarningNotification,
} from "@olympusdao/component-library";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { utils } from "ethers";
import { useState } from "react";
import { SolanaWalletConnectedGuard } from "src/components/SolanaWalletConnectedGuard";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BRIDGE_CHAINS, CCIP_BRIDGE_ADDRESSES, MINTER_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useEstimateSendFee } from "src/hooks/useBridging";
import { NetworkId } from "src/networkDetails";
import { BridgeFees } from "src/views/Bridge/components/BridgeFees";
import { useAccount, useBalance } from "wagmi";

export const BridgeConfirmModal = (props: {
  isOpen: boolean;
  handleConfirmClose: () => void;
  amountExceedsBalance: boolean;
  amount: string;
  bridgeMutation: any; // Accept any mutation type for now
  destinationChainId: number;
  sourceChainId: number;
  recipientAddress: string;
  handleSettingsOpen: () => void;
}) => {
  const { address } = useAccount();
  const { publicKey } = useWallet();

  const { data: nativeBalance } = useBalance({ address });

  const { data: fee } = useEstimateSendFee({
    destinationChainId: props.destinationChainId,
    recipientAddress: props.recipientAddress,
    amount: props.amount,
  });

  const isValidAddress = utils.isAddress(props.recipientAddress);
  const totalFees = (fee?.nativeFee || new DecimalBigNumber("0")).add(fee?.gasFee || new DecimalBigNumber("0"));

  const addressMatch = (props.recipientAddress ?? "").toLowerCase() === (address ?? "").toLowerCase();

  const [solanaRecipient, setSolanaRecipient] = useState("");
  const [solanaRecipientError, setSolanaRecipientError] = useState("");
  const [evmRecipient, setEvmRecipient] = useState("");
  const [evmRecipientError, setEvmRecipientError] = useState("");

  // Helper: basic Solana address validation
  function validateSolanaAddress(address: string) {
    try {
      const decoded = bs58.decode(address);
      if (decoded.length !== 32 && decoded.length !== 64) return false;
      return true;
    } catch {
      return false;
    }
  }

  // Helper: EVM address validation
  function validateEvmAddress(address: string) {
    return utils.isAddress(address);
  }

  const isSolanaSource = props.sourceChainId === NetworkId.SOLANA || props.sourceChainId === NetworkId.SOLANA_DEVNET;
  const isSolanaDestination =
    props.destinationChainId === NetworkId.SOLANA || props.destinationChainId === NetworkId.SOLANA_DEVNET;

  // Use the correct recipient address for the bridge action
  let recipientAddress = props.recipientAddress;
  let isValidSolanaAddress = true;
  let isValidEvmAddress = true;
  if (isSolanaDestination) {
    recipientAddress = solanaRecipient;
    isValidSolanaAddress = validateSolanaAddress(solanaRecipient);
  } else if (isSolanaSource) {
    recipientAddress = evmRecipient;
    isValidEvmAddress = validateEvmAddress(evmRecipient);
  }

  // Determine spender for TokenAllowanceGuard
  const spenderAddressMap =
    props.destinationChainId === NetworkId.SOLANA_DEVNET || props.destinationChainId === NetworkId.SOLANA
      ? CCIP_BRIDGE_ADDRESSES
      : MINTER_ADDRESSES;
  return (
    <Modal
      data-testid="bridge-confirmation-modal"
      maxWidth="476px"
      headerContent={
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <Icon name="bridge" />
          <Typography variant="body1" sx={{ fontSize: "15px", fontWeight: 500 }}>{`Confirm Bridging`}</Typography>
        </Box>
      }
      topLeft={
        !isSolanaDestination && !isSolanaSource ? (
          <Icon name="settings" style={{ cursor: "pointer" }} onClick={props.handleSettingsOpen} />
        ) : undefined
      }
      open={props.isOpen}
      onClose={props.handleConfirmClose}
      minHeight={"100px"}
    >
      <Box display="flex" flexDirection="column">
        {props.bridgeMutation.isLoading && (
          <InfoNotification>
            Please don't close this modal until all wallet transactions are confirmed.
          </InfoNotification>
        )}
        {!addressMatch && !isSolanaDestination && !isSolanaSource && (
          <WarningNotification>
            The address of the connected wallet and recipient address are different. Please confirm the recipient
            address. If this is not a valid recipient, your funds will be irrevocably lost.
          </WarningNotification>
        )}

        {isSolanaDestination && (
          <Box mb={2}>
            <InputLabel htmlFor="solana-recipient">Solana Recipient Address</InputLabel>
            <FormControl variant="outlined" color="primary" fullWidth error={!!solanaRecipientError}>
              <OutlinedInput
                id="solana-recipient"
                value={solanaRecipient}
                onChange={e => {
                  setSolanaRecipient(e.target.value);
                  setSolanaRecipientError("");
                }}
                onBlur={() => {
                  if (!validateSolanaAddress(solanaRecipient)) {
                    setSolanaRecipientError("Invalid Solana address");
                  }
                }}
                placeholder="Enter Solana address"
              />
            </FormControl>
            {solanaRecipientError && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {solanaRecipientError}
              </Typography>
            )}
          </Box>
        )}

        {isSolanaSource && !isSolanaDestination && (
          <Box mb={2}>
            <InputLabel htmlFor="evm-recipient">EVM Recipient Address</InputLabel>
            <FormControl variant="outlined" color="primary" fullWidth error={!!evmRecipientError}>
              <OutlinedInput
                id="evm-recipient"
                value={evmRecipient}
                onChange={e => {
                  setEvmRecipient(e.target.value);
                  setEvmRecipientError("");
                }}
                onBlur={() => {
                  if (!validateEvmAddress(evmRecipient)) {
                    setEvmRecipientError("Invalid EVM address");
                  }
                }}
                placeholder="Enter EVM address"
              />
            </FormControl>
            {evmRecipientError && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {evmRecipientError}
              </Typography>
            )}
          </Box>
        )}

        <Box id="bridge-metrics" display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
          <Box display="flex" flexDirection="column">
            <BridgeMetric
              amount={props.amount}
              chainId={props.sourceChainId}
              address={isSolanaSource && publicKey ? publicKey.toBase58() : (address as string)}
              fromTo="From"
            />
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <BridgeMetric
              amount={props.amount}
              chainId={props.destinationChainId}
              address={recipientAddress || ""}
              fromTo="To"
            />
          </Box>
        </Box>

        <Box id="bridge-fee" display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Box sx={{ marginTop: "1rem" }}>
            <hr style={{ borderWidth: "0.5px" }} />
          </Box>
          {!isSolanaSource && (
            <BridgeFees
              amount={props.amount}
              receivingChain={props.destinationChainId}
              recipientAddress={recipientAddress}
            />
          )}
        </Box>

        <Box id="bridge-button" sx={{ marginTop: "2rem" }}>
          {isSolanaSource ? (
            <SolanaWalletConnectedGuard fullWidth>
              <PrimaryButton
                data-testid="submit-modal-button"
                loading={props.bridgeMutation.isLoading}
                fullWidth
                disabled={
                  props.bridgeMutation.isLoading ||
                  !props.amount ||
                  props.amountExceedsBalance ||
                  parseFloat(props.amount) === 0 ||
                  (!isSolanaDestination && !isValidEvmAddress) ||
                  (isSolanaDestination && (!isValidSolanaAddress || !solanaRecipient))
                }
                onClick={() => {
                  props.bridgeMutation.mutate({ evmAddress: evmRecipient, amount: props.amount });
                }}
              >
                {props.amountExceedsBalance
                  ? "Amount exceeds balance"
                  : !props.amount || parseFloat(props.amount) === 0
                    ? "Enter an amount"
                    : (!isSolanaDestination && !isValidEvmAddress) ||
                        (isSolanaDestination && (!isValidSolanaAddress || !solanaRecipient))
                      ? `Invalid recipient address`
                      : props.bridgeMutation.isLoading
                        ? "Confirming Bridging in your wallet"
                        : `Bridge OHM to ${BRIDGE_CHAINS[props.destinationChainId as keyof typeof BRIDGE_CHAINS]
                            ?.name}`}
              </PrimaryButton>
            </SolanaWalletConnectedGuard>
          ) : (
            <WalletConnectedGuard fullWidth>
              <TokenAllowanceGuard
                tokenAddressMap={OHM_ADDRESSES}
                spenderAddressMap={spenderAddressMap}
                approvalText={`Approve OHM for Bridging`}
                message={
                  <>
                    First time bridging <b>OHM</b>? <br /> Please approve Olympus DAO to use your <b>OHM</b> for
                    bridging.
                  </>
                }
                spendAmount={!!props.amount ? new DecimalBigNumber(props.amount, 9) : undefined}
                isVertical={true}
              >
                <>
                  {nativeBalance?.value &&
                  new DecimalBigNumber(nativeBalance.value, 18).lt(totalFees || new DecimalBigNumber("0")) ? (
                    <PrimaryButton fullWidth disabled>
                      Insufficient Native Token Balance
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      data-testid="submit-modal-button"
                      loading={props.bridgeMutation.isLoading}
                      fullWidth
                      disabled={
                        props.bridgeMutation.isLoading ||
                        !props.amount ||
                        props.amountExceedsBalance ||
                        parseFloat(props.amount) === 0 ||
                        (!isSolanaDestination && !isValidEvmAddress) ||
                        (isSolanaDestination && (!isValidSolanaAddress || !solanaRecipient))
                      }
                      onClick={() => {
                        if (isSolanaDestination) {
                          props.bridgeMutation.mutate({ solanaAddress: solanaRecipient, amount: props.amount });
                        } else {
                          props.bridgeMutation.mutate({
                            destinationChainId: props.destinationChainId,
                            recipientAddress: evmRecipient,
                            amount: props.amount,
                          });
                        }
                      }}
                    >
                      {props.amountExceedsBalance
                        ? "Amount exceeds balance"
                        : !props.amount || parseFloat(props.amount) === 0
                          ? "Enter an amount"
                          : (!isSolanaDestination && !isValidEvmAddress) ||
                              (isSolanaDestination && (!isValidSolanaAddress || !solanaRecipient))
                            ? `Invalid recipient address`
                            : props.bridgeMutation.isLoading
                              ? "Confirming Bridging in your wallet"
                              : `Bridge OHM to ${BRIDGE_CHAINS[props.destinationChainId as keyof typeof BRIDGE_CHAINS]
                                  ?.name}`}
                    </PrimaryButton>
                  )}
                </>
              </TokenAllowanceGuard>
            </WalletConnectedGuard>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const BridgeMetric = ({
  amount,
  chainId,
  address,
  fromTo,
}: {
  amount: string;
  chainId: number;
  address: string;
  fromTo: "From" | "To";
}) => {
  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={1}>
        <Typography fontSize="18px" lineHeight="28px" color="textSecondary">
          {BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS]?.name}
        </Typography>
        <Token
          name={BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS]?.token as OHMTokenProps["name"]}
          sx={{ width: "28px", height: "28px" }}
        />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography fontSize="24px" fontWeight="700" lineHeight="33px">
          {new DecimalBigNumber(amount).toString({ decimals: 4, format: true, trim: true })}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography>{`OHM`}</Typography>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={1}>
        <Typography variant="caption">
          <strong>{`${fromTo}:`}</strong>
        </Typography>
        <Typography variant="caption">{shorten(address)}</Typography>
      </Box>
    </>
  );
};
