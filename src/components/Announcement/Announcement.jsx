import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, Paper, SvgIcon } from "@material-ui/core";
import { NETWORKS, NEWEST_NETWORK_ID } from "src/constants";
import Pill from "../Pill/Pill";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./Announcement.scss";

function Announcement() {
  const [newNetworkVisible, setNewNetworkVisible] = useState(true);

  const handleClose = () => {
    setNewNetworkVisible(false);
  };

  return (
    <div className="announcement-banner">
      {newNetworkVisible ? (
        <Paper className="new-network">
          <Box className="new-network-box" style={{ marginRight: "10px" }}>
            <Pill message="Info" style={{ color: "#F8CC82" }} />
          </Box>
          <Box className="new-network-box">
            <span>
              Treasury Stats may be inaccurate during the migration. Please check discord if you have any questions.
            </span>
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <SvgIcon color="primary" component={XIcon} />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <div />
      )}
    </div>
  );
}

export default Announcement;
