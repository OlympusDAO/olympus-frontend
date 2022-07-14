import { t } from "@lingui/macro";
import { Box, useTheme } from "@mui/material";
import { Input, OHMTokenProps, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "ethers/lib/ethers";
import React from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

// export interface OHMRangeInputFormProps {}

/**
 * Component for Displaying RangeInputForm
 */
const RangeInputForm = (props: {
  reserveSymbol: OHMTokenProps["name"];
  sellActive: boolean;
  reserveBalance?: DecimalBigNumber;
  ohmBalance?: DecimalBigNumber;
  reserveAmount: string;
  ohmAmount: string;
  onFormSubmit: (event: React.FormEvent) => void;
  onChangeReserveAmount: (value: any) => void;
  onChangeOhmAmount: (value: any) => void;
  capacity: BigNumber;
}) => {
  const {
    reserveSymbol,
    sellActive,
    reserveBalance = new DecimalBigNumber("0", 18),
    ohmBalance = new DecimalBigNumber("0", 9),
    reserveAmount,
    ohmAmount,
    onChangeReserveAmount,
    onChangeOhmAmount,
    capacity,
  } = props;
  const trimmedOhmBalance = ohmBalance.toString({ decimals: 2 });
  const trimmedReserveBalance = reserveBalance.toString({ decimals: 2 });

  const ohmAmountAsNumber = new DecimalBigNumber(ohmAmount, 9);
  const reserveAmountAsNumber = new DecimalBigNumber(reserveAmount, 18);
  const capacityBN = new DecimalBigNumber(capacity, 18);
  const amountAboveCapacity = sellActive ? reserveAmountAsNumber.gt(capacityBN) : ohmAmountAsNumber.gt(capacityBN);
  const amountAboveBalance = sellActive ? ohmAmountAsNumber.gt(ohmBalance) : reserveAmountAsNumber.gt(reserveBalance);
  let swapButtonText = `Swap ${reserveSymbol} for OHM`;
  if (sellActive === true) {
    swapButtonText = ` Swap OHM for ${reserveSymbol}`;
  }

  const OhmInput = () => (
    <Input
      key="reserveAmount"
      type="string"
      inputProps={{ "data-testid": "reserve-amount" }}
      name="reserveAmount"
      value={reserveAmount}
      endString={t`Max`}
      endStringOnClick={() => onChangeReserveAmount(reserveBalance.toString())}
      id="reserve-amount"
      onChange={event => onChangeReserveAmount(event.currentTarget.value)}
      label={sellActive ? t`Enter Amount of ${reserveSymbol} to Receive` : t`Enter Amount of ${reserveSymbol} to Spend`}
      startAdornment={reserveSymbol}
      placeholder="0.00"
      info={`Balance: ${trimmedReserveBalance} ${reserveSymbol}`}
    />
  );

  const ReserveInput = () => (
    <Input
      key="ohmAmount"
      type="string"
      inputProps={{ "data-testid": "ohm-amount" }}
      name="ohmAmount"
      value={ohmAmount}
      endString={t`Max`}
      endStringOnClick={() => onChangeOhmAmount(ohmBalance.toString())}
      id="ohm-amount"
      onChange={event => onChangeOhmAmount(event.currentTarget.value)}
      label={sellActive ? t`Enter Amount of OHM to Spend` : t`Enter Amount of OHM to Receive`}
      placeholder="0.00"
      startAdornment={"OHM"}
      info={`Balance: ${trimmedOhmBalance} OHM`}
    />
  );

  const theme = useTheme();

  const ArrowDownIcon = () => (
    <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill={theme.colors.gray[10]}>
      <defs></defs>
      <path
        fill-rule="oddeven"
        clip-rule="oddeven"
        d="M 10 0 C 10.69 0 11.25 0.56 11.25 1.25 L 11.25 15.732 L 17.866 9.116 C 18.354 8.628 19.146 8.628 19.634 9.116 C 20.122 9.604 20.122 10.396 19.634 10.884 L 10.884 19.634 C 10.396 20.122 9.604 20.122 9.116 19.634 L 0.366 10.884 C -0.122 10.396 -0.122 9.604 0.366 9.116 C 0.854 8.628 1.646 8.628 2.134 9.116 L 8.75 15.732 L 8.75 1.25 C 8.75 0.56 9.31 0 10 0 Z"
      ></path>
    </svg>
  );
  return (
    <form onSubmit={props.onFormSubmit}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column">
          {sellActive ? ReserveInput() : OhmInput()}
          <Box display="flex" flexDirection="row" mt={2} justifyContent="center">
            <Box
              display="flex"
              style={{ backgroundColor: theme.colors.gray[600] }}
              p={"10px"}
              borderRadius="9px"
              alignItems="center"
            >
              <ArrowDownIcon />
            </Box>
          </Box>
          {sellActive ? OhmInput() : ReserveInput()}
        </Box>
        <Box mt="8px">
          <PrimaryButton
            data-testid="range-submit"
            fullWidth
            type="submit"
            disabled={!ohmAmount || !reserveAmount || amountAboveCapacity || amountAboveBalance}
          >
            {amountAboveCapacity
              ? `Amount exceeds capacity`
              : amountAboveBalance
              ? `Amount exceeds balance`
              : swapButtonText}
          </PrimaryButton>
        </Box>
      </Box>
    </form>
  );
};

export default RangeInputForm;
