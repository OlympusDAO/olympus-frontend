<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Card } from "rimble-ui";
import "../Stake/stake.scss";
import { BondTableData, BondCardData } from "./BondRow";
=======
import React from "react";
import { useSelector } from 'react-redux';
import { Paper, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { BondTableData, BondDataCard } from './BondRow';
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
import { useEffect } from "react";
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
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";

function ChooseBond() {
<<<<<<< HEAD
<<<<<<< HEAD
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const isSmallScreen = useMediaQuery("(max-width: 1125px)");
  const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 589px)");
=======
	const marketPrice = useSelector((state) => { return state.app.marketPrice });
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

<<<<<<< HEAD
  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });
=======
	const isSmallScreen = useMediaQuery("(max-width: 800px)");
	const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
>>>>>>> sidebar spacing, mobile bond views, typography. anext up link colors and table format

<<<<<<< HEAD
  const bonds = useBonds();
=======
	const treasuryBalance = useSelector(state => {
		return state.app.treasuryBalance;
	});
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

<<<<<<< HEAD
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
<<<<<<< HEAD
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
=======
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
=======
	const bonds = useBonds();

	return (
		<Grid container id="choose-bond-view" justify="center" spacing={3}>
        <Paper className="ohm-card">
					<Typography variant="h5">Bond (1,1)</Typography>
          
						<Grid container item xs={12} style={{ marginTop: "33px",  marginBottom: "15px" }}>
							<Grid item xs={6}>
								<Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
									<Typography variant="h6">Treasury Balance</Typography>
									<h2 className="content">
										{treasuryBalance && new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
											maximumFractionDigits: 0,
											minimumFractionDigits: 0
										}).format(treasuryBalance)}
									</h2>
								</Box>
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
							</Grid>

							<Grid item xs={6} className={`ohm-price`}>
								<Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
									<Typography variant="h6">OHM Price</Typography>
									<h2 className="content">{trim(marketPrice, 2)}</h2>
								</Box>
							</Grid>
						</Grid>
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
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
=======
          
						{ !isSmallScreen && (
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

				{ isSmallScreen && (
					<Grid container item spacing={2}>
						{/* { Object.keys(BONDS).map(bond => ( */}
							{[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
								<Grid item xs={12} key={bond}>
									<BondDataCard key={bond} bond={bond} />
								</Grid>
						)) }
					</Grid>
				)}
						
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const isSmallScreen = useMediaQuery("(max-width: 800px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  const treasuryBalance = useSelector(state => {
    return state.app.treasuryBalance;
  });

  const bonds = useBonds();

  return (
    <Grid container id="choose-bond-view" justify="center" spacing={3}>
      <Paper className="ohm-card">
        <Typography variant="h5">Bond (1,1)</Typography>

        <Grid container item xs={12} style={{ marginTop: "33px", marginBottom: "15px" }}>
          <Grid item xs={6}>
            <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
              <Typography variant="h6">Treasury Balance</Typography>
              <h2 className="content">
                {treasuryBalance &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(treasuryBalance)}
              </h2>
            </Box>
          </Grid>

          <Grid item xs={6} className={`ohm-price`}>
            <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
              <Typography variant="h6">OHM Price</Typography>
              <h2 className="content">{trim(marketPrice, 2)}</h2>
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
        <Grid container item spacing={2}>
          {/* { Object.keys(BONDS).map(bond => ( */}
          {[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
            <Grid item xs={12} key={bond}>
              <BondDataCard key={bond} bond={bond} />
            </Grid>
          ))}
        </Grid>
      )}
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
    </Grid>
  );
}

export default ChooseBond;
