import { InfoTooltip } from "@olympusdao/component-library";
import { Box, Typography } from "@material-ui/core";
import { ResponsiveContainer } from "recharts";
import { Modal } from "@olympusdao/component-library";

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
    <Modal
      open={open}
      onClose={handleClose}
      closePosition={"right"}
      minHeight={"450px"}
      headerContent={
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
      }
    >
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
    </Modal>
  );
}

export default ExpandedChart;
