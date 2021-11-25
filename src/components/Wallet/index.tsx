import { useState } from "react";

import { ReactComponent as CloseIcon } from "../../assets/icons/x.svg";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import { useWeb3Context } from "../../hooks/web3Context";
import InitialWalletView from "./InitialWalletView";
import { Drawer, SvgIcon, Button, Typography, Box, IconButton, ButtonProps } from "@material-ui/core";
import { useSelector } from "react-redux";

const WalletButtonBase = (props: ButtonProps) => (
  <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" {...props} />
);

const OpenWalletButton = (props: ButtonProps) => (
  <WalletButtonBase {...props}>
    <SvgIcon component={WalletIcon} color="primary" />
    <Typography>Wallet</Typography>
  </WalletButtonBase>
);

const ConnectButton = (props: ButtonProps) => (
  <WalletButtonBase {...props}>
    <SvgIcon component={WalletIcon} color="primary" />
    <Typography>Connect Wallet</Typography>
  </WalletButtonBase>
);

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, disconnect, connected } = useWeb3Context();
  return connected ? <OpenWalletButton onClick={openWallet} /> : <ConnectButton onClick={connect} />;
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

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" size="large" color="secondary">
      <Typography>Disconnect</Typography>
    </Button>
  );
};

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
      <Drawer style={{ width: "450px" }} anchor="right" open={isWalletOpen} onClose={closeWallet}>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <IconButton onClick={closeWallet} aria-label="close wallet">
            <SvgIcon component={CloseIcon} color="primary" />
          </IconButton>
        </Box>
        <InitialWalletView />
        <DisconnectButton />
      </Drawer>
    </>
  );
}
