import { useSelector } from "react-redux";
import { Box, Typography, Button, SvgIcon } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import "./calltoaction.scss";

export const LearnMoreButton = () => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      href="https://github.com/OlympusDAO-Education/Documentation/blob/migration/basics/migration.md"
      target="_blank"
      className="learn-more-button"
    >
      <Typography variant="body1">Learn More</Typography>

      <SvgIcon component={ArrowUp} color="primary" />
    </Button>
  );
};

export const MigrateButton = ({ setMigrationModalOpen }) => {
  return (
    <Button
      className="migrate-button"
      variant="contained"
      color="primary"
      onClick={() => {
        setMigrationModalOpen(true);
      }}
    >
      Migrate
    </Button>
  );
};

const CallToAction = ({ setMigrationModalOpen }) => {
  return (
    <Box className="call-to-action ohm-card">
      <Typography style={{ fontSize: "20px", fontWeight: "600" }} variant="h5">
        You have assets ready to migrate to v2
      </Typography>
      <div className="actionable">
        <LearnMoreButton />
        <MigrateButton setMigrationModalOpen={setMigrationModalOpen} />
      </div>
    </Box>
  );
};

export default CallToAction;
