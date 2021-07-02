import React from "react";
import { useSelector } from 'react-redux';
import { Paper, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { BondTableData, BondDataCard } from './BondRow';
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "../Stake/stake.scss";
import "./choosebond.scss";

function ChooseBond() {
	const marketPrice = useSelector((state) => { return state.app.marketPrice });

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
							</Grid>

							<Grid item xs={6} className={`ohm-price`}>
								<Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
									<Typography variant="h6">OHM Price</Typography>
									<h2 className="content">{trim(marketPrice, 2)}</h2>
								</Box>
							</Grid>
						</Grid>
          
						{ !isSmallScreen && (
							<Grid container item>
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
						
    </Grid>
	);
  }

  export default ChooseBond;
