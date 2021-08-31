import { useSelector } from "react-redux";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
} from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

function ChooseBond() {
  const bonds = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });

  return (
    <div id="choose-bond-view">
      <ClaimBonds bonds={bonds} />

      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box className="card-header">
            <Typography variant="h5">Bond (1,1)</Typography>
          </Box>

          <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
            <Grid item xs={6}>
              <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  Treasury Balance
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? (
                    <Skeleton width="180px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(treasuryBalance)
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} className={`ohm-price`}>
              <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                <Typography variant="h5" color="textSecondary">
                  OHM Price
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Bond</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">ROI</TableCell>
                      <TableCell align="right">Purchased</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => (
                      <BondTableData key={bond.value} bond={bond.value} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.value}>
                <BondDataCard key={bond.value} bond={bond.value} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
