import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { Icon, Input, OHMTokenProps, PrimaryButton } from "@olympusdao/component-library";
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

  return (
    <form onSubmit={props.onFormSubmit}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column">
          {sellActive ? ReserveInput() : OhmInput()}
          <Box display="flex" flexDirection="row" mt={2} justifyContent="center">
            <Box style={{ backgroundColor: "#3F4552" }} p={"10px"} borderRadius="9px">
              <Icon name="arrow-down" />
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
