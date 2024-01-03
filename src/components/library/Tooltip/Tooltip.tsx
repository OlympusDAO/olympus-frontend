import "src/components/library/Tooltip/InfoTooltip.scss";

import { Box, Popper, Typography } from "@mui/material";
import { FC, ReactElement, useState } from "react";
import Paper from "src/components/library/Paper";

export interface OHMTooltipProps {
  message: string | ReactElement | JSX.Element;
  children: ReactElement | JSX.Element;
}

const Tooltip: FC<OHMTooltipProps> = ({ message, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? undefined : "info-tooltip";

  return (
    <Box
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignSelf: "center",
      }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      {children}
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        className="tooltip"
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        slotProps={undefined}
        slots={undefined}
      >
        <Paper className="info-tooltip">
          {typeof message === "string" ? (
            <Typography variant="body1" className="info-tooltip-text">
              {message}
            </Typography>
          ) : (
            <>{message}</>
          )}
        </Paper>
      </Popper>
    </Box>
  );
};

export default Tooltip;
