import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { SwapCollection } from "@olympusdao/component-library";
import { OHMTokenProps, PrimaryButton, SwapCard } from "@olympusdao/component-library";
import React from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

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
  onSetSellActive: () => void;
  capacity: number;
  hasPrice: boolean;
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
    onSetSellActive,
    capacity,
    hasPrice,
  } = props;
  const trimmedOhmBalance = ohmBalance.toString({ decimals: 2 });
  const trimmedReserveBalance = reserveBalance.toString({ decimals: 2 });

  const ohmAmountAsNumber = new DecimalBigNumber(ohmAmount, 9);
  const reserveAmountAsNumber = new DecimalBigNumber(reserveAmount, 18);
  const capacityBN = new DecimalBigNumber(capacity.toString(), sellActive ? 18 : 9); //reserve asset if sell, OHM if buy
  const amountAboveCapacity = sellActive ? reserveAmountAsNumber.gt(capacityBN) : ohmAmountAsNumber.gt(capacityBN);
  const amountAboveBalance = sellActive ? ohmAmountAsNumber.gt(ohmBalance) : reserveAmountAsNumber.gt(reserveBalance);
  let swapButtonText = `Swap ${reserveSymbol} for OHM`;
  if (sellActive === true) {
    swapButtonText = ` Swap OHM for ${reserveSymbol}`;
  }

  const ReserveInput = () => (
    <SwapCard
      key="reserveAmount"
      id="reserve-amount"
      inputProps={{ "data-testid": "reserve-amount" }}
      name="reserveAmount"
      value={reserveAmount}
      onChange={event => onChangeReserveAmount(event.currentTarget.value)}
      endString={t`Max`}
      endStringOnClick={() => hasPrice && onChangeReserveAmount(reserveBalance.toString())}
      token={reserveSymbol}
      type="string"
      info={`Balance: ${trimmedReserveBalance} ${reserveSymbol}`}
      disabled={!hasPrice}
    />
  );

  const OhmInput = () => (
    <SwapCard
      id="ohm-amount"
      key="ohmAmount"
      inputProps={{ "data-testid": "ohm-amount" }}
      name={"ohmAmount"}
      value={ohmAmount}
      onChange={event => onChangeOhmAmount(event.currentTarget.value)}
      endString={t`Max`}
      endStringOnClick={() => hasPrice && onChangeOhmAmount(ohmBalance.toString())}
      token="OHM"
      type="string"
      info={`Balance: ${trimmedOhmBalance} OHM`}
      disabled={!hasPrice}
    />
  );

  return (
    <form onSubmit={props.onFormSubmit}>
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <SwapCollection
            UpperSwapCard={sellActive ? OhmInput() : ReserveInput()}
            LowerSwapCard={sellActive ? ReserveInput() : OhmInput()}
            arrowOnClick={onSetSellActive}
          />
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
      </Box>
    </form>
  );
};

export default RangeInputForm;
