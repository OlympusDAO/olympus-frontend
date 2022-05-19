import "./YieldRecipients.scss";

import { t } from "@lingui/macro";
import { Grid, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SecondaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Project } from "src/components/GiveProject/project.type";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { ChangeAssetType } from "src/slices/interfaces";
import { error } from "src/slices/MessagesSlice";
import { GIVE_MAX_DECIMAL_FORMAT } from "src/views/Give/constants";
import { GetCorrectContractUnits } from "src/views/Give/helpers/GetCorrectUnits";
import { useDecreaseGive, useIncreaseGive } from "src/views/Give/hooks/useEditGive";
import { SubmitEditCallback, WithdrawSubmitCallback } from "src/views/Give/Interfaces";
import { ManageDonationModal } from "src/views/Give/ManageDonationModal";

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
  changeAssetType: ChangeAssetType;
}

const ZERO_NUMBER = new DecimalBigNumber("0");
const DECIMAL_PLACES = 2;

export const DepositTableRow = ({ depositObject, giveAssetType, changeAssetType }: DepositRowProps) => {
  const dispatch = useDispatch();
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const { data: currentIndex } = useCurrentIndex();
  const increaseMutation = useIncreaseGive();
  const decreaseMutation = useDecreaseGive();

  const isMutating = increaseMutation.isLoading || decreaseMutation.isLoading;

  useEffect(() => {
    if (isManageModalOpen) setIsManageModalOpen(false);
  }, [increaseMutation.isSuccess, decreaseMutation.isSuccess]);

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

    if (depositAmountDiff.eq(ZERO_NUMBER)) return;

    if (depositAmountDiff.gt(new DecimalBigNumber("0"))) {
      await increaseMutation.mutate({
        id: depositId,
        amount: depositAmountDiff.toString(GIVE_MAX_DECIMAL_FORMAT),
        recipient: walletAddress,
        token: giveAssetType,
      });
    } else {
      const subtractionAmount = depositAmountDiff.mul(new DecimalBigNumber("-1"));
      await decreaseMutation.mutate({
        id: depositId,
        amount: subtractionAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
        recipient: walletAddress,
        token: giveAssetType,
      });
    }
  };

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
  ) => {
    await decreaseMutation.mutate({
      id: depositId,
      amount: depositAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
      recipient: walletAddress,
      token: "gOHM",
    });
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
          <Typography variant="body1">{getDeposit().toString({ format: true })} sOHM</Typography>
        </Grid>
      )}
      <Grid item xs={4} sm={2} style={{ textAlign: "right" }}>
        <Typography variant="body1">
          {getYieldDonated().toString({ decimals: DECIMAL_PLACES, format: true })} sOHM
        </Typography>
      </Grid>
      <Grid item xs={4} sm={3} style={{ textAlign: "right" }}>
        <SecondaryButton onClick={() => setIsManageModalOpen(true)} size="small" fullWidth>
          Manage
        </SecondaryButton>
      </Grid>

      {/* current deposit amount must be passed in as gOHM */}
      <ManageDonationModal
        isModalOpen={isManageModalOpen}
        isMutationLoading={isMutating}
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
