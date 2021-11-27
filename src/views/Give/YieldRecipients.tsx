import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Typography,
  Button,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Grid,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

import { Skeleton } from "@material-ui/lab";
import { useWeb3Context } from "src/hooks/web3Context";
import { changeGive } from "../../slices/GiveThunk";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import { RecipientModal, SubmitCallback } from "./RecipientModal";
import { WithdrawDepositModal, WithdrawSubmitCallback, WithdrawCancelCallback } from "./WithdrawDepositModal";
import { shorten } from "src/helpers";
import { BigNumber } from "bignumber.js";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { error } from "../../slices/MessagesSlice";

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function YieldRecipients() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const [selectedRecipientForEdit, setSelectedRecipientForEdit] = useState("");
  const [selectedRecipientForWithdraw, setSelectedRecipientForWithdraw] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // TODO fix typing of state.app.loading
  const isAppLoading = useSelector((state: any) => state.app.loading);
  const donationInfo = useSelector((state: State) => {
    return state.account.giving && state.account.giving.donationInfo;
  });

  const isDonationInfoLoading = donationInfo == undefined;

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      //   loadLusdData();
    }
  }, [walletChecked]);

  // *** Edit modal
  const handleEditButtonClick = (walletAddress: string) => {
    setSelectedRecipientForEdit(walletAddress);
    setIsEditModalOpen(true);
  };

  const handleEditModalSubmit: SubmitCallback = async (walletAddress, depositAmount, depositAmountDiff) => {
    if (!depositAmountDiff) {
      return dispatch(error("Please enter a value!"));
    }

    if (depositAmountDiff.isEqualTo(new BigNumber(0))) return;

    // Record segment user event

    // If reducing the amount of deposit, withdraw
    await dispatch(
      changeGive({
        action: "editGive",
        value: depositAmountDiff.toString(),
        recipient: walletAddress,
        provider,
        address,
        networkID: chainID,
      }),
    );

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
    // Record Segment user event

    // Issue withdrawal from smart contract
    await dispatch(
      changeGive({
        action: "endGive",
        value: depositAmount.toString(),
        recipient: walletAddress,
        provider,
        address,
        networkID: chainID,
      }),
    );

    setIsWithdrawModalOpen(false);
  };

  const handleWithdrawModalCancel: WithdrawCancelCallback = () => {
    setIsWithdrawModalOpen(false);
  };

  if (Object.keys(donationInfo).length == 0) {
    return (
      <>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h5">It looks like you haven't donated any yield. Let's fix that!</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button component={NavLink} to="/give" variant="contained" color="primary">
              Give Yield
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <div className="card-content">
      <TableContainer className="stake-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient</TableCell>
              <TableCell align="left">
                Deposit
                <InfoTooltip message="The amount of sOHM deposited" children={null} />
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>

          {isDonationInfoLoading ? (
            <Skeleton />
          ) : (
            Object.keys(donationInfo).map(recipient => {
              return isAppLoading ? (
                <Skeleton />
              ) : (
                <TableRow key={recipient}>
                  <TableCell>{shorten(recipient)}</TableCell>
                  <TableCell>{donationInfo[recipient]}</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="right" width="10%" padding="none">
                    {" "}
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="stake-lp-button"
                      onClick={() => handleEditButtonClick(recipient)}
                      disabled={!address}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right" width="10%" padding="none">
                    {" "}
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="stake-lp-button"
                      onClick={() => handleWithdrawButtonClick(recipient)}
                      disabled={!address}
                    >
                      Withdraw
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Table>
      </TableContainer>

      {isDonationInfoLoading ? (
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
                currentDepositAmount={donationInfo[recipient]}
                key={recipient}
              />
            )
          );
        })
      )}

      {isDonationInfoLoading ? (
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
                depositAmount={donationInfo[recipient]}
                key={recipient}
              />
            )
          );
        })
      )}
    </div>
  );
}
