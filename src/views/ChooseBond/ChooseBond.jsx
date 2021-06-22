import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Card } from "rimble-ui";
import "../Stake/stake.scss";
import { BondTableData, BondCardData } from './BondRow';
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";


function ChooseBond({ address, provider }) {

	// const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });
	const marketPrice = useSelector((state ) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });

	const isSmallScreen = useMediaQuery("(max-width: 1125px)");
	const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
	const isVerySmallScreen = useMediaQuery("(max-width: 589px)");

	const treasuryBalance = useSelector(state => {
    	return state.app.treasuryBalance;
  	});

	return (
		<Grid container id="choose-bond-view" justify="center" spacing={2}>

        <Card className={`ohm-card secondary ${isSmallScreen  && "mobile"} ${isMediumScreen && "med"}`}>

          <div className="card-content">
						<Grid container item xs={12} spacing={2}>
							<Grid item sm={7} lg={9}>
								<h3>Treasury Balance</h3>
								<h2 className="content">
									{new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: "USD",
										maximumFractionDigits: 0,
										minimumFractionDigits: 0
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
				<div className="card-header" style={{ background: 'transparent' }}>
            <h5>Bonds (1, 1)</h5>
          </div> 
					{ !isSmallScreen ?
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
											{/* { Object.keys(BONDS).map(bond => ( */}
												{[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
												<BondTableData key={bond} bond={bond} />
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
							:
							<>
								{/* { Object.keys(BONDS).map(bond => ( */}
									{[BONDS.ohm_dai, BONDS.dai, BONDS.ohm_frax, BONDS.frax].map(bond => (
										<div className="card-content" key={bond}>
											<BondCardData key={bond} bond={bond} />
										</div>
								)) }
							</>
						}
          
        </Card>
    </Grid>
	);
  }
  
  export default ChooseBond;
