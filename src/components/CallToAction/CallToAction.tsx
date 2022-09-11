import "src/components/CallToAction/CallToAction.scss";

import { Box, Typography } from "@mui/material";
import { Paper, PrimaryButton, TertiaryButton } from "@olympusdao/component-library";

export const LearnMoreButton = () => (
  <TertiaryButton href="https://docs.olympusdao.finance/main/basics/migration" style={{ marginRight: "10.5px" }}>
    Learn More
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
          You have assets ready to migrate to v2
        </Typography>
        <div className="actionable">
          <LearnMoreButton />
          <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={`Get Started`} />
        </div>
      </Box>
    </Paper>
  </Box>
);

export default CallToAction;
