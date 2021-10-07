import { useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { SvgIcon, Paper, Typography, Box, Popper } from "@material-ui/core";
import "./infotooltip.scss";

function InfoTooltipMulti({ messagesArray }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleHover = event => {
    console.log("anchor", event.currentTarget);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  console.log("messages", messagesArray);
  var messagesRender = messagesArray.map((innerArray, i) => {
    console.log("inner", innerArray);
    return (
      <div key={i} style={i > 0 ? { marginTop: "1rem" } : {}}>
        <Typography variant="body2">
          <Box sx={{ lineHeight: 1.33 }}>{innerArray}</Box>
        </Typography>
      </div>
    );
  });

  return (
    <Box>
      <SvgIcon
        component={Info}
        onMouseOver={handleHover}
        onMouseOut={handleHover}
        style={{ margin: "0 5px", fontSize: 16 }}
        className="info-icon"
      ></SvgIcon>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" className="tooltip">
        <Paper className="info-tooltip ohm-card" style={{ padding: "1.33rem" }}>
          {messagesRender}
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoTooltipMulti;
