import { Box, SvgIcon, Typography } from "@mui/material";
import { InfoNotification, Modal, PrimaryButton, SecondaryButton } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import lendAndBorrowIcon from "src/assets/icons/lendAndBorrow.svg?react";
import WalletIcon from "src/assets/icons/wallet.svg?react";
import { useConsolidateCooler } from "src/views/Lending/Cooler/hooks/useConsolidateCooler";
import { useAccount, useDisconnect } from "wagmi";

export const AuthorizeMigration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { address: connectedAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const coolerMutation = useConsolidateCooler();

  const targetAddress = searchParams.get("address");
  const returnUrl = searchParams.get("returnUrl") || "/lending";

  const [step, setStep] = useState<"connect" | "authorize" | "complete">("connect");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isAlreadyAuthorized, setIsAlreadyAuthorized] = useState(false);

  // Check if target address is valid
  const isValidTarget = targetAddress && targetAddress.startsWith("0x") && targetAddress.length === 42;

  // Check if connected wallet matches target
  const isCorrectWallet = connectedAddress?.toLowerCase() === targetAddress?.toLowerCase();

  // Authorization mutation
  const authorizeMutation = useMutation(
    async () => {
      return await coolerMutation.authorizeMigrator();
    },
    {
      onSuccess: () => {
        setStep("complete");
        toast.success("Authorization successful!");
      },
      onError: (error: Error) => {
        toast.error(`Authorization failed: ${error.message}`);
      },
    },
  );

  // Check existing authorization when wallet connects
  useEffect(() => {
    if (!connectedAddress || !targetAddress || !isCorrectWallet) return;

    const checkExistingAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const authorized = await coolerMutation.checkAuthorization(connectedAddress);
        setIsAlreadyAuthorized(authorized);
        if (authorized) {
          setStep("complete");
        } else {
          setStep("authorize");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setStep("authorize");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [connectedAddress, targetAddress, isCorrectWallet]);

  // Auto-disconnect if wrong wallet is connected
  useEffect(() => {
    if (connectedAddress && targetAddress && !isCorrectWallet) {
      disconnect();
    }
  }, [connectedAddress, targetAddress, isCorrectWallet, disconnect]);

  const handleClose = () => {
    navigate(returnUrl);
  };

  const handleAuthorize = () => {
    authorizeMutation.mutate();
  };

  const handleReturnToMigration = () => {
    disconnect();
    navigate(returnUrl);
  };

  if (!isValidTarget) {
    return (
      <Modal
        maxWidth="476px"
        open={true}
        headerContent={
          <Box display="flex" alignItems="center" gap="6px">
            <SvgIcon component={lendAndBorrowIcon} />
            <Box fontWeight="500">Invalid Authorization Link</Box>
          </Box>
        }
        onClose={handleClose}
        minHeight="200px"
      >
        <Box textAlign="center">
          <InfoNotification type="error">Invalid wallet address in the authorization link.</InfoNotification>
          <Box mt={2}>
            <SecondaryButton onClick={handleClose} fullWidth>
              Return to Migration
            </SecondaryButton>
          </Box>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      maxWidth="520px"
      open={true}
      headerContent={
        <Box display="flex" alignItems="center" gap="6px">
          <SvgIcon component={lendAndBorrowIcon} />
          <Box fontWeight="500">Authorize Cooler Migration</Box>
        </Box>
      }
      onClose={handleClose}
      minHeight="200px"
    >
      <Box>
        {/* Step 1: Connect Wallet */}
        {step === "connect" && (
          <Box textAlign="center">
            <InfoNotification type="info">
              Connect with wallet {targetAddress?.substring(0, 6)}...
              {targetAddress?.substring(targetAddress.length - 4)} to authorize the migration.
            </InfoNotification>

            <Box mt={3}>
              <RainbowConnectButton.Custom>
                {({ openConnectModal, connectModalOpen }) => (
                  <PrimaryButton
                    fullWidth
                    onClick={openConnectModal}
                    startIcon={<SvgIcon component={WalletIcon} />}
                    disabled={connectModalOpen}
                  >
                    Connect Wallet
                  </PrimaryButton>
                )}
              </RainbowConnectButton.Custom>
            </Box>

            <Box mt={2}>
              <SecondaryButton onClick={handleClose} fullWidth>
                Cancel
              </SecondaryButton>
            </Box>
          </Box>
        )}

        {/* Step 2: Authorize */}
        {step === "authorize" && !isCheckingAuth && (
          <Box textAlign="center">
            <InfoNotification type="success">
              ✓ Correct wallet connected: {connectedAddress?.substring(0, 6)}...
              {connectedAddress?.substring(connectedAddress.length - 4)}
            </InfoNotification>

            <Box mt={3}>
              <Typography variant="body1" mb={2}>
                Click below to authorize the migration contract to manage your Cooler V2 position.
              </Typography>

              <PrimaryButton
                fullWidth
                onClick={handleAuthorize}
                loading={authorizeMutation.isLoading}
                disabled={authorizeMutation.isLoading}
              >
                Authorize Migration
              </PrimaryButton>
            </Box>

            <Box mt={2}>
              <SecondaryButton onClick={handleClose} fullWidth>
                Cancel
              </SecondaryButton>
            </Box>
          </Box>
        )}

        {/* Checking authorization status */}
        {isCheckingAuth && (
          <Box textAlign="center">
            <InfoNotification type="info">Checking existing authorization...</InfoNotification>
          </Box>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && (
          <Box textAlign="center">
            <InfoNotification type="success">
              {isAlreadyAuthorized
                ? "✓ Authorization already exists! Migration is ready to proceed."
                : "✓ Authorization successful! Migration is ready to proceed."}
            </InfoNotification>

            <Box mt={3}>
              <Typography variant="h6" mb={2}>
                Next Steps:
              </Typography>
              <Typography mb={3}>
                Click below to disconnect this wallet and return to the migration page. You'll need to reconnect with
                your original wallet to complete the process.
              </Typography>

              <PrimaryButton fullWidth onClick={handleReturnToMigration}>
                Return to Migration
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
