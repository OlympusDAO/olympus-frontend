import { Box, Button, Paper, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletIcon from "src/assets/icons/wallet.svg?react";

export const RewardsWalletNotConnected = () => {
  const theme = useTheme();
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Paper
          sx={{
            padding: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "400px",
            background: theme.palette.mode === "dark" ? "#20222A" : "#EFEAE0",
            borderRadius: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <SvgIcon
              component={WalletIcon}
              sx={{
                width: "48px",
                height: "48px",
                color: "#BBBDC0",
              }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography fontSize="18px" fontWeight={500} mb="8px">
                Wallet Not Connected
              </Typography>
              <Typography fontSize="15px" fontWeight={400} maxWidth="224px" sx={{ color: "#BBBDC0" }}>
                Please connect your wallet to check your Drachmas amount.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={openConnectModal}
              sx={{
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                padding: "12px 24px",
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        </Paper>
      )}
    </ConnectButton.Custom>
  );
};
