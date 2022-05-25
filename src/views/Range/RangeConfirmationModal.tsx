import { t, Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "@mui/material";
import { Icon, InfoNotification, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useIsMutating } from "react-query";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { BOND_DEPOSITORY_ADDRESSES, DAI_ADDRESSES } from "src/constants/addresses";
import { formatNumber } from "src/helpers";

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
}) => {
  const isMutating = useIsMutating();
  const theme = useTheme();
  return (
    <Modal
      topLeft={<Icon name="settings" />}
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
                ? `${formatNumber(Number(props.reserveAmount), 2)} DAI`
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
                : `${formatNumber(Number(props.reserveAmount), 2)} DAI`}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={"9px"}>
          <Typography sx={{ fontSize: "15px", lineHeight: "21px" }}>Discount</Typography>
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
              <Trans>First time swapping</Trans> <strong>DAI</strong>? <br />
              <Trans>Please approve Olympus DAO to use your</Trans> <strong>DAI</strong> <Trans>for swapping</Trans>.
            </>
          }
          tokenAddressMap={DAI_ADDRESSES}
          spenderAddressMap={BOND_DEPOSITORY_ADDRESSES}
          approvalText={t`Approve DAI for Swap`}
        >
          <PrimaryButton fullWidth>Confirm Swap</PrimaryButton>
        </TokenAllowanceGuard>
      </Box>
    </Modal>
  );
};

export default RangeConfirmationModal;
