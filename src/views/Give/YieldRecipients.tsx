import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Typography,
  Button,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

import { Skeleton } from "@material-ui/lab";
import { useWeb3Context } from "src/hooks/web3Context";
import { ACTION_GIVE_EDIT, ACTION_GIVE_WITHDRAW, changeGive, changeMockGive } from "../../slices/GiveThunk";
import { InfoTooltip } from "@olympusdao/component-library";
import { RecipientModal } from "src/views/Give/RecipientModal";
import { SubmitCallback } from "src/views/Give/Interfaces";
import { WithdrawDepositModal, WithdrawSubmitCallback, WithdrawCancelCallback } from "./WithdrawDepositModal";
import { shorten } from "src/helpers";
import { BigNumber } from "bignumber.js";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { error } from "../../slices/MessagesSlice";
import data from "./projects.json";
import { Project } from "src/components/GiveProject/project.type";
import { useAppSelector } from "src/hooks";
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useLocation } from "react-router-dom";
import { EnvHelper } from "src/helpers/Environment";
import { NetworkId } from "src/constants";
import { DepositTableRow } from "./DepositRow";

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

  if (!donationInfo || donationInfo.length == 0) {
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
    <Grid container item className="card-content">
      <TableContainer>
        <Table className="donation-table">
          <TableHead>
            <TableRow>
              {!isSmallScreen && (
                <TableCell align="left">
                  <Trans>DATE</Trans>
                </TableCell>
              )}
              <TableCell align="left">
                <Trans>RECIPIENT</Trans>
              </TableCell>
              {!isSmallScreen && (
                <TableCell align="left">
                  <Trans>DEPOSITED</Trans>
                </TableCell>
              )}
              <TableCell align="left">
                <Trans>YIELD SENT</Trans>
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <Skeleton />
            ) : (
              donationInfo.map(donation => {
                return <DepositTableRow depositObject={donation} key={donation.recipient} />;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isLoading ? (
        <Skeleton />
      ) : (
        donationInfo.map(donation => {
          return (
            donation.recipient === selectedRecipientForEdit && (
              <RecipientModal
                isModalOpen={isEditModalOpen}
                callbackFunc={handleEditModalSubmit}
                cancelFunc={handleEditModalCancel}
                currentWalletAddress={donation.recipient}
                currentDepositAmount={new BigNumber(donation.deposit)}
                project={projectMap.get(donation.recipient)}
                key={"edit-modal-" + donation.recipient}
              />
            )
          );
        })
      )}

      {isLoading ? (
        <Skeleton />
      ) : (
        donationInfo.map(donation => {
          return (
            donation.recipient === selectedRecipientForWithdraw && (
              <WithdrawDepositModal
                isModalOpen={isWithdrawModalOpen}
                callbackFunc={handleWithdrawModalSubmit}
                cancelFunc={handleWithdrawModalCancel}
                walletAddress={donation.recipient}
                depositAmount={new BigNumber(donation.deposit)}
                project={projectMap.get(donation.recipient)}
                key={"withdraw-modal-" + donation.recipient}
              />
            )
          );
        })
      )}
    </Grid>
  );
}
