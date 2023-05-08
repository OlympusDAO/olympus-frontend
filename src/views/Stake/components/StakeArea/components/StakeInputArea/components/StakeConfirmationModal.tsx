import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Icon, InfoNotification, Metric, Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { AddressMap } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useWarmupPeriod } from "src/hooks/useWarmupInfo";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";

/**
 * Component for Displaying RangeModal
 */
const StakeConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  contractRouting: "Stake" | "Wrap" | "Zap";
  addresses: any;
  chain: { id: number };
  swapAssetType: ModalHandleSelectProps;
  stakedAssetType: ModalHandleSelectProps;
  contractAddress: AddressMap;
  currentAction: string;
  amount: string;
  receiveAmount: string;
  amountExceedsBalance: boolean;
  zapOutputAmount: string;
  zapSlippageAmount: string;
  zapMinAmount: string;
  stakeMutation: any;
  unstakeMutation: any;
  isMutating: boolean;
  onZap: any;
  wrapMutation: any;
  zapExecuteIsLoading: boolean;
  humanReadableRouting: "Stake" | "Wrap" | "Zap" | "Unstake" | "Unwrap" | "Zap out";
}) => {
  const { data: warmupLength } = useWarmupPeriod();
  const needsWarmup = warmupLength?.gt("0") || false;
  // acknowledge warmup
  const [acknowledgedWarmup, setAcknowledgedWarmup] = useState(false);

  useEffect(() => {
    if (!needsWarmup) setAcknowledgedWarmup(true);
  }, [needsWarmup]);

  /** only appears if action is STAKE */
  const AcknowledgeWarmupCheckbox = () => {
    if (!needsWarmup) return <></>;
    return (
      <>
        {props.currentAction === "STAKE" && (
          <>
            <Box sx={{ marginBottom: "1rem" }}>
              <hr style={{ borderWidth: "0.5px" }} />

              <FormControlLabel
                control={
                  <Checkbox
                    data-testid="acknowledge-warmup"
                    checked={acknowledgedWarmup}
                    onChange={event => setAcknowledgedWarmup(event.target.checked)}
                    icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                    checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
                  />
                }
                label={`I understand the OHM I’m staking will only be available to claim 2 epochs after my transaction is confirmed`}
              />
            </Box>
          </>
        )}
      </>
    );
  };

  const NeedsWarmupDetails = () => {
    if (needsWarmup) {
      return (
        <>
          <AcknowledgeWarmupCheckbox />
          <SecondaryButton
            fullWidth
            href="https://docs.olympusdao.finance/main/overview/staking#staking-warm-up-period"
          >
            Why is there a warmup?
          </SecondaryButton>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Modal
      data-testid="stake-confirmation-modal"
      maxWidth="476px"
      topLeft={<></>}
      headerContent={
        <Box display="flex" flexDirection="row">
          <Typography variant="h5">{`Confirm ${props.humanReadableRouting}`}</Typography>
        </Box>
      }
      open={props.open}
      onClose={props.onClose}
      minHeight={"100px"}
    >
      <Box display="flex" flexDirection="column">
        {props.isMutating ||
          (props.zapExecuteIsLoading && (
            <InfoNotification>
              Please don't close this modal until all wallet transactions are confirmed.
            </InfoNotification>
          ))}

        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Metric
              label={`Assets to ${props.humanReadableRouting}`}
              metric={new DecimalBigNumber(props.amount).toString({ decimals: 4, format: true, trim: true })}
            />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>
                {props.currentAction === "STAKE" ? props.swapAssetType.name : props.stakedAssetType.name}
              </Typography>
            </Box>
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <Metric
              label="Assets to Receive"
              metric={new DecimalBigNumber(props.receiveAmount).toString({ decimals: 4, format: true, trim: true })}
            />
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Typography>
                {props.currentAction === "STAKE" ? props.stakedAssetType.name : props.swapAssetType.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <WalletConnectedGuard fullWidth>
            <TokenAllowanceGuard
              tokenAddressMap={
                props.contractRouting === "Stake" || props.contractRouting === "Wrap"
                  ? props.addresses
                  : { [props.chain.id]: props.swapAssetType.address }
              }
              spenderAddressMap={props.contractAddress}
              approvalText={
                props.currentAction === "STAKE"
                  ? props.contractRouting === "Stake" || props.contractRouting === "Wrap"
                    ? "Approve Staking"
                    : `Approve Zap from ${props.swapAssetType.name}`
                  : "Approve Unstaking"
              }
              approvalPendingText={"Confirming Approval in your wallet"}
              isVertical
            >
              {props.contractRouting === "Stake" && (
                <>
                  <NeedsWarmupDetails />
                  <PrimaryButton
                    data-testid="submit-modal-button"
                    loading={props.isMutating}
                    fullWidth
                    disabled={
                      props.isMutating ||
                      !props.amount ||
                      props.amountExceedsBalance ||
                      parseFloat(props.amount) === 0 ||
                      (props.currentAction === "STAKE" && !acknowledgedWarmup)
                    }
                    onClick={() =>
                      props.currentAction === "STAKE"
                        ? props.stakeMutation.mutate({ amount: props.amount, toToken: props.stakedAssetType.name })
                        : props.unstakeMutation.mutate(props.amount)
                    }
                  >
                    {props.amountExceedsBalance
                      ? "Amount exceeds balance"
                      : !props.amount || parseFloat(props.amount) === 0
                      ? "Enter an amount"
                      : props.currentAction === "STAKE"
                      ? props.isMutating
                        ? "Confirming Staking in your wallet"
                        : "Stake"
                      : props.isMutating
                      ? "Confirming Unstaking in your wallet "
                      : "Unstake"}
                  </PrimaryButton>
                </>
              )}

              {props.contractRouting === "Wrap" && (
                <PrimaryButton
                  data-testid="submit-modal-button"
                  loading={props.isMutating}
                  fullWidth
                  disabled={
                    props.isMutating || !props.amount || props.amountExceedsBalance || parseFloat(props.amount) === 0
                  }
                  onClick={() => props.currentAction === "STAKE" && props.wrapMutation.mutate(props.amount)}
                >
                  {props.amountExceedsBalance
                    ? "Amount exceeds balance"
                    : !props.amount || parseFloat(props.amount) === 0
                    ? "Enter an amount"
                    : props.currentAction === "STAKE"
                    ? props.isMutating
                      ? "Confirming Wrapping in your wallet"
                      : "Wrap to gOHM"
                    : props.isMutating
                    ? "Confirming Unstaking in your wallet "
                    : "Unstake"}
                </PrimaryButton>
              )}
              {props.contractRouting === "Zap" && (
                <>
                  <NeedsWarmupDetails />
                  <PrimaryButton
                    data-testid="submit-modal-button"
                    fullWidth
                    disabled={
                      props.zapExecuteIsLoading ||
                      props.zapOutputAmount === "" ||
                      (+props.zapOutputAmount < 0.5 && props.stakedAssetType.name !== "gOHM") ||
                      import.meta.env.VITE_DISABLE_ZAPS ||
                      parseFloat(props.amount) === 0 ||
                      (props.currentAction === "STAKE" && !acknowledgedWarmup)
                    }
                    onClick={props.onZap}
                  >
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {props.zapOutputAmount === ""
                        ? "Enter an amount"
                        : +props.zapOutputAmount >= 0.5 || props.stakedAssetType.name == "gOHM"
                        ? "Zap-Stake"
                        : "Minimum Output Amount: 0.5 sOHM"}
                    </Box>
                  </PrimaryButton>
                </>
              )}
            </TokenAllowanceGuard>
          </WalletConnectedGuard>
        </Box>
      </Box>
    </Modal>
  );
};

export default StakeConfirmationModal;
