import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim } from "../../helpers";
import { Flex, Box, Card } from "rimble-ui";
import "./dashboard.scss";


function Dashboard({ provider, address }) {
	const marketPrice = useSelector((state ) => { return state.app.marketPrice });
	const circSupply  = useSelector((state ) => { return state.app.circulating });
	const totalSupply = useSelector((state ) => { return state.app.total });

  const marketCap = () => {
    if (marketPrice && circSupply)
      return marketPrice * (circSupply / Math.pow(10, 9))
  };

	return (
			<div className="dashboard-view">
				<Flex className="top-row-data">
					<Box width={ 1 / 3 } p={3} m={3}>
						<div className="ohm-dashboard-card">
						
							<div className="card-body">
								<h5>
								Price (SushiSwap OHM-DAI Pool)
								<a
										href="https://analytics.sushi.com/pairs/0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c"
										target="_blank"
								>
										<i className="fas fa-external-link-alt fa-sm ms-1"></i>
								</a>
								</h5>
								<div className="my-auto">
									<h1 className="text-center">
										${ trim(marketPrice, 2) }
									</h1>
								</div>
							</div>
						
						</div>
					</Box> 
					

					<Box width={ 1 / 3 } p={3} m={3}>
        		<div className="ohm-dashboard-card">
							<div className="card-body">
								<h5>Market Cap</h5>
								<h1 className="text-center">
                  {
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(marketCap()  )

                  }
								</h1>
							</div>
        		</div>
					</Box>


					<Box width={ 1 / 3 } p={3} m={3}>
						<div className="ohm-dashboard-card">
							<div className="card-body">
								<h5>Supply (circulating/total)</h5>
								<h1 className="text-center">
                  {
                    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(circSupply / Math.pow(10,9))
                  }
                  /
                  {
                    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(totalSupply / Math.pow(10,9))
                  }
								</h1>
							</div>
						</div>
					</Box>
				</Flex>

				<Flex className="main-data-area">
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
								title="Total Value Staking"
							></iframe>
						</div>
					</div>
				
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
								title="Market value of Treasury"
							></iframe>
						</div>
					</div>
			
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/29153/58862/b6d18145-763a-48b6-ac4c-a8e43ec1c1f6"
								title="Risk Free Value of Treasury"
							></iframe>
						</div>
					</div>
				
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
								title="Total Value Staking"
							></iframe>
						</div>
					</div>
				

					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/27661/55859/fd0e3db2-d033-4000-9f70-c65de52ef9a9"
								title="Holders"
							></iframe>
						</div>
					</div>
				
				
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/34202/69216/17e353f6-ccb4-42ff-b6cb-150f69543f4d"
								title="APY Over Time"
							></iframe>
						</div>
					</div>
				
				
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/28756/58813/c7893c75-d8f1-421e-85c3-556a22cd7885"
								title="OHM Stakers"
							></iframe>
						</div>
					</div>
				
				
					<div className="olympus-card">
						<div className="card-body">
							<iframe
								frameBorder={"0"}
								src="https://duneanalytics.com/embeds/37326/74014/f0ad674a-2787-4314-b534-86dc1b910922"
								title="Runway Available"
							></iframe>
						</div>
					</div>
				</Flex>
			</div>
	)
}

export default Dashboard;
