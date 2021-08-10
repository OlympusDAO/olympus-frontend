import { useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/v1.2/info.svg";
import { SvgIcon, Paper, Hidden, Typography, Box } from "@material-ui/core";
import "./infotooltip.scss";

function InfoTooltip({ message }) {
  const [isHidden, setHidden] = useState(true);
  return (
    <Box>
      <SvgIcon
        component={Info}
        onMouseOver={() => setHidden(false)}
        onMouseOut={() => setHidden(true)}
        style={{ margin: "0 5px", fontSize: 16 }}
        className="info-icon"
      ></SvgIcon>
      <Hidden xsUp={isHidden}>
        <Paper className="info-tooltip ohm-card">
          <Typography variant="body2" className="info-tooltip-text">
            {message}
          </Typography>
        </Paper>
      </Hidden>
    </Box>
  );
}

export default InfoTooltip;
