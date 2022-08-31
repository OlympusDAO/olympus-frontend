import { Box, Link, Typography } from "@mui/material";
import { DataRow, Icon } from "@olympusdao/component-library";
import { FC, useMemo, useState } from "react";
import { trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import { ModalHandleSelectProps } from "src/views/Stake/components/StakeArea/components/StakeInputArea/components/TokenModal";
import SlippageModal from "src/views/Zap/SlippageModal";

export interface OHMZapTransactionDetailsProps {
  inputQuantity: string;
  outputGOHM: boolean;
  swapTokenBalance: ModalHandleSelectProps;
  handleExchangeRate: (exchangeRate: number) => void;
  handleOutputAmount: (outputAmount: string) => void;
  handleSlippageAmount: (slippageAmount: string) => void;
  handleMinAmount: (minAmount: string) => void;
}

/**
 * Component for Displaying ZapTransactionDetails
 */
const ZapTransactionDetails: FC<OHMZapTransactionDetailsProps> = ({
  inputQuantity,
  outputGOHM,
  swapTokenBalance,
  handleExchangeRate,
  handleOutputAmount,
  handleSlippageAmount,
  handleMinAmount,
}) => {
  const [customSlippage, setCustomSlippage] = useState<string>("1.0");
  const handleSlippageModalOpen = () => setSlippageModalOpen(true);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);

  const ohmMarketPrice = useOhmPrice();
  const gOhmMarketPrice = useGohmPrice();

  // TODO use DecimalBigNumber
  const exchangeRate: number | null = useMemo(() => {
    if (
      outputGOHM != null &&
      swapTokenBalance &&
      ohmMarketPrice.data &&
      gOhmMarketPrice.data &&
      swapTokenBalance.price
    ) {
      return (
        (outputGOHM === undefined || outputGOHM === null || outputGOHM ? gOhmMarketPrice.data : ohmMarketPrice.data) /
        swapTokenBalance.price
      );
    } else {
      return null;
    }
  }, [outputGOHM, ohmMarketPrice, gOhmMarketPrice, swapTokenBalance]);

  const outputQuantity = exchangeRate ? (+inputQuantity / exchangeRate).toString() : "";
  // Number(outputQuantity) * (1 - +customSlippage / 100)
  const minimumAmount: DecimalBigNumber = useMemo(() => {
    if (!outputQuantity || exchangeRate == Number.MAX_VALUE) return new DecimalBigNumber("0");

    return new DecimalBigNumber(outputQuantity).mul(new DecimalBigNumber((1 - +customSlippage / 100).toString(), 9));
  }, [customSlippage, exchangeRate, outputQuantity]);

  const minimumAmountString: string = useMemo(() => {
    return minimumAmount.toString({ decimals: 4, trim: true });
  }, [minimumAmount]);

  const exchangeRateString = `${trim(exchangeRate || 0, 4)} ${swapTokenBalance.name} =
    1 ${outputGOHM ? "gOHM" : "sOHM"}`;

  useMemo(() => {
    handleExchangeRate(exchangeRate ? exchangeRate : 0);
  }, [exchangeRate]);

  useMemo(() => {
    handleOutputAmount(outputQuantity);
  }, [outputQuantity]);

  useMemo(() => {
    handleSlippageAmount(customSlippage);
  }, [customSlippage]);

  useMemo(() => {
    handleMinAmount(minimumAmountString);
  }, [minimumAmountString]);

  return (
    <>
      <DataRow
        title="Slippage Tolerance"
        balance={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography>{customSlippage}%</Typography>
            <Box width="6px" />
            <Link onClick={handleSlippageModalOpen}>
              <Icon name="settings" sx={{ paddingTop: "2px", fontSize: "14px" }} />
            </Link>
          </Box>
        }
      />
      <DataRow title="Exchange Rate" balance={`${outputGOHM == null || !swapTokenBalance ? "" : exchangeRateString}`} />
      <DataRow title="Minimum You Get" balance={`${minimumAmountString} ${outputGOHM ? "gOHM" : "sOHM"}`}></DataRow>
      <SlippageModal
        handleClose={() => setSlippageModalOpen(false)}
        modalOpen={slippageModalOpen}
        setCustomSlippage={setCustomSlippage}
        currentSlippage={customSlippage}
      />
    </>
  );
};

export default ZapTransactionDetails;
