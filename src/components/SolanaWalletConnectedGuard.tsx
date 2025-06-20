import { Box, SvgIcon, Typography } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import WalletIcon from "src/assets/icons/wallet.svg?react";

export const SolanaWalletConnectedGuard: React.FC<{
  message?: string;
  fullWidth?: boolean;
  children: any;
  buttonText?: string;
}> = props => {
  const { connected, wallet, connect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    if (wallet) {
      connect().catch(() => {
        // If connection fails, show wallet modal
        setVisible(true);
      });
    } else {
      // No wallet selected, show wallet modal
      setVisible(true);
    }
  };

  if (!connected) {
    return (
      <>
        <PrimaryButton fullWidth={props.fullWidth} onClick={handleConnect}>
          <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
          {props.buttonText || "Connect Solana Wallet"}
        </PrimaryButton>

        {props.message && (
          <Box mt="12px">
            <Typography variant="h6">{props.message}</Typography>
          </Box>
        )}
      </>
    );
  }

  return <>{props.children}</>;
};
