import { useSelector } from "react-redux";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";

function ChooseBond() {
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const isSmallScreen = useMediaQuery("(max-width: 1000px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });

  const bonds = useBonds();

  return (
    <Grid container id="choose-bond-view" justify="center" spacing={3}>
      <Paper className="ohm-card">
        <Box className="card-header">
          <Typography variant="h5">Bond (1,1)</Typography>
        </Box>

        <Grid container item xs={12} style={{ marginTop: "33px", marginBottom: "15px" }}>
          <Grid item xs={6}>
            <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
              <Typography variant="h5">Treasury Balance</Typography>
              <Typography variant="h4">
                {treasuryBalance &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(treasuryBalance)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} className={`ohm-price`}>
            <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
              <Typography variant="h5">OHM Price</Typography>
              <Typography variant="h4">{trim(marketPrice, 2)}</Typography>
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
                    <TableCell>ROI</TableCell>
                    <TableCell>Purchased</TableCell>
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

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {/* { Object.keys(BONDS).map(bond => ( */}
            {[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
              <Grid item xs={12} key={bond}>
                <BondDataCard key={bond} bond={bond} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Grid>
  );
}

export default ChooseBond;
