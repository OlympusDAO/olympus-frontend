import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { Icon, Input, OHMTokenProps, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

// export interface OHMRangeInputFormProps {}

/**
 * Component for Displaying RangeInputForm
 */
const RangeInputForm = (props: {
  reserveSymbol: OHMTokenProps["name"];
  currentPrice: number;
  sellActive: boolean;
  reserveBalance?: DecimalBigNumber;
  ohmBalance?: DecimalBigNumber;
}) => {
  const { reserveSymbol, currentPrice, sellActive, reserveBalance, ohmBalance } = props;
  const trimmedOhmBalance = ohmBalance && ohmBalance.toString({ decimals: 2 });
  const trimmedReserveBalance = reserveBalance && reserveBalance.toString({ decimals: 2 });
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
  if (sellActive === true) {
    swapButtonText = ` Swap OHM for ${reserveSymbol}`;
  }

  const OhmInput = () => (
    <Input
      type="string"
      name="amount"
      value={reserveAmount}
      endString={t`Max`}
      endStringOnClick={() => changeReserveBalance(reserveBalance)}
      id="outlined-adornment-amount"
      onChange={event => changeReserveBalance(event.currentTarget.value)}
      label={sellActive ? t`Enter Amount of ${reserveSymbol} to Receive` : t`Enter Amount of ${reserveSymbol} to Spend`}
      startAdornment={reserveSymbol}
      placeholder="0.00"
      info={`Balance: ${trimmedReserveBalance} ${reserveSymbol}`}
    />
  );

  const ReserveInput = () => (
    <Input
      type="string"
      name="amount"
      value={ohmAmount}
      endString={t`Max`}
      endStringOnClick={() => changeOhmBalance(ohmBalance)}
      id="outlined-adornment-amount"
      onChange={event => changeOhmBalance(event.currentTarget.value)}
      label={sellActive ? t`Enter Amount of OHM to Spend` : t`Enter Amount of OHM to Receive`}
      placeholder="0.00"
      startAdornment={"OHM"}
      info={`Balance: ${trimmedOhmBalance} OHM`}
    />
  );
  return (
    <Box display="flex" flexDirection="column">
      {/* TODO: Add WalletConnect Guard */}
      <Box display="flex" flexDirection="column">
        {/* TODO: Add TokenAlllowanceGuard */}
        {sellActive ? <ReserveInput /> : <OhmInput />}
        <Box display="flex" flexDirection="row" mt={2} justifyContent="center">
          <Box style={{ backgroundColor: "#3F4552" }} p={"10px"} borderRadius="9px">
            <Icon name="arrow-down" />
          </Box>
        </Box>
        {sellActive ? <OhmInput /> : <ReserveInput />}
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
