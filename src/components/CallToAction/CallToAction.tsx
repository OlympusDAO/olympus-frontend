import "./calltoaction.scss";

import { t, Trans } from "@lingui/macro";
import { Box, SvgIcon, Typography } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "@olympusdao/component-library";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

export const LearnMoreButton = () => {
  return (
    <SecondaryButton
      href="https://docs.olympusdao.finance/main/basics/migration"
      target="_blank"
      className="learn-more-button"
    >
      Learn More
      <SvgIcon component={ArrowUp} color="primary" />
    </SecondaryButton>
  );
};

export interface MigrationButtonProps {
  setMigrationModalOpen: (state: boolean) => void;
  btnText: string;
}

export const MigrateButton = ({ setMigrationModalOpen, btnText }: MigrationButtonProps) => {
  return (
    <PrimaryButton
      className="migrate-button"
      onClick={() => {
        setMigrationModalOpen(true);
      }}
    >
      {btnText}
    </PrimaryButton>
  );
};

export interface CallToActionProps {
  setMigrationModalOpen: (state: boolean) => void;
}

const CallToAction = ({ setMigrationModalOpen }: CallToActionProps) => {
  return (
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
};

export default CallToAction;
