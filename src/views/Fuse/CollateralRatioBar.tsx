import { Grid, LinearProgress, Tooltip, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import { formatCurrency } from "../../helpers";

interface Props {
  maxBorrow: number;
  borrowUSD: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 16,
  },
  green: {
    backgroundColor: theme.palette.success.main,
  },
  yellow: {
    backgroundColor: theme.palette.warning.light,
  },
  orange: {
    backgroundColor: theme.palette.warning.dark,
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}));

export function CollateralRatioBar({ maxBorrow, borrowUSD }: Props) {
  const ratio = (borrowUSD / maxBorrow) * 100;
  const classes = useStyles();

  return (
    <Grid item container spacing={2} alignItems="center" className="collateralRatioBar">
      <Grid item>
        <Tooltip title={<Typography variant="h6">Keep this bar from filling up to avoid being liquidated!</Typography>}>
          <Typography variant="h6">Borrow Limit</Typography>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title={<Typography variant="h6">This is how much you have borrowed.</Typography>}>
          <Typography variant="h5">{formatCurrency(borrowUSD, 2)}</Typography>
        </Tooltip>
      </Grid>
      <Grid item className="progress">
        <Tooltip
          title={
            <Typography variant="h6">{`You're using ${ratio.toFixed(1)}% of your ${formatCurrency(
              maxBorrow,
              2,
            )} borrow limit.`}</Typography>
          }
        >
          <LinearProgress
            value={ratio}
            classes={{
              root: classes.root,
              barColorPrimary:
                ratio <= 40 ? classes.green : ratio <= 60 ? classes.yellow : ratio <= 80 ? classes.orange : classes.red,
            }}
            variant="determinate"
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip
          title={
            <Typography variant="h6">If your borrow amount reaches this value, you will be liquidated.</Typography>
          }
        >
          <Typography variant="h5">{formatCurrency(maxBorrow, 2)}</Typography>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
