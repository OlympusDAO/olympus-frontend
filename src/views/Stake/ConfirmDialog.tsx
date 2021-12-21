import { Box, Grid, Switch, Typography, Paper, withStyles } from "@material-ui/core";
import { ChangeEvent, useMemo, useState } from "react";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";

export interface ConfirmDialogProps {
  quantity: string;
  currentIndex: string;
  view: number;
  onConfirm: (value: boolean) => void;
}

const StyledSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.primary.main,
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export function ConfirmDialog({ quantity, currentIndex, view, onConfirm }: ConfirmDialogProps) {
  const [checked, setChecked] = useState(true);
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked(value);
    onConfirm(value);
  };
  const gohmQuantity = useMemo(
    () => (quantity ? Number((Number(quantity) / Number(currentIndex)).toFixed(4)) : ""),
    [quantity, currentIndex],
  );
  const ohmQuantity = useMemo(() => (quantity ? Number(Number(quantity).toFixed(4)) : ""), [quantity]);

  return (
    <Paper className="ohm-card confirm-dialog">
      <Box className="dialog-container" display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>sOHM</Grid>
            <Grid item>
              <StyledSwitch
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
        </Typography>
        {checked && Number(quantity) ? (
          <Typography variant="body2">
            {view === 0
              ? `Stake ${ohmQuantity} OHM → ${gohmQuantity} gOHM`
              : `Unstake ${gohmQuantity} gOHM → ${ohmQuantity} OHM`}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
}
