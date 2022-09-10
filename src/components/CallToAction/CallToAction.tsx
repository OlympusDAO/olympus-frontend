import "src/components/CallToAction/CallToAction.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";
import { Paper, PrimaryButton, TertiaryButton } from "@olympusdao/component-library";

export const LearnMoreButton = () => (
  <TertiaryButton href="https://docs.olympusdao.finance/main/basics/migration" style={{ marginRight: "10.5px" }}>
    <Trans>Learn More</Trans>
  </TertiaryButton>
);

export interface MigrationButtonProps {
  setMigrationModalOpen: (state: boolean) => void;
  btnText: string;
}

export const MigrateButton = ({ setMigrationModalOpen, btnText }: MigrationButtonProps) => (
  <PrimaryButton
    onClick={() => {
      setMigrationModalOpen(true);
    }}
  >
    {btnText}
  </PrimaryButton>
);

export interface CallToActionProps {
  setMigrationModalOpen: (state: boolean) => void;
}

const CallToAction = ({ setMigrationModalOpen }: CallToActionProps) => (
  <Box className="call-to-action ohm-card">
    <Paper enableBackground>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography style={{ fontSize: "21px", fontWeight: "700" }} variant="h5">
          <Trans>You have assets ready to migrate to v2</Trans>
        </Typography>
        <div className="actionable">
          <LearnMoreButton />
          <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={t`Get Started`} />
        </div>
      </Box>
    </Paper>
  </Box>
);

export default CallToAction;
