import { useState } from "react";
import { NavLink } from "react-router-dom";
import BondLogo from "../../components/BondLogo";
import AdvancedSettings from "./AdvancedSettings";
import { bondName } from "../../helpers";
import { Typography, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings-cog.svg";

function BondHeader({ bond, slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bond-header">
      <div className="bond-settings">
        <IconButton onClick={() => setShowMenu(!showMenu)}>
          <SettingsIcon />
        </IconButton>

        {showMenu && (
          <AdvancedSettings
            slippage={slippage}
            recipientAddress={recipientAddress}
            onRecipientAddressChange={onRecipientAddressChange}
            onSlippageChange={onSlippageChange}
          />
        )}
      </div>

      <div className="bond-header-logo">
        <BondLogo bond={bond} />
        <div className="bond-header-name">
          <Typography>{bondName(bond)}</Typography>
        </div>
      </div>

      <NavLink to="/bonds" className="cancel-bond">
        <ClearIcon color="primary" />
      </NavLink>
    </div>
  );
}

export default BondHeader;
