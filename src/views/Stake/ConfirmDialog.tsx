import { Box, Grid, Paper, Switch, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip } from "@olympusdao/component-library";
import { ChangeEvent, useMemo, useState } from "react";

export interface ConfirmDialogProps {
  quantity: string;
  currentIndex: string | undefined;
  view: number;
  onConfirm: (value: boolean) => void;
  isLoading: boolean;
}

export function ConfirmDialog({ quantity, currentIndex, view, onConfirm, isLoading }: ConfirmDialogProps) {
  const [checked, setChecked] = useState(false);
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onConfirm(value);
  };
  const gohmQuantity = useMemo(
    () => (quantity && currentIndex ? Number((Number(quantity) / Number(currentIndex)).toFixed(4)) : ""),
    [quantity, currentIndex],
  );
  const ohmQuantity = useMemo(() => (quantity ? Number(Number(quantity).toFixed(4)) : ""), [quantity]);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Paper className="ohm-card confirm-dialog">
          <Box className="dialog-container" display="flex" alignItems="center" justifyContent="space-between">
            <Grid component="label" container alignItems="center" spacing={1} wrap="nowrap">
              <Grid item>sOHM</Grid>
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
                gOHM
                <InfoTooltip
                  message={`Toggle to switch between ${view === 0 ? "staking to" : "unstaking from"} sOHM or gOHM`}
                  children={undefined}
                />
              </Grid>
            </Grid>
            {checked && Number(quantity) ? (
              <Typography variant="body2">
                {view === 0
                  ? `Stake ${ohmQuantity} OHM → ${gohmQuantity} gOHM`
                  : `Unstake ${gohmQuantity} gOHM → ${ohmQuantity} OHM`}
              </Typography>
            ) : null}
          </Box>
        </Paper>
      )}
    </>
  );
}
