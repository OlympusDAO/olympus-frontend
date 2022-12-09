import { Box } from "@mui/material";
import { SwapCollection } from "@olympusdao/component-library";
import { OHMTokenProps, SwapCard } from "@olympusdao/component-library";
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
    hasPrice,
  } = props;
  const trimmedOhmBalance = ohmBalance.toString({ decimals: 2 });
  const trimmedReserveBalance = reserveBalance.toString({ decimals: 2 });

  const ReserveInput = () => (
    <SwapCard
      key="reserveAmount"
      id="reserve-amount"
      inputProps={{ "data-testid": "reserve-amount" }}
      name="reserveAmount"
      value={reserveAmount}
      onChange={event => onChangeReserveAmount(event.currentTarget.value)}
      endString={`Max`}
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
      endString={`Max`}
      endStringOnClick={() => hasPrice && onChangeOhmAmount(ohmBalance.toString())}
      token="OHM"
      type="string"
      info={`Balance: ${trimmedOhmBalance} OHM`}
      disabled={!hasPrice}
    />
  );

  return (
    <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
      <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
        <SwapCollection
          UpperSwapCard={sellActive ? OhmInput() : ReserveInput()}
          LowerSwapCard={sellActive ? ReserveInput() : OhmInput()}
          arrowOnClick={onSetSellActive}
        />
      </Box>
    </Box>
  );
};

export default RangeInputForm;
