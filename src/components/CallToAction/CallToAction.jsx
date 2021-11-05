import { Box, Typography, Button } from "@material-ui/core";
// import "./cardheader.scss";

const CallToAction = ({ title, actionTitle, action, addlInfo, actionableChildren }) => {
  return (
    <Box className="call-to-action">
      <Typography variant="h5">{title}</Typography>
      <div className="actionable">
        <Button onclick={action}>{actionTitle}</Button>
        <Button>{addlInfo}</Button>
      </div>
    </Box>
  );
};

export default CallToAction;
