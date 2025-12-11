import { Alert, Box, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InfoNotification, Modal, PrimaryButton } from "@olympusdao/component-library";
import { RiInformationLine } from "@remixicon/react";
import { useState } from "react";
import sUSDSIcon from "src/assets/icons/susds.svg?react";
import USDSIcon from "src/assets/icons/USDS.svg?react";
import { formatNumber } from "src/helpers";

interface ClaimRewardsModalProps {
  open: boolean;
  onClose: () => void;
  epochEndDates: number[];
  amounts: string[];
  proofs: string[][];
  totalAmount: number;
  vaultShares?: number;
  onClaim: (params: { epochEndDates: number[]; amounts: string[]; proofs: string[][]; asVaultToken: boolean }) => void;
  isClaiming?: boolean;
}

type RewardToken = "USDS" | "sUSDS";

// Custom Toggle Selector Component (similar to shadcn/ui tabs)
const ToggleSelector = ({
  value,
  onChange,
  options,
}: {
  value: RewardToken;
  onChange: (value: RewardToken) => void;
  options: { label: string; value: RewardToken; icon?: React.ComponentType<any> }[];
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        position: "relative",
        padding: "4px",
        borderRadius: "12px",
        bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 23, 34, 0.05)",
        width: "100%",
      }}
    >
      {options.map((option, index) => (
        <Box
          key={option.value}
          onClick={() => onChange(option.value)}
          sx={{
            flex: 1,
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "color 0.2s ease",
            color: value === option.value ? theme.colors.gray[10] : theme.colors.gray[40],
            fontWeight: value === option.value ? 600 : 500,
            fontSize: "15px",
            userSelect: "none",
          }}
        >
          {option.icon && <SvgIcon component={option.icon} sx={{ fontSize: "16px" }} />}
          {option.label}
        </Box>
      ))}
      {/* Animated background indicator */}
      <Box
        sx={{
          position: "absolute",
          top: "4px",
          bottom: "4px",
          left: value === "USDS" ? "4px" : "calc(50%)",
          right: value === "USDS" ? "calc(50%)" : "4px",
          bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#FFFFFF",
          borderRadius: "8px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 1px 3px rgba(0, 0, 0, 0.3)"
              : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export const ClaimRewardsModal = ({
  open,
  onClose,
  epochEndDates,
  amounts,
  proofs,
  totalAmount,
  vaultShares,
  onClaim,
  isClaiming = false,
}: ClaimRewardsModalProps) => {
  const theme = useTheme();
  const [selectedToken, setSelectedToken] = useState<RewardToken>("USDS");

  const handleTokenChange = (newValue: RewardToken) => {
    setSelectedToken(newValue);
  };

  const handleConfirmClaim = () => {
    onClaim({
      epochEndDates,
      amounts,
      proofs,
      asVaultToken: selectedToken === "sUSDS",
    });
  };

  // Calculate display amount based on selected token
  const displayAmount = selectedToken === "USDS" ? totalAmount : vaultShares || 0;
  const usdValue = totalAmount; // Assuming 1:1 for USDS, could be calculated differently for sUSDS

  return (
    <Modal
      data-testid="claim-rewards-modal"
      maxWidth="476px"
      headerContent={
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography variant="h5" fontWeight={600}>
            Claim Rewards
          </Typography>
          <Typography fontSize="14px" color={theme.colors.gray[40]}>
            Choose how you want to receive your rewards.
          </Typography>
        </Box>
      }
      open={open}
      onClose={onClose}
      minHeight="200px"
    >
      <Box display="flex" flexDirection="column" gap="24px">
        {isClaiming && (
          <InfoNotification>Please don't close this modal until the wallet transaction is confirmed.</InfoNotification>
        )}

        {/* Token Selection Toggle */}
        <ToggleSelector
          value={selectedToken}
          onChange={handleTokenChange}
          options={[
            { label: "USDS", value: "USDS", icon: USDSIcon },
            { label: "sUSDS", value: "sUSDS", icon: sUSDSIcon },
          ]}
        />

        {/* Amount Display */}
        <Box
          sx={{
            padding: "16px",
            borderRadius: "12px",
            bgcolor: theme.palette.mode === "dark" ? "#2C2E37" : "#F5F5F5",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize="15px" fontWeight={400} color={theme.colors.gray[40]} mb="8px">
            You receive:
          </Typography>
          <Box display="flex" alignItems="center" gap="4px">
            <SvgIcon sx={{ fontSize: "20px" }} component={selectedToken === "USDS" ? USDSIcon : sUSDSIcon} />
            <Typography fontSize="15px" fontWeight={600}>
              {formatNumber(displayAmount, 2)} {selectedToken}
            </Typography>
            <Typography fontSize="15px" fontWeight={400} color={theme.colors.gray[40]}>
              (${formatNumber(usdValue, 2)})
            </Typography>
          </Box>
        </Box>

        {/* sUSDS Information Alert */}
        {selectedToken === "sUSDS" && (
          <Alert
            severity="info"
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "rgba(33, 150, 243, 0.1)" : "rgba(33, 150, 243, 0.05)",
              color: theme.colors.gray[10],
              "& .MuiAlert-icon": {
                display: "none",
              },
              fontSize: "13px",
              borderRadius: "8px",
            }}
          >
            <Box display="flex" alignItems="start" gap="8px">
              <Box sx={{ color: theme.palette.info.main }}>
                <RiInformationLine />
              </Box>
              <Typography fontSize="15px" fontWeight={400}>
                sUSDS is a vault token, so you receive fewer tokens, but they accrue yield over time.
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Confirm Button */}
        <PrimaryButton
          data-testid="confirm-claim-button"
          loading={isClaiming}
          fullWidth
          disabled={isClaiming || totalAmount === 0}
          onClick={handleConfirmClaim}
        >
          {isClaiming ? "Confirming in your wallet..." : "Confirm Claim"}
        </PrimaryButton>
      </Box>
    </Modal>
  );
};
