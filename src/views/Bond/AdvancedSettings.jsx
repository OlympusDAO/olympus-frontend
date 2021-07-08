<<<<<<< HEAD
<<<<<<< HEAD
=======
import React from "react";
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
import { Typography, Box } from "@material-ui/core";
>>>>>>> removed unneeded rebase timer styles, replaced bond cancel with styled icon, began styling for bond settings. main things left are new icons and input fields
import "./bondSettings.scss";

function AdvancedSettings({ slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }) {
  return (
    <Box className="ohm-popover-card">
      <div className="card-body">
        <Typography variant="h3">Hades</Typography>
        <form>
          <div>
            <label htmlFor="slippage" className="form-label">
              Slippage
            </label>

            <div className="input-group ohm-input-group">
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
              <Typography variant="body2">Transaction may revert if price changes by more than slippage %</Typography>
            </div>
          </div>

          <div>
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
    </Box>
  );
}

export default AdvancedSettings;
