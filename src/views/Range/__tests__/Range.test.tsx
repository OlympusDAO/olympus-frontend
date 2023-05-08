import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { formatCurrency } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Prices from "src/hooks/usePrices";
import { connectWallet, invalidAddress } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import * as RangeFactory from "src/typechain/factories/Range__factory";
import { RangeData } from "src/views/Range/__mocks__/mockRangeCalls";
import { Range } from "src/views/Range/index";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as WAGMI from "wagmi";

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

const defaultStatesWithApproval = () => {
  const rangeOperator = vi.spyOn(Contract.RANGE_OPERATOR_CONTRACT, "getEthersContract");
  RangeFactory.Range__factory.connect = vi.fn().mockReturnValue({
    range: vi.fn().mockReturnValue(RangeData),
    reserve: vi.fn().mockReturnValue("address"),
  });
  IERC20Factory.IERC20__factory.connect = vi.fn().mockReturnValue({
    symbol: vi.fn().mockReturnValue("DAI"),
  });
  //@ts-expect-error
  vi.spyOn(Prices, "useOhmPrice").mockReturnValue({ data: "18.209363085" });

  //@ts-ignore
  rangeOperator.mockReturnValue({
    connect: vi.fn().mockReturnValue({
      swap: vi.fn().mockReturnValue({
        wait: vi.fn().mockResolvedValue(true),
      }),
    }),
  });
  //@ts-expect-error
  useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });
  //@ts-expect-error
  vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
};
describe("Default Main Range View", () => {
  beforeEach(async () => {
    connectWallet();
    defaultStatesWithApproval();
    render(<Range />);
  });

  it("Should Display Max You Can Buy", async () => {
    expect(await screen.findByTestId("max-row")).toContain(/Max You Can Buy/);
  });

  it("Should populate OHM Value automatically with 4.136381351142522 when 100 DAI amount is entered", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toContain(/4.136381351142522/);
  });

  it("Should populate DAI Value automatically with 145.05432383169222 when 6 OHM amount is entered", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/145.05432383169222/);
  });

  it("Should open the confirmation modal when Reserve amount is lower than balance", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(await screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]);
  });

  it("Should Successfully execute a buy swap", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Range Swap Successful"));
  });
  it("Should Show a message when mutating", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    //waiting for isMutating to be caught
    setTimeout(async () => {
      expect(await screen.findByText("Please don't close this modal until all wallet transactions are confirmed."));
    }, 10000);
  });

  it("Should close the confirmation modal when clicking the close button", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]);
    fireEvent.click(screen.getByLabelText("close"));
    expect(await screen.queryByText("Confirm Swap")).toBeNull();
  });

  it("Should display Amount exceeds balance when DAI amount entered exceeds balance", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance"));
  });
  it("Should display Amount exceeds capacity message when DAI amount entered exceeds available OHM capacity", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "20000000" } });
    expect(screen.getByText("Amount exceeds capacity"));
  });

  it("Should populate input with max balance (10 DAI) when clicking Max button", async () => {
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("reserve-amount")).toContain(/10/);
  });

  // it("Should render tooltip with correct data", async () => {
  //   render(<Range />);
  //   expect(await screen.findByText("Upper Cushion"));
  //   expect(await screen.findByText("Lower Cushion"));
  // });

  it("Should render with Ask price of $24.18 on chart", async () => {
    expect(await screen.getByText("Ask: $24.18"));
  });
});

describe("No Balances Loaded", () => {
  beforeEach(() => {
    connectWallet();
    //@ts-expect-error
    vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: undefined } });
    render(<Range />);
  });

  it("Should Load page without error. With Correct Max values based on capacity", async () => {
    expect(await screen.findByTestId("max-row")).toContain(/605396.96 OHM (14635907.74 DAI)/);
  });
});

describe("Sell Tab Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    //@ts-expect-error
    vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  });

  it("Should Display Max You Can Sell", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("max-row")).toContain(/Max You Can Sell/);
  });

  it("Should Display Discount instead of Premium", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("premium-discount")).toContain(/Discount/);
  });

  it("Should populate DAI Value automatically with 81.38628391985866 when 6.204572026713784 DAI amount is entered", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/81.38628391985866/);
  });
  it("Should populate OHM Value automatically with 7.623608952122014 OHM when 100 DAI is entered", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toContain(/7.623608952122014/);
  });

  it("Should change the OHM Value when switching back to the Buy Tab", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/81.38628391985866/);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("ohm-amount")).toContain(/3.366447070448939/);
  });

  it("Should display Amount exceeds balance when OHM amount entered exceeds balance", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance"));
  });
  it("Should display Amount exceeds capacity message when OHM amount entered exceeds available DAI capacity", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "1000000" } });
    expect(await screen.getByText("Amount exceeds capacity"));
  });
  it("Should populate input with max balance (10 OHM) when clicking Max button", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("ohm-amount")).toContain(/10/);
  });

  it("Should render with Bid price of $13.12 on chart", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(screen.getByText("Bid: $13.12"));
  });
});

describe("Error Checks Disconnected", () => {
  beforeEach(() => {
    defaultStatesWithApproval();
    invalidAddress();
  });

  // it("Should render an error when empty/invalid address", async () => {
  //   render(
  //     <>
  //       <Messages />
  //       <Range />
  //     </>,
  //   );
  //   fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
  //   fireEvent.click(screen.getByTestId("range-submit"));
  //   fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
  //   fireEvent.click(screen.getByTestId("range-confirm-submit"));
  //   expect(await screen.findByText("Invalid address"));
  // });

  it("Should render an error when ther is an invalid signer", async () => {
    connectWallet();
    //@ts-ignore
    vi.spyOn(WAGMI, "useSigner").mockReturnValue(() => {
      return {
        data: undefined,
      };
    });

    render(
      <>
        <Range />
      </>,
    );
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Please connect a wallet to Range Swap"));
  });
});
