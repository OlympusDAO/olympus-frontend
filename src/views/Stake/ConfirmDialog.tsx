import { Box, Grid, Switch, Typography, Paper } from "@material-ui/core";
import { ChangeEvent, useState } from "react";

export interface ConfirmDialogProps {
  quantity: string;
  currentIndex: string;
  view: number;
  onConfirm: (value: boolean) => void;
}
export function ConfirmDialog({ quantity, currentIndex, view, onConfirm }: ConfirmDialogProps) {
  const [checked, setChecked] = useState(true);
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onConfirm(value);
  };
  const gohmQuantity = () => {
    if (quantity) {
      return (Number(quantity) / Number(currentIndex)).toFixed(4);
    } else {
      return "";
    }
  };
  const ohmQuantity = () => {
    if (quantity) {
      return Number(quantity).toFixed(4);
    } else {
      return "";
    }
  };

  return (
    <Paper className="ohm-card confirm-dialog">
      <Box className="dialog-container" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body2">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>{view === 0 ? "Stake to sOHM" : "Unstake from sOHM"}</Grid>
            <Grid item>
              <Switch
                checked={checked}
                onChange={handleCheck}
                color="primary"
                className="stake-to-ohm-checkbox"
                inputProps={{ "aria-label": "stake to gohm" }}
              />
            </Grid>
            <Grid item>
              {view === 0
                ? `Staking ${ohmQuantity()} OHM to ${gohmQuantity()} gOHM`
                : `Unstaking ${gohmQuantity()} gOHM to ${ohmQuantity()} OHM`}
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </Paper>
  );
}
