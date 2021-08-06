import { useState } from "react";
import { Paper, Box, Typography, Button, Tab, Tabs, Zoom, SvgIcon } from "@material-ui/core";

// TODO: Add countdown timer functionality using prizePeriodSeconds, prizePeriodEndAt from apollo
const countdownTimer = () => {};

export const PoolPrize = () => {
  return (
    <Zoom in={true}>
      <Paper className="ohm-card">
        <div className="card-header">
          <Typography variant="h5">3, 3 Together</Typography>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h2">Pize Amount</Typography>
          <Typography variant="h3">(Countdown Timer)</Typography>
        </Box>
      </Paper>
    </Zoom>
  );
};
