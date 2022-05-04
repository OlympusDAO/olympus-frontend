import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import { useUIDSeed } from "react-uid";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useAppDispatch } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { ChangeAssetType } from "src/slices/interfaces";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import { useGive } from "./hooks/useGive";
import data from "./projects.json";

type CausesDashboardProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

const ZERO_NUMBER = new DecimalBigNumber("0");

export default function CausesDashboard({ giveAssetType, changeAssetType }: CausesDashboardProps) {
  const { address } = useWeb3Context();
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const { projects } = data;

  const giveMutation = useGive();

  const isMutating = giveMutation.isLoading;

  useEffect(() => {
    if (isCustomGiveModalOpen) setIsCustomGiveModalOpen(false);
  }, [giveMutation.isSuccess]);

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const seed = useUIDSeed();

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      return (
        <>
          <Grid item xs={12}>
            <ProjectCard
              key={seed(project.title)}
              project={project}
              giveAssetType={giveAssetType}
              changeAssetType={changeAssetType}
              mode={ProjectDetailsMode.Card}
            />
          </Grid>
        </>
      );
    });
  }, [projects]);

  const handleCustomGiveButtonClick = () => {
    setIsCustomGiveModalOpen(true);
  };

  const handleCustomGiveModalSubmit: SubmitCallback = async (
    walletAddress: string,
    eventSource: string,
    depositAmount: DecimalBigNumber,
  ) => {
    if (depositAmount.eq(ZERO_NUMBER)) {
      return dispatch(error(t`Please enter a value!`));
    }

    const amount = depositAmount.toString();
    await giveMutation.mutate({ amount: amount, recipient: walletAddress, token: giveAssetType });
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  const customRecipientBoxStyle = {
    backgroundColor: theme.palette.mode === "dark" ? theme.colors.gray[500] : theme.colors.gray[10],
    borderRadius: "10px",
  };

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        {renderProjects}
        <Grid item xs={12}>
          <Box style={customRecipientBoxStyle}>
            <Grid
              container
              spacing={2}
              style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "30px", paddingRight: "30px" }}
            >
              <Grid item xs={12}>
                <Typography variant="h4" align="center">
                  <Trans>Want to give to a different cause?</Trans>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" align="center">
                  <Trans>You can direct your yield to a recipient of your choice</Trans>
                </Typography>
              </Grid>
              <Grid item xs />
              <Grid item xs={12} sm={4} container justifyContent="center">
                <PrimaryButton fullWidth size="small" onClick={() => handleCustomGiveButtonClick()} disabled={!address}>
                  <Trans>Select Custom Recipient</Trans>
                </PrimaryButton>
              </Grid>
              <Grid item xs />
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <RecipientModal
        isModalOpen={isCustomGiveModalOpen}
        isMutationLoading={isMutating}
        eventSource="Custom Recipient Button"
        callbackFunc={handleCustomGiveModalSubmit}
        cancelFunc={handleCustomGiveModalCancel}
        giveAssetType={giveAssetType}
        changeAssetType={changeAssetType}
      />
    </Container>
  );
}
