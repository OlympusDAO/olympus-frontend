import React from "react";
import "./bondSettings.scss";

function AdvancedSettings({ slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }) {
  return (
    <div className="card ohm-popover-card">
      <div className="card-body">
        <h2 className="card-title mb-4">Hades</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="slippage" className="form-label">
              Slippage
            </label>

            <div className="input-group ohm-input-group flex-nowrap d-flex">
              <input
                value={slippage}
                onChange={onSlippageChange}
                type="number"
                max="100"
                min="100"
                className="form-control ohm-form-control"
                id="slippage"
              />
              <span className="input-group-text" id="basic-addon2">
                %
              </span>
            </div>
            <div id="emailHelp" className="form-text">
              Transaction may revert if price changes by more than slippage %
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="slippage" className="form-label">
              Recipient Address
            </label>

            <div className="ohm-input-group">
              <input
                value={recipientAddress}
                onChange={onRecipientAddressChange}
                type="text"
                className="form-control ohm-form-control"
              />
            </div>
            <div className="form-text">
              Choose recipient address. By default, this is your currently connected address
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdvancedSettings;
