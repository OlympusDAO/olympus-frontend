import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Typography,
  Button,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
} from "@material-ui/core";

import { useWeb3Context } from "src/hooks/web3Context";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import { RecipientModal } from "./RecipientModal";
import { WithdrawDepositModal } from "./WithdrawDepositModal";

export default function YieldRecipients() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const [selectedRecipientForEdit, setSelectedRecipientForEdit] = useState(null);
  const [selectedRecipientForWithdraw, setSelectedRecipientForWithdraw] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

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

  // TODO add fetching of yield directions
  const recipients = [
    {
      walletAddress: "0x1",
      depositAmount: 1.0,
    },
    {
      walletAddress: "0x2",
      depositAmount: 2.0,
    },
  ];

  // *** Edit modal
  const handleEditButtonClick = walletAddress => {
    setSelectedRecipientForEdit(walletAddress);
    setIsEditModalOpen(true);
  };

  // TODO implement recipient edit
  const handleEditModalSubmit = (walletAddress, depositAmount, depositAmountDiff) => {
    if (depositAmountDiff == 0.0) return;

    // Record segment user event

    // If reducing the amount of deposit, withdraw
    if (depositAmountDiff < 0) {
    }
    // If increasing the amount of deposit, deposit
    else if (depositAmountDiff > 0) {
    }

    // Refresh recipients list

    setIsEditModalOpen(false);
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
  };

  // *** Withdraw model
  const handleWithdrawButtonClick = walletAddress => {
    setSelectedRecipientForWithdraw(walletAddress);
    setIsWithdrawModalOpen(true);
  };

  // TODO implement withdrawal
  const handleWithdrawModalSubmit = (walletAddress, depositAmount) => {
    // Record Segment user event

    // Issue withdrawal from smart contract

    // Refresh recipients list

    setIsWithdrawModalOpen(false);
  };

  const handleWithdrawModalCancel = () => {
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="card-content">
      <TableContainer className="stake-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient</TableCell>
              <TableCell align="left">
                Deposit
                <InfoTooltip message="The amount of sOHM deposited" />
              </TableCell>
              <TableCell align="left">
                Yield
                <InfoTooltip message="The amount of yield (in sOHM) directed to the recipient" />
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {recipients.map(item => {
              return (
                <TableRow key={item.walletAddress}>
                  <TableCell>{item.walletAddress}</TableCell>
                  <TableCell align="left">{item.depositAmount}</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="right" width="10%" padding="none">
                    {" "}
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="stake-lp-button"
                      onClick={() => handleEditButtonClick(item.walletAddress)}
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
                      onClick={() => handleWithdrawButtonClick(item.walletAddress)}
                      disabled={!address}
                    >
                      Withdraw
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {recipients.map(item => {
        return (
          item.walletAddress === selectedRecipientForEdit && (
            <RecipientModal
              isModalOpen={isEditModalOpen}
              callbackFunc={handleEditModalSubmit}
              cancelFunc={handleEditModalCancel}
              currentWalletAddress={item.walletAddress}
              currentDepositAmount={item.depositAmount}
              key={item.walletAddress}
            />
          )
        );
      })}

      {recipients.map(item => {
        return (
          item.walletAddress === selectedRecipientForWithdraw && (
            <WithdrawDepositModal
              isModalOpen={isWithdrawModalOpen}
              callbackFunc={handleWithdrawModalSubmit}
              cancelFunc={handleWithdrawModalCancel}
              walletAddress={item.walletAddress}
              depositAmount={item.depositAmount}
              key={item.walletAddress}
            />
          )
        );
      })}
    </div>
  );
}
