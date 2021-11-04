import { Box, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { formatCurrency, trim } from "../../helpers";

function ZapBondSubHeader({ bond }) {
  const isBondLoading = useSelector(state => state.bonding.loading ?? true);
  return (
    <>
      <Box direction="row" className="bond-price-data-row">
        <div className="bond-price-data">
          <Typography variant="h5" color="textSecondary">
            Bond Price
          </Typography>
          <Typography variant="h3" className="price" color="primary">
            {isBondLoading ? <Skeleton /> : formatCurrency(bond.bondPrice, 2)}
          </Typography>
        </div>
        <div className="bond-price-data">
          <Typography variant="h5" color="textSecondary">
            Market Price
          </Typography>
          <Typography variant="h3" color="primary" className="price">
            {isBondLoading ? <Skeleton /> : formatCurrency(bond.marketPrice, 2)}
          </Typography>
        </div>
      </Box>
      <Grid container>
        <Grid item>
          <Typography>Hi</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default ZapBondSubHeader;
