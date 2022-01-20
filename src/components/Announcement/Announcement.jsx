import "./Announcement.scss";

import { Trans } from "@lingui/macro";
import { Box, IconButton, Paper, SvgIcon, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";

import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

function Announcement() {
  const [newNetworkVisible, setNewNetworkVisible] = useState(true);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const handleClose = () => {
    setNewNetworkVisible(false);
  };

  return (
    <div className="announcement-banner ohm-card">
      {newNetworkVisible && (
        <>
          <Paper className="new-network" style={isMobileScreen ? { borderRadius: 0 } : { width: "100%" }}>
            <Box style={{ width: "2%" }}></Box>
            <Box display="flex" alignItems="center">
              <Box className="new-network-box" style={{ marginRight: "10px" }}>
                <SvgIcon component={InfoIcon} />
              </Box>

              <Box className="new-network-box">
                <Typography variant="body2">
                  <Trans>
                    Treasury stats may be inaccurate during the migration. Please check discord if you have any
                    questions.
                  </Trans>
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
