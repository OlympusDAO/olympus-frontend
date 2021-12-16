import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, Paper, SvgIcon, Typography } from "@material-ui/core";
import { NETWORKS, NEWEST_NETWORK_ID } from "src/constants";
import Pill from "../Pill/Pill";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./Announcement.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function Announcement() {
  const [newNetworkVisible, setNewNetworkVisible] = useState(true);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const handleClose = () => {
    setNewNetworkVisible(false);
  };

  return (
    <div className="announcement-banner">
      {newNetworkVisible && (
        <>
          <Paper className="new-network" style={isMobileScreen ? { borderRadius: "0" } : { width: "100%" }}>
            <Box style={{ width: "15%" }}></Box>
            <Box display="flex" alignItems="center">
              <Box className="new-network-box" style={{ marginRight: "10px" }}>
                <Pill message="Info" style={{ color: "#F8CC82" }} />
              </Box>
              <Box className="new-network-box">
                <Typography variant="body2">
                  Treasury Stats are inaccurate during the migration. Please check discord if you have any questions.
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={handleClose}>
                <SvgIcon color="primary" component={XIcon} />
              </IconButton>
            </Box>
          </Paper>
        </>
      )}
    </div>
  );
}

export default Announcement;
