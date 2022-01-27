import "./CallToAction.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Button, SvgIcon, Typography } from "@material-ui/core";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

export const LearnMoreButton = () => (
  <Button
    variant="outlined"
    color="secondary"
    href="https://docs.olympusdao.finance/main/basics/migration"
    target="_blank"
    className="learn-more-button"
  >
    <Typography variant="body1">
      <Trans>Learn More</Trans>
    </Typography>

    <SvgIcon component={ArrowUp} color="primary" />
  </Button>
);

export interface MigrationButtonProps {
  setMigrationModalOpen: (state: boolean) => void;
  btnText: string;
}

export const MigrateButton = ({ setMigrationModalOpen, btnText }: MigrationButtonProps) => (
  <Button
    className="migrate-button"
    variant="contained"
    color="primary"
    onClick={() => {
      setMigrationModalOpen(true);
    }}
  >
    {btnText}
  </Button>
);

export interface CallToActionProps {
  setMigrationModalOpen: (state: boolean) => void;
}

const CallToAction = ({ setMigrationModalOpen }: CallToActionProps) => (
  <Box className="call-to-action ohm-card">
    <Typography style={{ fontSize: "20px", fontWeight: "600" }} variant="h5">
      <Trans>You have assets ready to migrate to v2</Trans>
    </Typography>
    <div className="actionable">
      <LearnMoreButton />
      <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={t`Get Started`} />
    </div>
  </Box>
);

export default CallToAction;
