import InfoTooltip from "../InfoTooltip/InfoTooltip";
import { Box, Modal, Paper, SvgIcon, Hidden, Typography } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/v1.2/x.svg";
import { ResponsiveContainer } from "recharts";

const modalStyle = {
  position: "absolute",
  display: "flex",
  minWidth: 833,
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(5px)",
  backgroundColor: "#55555533",
};

function ExpandedChart({
  open,
  handleClose,
  renderChart,
  data,
  infoTooltipMessage,
  headerText,
  headerSubText,
  runwayExtraInfo,
}) {
  return (
    <Modal open={open} onClose={handleClose} hideBackdrop style={modalStyle}>
      <Paper className="ohm-card ohm-popover">
        <div className="card-header">
          <Hidden smUp>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" style={{ fontSize: 23, cursor: "pointer" }}>
                <InfoTooltip message={infoTooltipMessage} />
              </Typography>
              <Typography variant="h6" style={{ fontSize: 24, cursor: "pointer" }}>
                <SvgIcon component={XIcon} color="primary" onClick={handleClose} />
              </Typography>
            </Box>
          </Hidden>
          <Box display="flex">
            <Box>
              <Typography variant="h6" color="textSecondary" style={{ fontWeight: 400, fontSize: 20 }}>
                {headerText}
              </Typography>
            </Box>
            <Hidden xsDown>
              <Box display="flex" justifyContent="space-between" style={{ width: "100%" }}>
                <Typography variant="h6" style={{ marginLeft: 10, fontSize: 23, cursor: "pointer" }}>
                  <InfoTooltip message={infoTooltipMessage} />
                </Typography>
                <Typography variant="h6" style={{ fontSize: 24, cursor: "pointer" }}>
                  <SvgIcon component={XIcon} color="primary" onClick={handleClose} />
                </Typography>
              </Box>
            </Hidden>
          </Box>
          <Box display="flex">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {headerSubText}
            </Typography>
            {runwayExtraInfo}
            <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400, fontSize: 24 }}>
              Today
            </Typography>
          </Box>
        </div>

        <Box className="card-content" minWidth={300} style={{ margin: "0 0 -10px -25px" }}>
          {data && data.length > 0 && (
            <ResponsiveContainer width="99%" minWidth="280px" height="99%" minHeight="250px">
              {renderChart}
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>
    </Modal>
  );
}

export default ExpandedChart;
