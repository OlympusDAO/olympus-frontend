import { useEffect, useState, Fragment } from "react";
import { ReactComponent as Info } from "../../assets/icons/v1.2/info.svg";
import { SvgIcon, Tooltip, Paper, Hidden } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "./infotooltip.scss";

function InfoTooltip({ message }) {
  const [isVisible, setVisible] = useState(true);
  return (
    <Fragment>
      <SvgIcon component={Info} onMouseOver={() => setVisible(false)} onMouseOut={() => setVisible(true)}></SvgIcon>
      <Hidden xlUp={isVisible}>
        <Paper className="info-tooltip ohm-card ">{message}</Paper>
      </Hidden>
    </Fragment>
  );
}

export default InfoTooltip;
