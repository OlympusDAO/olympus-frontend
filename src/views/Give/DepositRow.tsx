import "./Give.scss";

import { t } from "@lingui/macro";
import { Box, Button, Divider, TableCell, TableRow, Tooltip, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BigNumber } from "bignumber.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import { SubmitCallback } from "src/views/Give/Interfaces";

import { Project } from "../../components/GiveProject/project.type";
import { ACTION_GIVE_EDIT, ACTION_GIVE_WITHDRAW, changeGive, changeMockGive } from "../../slices/GiveThunk";
import { error } from "../../slices/MessagesSlice";
import { ManageDonationModal, WithdrawSubmitCallback } from "./ManageDonationModal";
import data from "./projects.json";

interface IUserDonationInfo {
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

interface DepositRowProps {
  depositObject: IUserDonationInfo;
}

export const DepositTableRow = ({ depositObject }: DepositRowProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 980px)") && !isSmallScreen;

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return isMediumScreen || isSmallScreen ? "Custom" : "Custom Recipient";

    if (!project.owner) return isSmallScreen ? project.title.substring(0, 9) + "..." : project.title;

    return project.owner + " - " + project.title;
  };

  const handleManageModalCancel = () => {
    setIsManageModalOpen(false);
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

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
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
          eventSource,
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
          eventSource,
        }),
      );
    }

    setIsManageModalOpen(false);
  };

  // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
  // Else use standard call
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

    setIsManageModalOpen(false);
  };

  return (
    <Box>
      <TableRow>
        {!isSmallScreen && (
          <TableCell align="left" className="deposit-date-cell">
            <Typography variant="h6">{depositObject.date}</Typography>
          </TableCell>
        )}
        <TableCell align="left" className="deposit-recipient-cell">
          <Tooltip title={depositObject.recipient} arrow>
            <Typography variant={isSmallScreen ? "body1" : "h6"}>
              {getRecipientTitle(depositObject.recipient)}
            </Typography>
          </Tooltip>
        </TableCell>
        {!isSmallScreen && (
          <TableCell align="right" className="deposit-deposited-cell">
            <Typography variant="h6">{parseFloat(depositObject.deposit).toFixed(2)} sOHM</Typography>
          </TableCell>
        )}
        <TableCell align="right" className="deposit-yield-cell">
          <Typography variant={isSmallScreen ? "body1" : "h6"}>
            {parseFloat(depositObject.yieldDonated).toFixed(2)} sOHM
          </Typography>
        </TableCell>
        <TableCell align="right" className="deposit-manage-cell">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsManageModalOpen(true)}
            style={{ width: "100%" }}
          >
            <Typography variant="h6">Manage</Typography>
          </Button>
        </TableCell>
      </TableRow>
      <Divider />

      <ManageDonationModal
        isModalOpen={isManageModalOpen}
        submitEdit={handleEditModalSubmit}
        submitWithdraw={handleWithdrawModalSubmit}
        cancelFunc={handleManageModalCancel}
        currentWalletAddress={depositObject.recipient}
        currentDepositAmount={new BigNumber(depositObject.deposit)}
        depositDate={depositObject.date}
        yieldSent={depositObject.yieldDonated}
        project={projectMap.get(depositObject.recipient)}
        key={"manage-modal-" + depositObject.recipient}
        eventSource={"My Donations"}
      />
    </Box>
  );
};
