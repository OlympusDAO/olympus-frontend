import React, { useState, useCallback } from "react";
import { Grid, Modal, Backdrop, Fade, Breadcrumbs } from "@material-ui/core";
import { changeStake, changeApproval } from "../../actions/Stake.actions";
import { useSelector, useDispatch } from "react-redux";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ClearIcon from '@material-ui/icons/Clear';
import { trim } from "../../helpers";
import { Flex } from "rimble-ui";
import { NavLink } from "react-router-dom";
import "./stake.scss";



// this will need to know the users ohmBalance, stakedSOHM, and stakedWSOHM

export default function Migrate({ 
	address,
	provider,
	web3Modal,
	loadWeb3Modal
}) {
	const dispatch = useDispatch();
	const [view, setView] = useState("unstake"); // this is the first step
	const [quantity, setQuantity] = useState();

	const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.app.staking && state.app.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.app.staking && state.app.staking.ohmUnstake;
  });

	const setMax = () => {
    if (view === "unstake") {
      setQuantity(sohmBalance);
    } else {
      // setQuantity(wsohmBalance); // we need a getter for this
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      alert("Please enter a value!");
    } else {
      await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: 1 }));
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

	let modalButton = <></>;
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButton = (
        <button type="button" className="btn top-bar-button btn-overwrite-primer m-2" onClick={loadWeb3Modal}>
          Connect Wallet
        </button>
      );
    }
  }

	return (
		<Grid container id="sohm-migration-view">
			<Backdrop open={true}>
			<div className="ohm-card primary">
						<div className="card-header">
							<h3>sOHM Migration</h3>
							
							<div role="button" className="cancel">
								<NavLink to="/stake" className="cancel-migrate">
									<p><ClearIcon/> Cancel</p> 
								</NavLink>
							</div>
						</div>
						<div className="card-content">
							<Breadcrumbs className="migration-breadcrumbs" separator={<NavigateNextIcon fontsize="small" />}>
								<div role="button" onClick={() => {setView("unstake") }}>
									Unstake sOHM (old)
								</div>
								<div role="button" onClick={() => { setView("stake") }}>
									Stake sOHM (new)
								</div>
							</Breadcrumbs>
						</div>

						{!address ? (
							<div className="stake-wallet-notification">
								<h4>Connect your wallet to continue</h4>
								<div className="wallet-menu" id="wallet-menu">
									<button
										type="button"
										className="btn stake-button btn-overwrite-primer m-2"
										onClick={loadWeb3Modal}
										key={1}
									>
										Connect Wallet
									</button>
								</div>
							</div>
						) : (
						<div>
						<Grid item>
							<Flex className="stake-action-row">
								<div className="stake-migration-help">
									{view === "unstake" ? (
										<>
											<p>
												Hey Ohmie, dont panic - Olympus is just updating its  
											  staking contract. But in order to continue earning those
												juicy rewards you will need to unstake your old sOHM, 
												and restake the resulting OHM on the new sOHM contract. 
											</p>
										</>
									) : (
										<>
											<p>
												Youre almost there. Go ahead and hit it "Max", press Stake, and keep it (3,3) fren
											</p>
										</>
									)}
								</div>
								<div className="input-group ohm-input-group">
									<div className="logo-holder">
										<div className="ohm-logo-bg">
											<img
												className="ohm-logo-tiny"
												src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
											/>
										</div>
									</div>
									<input
										value={quantity}
										onChange={e => setQuantity(e.target.value)}
										type="number"
										className="form-control stake-input"
										placeholder="Type an amount"
									/>
									<button type="button" onClick={setMax}>
										Max
									</button>
								</div>

								{address && (hasAllowance("sohm") && view === "unstake") && (
									<div
										className="stake-button"
										onClick={() => {
											// onChangeStake("unstake");
											setView("stake")
										}}
									>
										Unstake sOHM (old)
									</div>
								)}

								{address && (hasAllowance("wsohm" || "sohm") && view === "stake") && (
									<div
										className="stake-button"
										onClick={() => {
											// onChangeStake("stake");
										}}
									>
										Stake sOHM (new)
									</div>
								)}

								{address && (!hasAllowance("sohm") && view === "unstake") && (
									<div
										className="stake-button"
										onClick={() => {
											// onSeekApproval("sohm");
										}}
									>
										Approve
									</div>
								)}

								{address && (hasAllowance("wsohm" || "sohm") && view === "stake") && (
									<div
										className="stake-button"
										onClick={() => {
											// onSeekApproval("wsohm");
										}}
									>
										Approve
									</div>
								)}
							</Flex>

							<div className="stake-notification">
								{address &&
									!hasAllowance("sohm") && (
										<em>
											<p>
												Important: The "Approve" transaction is only needed when staking/unstaking for the first time;
												subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.
											</p>
										</em>
									)}
							</div>
						</Grid>

						<Grid item>
							

						<div className={`stake-user-data`}>
								<div className="stake-price-data-column">
								<div className="stake-price-data-row">
									<p className="price-label">Ohm Balance</p>
									<p className="price-data">{trim(ohmBalance)} OHM</p>
								</div>

								<div className="stake-price-data-row">
									<p className="price-label">Staked (new contract)</p>
									{/* replace below with wsohmBalance */}
									<p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
								</div>

								<div className="stake-price-data-row">
									<p className="price-label">Staked (legacy)</p>
									<p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
								</div>
							</div>
							
						
						</div>
						</Grid>
						</div>
				)}
					</div>

			</Backdrop>
		</Grid>
	)
}