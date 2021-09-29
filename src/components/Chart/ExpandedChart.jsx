import InfoTooltip from "../InfoTooltip/InfoTooltip";
import { Box, Backdrop, Modal, Paper, SvgIcon, Typography, Fade, useMediaQuery } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ResponsiveContainer } from "recharts";
import { style } from "@material-ui/system";

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
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <Modal open={open} onClose={handleClose}>
      <Backdrop open={true}>
        <Fade in={true}>
          <Paper className="ohm-card ohm-popover">
            <div className="chart-card-header">
              <Box display="flex">
                <Box display="flex" alignItems="center" style={{ width: "max-content", whiteSpace: "nowrap" }}>
                  <Typography variant="h6" color="textSecondary" style={{ fontWeight: 400 }}>
                    {headerText}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ width: "100%", marginLeft: "5px" }}
                >
                  <Typography variant="h6" style={{ cursor: "pointer" }}>
                    <InfoTooltip message={infoTooltipMessage} />
                  </Typography>
                  <Typography variant="h6" style={{ cursor: "pointer" }}>
                    <SvgIcon component={XIcon} color="primary" onClick={handleClose} />
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" flexWrap="wrap">
                <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
                  {headerSubText}
                </Typography>
                {runwayExtraInfo}
                <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400 }}>
                  Today
                </Typography>
              </Box>
            </div>

            <Box minWidth={300} width="100%">
              {data && data.length > 0 && (
                <ResponsiveContainer minHeight={260} minWidth={300}>
                  {renderChart}
                </ResponsiveContainer>
              )}
            </Box>
            <Box display="flex" style={{ width: "100%", margin: "15px" }}>
              <Typography variant="h6">{infoTooltipMessage}</Typography>
            </Box>
          </Paper>
        </Fade>
      </Backdrop>
    </Modal>
  );
}

export default ExpandedChart;
