<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Card } from "rimble-ui";
import "../Stake/stake.scss";
import { BondTableData, BondCardData } from "./BondRow";
>>>>>>> Linting fixes
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";

function ChooseBond() {
<<<<<<< HEAD
<<<<<<< HEAD
  const bonds = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
=======
	const marketPrice = useSelector((state) => { return state.app.marketPrice });
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });

<<<<<<< HEAD
  return (
    <div id="choose-bond-view">
      <Paper className="ohm-card">
        <Box className="card-header">
          <Typography variant="h5">Bond (1,1)</Typography>
        </Box>
=======
	const treasuryBalance = useSelector(state => {
		return state.app.treasuryBalance;
	});
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

        <Grid container item xs={12} style={{ margin: "30px 0" }}>
          <Grid item xs={6}>
            <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
              <Typography variant="h5" color="textSecondary">
                Treasury Balance
              </Typography>
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
              <Typography variant="h5" color="textSecondary">
                OHM Price
              </Typography>
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

<<<<<<< HEAD
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
    </div>
  );
}
=======
          <div className="card-content">
						<Grid container item xs={12} spacing={2}>
							<Grid item sm={7} lg={9}>
								<h3>Treasury Balance</h3>
								<h2 className="content">
									{treasuryBalance && new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: "USD",
										maximumFractionDigits: 0,
										minimumFractionDigits: 0
									}).format(treasuryBalance)}
								</h2>
							</Grid>
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const isSmallScreen = useMediaQuery("(max-width: 1125px)");
  const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 589px)");

  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });

  const bonds = useBonds();

  return (
    <Grid container id="choose-bond-view" justify="center" spacing={2}>
      <Card className={`ohm-card secondary ${isSmallScreen && "mobile"} ${isMediumScreen && "med"}`}>
        <div className="card-content">
          <Grid container item xs={12} spacing={2}>
            <Grid item sm={7} lg={9}>
              <h3>Treasury Balance</h3>
              <h2 className="content">
                {treasuryBalance &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(treasuryBalance)}
              </h2>
            </Grid>

            <Grid item xs={5} sm={5} lg={3} className={`ohm-price ${isVerySmallScreen && "very-small"}`}>
              <h3>OHM Price</h3>
              <h2 className="content">{trim(marketPrice, 2)}</h2>
            </Grid>
          </Grid>
        </div>
      </Card>

      <Card className={`ohm-card primary ${isSmallScreen && "mobile"} ${isMediumScreen && "med"}`}>
        <div className="card-header" style={{ background: "transparent" }}>
          <h5>Bonds (1, 1)</h5>
        </div>
        {!isSmallScreen ? (
          <div className="card-content">
            <TableContainer>
              <Table aria-label="Available bonds">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Bond</TableCell>
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
          </div>
        ) : (
          <>
            {/* { Object.keys(BONDS).map(bond => ( */}
            {[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
              <div className="card-content" key={bond}>
                <BondCardData key={bond} bond={bond} />
              </div>
            ))}
          </>
        )}
      </Card>
    </Grid>
  );
}
>>>>>>> Linting fixes

export default ChooseBond;
