import { useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { SvgIcon, Paper, Typography, Box, Popper } from "@material-ui/core";
import "./infotooltip.scss";

/**
 * InfoTooltipMulti allows passing an ARRAY of message strings w each Array Element on a new line
 * @param {*} messagesArray = Array of Message Strings
 * @returns MUI Popover on document.body
 */
function InfoTooltipMulti({ messagesArray }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleHover = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  var messagesRender = messagesArray.map((innerArray, i) => {
    return (
      <div key={i} style={i > 0 ? { marginTop: "1rem" } : {}}>
        <Typography variant="body2">{innerArray}</Typography>
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
