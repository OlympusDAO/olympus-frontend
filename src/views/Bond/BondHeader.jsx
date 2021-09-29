import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import BondLogo from "../../components/BondLogo";
import AdvancedSettings from "./AdvancedSettings";
import { Typography, IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import useEscape from "../../hooks/useEscape";

function BondHeader({ bond, slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  useEscape(() => {
    if (open) handleClose;
    else history.push("/bonds");
  });

  return (
    <div className="bond-header">
      <Link component={NavLink} to="/bonds" className="cancel-bond">
        <SvgIcon color="primary" component={XIcon} />
      </Link>

      <div className="bond-header-logo">
        <BondLogo bond={bond} />
        <div className="bond-header-name">
          <Typography variant="h5">{bond.displayName}</Typography>
        </div>
      </div>

      <div className="bond-settings">
        <IconButton onClick={handleOpen}>
          <SvgIcon color="primary" component={SettingsIcon} />
        </IconButton>
        <AdvancedSettings
          open={open}
          handleClose={handleClose}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        />
      </div>
    </div>
  );
}

export default BondHeader;
