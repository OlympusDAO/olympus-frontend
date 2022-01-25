import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";
import { useWeb3Context } from "src/hooks/web3Context";
import { ACTION_GIVE_EDIT, ACTION_GIVE_WITHDRAW, changeGive, changeMockGive } from "../../slices/GiveThunk";
import { SubmitCallback, DonationInfoState, IButtonChangeView } from "src/views/Give/Interfaces";
import { WithdrawSubmitCallback, WithdrawCancelCallback } from "./WithdrawDepositModal";
import { shorten } from "src/helpers";
import { BigNumber } from "bignumber.js";
import { error } from "../../slices/MessagesSlice";
import data from "./projects.json";
import { Project } from "src/components/GiveProject/project.type";
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useLocation } from "react-router-dom";
import { EnvHelper } from "src/helpers/Environment";
import { NetworkId } from "src/constants";
import { DepositTableRow } from "./DepositRow";

type RecipientModalProps = {
  changeView: IButtonChangeView;
};

export default function YieldRecipients({ changeView }: RecipientModalProps) {
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
  const donationInfo = useSelector((state: DonationInfoState) => {
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

  const handleEditModalSubmit: SubmitCallback = async (
    walletAddress,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
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
          eventSource: eventSource,
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
          eventSource: eventSource,
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

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, eventSource, depositAmount) => {
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
          eventSource,
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
          eventSource,
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

  const getRecipientTitle = (recipient: string): string => {
    const project = projectMap.get(recipient);
    if (!project) return shorten(recipient);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (!donationInfo || donationInfo.length == 0) {
    return (
      <Box
        className="no-donations"
        style={{ border: "1px solid #999999", borderRadius: "10px", padding: "20px 40px 20px 40px" }}
      >
        <Typography variant="body1">
          <Trans>Looks like you haven’t made any donations yet</Trans>
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => changeView(0)}>
          <Typography variant="body1">
            <Trans>Donate to a cause</Trans>
          </Typography>
        </Button>
      </Box>
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
                  <Typography variant="body1">
                    <Trans>DATE</Trans>
                  </Typography>
                </TableCell>
              )}
              <TableCell align="left">
                <Typography variant="body1">
                  <Trans>RECIPIENT</Trans>
                </Typography>
              </TableCell>
              {!isSmallScreen && (
                <TableCell align="right">
                  <Typography variant="body1">
                    <Trans>DEPOSITED</Trans>
                  </Typography>
                </TableCell>
              )}
              <TableCell align="right">
                <Typography variant="body1">
                  <Trans>YIELD SENT</Trans>
                </Typography>
              </TableCell>
              <TableCell align="right" className="manage-cell"></TableCell>
            </TableRow>
          </TableHead>
          <Divider className="table-head-divider" />
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
    </Grid>
  );
}
