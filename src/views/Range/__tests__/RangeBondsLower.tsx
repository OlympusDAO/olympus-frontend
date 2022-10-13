import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { connectWallet } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as BondTellerContract from "src/typechain/factories/BondTeller__factory";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import * as RANGEPriceContract from "src/typechain/factories/RangePrice__factory";
import { ohmPriceHistory, RangeData, reservePriceHistory } from "src/views/Range/__mocks__/mockRangeCalls";
import * as RangeHooks from "src/views/Range/hooks";
import { Range } from "src/views/Range/index";

global.ResizeObserver = require("resize-observer-polyfill");
jest.mock("src/hooks/useContractAllowance");

const setupTest = () => {
  const rangeData = jest.spyOn(Contract.RANGE_CONTRACT, "getEthersContract");
  const bondData = jest.spyOn(Contract.BOND_AGGREGATOR_CONTRACT, "getEthersContract");
  //@ts-ignore
  useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });

  IERC20Factory.IERC20__factory.connect = jest.fn().mockReturnValue({
    symbol: jest.fn().mockReturnValue("DAI"),
  });
  RANGEPriceContract.RangePrice__factory.connect = jest.fn().mockReturnValue({
    getCurrentPrice: jest.fn().mockReturnValue(BigNumber.from("13209363085060059262")),
  });
  BondTellerContract.BondTeller__factory.connect = jest.fn().mockReturnValue({
    purchase: jest.fn().mockReturnValue({
      wait: jest.fn().mockResolvedValue(true),
    }),
  });

  //@ts-expect-error
  RangeHooks.OHMPriceHistory = jest.fn().mockReturnValue({ data: ohmPriceHistory });
  //@ts-expect-error
  RangeHooks.ReservePriceHistory = jest.fn().mockReturnValue({ data: reservePriceHistory });

  //@ts-expect-error
  Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  //@ts-expect-error
  rangeData.mockReturnValueOnce({
    range: jest.fn().mockReturnValueOnce({ ...RangeData, low: { ...RangeData.low, market: BigNumber.from("1") } }),
    reserve: jest.fn().mockReturnValue("address"),
  });

  //@ts-expect-error
  bondData.mockReturnValue({
    connect: jest.fn().mockReturnValue({
      getTeller: jest.fn().mockReturnValue("address"),
    }),
    marketPrice: jest.fn().mockReturnValue(BigNumber.from("10120000000000000000000000000000000000")),
  });
};
describe("Lower Wall Active Bond Market", () => {
  beforeEach(() => {
    connectWallet();
    setupTest();
  });

  it("Should Buy at Upper wall price of $24.18", async () => {
    //@ts-expect-error
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "24.18" } });
    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("24.18");
  });

  it("Should Sell at Bond market price of $10.12", async () => {
    //@ts-expect-error
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "10.12" } });
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("10.12");
  });

  it("Should have a disclaimer notifying a sell below current market price ($13.20)", async () => {
    //@ts-expect-error
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "10.12" } });
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(
      await screen.findByText("I understand that I am selling at a discount to current market price"),
    ).toBeInTheDocument();
  });
});

// describe("Bond Swap Transaction", () => {
//   beforeEach(() => {
//     connectWallet();
//     setupTest();
//   });
//   it("Should Successfully execute a buy inverse bond", async () => {
//     render(
//       <>
//         <Messages />
//         <Range />
//       </>,
//     );
//     fireEvent.click(screen.getByTestId("sell-tab"));
//     fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
//     fireEvent.click(screen.getByTestId("range-submit"));
//     fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
//     fireEvent.click(screen.getByTestId("range-confirm-submit"));
//     expect(await screen.findByText("Range Swap Successful")).toBeInTheDocument();
//   });

//   it("Should successfully change recipient address, and throw invalid address error", async () => {
//     render(
//       <>
//         <Messages />
//         <Range />
//       </>,
//     );
//     fireEvent.click(screen.getByTestId("sell-tab"));
//     fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
//     fireEvent.click(screen.getByTestId("range-submit"));
//     fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
//     fireEvent.click(await screen.findByTestId("transaction-settings"));
//     fireEvent.input(await screen.findByTestId("recipient"), { target: { value: "invalidAddress" } });
//     fireEvent.click(screen.getAllByLabelText("close")[1]);
//     fireEvent.click(screen.getByTestId("range-confirm-submit"));
//     expect(await screen.findByText("Invalid address")).toBeInTheDocument();
//   });

//   it("Should successfully change slippage amount and complete transaction", async () => {
//     render(
//       <>
//         <Messages />
//         <Range />
//       </>,
//     );
//     fireEvent.click(screen.getByTestId("sell-tab"));
//     fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
//     fireEvent.click(screen.getByTestId("range-submit"));
//     fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
//     fireEvent.click(await screen.findByTestId("transaction-settings"));
//     fireEvent.input(await screen.findByTestId("slippage"), { target: { value: "0.1" } });
//     fireEvent.click(screen.getAllByLabelText("close")[1]);
//     fireEvent.click(screen.getByTestId("range-confirm-submit"));
//     expect(await screen.findByText("Range Swap Successful")).toBeInTheDocument();
//   });
// });
