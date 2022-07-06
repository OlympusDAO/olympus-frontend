import { BigNumber } from "ethers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { connectWallet } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import * as RangeFactory from "src/typechain/factories/Range__factory";
import * as RANGEPriceContract from "src/typechain/factories/RangePrice__factory";

import { RangeData } from "../__mocks__/mockRangeCalls";
import { Range } from "../index";

global.ResizeObserver = require("resize-observer-polyfill");

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe("Default Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    RangeFactory.Range__factory.connect = jest.fn().mockReturnValue({
      range: jest.fn().mockReturnValue(RangeData),
      reserve: jest.fn().mockReturnValue("address"),
    });
    IERC20Factory.IERC20__factory.connect = jest.fn().mockReturnValue({
      symbol: jest.fn().mockReturnValue("DAI"),
    });
    RANGEPriceContract.RangePrice__factory.connect = jest.fn().mockReturnValue({
      getCurrentPrice: jest.fn().mockReturnValue(BigNumber.from("13209363085060059262")),
    });
    //@ts-expect-error
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  });

  it("Should Load Correct Upper Wall Price", async () => {
    render(<Range />);
    expect(await screen.findByTestId("upper-wall")).toHaveTextContent("$24.18");
  });
  it("Should Load Correct Lower Wall Price", async () => {
    render(<Range />);
    expect(await screen.findByTestId("lower-wall")).toHaveTextContent("$16.12");
  });
  it("Should Display Max You Can Buy", async () => {
    render(<Range />);
    expect(await screen.findByTestId("max-row")).toHaveTextContent("Max You Can Buy");
  });
  it("Should Display Enter Amount of DAI to Spend", () => {
    render(<Range />);
    expect(screen.getAllByText("Enter Amount of DAI to Spend")[0]).toBeInTheDocument();
  });

  it("Should populate OHM Value automatically with 4.136381351142522 when 100 DAI amount is entered", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("4.136381351142522");
  });

  it("Should populate DAI Value automatically with 145.05432383169222 when 6 OHM amount is entered", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("145.05432383169222");
  });

  it("Should open the confirmation modal when Reserve amount is lower than balance", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getByText("Confirm Swap")).toBeInTheDocument();
  });

  it("Should close the confirmation modal when clicking the close button", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getByText("Confirm Swap")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("close"));
    expect(await screen.queryByText("Confirm Swap")).not.toBeInTheDocument();
  });

  it("Should display Amount exceeds balance when DAI amount entered exceeds balance", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance")).toBeInTheDocument();
  });
  it("Should display Amount exceeds capacity message when DAI amount entered exceeds available OHM capacity", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "20000000" } });
    expect(screen.getByText("Amount exceeds capacity")).toBeInTheDocument();
  });

  it("Should populate input with max balance (10 DAI) when clicking Max button", async () => {
    render(<Range />);
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("10");
  });

  it("Should render tooltip with correct data", async () => {
    render(<Range />);
    expect(await screen.findByText("Upper Cushion"));
    expect(await screen.findByText("Lower Cushion"));
  });

  it("Should render with Ask price of $24.18 on chart", async () => {
    render(<Range />);
    expect(await screen.findByText("Ask: $24.18"));
  });
});

describe("No Balances Loaded", () => {
  beforeEach(() => {
    connectWallet();
    //@ts-expect-error
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: undefined } });
    render(<Range />);
  });

  it("Should Load page without error. With 0.00 placeholder", async () => {
    expect(await screen.findByTestId("max-row")).toHaveTextContent("0.00");
  });
});
describe("Sell Tab Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    //@ts-expect-error
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
  });

  it("Should Display Max You Can Sell", async () => {
    expect(await screen.findByTestId("max-row")).toHaveTextContent("Max You Can Sell");
  });

  it("Should Display Premium instead of Discount", async () => {
    expect(await screen.findByTestId("premium-discount")).toHaveTextContent("Premium");
  });

  it("Should Display Enter Amount of OHM to Spend", () => {
    expect(screen.getAllByText("Enter Amount of OHM to Spend")[0]).toBeInTheDocument();
  });

  it("Should populate DAI Value automatically with 100 when 6.204572026713784 DAI amount is entered", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("100");
  });
  it("Should populate OHM Value automatically with 6.204572026713784 OHM when 100 DAI is entered", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("6.204572026713784");
  });

  it("Should change the OHM Value when switching back to the Buy Tab", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("100");
    fireEvent.click(screen.getByTestId("buy-tab"));
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("4.136381351142522");
  });

  it("Should display Amount exceeds balance when OHM amount entered exceeds balance", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance")).toBeInTheDocument();
  });
  it("Should display Amount exceeds capacity message when OHM amount entered exceeds available DAI capacity", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "1000000" } });
    expect(await screen.getByText("Amount exceeds capacity")).toBeInTheDocument();
  });
  it("Should populate input with max balance (10 OHM) when clicking Max button", async () => {
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("10");
  });

  it("Should render with Bid price of $16.12 on chart", async () => {
    render(<Range />);
    expect(await screen.findByText("Bid: $16.12"));
  });
});
