import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { connectWallet } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import * as RANGEPriceContract from "src/typechain/factories/RangePrice__factory";

import { ohmPriceHistory, RangeData, reservePriceHistory } from "../__mocks__/mockRangeCalls";
import * as RangeHooks from "../hooks";
import { Range } from "../index";

//@ts-ignore

describe("Upper Wall Active Bond Market", () => {
  beforeEach(() => {
    const rangeData = jest.spyOn(Contract.RANGE_CONTRACT, "getEthersContract");
    const bondData = jest.spyOn(Contract.BOND_AGGREGATOR_CONTRACT, "getEthersContract");
    connectWallet();

    console.log("range buy view");

    IERC20Factory.IERC20__factory.connect = jest.fn().mockReturnValue({
      symbol: jest.fn().mockReturnValue("DAI"),
    });
    RANGEPriceContract.RangePrice__factory.connect = jest.fn().mockReturnValue({
      getCurrentPrice: jest.fn().mockReturnValue(BigNumber.from("13209363085060059262")),
    });
    //@ts-expect-error
    RangeHooks.OHMPriceHistory = jest.fn().mockReturnValue({ data: ohmPriceHistory });
    //@ts-expect-error
    RangeHooks.ReservePriceHistory = jest.fn().mockReturnValue({ data: reservePriceHistory });

    //@ts-expect-error
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
    //@ts-expect-error
    rangeData.mockReturnValueOnce({
      range: jest.fn().mockReturnValueOnce({ ...RangeData, high: { ...RangeData.high, market: BigNumber.from("1") } }),
      reserve: jest.fn().mockReturnValue("address"),
    });
    //@ts-expect-error
    bondData.mockReturnValue({
      marketPrice: jest.fn().mockReturnValue(BigNumber.from("20120000000000000000")),
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should Buy at Bond market price of $20.12", async () => {
    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("20.12");
  });

  it("Should Sell at Lower wall price of $16.12", async () => {
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("16.12");
  });
});
