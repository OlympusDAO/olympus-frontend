import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Container, Grid, Typography, Zoom } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useUIDSeed } from "react-uid";
import GrantCard, { GrantDetailsMode } from "src/components/GiveProject/GrantCard";
import { Grant } from "src/components/GiveProject/project.type";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useAppDispatch } from "src/hooks";
import { ChangeAssetType } from "src/slices/interfaces";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import data from "./grants.json";
import { useGive } from "./hooks/useGive";

type GrantsDashboardProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function GrantsDashboard({ giveAssetType, changeAssetType }: GrantsDashboardProps) {
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const grants: Grant[] = data.grants;

  const giveMutation = useGive();

  const isMutating = giveMutation.isLoading;

  useEffect(() => {
    if (isCustomGiveModalOpen) setIsCustomGiveModalOpen(false);
  }, [giveMutation.isSuccess]);

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();
  const seed = useUIDSeed();

  const renderGrants = useMemo(() => {
    let activeGrants = 0;

    const grantElements: JSX.Element[] = grants.map(grant => {
      if (grant.disabled) return <></>;

      activeGrants++;
      return (
        <GrantCard
          key={seed(grant.title)}
          grant={grant}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          mode={GrantDetailsMode.Card}
        />
      );
    });

    if (activeGrants > 0) return grantElements;

    return (
      <Typography variant="body2">
        <Trans>We don't have any grants open right now, but check back soon!</Trans>
      </Typography>
    );
  }, [grants]);

  const handleCustomGiveModalSubmit: SubmitCallback = async (
    walletAddress: string,
    eventSource: string,
    depositAmount: DecimalBigNumber,
  ) => {
    if (depositAmount.eq(new DecimalBigNumber("0"))) {
      return dispatch(error(t`Please enter a value!`));
    }

    await giveMutation.mutate({ amount: depositAmount.toString(), recipient: walletAddress, token: giveAssetType });
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <Zoom in={true}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <Trans>
                Upon receiving an Olympus Grant, you gain exposure to the Olympus Give ecosystem where your performance
                is rewarded every 8 hours through the yield your grant generates; you then can also receive support from
                other Ohmies and this acts as a loop that compounds value and amplifies the reach and growth of your
                mission.
              </Trans>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {/* Custom padding so that the "no grants" text isn't cut off at the bottom */}
            <Grid container justifyContent="center" style={{ paddingBottom: "10px" }}>
              {renderGrants}
            </Grid>
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
    </Zoom>
  );
}
