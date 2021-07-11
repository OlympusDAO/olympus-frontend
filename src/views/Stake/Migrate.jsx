import { useState, useCallback, useEffect } from "react";
import { Grid, Backdrop, Paper, Fade, Breadcrumbs } from "@material-ui/core";
import { changeStake, getApproval, TYPES, ACTIONS } from "../../actions/Migrate.actions";
import { useSelector, useDispatch } from "react-redux";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import ClearIcon from "@material-ui/icons/Clear";
import { trim } from "../../helpers";
import { Flex } from "rimble-ui";
import { NavLink } from "react-router-dom";
import "./stake.scss";
import "./migrate.scss";

// this will need to know the users ohmBalance, stakedSOHM, and stakedWSOHM

export default function Migrate({ address, provider, web3Modal, loadWeb3Modal }) {
  const dispatch = useDispatch();
  const [view, setView] = useState("unstake"); // views = (approve) > unstake > approve > stake > done
  const [currentStep, setCurrentStep] = useState("1"); // steps = 1,2,3,4
  const [quantity, setQuantity] = useState();

  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.app.staking && state.app.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.unstakeAllowance;
  });
  const newStakingAPY = useSelector(state => {
    return (state.app && state.app.stakingAPY) || 0;
  });

  const oldStakingAPY = useSelector(state => {
    return (state.app && state.app.oldStakingAPY) || 0;
  });

  const setMax = () => {
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const getStakeApproval = async () => {
    const dispatchObj = getApproval({
      type: TYPES.NEW,
      networkID: 1,
      provider,
      address,
    });
    await dispatch(dispatchObj);
  };

  const getUnstakeLegacyApproval = async () => {
    const dispatchObj = getApproval({
      type: TYPES.OLD,
      networkID: 1,
      provider,
      address,
    });
    await dispatch(dispatchObj);
  };

  const unStakeLegacy = async () => {
    if (Number.isNaN(quantity) || quantity === 0 || quantity === "") {
      alert("Please enter a value!");
      return;
    }

    await dispatch(
      changeStake({ action: ACTIONS.UNSTAKE, address, value: quantity.toString(), provider, networkID: 1 }),
    );
  };

  const stakeOhm = async () => {
    if (Number.isNaN(quantity) || quantity === 0 || quantity === "") {
      alert("Please enter a value!");
      return;
    }

    await dispatch(changeStake({ action: ACTIONS.STAKE, address, value: quantity.toString(), provider, networkID: 1 }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance],
  );

  useEffect(() => {
    // here we check the user's sohm and wsohm balance
    // if they still have sohm (old) they remain on step 1 (unstake)
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(ohmBalance);
    }

    if (oldSohmBalance > 0) {
      setCurrentStep("1");
    } else if (sohmBalance > 0) {
      setCurrentStep("3");
    } else {
      setCurrentStep("2");
    }
  }, [view]);

  useEffect(() => {
    // setView based on sohm(new) vs sohm(old) balance
    // if there is any sohm(old) set to unstake
    if (oldSohmBalance > 0) {
      setCurrentStep("1");
      setView("unstake");
    } else if (ohmBalance > 0) {
      setCurrentStep("2");
      setView("stake");
    } else {
      setCurrentStep("3");
      setView("done");
    }
  }, [ohmBalance, oldSohmBalance, sohmBalance, stakeAllowance, unstakeAllowance]);

  useEffect(() => {
    // setView based on sohm(new) vs sohm(old) balance
    // if there is any sohm(old) set to unstake
    if (oldSohmBalance > 0) setView("unstake");
    else if (ohmBalance > 0) setView("stake");
    else setView("done");
  }, []);

  let modalButton = <></>;
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButton = (
        <button type="button" className="btn stake-button btn-overwrite-primer m-2" onClick={loadWeb3Modal}>
          Connect Wallet
        </button>
      );
    }
  }

  return (
    <Grid container id="sohm-migration-view">
      <Backdrop open={true}>
        <Paper className="ohm-card ohm-modal">
          <div className="card-header">
            <h3>sOHM Migration</h3>
            <div role="button" className="cancel">
              <NavLink to="/stake" className="cancel-migrate">
                <p>
                  <ClearIcon /> Cancel
                </p>
              </NavLink>
            </div>
          </div>

          {!address ? (
            <div className="stake-wallet-notification">
              <h4>Connect your wallet to continue</h4>
              <div className="wallet-menu" id="wallet-menu">
                <button type="button" className="btn stake-button btn-overwrite-primer m-2" onClick={loadWeb3Modal}>
                  Connect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <div className="stake-migration-help">
                {view === "unstake" && (
                  <p>
                    Hey Ohmie, Olympus is updating the staking contract. So in order to continue earning those juicy
                    rewards you'll need to unstake your sOHM from the old contract and restake it to the new sOHM
                    contract.
                  </p>
                )}

                {view === "stake" && (
                  <p>Youre almost done, all thats left now is to Stake your OHM to the new contract.</p>
                )}

                {view === "done" && <h4>Youre good to go, all OHM is staked to the new contract.</h4>}
              </div>

              <Breadcrumbs className={`migration-breadcrumbs`} separator={<DoubleArrowIcon fontSize="medium" />}>
                <div
                  role="button"
                  onClick={() => {
                    setView("unstake");
                  }}
                  className={`${currentStep === "1" ? "current-step" : "finished-step"}`}
                >
                  Step 1: Unstake sOHM (old)
                </div>
                <div
                  role="button"
                  onClick={() => {
                    setView("stake");
                  }}
                  className={`${currentStep === "2" && "current-step"} ${currentStep === "3" && "finished-step"}`}
                >
                  Step 2: Stake sOHM (new)
                </div>
              </Breadcrumbs>

              {view !== "done" ? (
                <>
                  <Flex className="stake-action-row">
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
                      {/* <button type="button" onClick={setMax}>
											Max
										</button> */}
                    </div>

                    {address && hasAllowance("sohm") && view === "unstake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          unStakeLegacy();
                          setView("stake");
                        }}
                      >
                        Unstake sOHM (legacy)
                      </div>
                    )}

                    {address && hasAllowance("ohm") && view === "stake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          stakeOhm();
                          setView("done");
                        }}
                      >
                        Stake OHM (new)
                      </div>
                    )}

                    {address && !hasAllowance("sohm") && view === "unstake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          getUnstakeLegacyApproval();
                        }}
                      >
                        Approve Unstake (legacy)
                      </div>
                    )}

                    {address && !hasAllowance("ohm") && view === "stake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          getStakeApproval();
                        }}
                      >
                        Approve Stake (new)
                      </div>
                    )}
                  </Flex>

                  <div className="stake-notification">
                    {address &&
                      ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                        <em>
                          <p>
                            "Approve" transaction is only needed when staking/unstaking for the first time; subsequent
                            staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.
                          </p>
                        </em>
                      )}
                  </div>
                </>
              ) : (
                <div>
                  <p> All you gotta do now is keep it (3, 3)</p>
                </div>
              )}

              <div className={`stake-user-data`}>
                <div className="stake-price-data-column">
                  <div className="stake-price-data-row">
                    <p className="price-label">Ohm Balance</p>
                    <p className="price-data">{trim(ohmBalance)} OHM</p>
                  </div>

                  <br />

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (new)</p>
                    <p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">APY (New)</p>
                    <p className="price-data">{trim(newStakingAPY * 100, 4)}%</p>
                  </div>

                  <br />

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (legacy)</p>
                    <p className="price-data">{trim(oldSohmBalance, 4)} sOHM</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">APY (Legacy)</p>
                    <p className="price-data">{trim(oldStakingAPY * 100, 4)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Paper>
      </Backdrop>
    </Grid>
  );
}
