import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "../../actions/Stake.actions";

// This view will only allow you to Unstake sOHm --> ohm and then stake Ohm --> wsOhm
function Migrate({ provider, address }) {
  const dispatch = useDispatch();

  const [view, setView] = useState("unstake");
  const [quantity, setQuantity] = useState();

  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });

  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.wsohm;
  });

  const stakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.ohm;
  });
  const unstakeAllowance = useSelector(state => {
    return state.app.migrate && state.app.migrate.sohm;
  });

  const setMax = () => {
    // Only want sOhm balance to be max, regardless of stake/unstake
    if (view === "stake") {
      setQuantity(ohmBalance);
      return;
    }

    setQuantity(sohmBalance);
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
  };

  const onChangeStake = async action => {
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      alert("Please enter a value!");
      return;
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: 1 }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "sohm") return stakeAllowance > 0;
      if (token === "ohm") return unstakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance],
  );

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
                <p className="price-data">{trim(wsohmBalance, 4)} wsOHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Staked (Legacy)</p>
                <p className="price-data">{trim(sohmBalance, 4)} sOHM</p>
              </div>
            </div>

            {address && hasAllowance("ohm") && view === "stake" && (
              <div className="d-flex align-self-center mb-2">
                <div
                  className="stake-button"
                  onClick={() => {
                    onChangeStake("stake");
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
                    onChangeStake("unstake");
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
                    onSeekApproval("ohm");
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
                    onSeekApproval("sohm");
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
