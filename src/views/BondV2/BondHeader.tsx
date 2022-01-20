import { IconButton, Link, SvgIcon, Typography } from "@material-ui/core";
import { TokenStack } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import useEscape from "../../hooks/useEscape";
import { BondOpts } from "../../lib/Bond";
import { IBondDetails } from "../../slices/BondSlice";
import { IBondV2 } from "../../slices/BondSliceV2";
import AdvancedSettings from "../BondV2/AdvancedSettings";

type InputEvent = ChangeEvent<HTMLInputElement>;

interface IBondHeaderProps {
  bond: (IBondDetails & BondOpts) | IBondV2;
  slippage: number;
  recipientAddress: string;
  onRecipientAddressChange(e: InputEvent): void;
  onSlippageChange(e: InputEvent): void;
}

function BondHeader({
  bond,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}: IBondHeaderProps) {
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEscape(() => {
    if (open) handleClose;
    else history.push(`/bonds-v1`);
  });

  return (
    <div className="bond-header">
      <Link component={NavLink} to="/bonds-v1" className="cancel-bond">
        <SvgIcon color="primary" component={XIcon} />
      </Link>

      <div className="bond-header-logo">
        <TokenStack tokens={bond.bondIconSvg} />
        <div className="bond-header-name">
          <Typography variant="h5">{`${bond.displayName} (v1 Bond)`}</Typography>
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
