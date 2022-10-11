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

describe("Upper Wall Active Bond Market", () => {
  beforeEach(() => {
    const rangeData = jest.spyOn(Contract.RANGE_CONTRACT, "getEthersContract");
    const bondData = jest.spyOn(Contract.BOND_AUCTIONEER_CONTRACT, "getEthersContract");
    connectWallet();
    //@ts-ignore
    useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });

    IERC20Factory.IERC20__factory.connect = jest.fn().mockReturnValue({
      symbol: jest.fn().mockReturnValue("DAI"),
    });
    RANGEPriceContract.RangePrice__factory.connect = jest.fn().mockReturnValue({
      getCurrentPrice: jest.fn().mockReturnValue(BigNumber.from("13209363085060059262")),
    });
    //@ts-ignore
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
      range: jest.fn().mockReturnValueOnce({ ...RangeData, high: { ...RangeData.high, market: BigNumber.from("1") } }),
      reserve: jest.fn().mockReturnValue("address"),
    });
    //@ts-expect-error
    bondData.mockReturnValue({
      connect: jest.fn().mockReturnValue({
        getTeller: jest.fn().mockReturnValue("address"),
      }),
      marketPrice: jest.fn().mockReturnValue(BigNumber.from("20120000000000000000000000000000000000")),
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should Buy at Bond market price of $20.12", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "20.12" } });
    render(<Range />);
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("20.12");
  });

  it("Should Sell at Lower wall price of $16.12", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "16.12" } });
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
    expect(await screen.findByTestId("swap-price")).toHaveTextContent("16.12");
  });

  it("Should Show Confirmation modal with additional settings for recipient and slippage", async () => {
    //@ts-ignore

    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "11.12" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.findByTestId("transaction-settings")).toBeInTheDocument();
  });

  it("Should properly open Additional Settings Modal", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "11.12" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(await screen.findByTestId("transaction-settings"));
    expect(await screen.findByText("Slippage")).toBeInTheDocument();
  });

  it("Should properly close Additional Settings Modal", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "10.12" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(await screen.findByTestId("transaction-settings"));
    expect(await screen.findByText("Slippage")).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText("close")[1]);
    expect(await screen.getAllByText("Confirm Swap")[0]).toBeInTheDocument();
  });

  it("Should have a disclaimer notifying a buy above current market price ($13.20)", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "14.12" } });
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(screen.getByTestId("disclaimer")).toHaveTextContent(
      "I understand that I am buying at a premium to current market price",
    );
  });

  it("Should successfully complete buy regular bond transaction", async () => {
    //@ts-ignore
    RangeHooks.DetermineRangePrice = jest.fn().mockReturnValue({ data: { price: "14.12" } });
    render(
      <>
        <Range />
      </>,
    );
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Range Swap Successful")).toBeInTheDocument();
  });
});
