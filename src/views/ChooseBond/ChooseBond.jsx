import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Card } from "rimble-ui";
import "../Stake/stake.scss";
import { BondTableData } from './BondRow';
import { BONDS } from "../../constants";


function ChooseBond({ provider, address }) {
	const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });	
	const marketPrice = useSelector((state ) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });
	
	return (
		<Grid container id="choose-bond-view" justify="center" spacing={4}>

        <Card className="ohm-card secondary">
          <div className="card-header">
            <h5>Bond (1, 1)</h5>
          </div> 

          <div className="card-content">    
						<Grid container item xs={12}>
							<Grid item xs={12} sm={7} lg={9}>
								<h3>Treasury Balance</h3>
								<h2>$17,590,059</h2>
							</Grid>
							
							<Grid item xs={12} sm={5} lg={3}>
								<h3>OHM Price</h3>
								<h2>239.90</h2>
							</Grid>
						</Grid>
          </div>
        </Card>
          
        <Card className="ohm-card primary">
          <div className="card-header">
            <h5>Available Bonds</h5>
          </div>  
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
        </Card>
    </Grid>
	);
  }
  
  export default ChooseBond;
