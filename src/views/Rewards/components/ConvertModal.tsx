import { Box, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Modal, PrimaryButton, SwapCard, SwapCollection } from "@olympusdao/component-library";
import { useState } from "react";
import USDSIcon from "src/assets/icons/USDS.svg?react";
import ConvOhmSmIcon from "src/assets/tokens/convOHMsm.svg?react";
import OhmIcon from "src/assets/tokens/token_OHM.svg?react";
import { formatNumber } from "src/helpers";
import type { ConvertRow } from "src/views/Rewards/components/ConvertTable";

interface ConvertModalProps {
  open: boolean;
  onClose: () => void;
  row: ConvertRow;
}

// Mock USDS balance — replace with real balance later
const MOCK_USDS_BALANCE = 24244.28;

export const ConvertModal = ({ open, onClose, row }: ConvertModalProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [usdsAmount, setUsdsAmount] = useState("");

  const secondaryText = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(20, 23, 34, 0.6)";

  const parsedUsds = parseFloat(usdsAmount) || 0;
  const ohmAmount = row.convertiblePrice > 0 ? parsedUsds / row.convertiblePrice : 0;
  const maxOhm = row.availableToConvert;
  const maxUsds = Math.min(MOCK_USDS_BALANCE, maxOhm * row.convertiblePrice);

  const discount = row.discount !== null ? row.discount : 0;
  const exceedsBalance = parsedUsds > MOCK_USDS_BALANCE;
  const exceedsAvailable = ohmAmount > maxOhm;

  const getButtonLabel = () => {
    if (parsedUsds === 0) return "Enter an amount";
    if (exceedsBalance) return "Insufficient USDS balance";
    if (exceedsAvailable) return "Amount exceeds available convOHM";
    return "Convert";
  };

  const isDisabled = parsedUsds === 0 || exceedsBalance || exceedsAvailable;

  const handleUsdsMax = () => {
    setUsdsAmount(maxUsds.toString());
  };

  const handleOhmMax = () => {
    const ohmMaxUsds = maxOhm * row.convertiblePrice;
    const capped = Math.min(MOCK_USDS_BALANCE, ohmMaxUsds);
    setUsdsAmount(capped.toString());
  };

  const handleClose = () => {
    setUsdsAmount("");
    onClose();
  };

  return (
    <Modal
      data-testid="convert-to-ohm-modal"
      maxWidth="476px"
      headerContent={
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography fontSize="24px" fontWeight={600} lineHeight="33px">
            Convert to OHM
          </Typography>
          <Typography fontSize="15px" lineHeight="20px" color={secondaryText}>
            Deposit USDS to buy OHM under special conditions.
          </Typography>
        </Box>
      }
      open={open}
      onClose={handleClose}
      minHeight="200px"
    >
      <Box display="flex" flexDirection="column" gap="24px">
        {/* Token Input Cards */}
        <SwapCollection
          UpperSwapCard={
            <SwapCard
              id="usds-deposit"
              token={<SvgIcon sx={{ width: "21px", height: "21px" }} component={USDSIcon} inheritViewBox />}
              tokenName="USDS"
              value={usdsAmount}
              onChange={e => setUsdsAmount(e.currentTarget.value)}
              info={`Balance: ${formatNumber(MOCK_USDS_BALANCE, 2)} USDS`}
              endString="Max"
              endStringOnClick={handleUsdsMax}
              inputProps={{ "data-testid": "usds-input" }}
            />
          }
          LowerSwapCard={
            <SwapCard
              id="ohm-receive"
              token={<SvgIcon sx={{ width: "21px", height: "21px" }} component={OhmIcon} inheritViewBox />}
              tokenName="OHM"
              value={ohmAmount > 0 ? formatNumber(ohmAmount, 4) : ""}
              info={`Available: ${row.availableToConvert} OHM`}
              endString="Max"
              endStringOnClick={handleOhmMax}
              inputProps={{ "data-testid": "ohm-output", disabled: true }}
            />
          }
        />

        {/* Details Section */}
        <Box display="flex" flexDirection="column" gap="12px">
          <DetailRow
            label="Convertible OHM Balance"
            value={
              <Box display="flex" alignItems="center" gap="4px">
                <SvgIcon sx={{ fontSize: "16px" }} component={ConvOhmSmIcon} inheritViewBox />
                <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px">
                  {row.availableToConvert} convOHM
                </Typography>
              </Box>
            }
            secondaryText={secondaryText}
          />

          <DetailRow
            label="Conversion Price"
            value={
              <Box display="flex" alignItems="center" gap="4px">
                <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px" color="#45BB78">
                  {row.convertiblePrice.toFixed(2)}
                </Typography>
                <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px">
                  USDS/OHM
                </Typography>
              </Box>
            }
            secondaryText={secondaryText}
          />

          <DetailRow
            label="You Deposit"
            value={
              <Box display="flex" alignItems="center" gap="4px">
                <SvgIcon sx={{ fontSize: "16px" }} component={USDSIcon} inheritViewBox />
                <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px">
                  {formatNumber(parsedUsds, 2)} USDS
                </Typography>
                <Typography fontSize="12px" lineHeight="16px" color={secondaryText}>
                  (${formatNumber(parsedUsds, 2)})
                </Typography>
              </Box>
            }
            secondaryText={secondaryText}
          />

          <DetailRow
            label="You Receive"
            value={
              <Box display="flex" alignItems="center" gap="4px">
                <SvgIcon sx={{ fontSize: "16px" }} component={OhmIcon} inheritViewBox />
                <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px">
                  {formatNumber(ohmAmount, 4)} OHM
                </Typography>
                <Typography fontSize="12px" lineHeight="16px" color={secondaryText}>
                  (${formatNumber(parsedUsds, 2)})
                </Typography>
              </Box>
            }
            secondaryText={secondaryText}
          />

          <DetailRow
            label="Discount"
            value={
              <Typography fontSize="12px" fontWeight={600} lineHeight="16px" letterSpacing="0.12px" color="#45BB78">
                {discount > 0 ? `${discount.toFixed(2)}%` : "-"}
              </Typography>
            }
            secondaryText={secondaryText}
          />
        </Box>

        {/* CTA Button */}
        <PrimaryButton
          fullWidth
          disabled={isDisabled}
          onClick={() => {
            // TODO: implement conversion transaction
          }}
        >
          {getButtonLabel()}
        </PrimaryButton>
      </Box>
    </Modal>
  );
};

const DetailRow = ({
  label,
  value,
  secondaryText,
}: {
  label: string;
  value: React.ReactNode;
  secondaryText: string;
}) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Typography fontSize="12px" lineHeight="16px" color={secondaryText}>
      {label}
    </Typography>
    {value}
  </Box>
);
