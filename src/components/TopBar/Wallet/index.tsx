import { useState } from "react";

import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialWalletView from "./InitialWalletView";
import ConnectMenu from "../ConnectMenu";
import { Drawer, SvgIcon, Button, Typography, Box, IconButton, ButtonProps, useTheme } from "@material-ui/core";
import { t } from "@lingui/macro";

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, connected } = useWeb3Context();
  const onClick = connected ? openWallet : connect;
  const label = connected ? t`Wallet` : t`Connect Wallet`;
  const theme = useTheme();
  return (
    <Button id="ohm-menu-button" variant="contained" color="secondary" onClick={onClick}>
      <SvgIcon component={WalletIcon} color="primary" style={{ marginRight: theme.spacing(1) }} />
      <Typography>{label}</Typography>
    </Button>
  );
};

export function Wallet() {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);
  const theme = useTheme();

  return (
    <>
      <WalletButton openWallet={openWallet} />
      <Drawer style={{ width: "460px" }} anchor="right" open={isWalletOpen} onClose={closeWallet}>
        <InitialWalletView onClose={closeWallet} />
      </Drawer>
    </>
  );
}

export default Wallet;
