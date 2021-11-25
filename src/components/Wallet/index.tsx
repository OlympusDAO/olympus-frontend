import { useState } from "react";

import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialWalletView from "./InitialWalletView";
import { Drawer, SvgIcon, Button, Typography, Box, IconButton, ButtonProps, useTheme } from "@material-ui/core";
import { t } from "@lingui/macro";

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const theme = useTheme();
  const { connect, connected } = useWeb3Context();
  const onClick = connected ? openWallet : connect;
  const label = connected ? t`Wallet` : t`Connect Wallet`;
  return (
    <Button id="ohm-menu-button" variant="contained" color="secondary" onClick={onClick}>
      <SvgIcon component={WalletIcon} color="primary" style={{ marginRight: theme.spacing(1) }} />
      <Typography>{label}</Typography>
    </Button>
  );
  // connected ? <OpenWalletButton onClick={openWallet} /> : <ConnectButton onClick={connect} />;
};

// const PendingTxsList = ({ pendingTxs, anchorEl }) => {
//   <Popper id={id} open={open} anchorEl={walletButtonRef.current} placement="bottom-end">
//             <Fade {...TransitionProps} timeout={100}>
//               <Paper className="ohm-menu" elevation={1}>
//                 {pendingTransactions.map(({ txnHash, text }) => (
//                   <Box key={txnHash} fullWidth>
//                     <Link key={txnHash} href={getEtherscanUrl({ chainID, txnHash })} target="_blank" rel="noreferrer">
//                       <Button size="large" variant="contained" color="secondary" fullWidth>
//                         <Typography align="left">
//                           {text} <SvgIcon component={ArrowUpIcon} />
//                         </Typography>
//                       </Button>
//                     </Link>
//                   </Box>
//                 ))}
//               </Paper>
//             </Fade>
//       </Popper>
// }

export function Wallet() {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);

  // const pendingTransactions = useSelector(state => {
  //   return state.pendingTransactions;
  // }); // [{ txnHash: "3241141", text: "test" }];

  return (
    <>
      <WalletButton openWallet={openWallet} />
      <Drawer style={{ width: "400px" }} anchor="right" open={isWalletOpen} onClose={closeWallet}>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <IconButton onClick={closeWallet} aria-label="close wallet">
            <SvgIcon component={CloseIcon} color="primary" />
          </IconButton>
        </Box>
        <InitialWalletView />
      </Drawer>
    </>
  );
}
