import { Box, Typography, useTheme } from "@mui/material";
import { SecondaryButton } from "@olympusdao/component-library";
import { InPageConnectButton } from "src/components/ConnectButton/ConnectButton";
import { useAccount } from "wagmi";

export const LearnAboutGohm = () => {
  const theme = useTheme();
  const { isConnected } = useAccount();
  return (
    <>
      <Box my="18px">
        <Typography fontWeight="500">What is gOHM?</Typography>
        <Typography color={theme.colors.gray[40]} mt="9px">
          gOHM is the governance token of the Olympus protocol. gOHM can be obtained by wrapping OHM. gOHM can be
          unwrapped to OHM at any time. gOHM is used to vote in governance and can be used as collateral to take a
          Cooler Loan.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <SecondaryButton fullWidth href="https://docs.olympusdao.finance/main/overview/tokens">
          Learn More
        </SecondaryButton>
      </Box>
      {!isConnected && (
        <Box>
          <div className="stake-wallet-notification">
            <InPageConnectButton fullWidth />
          </div>
        </Box>
      )}
    </>
  );
};
