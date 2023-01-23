import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Prices from "src/hooks/usePrices";
import { connectWallet } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as BondTellerContract from "src/typechain/factories/BondTeller__factory";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import { RangeData } from "src/views/Range/__mocks__/mockRangeCalls";
import * as RangeHooks from "src/views/Range/hooks";
import { Range } from "src/views/Range/index";
import { beforeEach, describe, expect, it, vi } from "vitest";

global.ResizeObserver = require("resize-observer-polyfill");
vi.mock("src/hooks/useContractAllowance");

const setupTest = () => {
  const rangeData = vi.spyOn(Contract.RANGE_CONTRACT, "getEthersContract");
  const bondData = vi.spyOn(Contract.BOND_AGGREGATOR_CONTRACT, "getEthersContract");
  //@ts-ignore
  useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });

  IERC20Factory.IERC20__factory.connect = vi.fn().mockReturnValue({
    symbol: vi.fn().mockReturnValue("DAI"),
  });
  //@ts-expect-error
  vi.spyOn(Prices, "useOhmPrice").mockReturnValue({ data: "13.209363085" });

  BondTellerContract.BondTeller__factory.connect = vi.fn().mockReturnValue({
    purchase: vi.fn().mockReturnValue({
      wait: vi.fn().mockResolvedValue(true),
    }),
    getTeller: vi.fn().mockReturnValue(0),
  });

  //@ts-expect-error
  vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  //@ts-expect-error
  rangeData.mockReturnValueOnce({
    range: vi.fn().mockReturnValueOnce({ ...RangeData, low: { ...RangeData.low, market: BigNumber.from("1") } }),
    reserve: vi.fn().mockReturnValue("address"),
  });

  //@ts-expect-error
  bondData.mockReturnValue({
    connect: vi.fn().mockReturnValue({
      getTeller: vi.fn().mockReturnValue("address"),
    }),
    marketPrice: vi.fn().mockReturnValue(BigNumber.from("10120000000000000000000000000000000000")),
  });
};
describe("Lower Wall Active Bond Market", () => {
  beforeEach(() => {
    connectWallet();
    setupTest();
  });

  it("Should Buy at Upper wall price of $24.18", async () => {
    //@ts-expect-error
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "24.18" } });
    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toContain(/24.18/);
  });

  it("Should Sell at Bond market price of $10.12", async () => {
    //@ts-expect-error
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "10.12" } });
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("swap-price")).toContain(/10.12/);
  });

  it("Should have a disclaimer notifying a sell below current market price ($13.20)", async () => {
    //@ts-expect-error
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "10.12" } });
    //@ts-expect-error
    vi.spyOn(RangeHooks, "OperatorReserveSymbol").mockReturnValue({ data: { reserveAddress: "0x", symbol: "OHM" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.findByText("I understand that I am selling at a discount to current market price"));
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
