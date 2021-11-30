import { useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { Box, Paper, Popper, SvgIcon, Typography } from "@material-ui/core";
import "./infotooltip.scss";

function InfoTooltip({ message, children }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleHover = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  return (
    <Box style={{ display: "inline-flex", justifyContent: "center", alignSelf: "center" }}>
      <SvgIcon
        component={Info}
        onMouseOver={handleHover}
        onMouseOut={handleHover}
        style={{ margin: "0 5px", fontSize: "1em" }}
        className="info-icon"
      ></SvgIcon>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" className="tooltip">
        <Paper className="info-tooltip ohm-card">
          <Typography variant="body2" className="info-tooltip-text">
            {children || message}
          </Typography>
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoTooltip;
