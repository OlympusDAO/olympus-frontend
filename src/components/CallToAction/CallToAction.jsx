import { useSelector } from "react-redux";
import { Box, Typography, Button, SvgIcon } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import "./calltoaction.scss";

export const LearnMoreButton = () => {
  return (
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
};

export const MigrateButton = ({ setMigrationModalOpen, btnText }) => {
  return (
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
};

const CallToAction = ({ setMigrationModalOpen }) => {
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
