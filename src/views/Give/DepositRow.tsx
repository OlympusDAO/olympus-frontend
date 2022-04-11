import "./YieldRecipients.scss";

import { t } from "@lingui/macro";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { SecondaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useWeb3Context } from "src/hooks/web3Context";
import { GetCorrectContractUnits } from "src/views/Give/helpers/GetCorrectUnits";
import { SubmitEditCallback } from "src/views/Give/Interfaces";

import { Project } from "../../components/GiveProject/project.type";
import { ACTION_GIVE_EDIT, ACTION_GIVE_WITHDRAW, changeGive, changeMockGive } from "../../slices/GiveThunk";
import { error } from "../../slices/MessagesSlice";
import { ManageDonationModal, WithdrawSubmitCallback } from "./ManageDonationModal";
import data from "./projects.json";

interface IUserDonationInfo {
  id: string;
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}

interface DepositRowProps {
  depositObject: IUserDonationInfo;
  giveAssetType: string;
  changeAssetType: (checked: boolean) => void;
}

const ZERO_DBN = new DecimalBigNumber("0");

export const DepositTableRow = ({ depositObject, giveAssetType, changeAssetType }: DepositRowProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { data: currentIndex } = useCurrentIndex();

  const getRecipientTitle = (address: string): string => {
    const project = projectMap.get(address);
    if (!project) return isMediumScreen || isSmallScreen ? "Custom" : "Custom Recipient";

    if (!project.owner)
      return isSmallScreen && project.title.length > 16 ? project.title.substring(0, 16) + "..." : project.title;

    return project.owner + " - " + project.title;
  };

  const getDeposit = () => {
    return GetCorrectContractUnits(depositObject.deposit, "sOHM", currentIndex);
  };

  const getYieldDonated = () => {
    return GetCorrectContractUnits(depositObject.yieldDonated, "sOHM", currentIndex);
  };

  const handleManageModalCancel = () => {
    setIsManageModalOpen(false);
  };

  const handleEditModalSubmit: SubmitEditCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.eq(ZERO_DBN)) return;

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toString(),
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
          value: depositAmountDiff.toString(),
          token: giveAssetType,
          recipient: walletAddress,
          id: depositId,
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
  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
  ) => {
    // Issue withdrawal from smart contract
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toString(),
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
          value: depositAmount.toString(),
          token: giveAssetType,
          recipient: walletAddress,
          id: depositId,
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
    <Grid container alignItems="center" spacing={2}>
      {!isSmallScreen && (
        <Grid item xs={2}>
          <Typography variant="body1">{depositObject.date}</Typography>
        </Grid>
      )}
      <Grid item xs={4} sm={3}>
        <Tooltip title={depositObject.recipient} arrow>
          <Typography variant="body1">{getRecipientTitle(depositObject.recipient)}</Typography>
        </Tooltip>
      </Grid>
      {!isSmallScreen && (
        <Grid item xs={2} style={{ textAlign: "right" }}>
          <Typography variant="body1">{getDeposit().toString({ decimals: 2 })} sOHM</Typography>
        </Grid>
      )}
      <Grid item xs={4} sm={2} style={{ textAlign: "right" }}>
        <Typography variant="body1">{getYieldDonated().toString({ decimals: 2 })} sOHM</Typography>
      </Grid>
      <Grid item xs={4} sm={3} style={{ textAlign: "right" }}>
        <SecondaryButton onClick={() => setIsManageModalOpen(true)} size="small" fullWidth>
          Manage
        </SecondaryButton>
      </Grid>

      <ManageDonationModal
        isModalOpen={isManageModalOpen}
        submitEdit={handleEditModalSubmit}
        submitWithdraw={handleWithdrawModalSubmit}
        cancelFunc={handleManageModalCancel}
        currentWalletAddress={depositObject.recipient}
        currentDepositAmount={depositObject.deposit}
        giveAssetType={giveAssetType}
        changeAssetType={changeAssetType}
        depositDate={depositObject.date}
        yieldSent={depositObject.yieldDonated}
        project={projectMap.get(depositObject.recipient)}
        currentDepositId={depositObject.id}
        key={"manage-modal-" + depositObject.recipient}
        eventSource={"My Donations"}
      />
    </Grid>
  );
};
