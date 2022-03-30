import { t, Trans } from "@lingui/macro";
import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks/web3Context";

import { ArrowGraphic } from "../../components/EducationCard";
import { txnButtonText } from "../../slices/PendingTxnsSlice";
import { isPendingTxn } from "../../slices/PendingTxnsSlice";
import { DonationInfoState } from "./Interfaces";

export interface RedeemSubmitCallback {
  (): void;
}

export interface RedeemCancelCallback {
  (): void;
}

type RedeemModalProps = {
  isModalOpen: boolean;
  callbackFunc: RedeemSubmitCallback;
  cancelFunc: RedeemCancelCallback;
  deposit: BigNumber;
  redeemableBalance: BigNumber;
};

export function RedeemYieldModal({ isModalOpen, callbackFunc, cancelFunc, redeemableBalance }: RedeemModalProps) {
  const { address } = useWeb3Context();
  const pendingTransactions = useSelector((state: DonationInfoState) => {
    return state.pendingTransactions;
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const canSubmit = () => {
    if (!address) return false;
    if (isPendingTxn(pendingTransactions, "redeeming")) return false;

    return true;
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    callbackFunc();
  };

  return (
    <Modal open={isModalOpen} onClose={cancelFunc} headerText={t`Redeem Yield`} closePosition="left" minHeight="200px">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" className="modal-confirmation-title">
                  <Trans>Redeemable Yield</Trans>
                </Typography>
                <Typography variant="h6">{redeemableBalance.toFixed(2)} sOHM</Typography>
              </Grid>
              {!isSmallScreen ? (
                <Grid item sm={4}>
                  <ArrowGraphic />
                </Grid>
              ) : (
                <></>
              )}
              <Grid item xs={12} sm={4}>
                {/* On small screens, the current and new sOHM deposit numbers are stacked and left-aligned,
                    whereas on larger screens, the numbers are on opposing sides of the box. This adjusts the
                    alignment accordingly. */}
                <Grid container direction="column" alignItems={isSmallScreen ? "flex-start" : "flex-end"}>
                  <Grid item xs={12}>
                    <Typography variant="body1" className="modal-confirmation-title">
                      <Trans>My Wallet Address</Trans>
                    </Typography>
                    <Typography variant="h6">{shorten(address)}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs />
            <Grid item xs={12} md={6}>
              <PrimaryButton disabled={!canSubmit()} onClick={() => handleSubmit()} fullWidth>
                {txnButtonText(pendingTransactions, "redeeming", t`Confirm ${redeemableBalance.toFixed(2)} sOHM`)}
              </PrimaryButton>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
}
