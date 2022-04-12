import "./YieldRecipients.scss";

import { t } from "@lingui/macro";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { SecondaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { SubmitCallback } from "src/views/Give/Interfaces";

import { Project } from "../../components/GiveProject/project.type";
import { error } from "../../slices/MessagesSlice";
import { useDecreaseGive, useIncreaseGive } from "./hooks/useEditGive";
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

const DECIMAL_PLACES = 2;

export const DepositTableRow = ({ depositObject }: DepositRowProps) => {
  const dispatch = useDispatch();
  const { projects } = data;
  const projectMap = new Map(projects.map(i => [i.wallet, i] as [string, Project]));
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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

    if (depositAmountDiff.eq(new DecimalBigNumber("0"))) return;

    if (depositAmountDiff.gt(new DecimalBigNumber("0"))) {
      await increaseMutation.mutate({ amount: depositAmountDiff.toString(), recipient: walletAddress });
    } else {
      const subtractionAmount = depositAmountDiff.mul(new DecimalBigNumber("-1"));
      await decreaseMutation.mutate({ amount: subtractionAmount.toString(), recipient: walletAddress });
    }
  };

  // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
  // Else use standard call
  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, eventSource, depositAmount) => {
    await decreaseMutation.mutate({ amount: depositAmount.toString(), recipient: walletAddress });
  };

  const depositNumber = new DecimalBigNumber(depositObject.deposit);

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
          {/* Exact amount as this is what the user has deposited */}
          <Typography variant="body1">{depositNumber.toString({ format: true })} sOHM</Typography>
        </Grid>
      )}
      <Grid item xs={4} sm={2} style={{ textAlign: "right" }}>
        <Typography variant="body1">
          {new DecimalBigNumber(depositObject.yieldDonated).toString({
            decimals: DECIMAL_PLACES,
            format: true,
          })}{" "}
          sOHM
        </Typography>
      </Grid>
      <Grid item xs={4} sm={3} style={{ textAlign: "right" }}>
        <SecondaryButton onClick={() => setIsManageModalOpen(true)} size="small" fullWidth>
          Manage
        </SecondaryButton>
      </Grid>
      <ManageDonationModal
        isModalOpen={isManageModalOpen}
        isMutationLoading={isMutating}
        submitEdit={handleEditModalSubmit}
        submitWithdraw={handleWithdrawModalSubmit}
        cancelFunc={handleManageModalCancel}
        currentWalletAddress={depositObject.recipient}
        currentDepositAmount={depositNumber}
        depositDate={depositObject.date}
        yieldSent={depositObject.yieldDonated}
        project={projectMap.get(depositObject.recipient)}
        key={"manage-modal-" + depositObject.recipient}
        eventSource={"My Donations"}
      />
    </Grid>
  );
};
