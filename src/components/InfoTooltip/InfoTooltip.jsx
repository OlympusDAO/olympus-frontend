import { useState, Fragment } from "react";
import { ReactComponent as Info } from "../../assets/icons/v1.2/info.svg";
import { SvgIcon, Box, Paper, Hidden, Typography } from "@material-ui/core";
import "./infotooltip.scss";

function InfoTooltip({ message }) {
  const [isHidden, setHidden] = useState(true);
  return (
    <Fragment>
      <SvgIcon component={Info} onMouseOver={() => setHidden(false)} onMouseOut={() => setHidden(true)}></SvgIcon>
      <Hidden xsUp={isHidden}>
        <Paper className="info-tooltip ohm-card">
          <Box>
            <Typography variant="body2">{message}</Typography>
          </Box>
        </Paper>
      </Hidden>
    </Fragment>
  );
}

export default InfoTooltip;
