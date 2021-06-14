/* eslint-disable no-alert */
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { changeStake, getApproval, TYPES, ACTIONS } from "../../actions/Migrate.actions";

// This view will only allow you to Unstake sOHm --> ohm and then stake Ohm --> wsOhm
function Migrate({ provider, address }) {
  const dispatch = useDispatch();

  const [view, setView] = useState("unstake");
  const [quantity, setQuantity] = useState();

  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });

  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });

  const oldSohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.oldsohm;
  });

  // Stake allownace for the new contract
  const stakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.stakeAllowance;
  });

  // Unstake allowance from the old contract
  const unstakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.unstakeAllowance;
  });

  const setMax = () => {
    if (view === "stake") {
      setQuantity(ohmBalance);
      return;
    }
    // Otherwise max the sohm balance
    setQuantity(sohmBalance);
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
      if (token === "sohm") return stakeAllowance > 0;
      if (token === "ohm") return unstakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance],
  );

  // TODO:
  //  - Remove max button
  //  - Set value = ohmBalance, sOhmbalance (depending on view)
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
        <div className="dapp-modal-wrapper d-flex align-items-center">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${view === "unstake" ? "btn-light" : ""}`}
                  onClick={() => {
                    setView("unstake");
                  }}
                >
                  Unstake
                </button>
                <button
                  type="button"
                  className={`btn ${view === "stake" ? "btn-light" : ""}`}
                  onClick={() => {
                    setView("stake");
                  }}
                >
                  Stake
                </button>
              </div>
            </div>

            <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
              <input
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                type="number"
                className="form-control"
                placeholder="Type an amount"
              />

              <button className="btn" type="button" onClick={setMax}>
                Max
              </button>
            </div>

            <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Ohm Balance</p>
                <p className="price-data">{trim(ohmBalance, 4)} OHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Staked</p>
                <p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Staked (Legacy)</p>
                <p className="price-data">{trim(oldSohmBalance, 4)} sOHM</p>
              </div>
            </div>

            {address && hasAllowance("ohm") && view === "stake" && (
              <div className="d-flex align-self-center mb-2">
                <div
                  className="stake-button"
                  onClick={() => {
                    stakeOhm();
                  }}
                >
                  Stake OHM
                </div>
              </div>
            )}

            {address && hasAllowance("sohm") && view === "unstake" && (
              <div className="d-flex align-self-center mb-2">
                <div
                  className="stake-button"
                  onClick={() => {
                    unStakeLegacy();
                  }}
                >
                  Unstake sOHM
                </div>
              </div>
            )}

            {address && !hasAllowance("ohm") && view === "stake" && (
              <div className="d-flex align-self-center mb-2">
                <div
                  className="stake-button"
                  onClick={() => {
                    getStakeApproval();
                  }}
                >
                  Approve OHM
                </div>
              </div>
            )}

            {address && !hasAllowance("sohm") && view === "unstake" && (
              <div className="d-flex align-self-center mb-2">
                <div
                  className="stake-button"
                  onClick={() => {
                    getUnstakeLegacyApproval();
                  }}
                >
                  Approve sOHM
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
