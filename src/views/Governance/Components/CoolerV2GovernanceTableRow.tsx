import { Box, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { formatNumber } from "src/helpers";

export interface CoolerV2GovernanceTableRowProps {
  tokenName: string;
  delegationAddress?: string;
  balance: string;
  address: string;
  onDelegate: () => void;
  delegations?: Array<{
    tokenName: string;
    delegationAddress: string;
    balance: string;
    address: string;
    percentage: number;
  }>;
}

export const CoolerV2GovernanceTableRow: React.FC<CoolerV2GovernanceTableRowProps> = ({
  tokenName,
  balance,
  address,
  onDelegate,
  delegations,
}) => {
  const theme = useTheme();
  return (
    <div>
      <Typography fontWeight="600" fontSize="18px" mb="3px">
        {tokenName}
      </Typography>

      <Box display="flex" flexDirection="column" bgcolor={theme.colors.gray[700]} padding="20px" borderRadius={"10px"}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" gap="3px" justifyContent={"space-between"}>
            <Typography>Balance </Typography>
            <Typography fontWeight="600">{Number(balance || 0).toFixed(2)} gOHM</Typography>
          </Box>
        </Box>

        {delegations && delegations.length > 0 && (
          <Box>
            <Typography mb={1} fontWeight={600}>
              Current Delegations
            </Typography>
            {delegations.map((delegation, index) => (
              <Box
                key={`${delegation.delegationAddress}-${index}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                borderTop={index === 0 ? "1px solid rgba(255,255,255,0.1)" : undefined}
                borderBottom="1px solid rgba(255,255,255,0.1)"
              >
                <Box>
                  <Typography>Delegated to: {delegation.delegationAddress}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatNumber(Number(delegation.balance), 4)} gOHM ({delegation.percentage}%)
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        <Box display="flex" justifyContent="flex-end" mt="18px">
          <PrimaryButton onClick={onDelegate}>Manage Delegation</PrimaryButton>
        </Box>
      </Box>
    </div>
  );
};
