import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Card } from "rimble-ui";
import "../Stake/stake.scss";
import { BondTableData, BondCardData } from './BondRow';
import { BONDS } from "../../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { trim } from "../../helpers";


const useStyles = makeStyles(theme => ({
	"ohm-card": {
		[theme.breakpoints.down('md')]: {
			width: '100%',
		}	
	}
}));


function ChooseBond({ provider, address }) {
	const material = useTheme();
	

	// const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });	
	const marketPrice = useSelector((state ) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });

	const isSmallScreen = useMediaQuery(material.breakpoints.down('md'));
	const isNarrowScreen = useMediaQuery("(max-width:460px)");

	
	return (
		<Grid container id="choose-bond-view" justify="center" spacing={4}>

        <Card className={`ohm-card secondary ${isSmallScreen  && "mobile"}`}>
          <div className="card-header">
            <h5>Bond (1, 1)</h5>
          </div> 

          <div className="card-content">    
						<Grid container item xs={12} spacing={2}>
							<Grid item sm={7} lg={9}>
								<h3>Treasury Balance</h3>
								<h2>$17,590,059</h2>
							</Grid>
							
							<Grid item xs={5} sm={5} lg={3} className="ohm-price">
								<h3>OHM Price</h3>
								<h2>{trim(marketPrice, 2)}</h2>
							</Grid>
						</Grid>
          </div>
        </Card>
          
        <Card className={`ohm-card primary ${isSmallScreen && "mobile"}`}>
          <div className="card-header">
            <h5>Available Bonds</h5>
          </div>  
					{ !isSmallScreen ?
          		<div className="card-content">
								<TableContainer>
									<Table aria-label="Available bonds">
										<TableHead>
											<TableRow>
												<TableCell align="left">Bond Type</TableCell>
												<TableCell align="center">Bond Price</TableCell>
												<TableCell>ROI</TableCell>
												<TableCell>Purchased</TableCell>
												<TableCell align="right"></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{ // Object.keys(BONDS).map(bond => (
												["ohm_dai_lp", "dai"].map(bond => (
												<BondTableData key={bond} bond={bond} />
											)) }
										</TableBody>
									</Table>
								</TableContainer>
							</div>
							:
							<>
								{ // Object.keys(BONDS).map(bond => (
									["ohm_dai_lp", "dai"].map(bond => (
										<div className="card-content">
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
