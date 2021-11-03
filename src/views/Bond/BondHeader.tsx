import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Typography, IconButton, SvgIcon, Link } from "@material-ui/core";

import BondLogo from "../../components/BondLogo";
import useEscape from "../../hooks/useEscape";
import AdvancedSettings from "./AdvancedSettings";
import { BondOpts } from "../../lib/Bond";
import { IBondDetails } from "../../slices/BondSlice";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";

type Props = {
  bond: IBondDetails & BondOpts;
  slippage: number;
  recipientAddress: string;
  onRecipientAddressChange(value: string | number): void;
  onSlippageChange(value: string | number): void;
};

function BondHeader({ bond, slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }: Props) {
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
