/* eslint-disable no-alert */
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { changeStake, getApproval, TYPES, ACTIONS } from "../../actions/Migrate.actions";
import "../../style.scss";

function Migrate({ provider, address }) {
  const dispatch = useDispatch();

  const [view, setView] = useState("unstake");
  const [quantity, setQuantity] = useState(0);

  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });

  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });

  const oldSohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.oldsohm;
    // return 420.69;
  });

  // Stake allownace for the new contract
  const stakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.stakeAllowance;
  });

  // Unstake allowance from the old contract
  const unstakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.unstakeAllowance;
  });

  const newStakingAPY = useSelector(state => {
    return (state.app && state.app.stakingAPY) || 0;
  });

  const oldStakingAPY = useSelector(state => {
    return (state.app && state.app.oldStakingAPY) || 0;
  });

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
      if (token === "sohm") return unstakeAllowance > 0;
      if (token === "ohm") return stakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const setMax = () => {
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(ohmBalance);
    }
  };

  useEffect(() => {
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(ohmBalance);
    }
  }, [view]);

  useEffect(() => {
    // setView based on sohm(new) vs sohm(old) balance
    // if there is any sohm(old) set to unstake
    if (oldSohmBalance > 0) setView("unstake");
    else if (ohmBalance > 0) setView("stake");
    else setView("done");
  }, [oldSohmBalance, ohmBalance]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
        <div className="dapp-modal-wrapper d-flex align-items-center flex-column">
          <div className="migrate-breadcrumbs">
            <p>
              <span className={`${view === "unstake" ? "active" : "complete"}`}>
                <i className={ (view === "stake" || view === "done") ? "fas fa-check" : ""} />
                Unstake (old)
              </span>
              <i className="fas fa-long-arrow-alt-right" />
              <span className={`${view === "stake" ? "active" : view === "done" ? "complete" : ""}`}>
                <i className={view === "done" ? "fas fa-check" : ""} />
                Stake (new)
              </span>

              <i className="fas fa-long-arrow-alt-right" />
              <span className={`${view === "done" ? "complete" : ""}`}>Profit</span>
            </p>
          </div>

          <div className="swap-input-column">
            {/* <div className="stake-toggle-row"> */}

            {/* </div> */}

            <div className="d-flex help-message">
              {view === "unstake" && (
                <p>
                  Hey Ohmie, Olympus is updating the staking contract. But to keep earning those juicy
                  rewards you will need to unstake from the old sOHM contract and stake to the new one.
                  <br />
                  <br />
                  
                    <strong>Step 1.</strong> Unstake your old sOHM below
                    <br />
                    <em>Note: you may need to click "Approve" before unstaking.</em>
                  
                </p>
              )}

              {view === "stake" && (
                <p>
                  Nice, youre already almost done. Simply Approve and restake below.
                  <br />
                  <br />
                  
                    <strong>Step 2.</strong> Click Approve
                    <br />
                    <strong>Step 3.</strong> Click Stake
                  
                </p>
              )}

              {view === "done" && (
                <p>
                  Youre all set! All OHM staked is on the new contract. Keep it (3,3) fren
                  <br />
                  <br />
                </p>
              )}
            </div>

            {view === "stake" || view === "unstake" ? (
              <div>
                <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
                  <input
                    value={quantity}
                    // onChange={e => setQuantity(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="Type an amount"
                  />
                </div>

                <div className="stake-price-data-column">
                  <div className="stake-price-data-row">
                    <p className="price-label">Ohm Balance</p>
                    <p className="price-data">{trim(ohmBalance, 4)} OHM</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (New)</p>
                    <p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
                  </div>
                  <div className="stake-price-data-row">
                    <p className="price-label">APY (New)</p>
                    <p className="price-data">{trim(newStakingAPY * 100, 4)}%</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (Legacy)</p>
                    <p className="price-data">{trim(oldSohmBalance, 4)} sOHM</p>
                  </div>
                  <div className="stake-price-data-row">
                    <p className="price-label">APY (Legacy)</p>
                    <p className="price-data">{trim(oldStakingAPY * 100, 4)}%</p>
                  </div>
                </div>

                {address && hasAllowance("ohm") && view === "stake" && (
                  // This button was combined with the approve stake button. 
                  <div className="align-self-center mb-2" style={{textAlign: "center"}}>
                    <div
                      className="stake-button"
                      onClick={() => {
                        stakeOhm();
                        setView("done");
                      }}
                    >
                      Stake OHM (new)
                    </div>
                  </div>
                )}

                {address && hasAllowance("sohm") && view === "unstake" && (
                  <div className="align-self-center mb-2" style={{textAlign: "center"}}>
                    <div
                      className="stake-button"
                      onClick={() => {
                        unStakeLegacy();
                        setView("stake");
                      }}
                    >
                      Unstake sOHM (legacy)
                    </div>
                  </div>
                )}

                {address && !hasAllowance("ohm") && view === "stake" && (
                  <div className="align-self-center mb-2" style={{ textAlign: "center" }}>
                    <div
                      className="stake-button"
                      onClick={() => {
                        getStakeApproval();
                      }}
                    >
                      Approve Stake
                    </div>
                  </div>
                )}

                {address && !hasAllowance("sohm") && view === "unstake" && (
                  <div className="align-self-center mb-2" style={{textAlign: "center"}}>
                    <div
                      className="stake-button"
                      onClick={() => {
                        getUnstakeLegacyApproval();
                      }}
                    >
                      Approve Unstake
                    </div>
                  </div>
                )}

                {address &&
                  ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                    <div className="d-flex align-self-center mb-2">
                      <div>
                        The "Approve" action is only required when staking or unstaking to/from a contract for the first
                        time
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <div className="stake-price-data-column">
                  <div className="stake-price-data-row">
                    <p className="price-label">Ohm Balance</p>
                    <p className="price-data">{trim(ohmBalance, 4)} OHM</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (New)</p>
                    <p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
                  </div>
                  <div className="stake-price-data-row">
                    <p className="price-label">APY (New)</p>
                    <p className="price-data">{trim(newStakingAPY * 100, 4)}%</p>
                  </div>

                  <div className="stake-price-data-row">
                    <p className="price-label">Staked (Legacy)</p>
                    <p className="price-data">{trim(oldSohmBalance, 4)} sOHM</p>
                  </div>
                  <div className="stake-price-data-row">
                    <p className="price-label">APY (Legacy)</p>
                    <p className="price-data">{trim(oldStakingAPY * 100, 4)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Migrate;
