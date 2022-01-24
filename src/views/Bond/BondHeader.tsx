import { IconButton, Link, Typography } from "@material-ui/core";
import { Icon, TokenStack } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import useEscape from "../../hooks/useEscape";
import { BondOpts } from "../../lib/Bond";
import { IBondDetails } from "../../slices/BondSlice";
import AdvancedSettings from "../BondV2/AdvancedSettings";

type InputEvent = ChangeEvent<HTMLInputElement>;

interface IBondHeaderProps {
  bond: IBondDetails & BondOpts;
  slippage: string;
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
        <Icon color="primary" name="x" />
      </Link>

      <div className="bond-header-logo">
        <TokenStack tokens={bond.bondIconSvg} />
        <div className="bond-header-name">
          <Typography variant="h5">{`${bond.displayName} (v1 Bond)`}</Typography>
        </div>
      </div>

      <div className="bond-settings">
        <IconButton onClick={handleOpen}>
          <Icon color="primary" name="settings" />
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
