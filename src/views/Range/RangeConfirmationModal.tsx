import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import { Icon, InfoNotification, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useIsMutating } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { OHM_ADDRESSES, RANGE_OPERATOR_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";
import { BondSettingsModal } from "src/views/Bond/components/BondModal/components/BondSettingsModal";
import { BondTellerAddress, RangeSwap } from "src/views/Range/hooks";
import { useAccount, useNetwork } from "wagmi";

/**
 * Component for Displaying RangeModal
 */
const RangeConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  sellActive: boolean;
  ohmAmount: string;
  reserveAmount: string;
  swapPrice: string;
  discount: number;
  reserveSymbol: string;
  reserveAddress: string;
  contract: "swap" | "bond";
  market: BigNumber;
}) => {
  const isMutating = useIsMutating();
  const theme = useTheme();
  const rangeSwap = RangeSwap();
  const { data: tellerAddress = "" } = BondTellerAddress(props.market);
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [checked, setChecked] = useState(false);
  if (rangeSwap.isSuccess) {
    rangeSwap.reset();
    props.onClose();
  }

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  return (
    <Modal
      maxWidth="476px"
      topLeft={
        <Icon
          name="settings"
          sx={{ cursor: "pointer" }}
          data-testid="transaction-settings"
          onClick={() => setSettingsOpen(true)}
        />
      }
      headerContent={
        <Box display="flex" flexDirection="row">
          <Typography variant="h5">Confirm Swap</Typography>
        </Box>
      }
      open={props.open}
      onClose={props.onClose}
      minHeight={"100px"}
    >
      <Box display="flex" flexDirection="column">
        <BondSettingsModal
          slippage={slippage}
          open={isSettingsOpen}
          recipientAddress={recipientAddress}
          handleClose={() => setSettingsOpen(false)}
          onRecipientAddressChange={event => setRecipientAddress(event.currentTarget.value)}
          onSlippageChange={event => setSlippage(event.currentTarget.value)}
        />
        {isMutating > 0 && (
          <InfoNotification>
            Please don't close this modal until all wallet transactions are confirmed.
          </InfoNotification>
        )}

        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
          <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Price of OHM</Typography>
          <Box display="flex" flexDirection="column" textAlign="right">
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>{props.swapPrice} DAI</Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
          <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>You Receive</Typography>
          <Box display="flex" flexDirection="column" textAlign="right">
            <Typography>
              {props.sellActive
                ? `${formatNumber(Number(props.reserveAmount), 2)} ${props.reserveSymbol}`
                : `${formatNumber(Number(props.ohmAmount), 2)} OHM`}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
          <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>You spend</Typography>
          <Box display="flex" flexDirection="column" textAlign="right">
            <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
              {props.sellActive
                ? `${formatNumber(Number(props.ohmAmount), 2)} OHM`
                : `${formatNumber(Number(props.reserveAmount), 2)} ${props.reserveSymbol}`}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
          <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>
            {props.sellActive ? `Premium` : `Discount`}
          </Typography>
          <Box display="flex" flexDirection="column" textAlign="right">
            <Typography
              sx={{ color: props.discount > 0 ? theme.colors.feedback.pnlGain : theme.colors.feedback.error }}
            >
              {formatNumber(props.discount * 100, 2)}%
            </Typography>
          </Box>
        </Box>
        <TokenAllowanceGuard
          isVertical
          message={
            <>
              First time swapping{" "}
              <strong>
                {props.sellActive ? "OHM" : props.reserveSymbol} with
                {props.contract === "bond" ? " the Bond Teller" : " the Range Operator"}
              </strong>
              ?
              <br />
              Please approve Olympus DAO to use your <strong>{props.sellActive ? "OHM" : props.reserveSymbol} </strong>
              for swapping.
            </>
          }
          tokenAddressMap={props.sellActive ? OHM_ADDRESSES : { [chain.id]: props.reserveAddress }}
          spenderAddressMap={props.contract === "bond" ? { [chain.id]: tellerAddress } : RANGE_OPERATOR_ADDRESSES}
          approvalText={`Approve ${props.sellActive ? "OHM" : props.reserveSymbol} for Swap`}
        >
          {props.discount < 0 && (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={event => setChecked(event.target.checked)}
                    icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                    checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
                    data-testid="disclaimer-checkbox"
                  />
                }
                label={
                  props.sellActive
                    ? `I understand that I am selling at a discount to current market price`
                    : `I understand that I am buying at a premium to current market price`
                }
                data-testid="disclaimer"
              />
            </div>
          )}

          <PrimaryButton
            data-testid="range-confirm-submit"
            fullWidth
            onClick={() =>
              rangeSwap.mutate({
                market: props.market,
                tokenAddress: props.sellActive
                  ? OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES]
                  : props.reserveAddress,
                amount: props.sellActive ? props.ohmAmount : props.reserveAmount,
                swapType: props.contract,
                receiveAmount: props.sellActive ? props.reserveAmount : props.ohmAmount,
                sellActive: props.sellActive,
                slippage: slippage,
                recipientAddress: recipientAddress,
              })
            }
            loading={rangeSwap.isLoading}
            disabled={(props.discount < 0 && !checked) || rangeSwap.isLoading}
          >
            {rangeSwap.isLoading ? "Pending..." : "Confirm Swap"}
          </PrimaryButton>
        </TokenAllowanceGuard>
      </Box>
    </Modal>
  );
};

export default RangeConfirmationModal;
