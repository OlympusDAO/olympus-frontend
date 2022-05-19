import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { Icon, Input, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";

// export interface OHMRangeInputFormProps {}

/**
 * Component for Displaying RangeInputForm
 */
const RangeInputForm = (props: { reserveSymbol: string; currentPrice: number; buyOrSell: string }) => {
  const { reserveSymbol, currentPrice, buyOrSell } = props;
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");
  const setMax = () => {
    return "max";
  };

  //TODO: Swap for Current Price

  const changeOhmBalance = (value: any) => {
    const reserveValue = value * currentPrice;
    setOhmAmount(value);
    setReserveAmount(reserveValue.toString());
  };

  const changeReserveBalance = (value: any) => {
    const ohmValue = value / currentPrice;
    setOhmAmount(ohmValue.toString());
    setReserveAmount(value);
  };

  let swapButtonText = `Swap ${reserveSymbol} for OHM`;
  if (buyOrSell === "sell") {
    swapButtonText = ` Swap OHM for ${reserveSymbol}`;
  }

  return (
    <Box display="flex" flexDirection="column">
      {/* TODO: Add WalletConnect Guard */}
      <Box display="flex" flexDirection="column">
        {/* TODO: Add TokenAlllowanceGuard */}
        <Input
          type="string"
          name="amount"
          value={reserveAmount}
          endString={t`Max`}
          endStringOnClick={setMax}
          id="outlined-adornment-amount"
          onChange={event => changeReserveBalance(event.currentTarget.value)}
          label={t`Enter Amount of ${reserveSymbol} to Spend`}
          startAdornment={"DAI"}
          placeholder="0.00"
        />
        <Box display="flex" flexDirection="row" mt={2} justifyContent="center">
          <Box style={{ backgroundColor: "#3F4552" }} p={"10px"} borderRadius="9px">
            <Icon name="arrow-down" />
          </Box>
        </Box>
        <Input
          type="string"
          name="amount"
          value={ohmAmount}
          endString={t`Max`}
          endStringOnClick={setMax}
          id="outlined-adornment-amount"
          onChange={event => changeOhmBalance(event.currentTarget.value)}
          label={t`Enter Amount of OHM to Receive`}
          placeholder="0.00"
          startAdornment={"OHM"}
        />
      </Box>
      <Box mt="8px">
        <PrimaryButton fullWidth type="submit">
          {swapButtonText}
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default RangeInputForm;
