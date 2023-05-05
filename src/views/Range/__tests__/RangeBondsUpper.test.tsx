import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { formatCurrency } from "src/helpers";
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
vi.mock("src/views/Range/RangeChart", () => ({
  default: (props: {
    rangeData: any;
    currentPrice: number;
    bidPrice: number;
    askPrice: number;
    sellActive: boolean;
    reserveSymbol: string;
  }) => {
    return (
      <>
        <div>Ask: {formatCurrency(props.askPrice, 2)}</div>
        <div>Bid: {formatCurrency(props.bidPrice, 2)}</div>
      </>
    );
  },
}));

describe("Upper Wall Active Bond Market", () => {
  beforeEach(() => {
    const rangeData = vi.spyOn(Contract.RANGE_CONTRACT, "getEthersContract");
    const bondData = vi.spyOn(Contract.BOND_AGGREGATOR_CONTRACT, "getEthersContract");
    connectWallet();
    //@ts-ignore
    useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });

    IERC20Factory.IERC20__factory.connect = vi.fn().mockReturnValue({
      symbol: vi.fn().mockReturnValue("DAI"),
    });
    //@ts-expect-error
    vi.spyOn(Prices, "useOhmPrice").mockReturnValue({ data: "13.209363085" });
    //@ts-ignore
    BondTellerContract.BondTeller__factory.connect = vi.fn().mockReturnValue({
      purchase: vi.fn().mockReturnValue({
        wait: vi.fn().mockResolvedValue(true),
      }),
      getTeller: vi.fn().mockReturnValue(0),
    });

    //@ts-expect-error
    vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
    //@ts-ignore
    vi.spyOn(RangeHooks, "OperatorReserveSymbol").mockReturnValue({ data: { reserveAddress: "0x", symbol: "OHM" } });
    vi.spyOn(RangeHooks, "OperatorTargetPrice").mockReturnValue({
      data: 12,
      isFetched: true,
      isLoading: false,
    });

    //@ts-expect-error
    rangeData.mockReturnValueOnce({
      range: vi.fn().mockReturnValueOnce({ ...RangeData, high: { ...RangeData.high, market: BigNumber.from("1") } }),
      reserve: vi.fn().mockReturnValue("address"),
    });
    //@ts-expect-error
    bondData.mockReturnValue({
      connect: vi.fn().mockReturnValue({
        getTeller: vi.fn().mockReturnValue("address"),
      }),
      marketPrice: vi.fn().mockReturnValue(BigNumber.from("20120000000000000000000000000000000000")),
      getTeller: vi.fn().mockReturnValue(0),
      getMarketInfoForPurchase: vi.fn().mockReturnValue({ maxPayout: 0 }),
    });
    // vi.mock("src/views/Range/RangeChart", () => ({
    //   default: (props: {
    //     rangeData: any;
    //     currentPrice: number;
    //     bidPrice: number;
    //     askPrice: number;
    //     sellActive: boolean;
    //     reserveSymbol: string;
    //   }) => {
    //     console.log(formatCurrency(props.bidPrice, 2), "bidprice");
    //     return (
    //       <>
    //         <div>Ask: {formatCurrency(props.askPrice, 2)}</div>
    //         <div>Bid: {formatCurrency(props.bidPrice, 2)}</div>
    //       </>
    //     );
    //   },
    // }));
  });

  it("Should Buy at Bond market price of $20.12", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "20.12" } });

    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toContain(/20.12/);
  });

  it("Should Sell at Lower wall price of $16.12", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "16.12" } });
    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toContain(/16.12/);
  });

  it("Should Show Confirmation modal with additional settings for recipient and slippage", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "11.12" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.findByTestId("transaction-settings"));
  });

  it("Should properly open Additional Settings Modal", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "11.12" } });
    //@ts-ignore
    vi.spyOn(RangeHooks, "OperatorReserveSymbol").mockReturnValue({ data: { reserveAddress: "0x", symbol: "OHM" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(await screen.findByTestId("transaction-settings"));
    expect(await screen.findByText("Slippage"));
  });

  it("Should properly close Additional Settings Modal", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "10.12" } });

    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(await screen.findByTestId("transaction-settings"));
    expect(await screen.findByText("Slippage"));
    fireEvent.click(screen.getAllByLabelText("close")[1]);
    expect(await screen.getAllByText("Confirm Swap")[0]);
  });

  it("Should have a disclaimer notifying a buy above current market price ($14.20)", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "14.20" } });

    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(screen.getByTestId("disclaimer")).toContain(
      /I understand that I am buying at a premium to current market price/,
    );
  });

  it("Should successfully complete buy regular bond transaction", async () => {
    //@ts-ignore
    vi.spyOn(RangeHooks, "DetermineRangePrice").mockReturnValue({ data: { price: "14.20" } });

    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.queryAllByText("Range Swap Successful"));
  });
});
