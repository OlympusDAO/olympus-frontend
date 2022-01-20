import { t, Trans } from "@lingui/macro";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Project } from "src/components/GiveProject/project.type";
import { NetworkId } from "src/constants";
import { shorten } from "src/helpers";
import { EnvHelper } from "src/helpers/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { ACTION_GIVE_EDIT, ACTION_GIVE_WITHDRAW, changeGive, changeMockGive } from "../../slices/GiveThunk";
import { error } from "../../slices/MessagesSlice";
import data from "./projects.json";
import { WithdrawCancelCallback, WithdrawDepositModal, WithdrawSubmitCallback } from "./WithdrawDepositModal";

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function YieldRecipients() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const [selectedRecipientForEdit, setSelectedRecipientForEdit] = useState("");
  const [selectedRecipientForWithdraw, setSelectedRecipientForWithdraw] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // TODO fix typing of state.app.loading
  const isAppLoading = useSelector((state: any) => state.app.loading);
  const donationInfo = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const isDonationInfoLoading = useSelector((state: any) => state.account.loading);
  const isLoading = isAppLoading || isDonationInfoLoading;

  // *** Edit modal
  const handleEditButtonClick = (walletAddress: string) => {
    setSelectedRecipientForEdit(walletAddress);
    setIsEditModalOpen(true);
  };

  const handleEditModalSubmit: SubmitCallback = async (walletAddress, depositAmount, depositAmountDiff) => {
    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.isEqualTo(new BigNumber(0))) return;

    // If reducing the amount of deposit, withdraw
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toFixed(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
        }),
      );
    } else {
      await dispatch(
        changeGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toFixed(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
        }),
      );
    }

    setIsEditModalOpen(false);
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
  };

  // *** Withdraw modal
  const handleWithdrawButtonClick = (walletAddress: string) => {
    setSelectedRecipientForWithdraw(walletAddress);
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, depositAmount) => {
    // Issue withdrawal from smart contract
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toFixed(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
        }),
      );
    } else {
      await dispatch(
        changeGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toFixed(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
        }),
      );
    }

    setIsWithdrawModalOpen(false);
  };

  const handleWithdrawModalCancel: WithdrawCancelCallback = () => {
    setIsWithdrawModalOpen(false);
  };

  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return shorten(address);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (!donationInfo || Object.keys(donationInfo).length == 0) {
    return (
      <>
        <Grid container className="yield-recipients-empty">
          <Grid item sm={10} md={8}>
            <Typography variant="h6">
              <Trans>It looks like you haven't donated any yield. Let's fix that!</Trans>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button component={NavLink} to="/give" variant="contained" color="primary">
              <Trans>Donate Yield</Trans>
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <div className="card-content">
      <Grid container className={`donation-table ${isSmallScreen && "smaller"}`}>
        <Grid item xs={12} sm={6} style={{ width: "100%", display: "flex", marginBottom: "1rem" }}>
          <Typography variant="h6">
            <Trans>Recipient</Trans>
          </Typography>
          <Typography variant="h6">
            <Trans>Deposit</Trans>
            <InfoTooltip message={t`The amount of sOHM deposited`} children={null} />
          </Typography>
        </Grid>
        {isLoading ? (
          <Skeleton />
        ) : (
          Object.keys(donationInfo).map(recipient => {
            return (
              <Grid container className="donation-row">
                <Grid item xs={12} sm={6} className="donation-info" style={{ display: "flex" }}>
                  <Typography variant="body1" align="left">
                    {getRecipientTitle(recipient)}
                  </Typography>
                  <Typography variant="body1" align="left">
                    {donationInfo[recipient]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} className="donation-buttons">
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="donation-lp-button"
                    onClick={() => handleEditButtonClick(recipient)}
                    disabled={!address}
                    key={"edit-" + recipient}
                  >
                    <Trans>Edit</Trans>
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="donation-lp-button"
                    onClick={() => handleWithdrawButtonClick(recipient)}
                    disabled={!address}
                    key={"withdraw-" + recipient}
                  >
                    <Trans>Withdraw</Trans>
                  </Button>
                </Grid>
                <Grid item xs={12} className="recipient-divider">
                  <Divider />
                </Grid>
              </Grid>
            );
          })
        )}
      </Grid>

      {isLoading ? (
        <Skeleton />
      ) : (
        Object.keys(donationInfo).map(recipient => {
          return (
            recipient === selectedRecipientForEdit && (
              <RecipientModal
                isModalOpen={isEditModalOpen}
                callbackFunc={handleEditModalSubmit}
                cancelFunc={handleEditModalCancel}
                currentWalletAddress={recipient}
                currentDepositAmount={new BigNumber(donationInfo[recipient])}
                project={projectMap.get(recipient)}
                key={"edit-modal-" + recipient}
              />
            )
          );
        })
      )}

      {isLoading ? (
        <Skeleton />
      ) : (
        Object.keys(donationInfo).map(recipient => {
          return (
            recipient === selectedRecipientForWithdraw && (
              <WithdrawDepositModal
                isModalOpen={isWithdrawModalOpen}
                callbackFunc={handleWithdrawModalSubmit}
                cancelFunc={handleWithdrawModalCancel}
                walletAddress={recipient}
                depositAmount={new BigNumber(donationInfo[recipient])}
                project={projectMap.get(recipient)}
                key={"withdraw-modal-" + recipient}
              />
            )
          );
        })
      )}
    </div>
  );
}
