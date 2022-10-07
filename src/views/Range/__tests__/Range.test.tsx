import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { connectWallet, invalidAddress } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import * as IERC20Factory from "src/typechain/factories/IERC20__factory";
import * as RangeFactory from "src/typechain/factories/Range__factory";
import * as RANGEPriceContract from "src/typechain/factories/RangePrice__factory";
import { RangeData } from "src/views/Range/__mocks__/mockRangeCalls";
import { Range } from "src/views/Range/index";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as WAGMI from "wagmi";

global.ResizeObserver = require("resize-observer-polyfill");
vi.mock("src/hooks/useContractAllowance");
// vi.mock("recharts", async () => {
//   const OriginalModule = await vi.importActual("recharts");

//   return {
//     ...OriginalModule,
//     Symbols: vi.fn(),
//     ResponsiveContainer: ({ height, children }) => (
//       <OriginalModule.ResponsiveContainer width={800} height={height}>
//         {children}
//       </OriginalModule.ResponsiveContainer>
//     ),
//   };
// });

const defaultStatesWithApproval = () => {
  const rangeOperator = vi.spyOn(Contract.RANGE_OPERATOR_CONTRACT, "getEthersContract");
  RangeFactory.Range__factory.connect = vi.fn().mockReturnValue({
    range: vi.fn().mockReturnValue(RangeData),
    reserve: vi.fn().mockReturnValue("address"),
  });
  IERC20Factory.IERC20__factory.connect = vi.fn().mockReturnValue({
    symbol: vi.fn().mockReturnValue("DAI"),
  });
  RANGEPriceContract.RangePrice__factory.connect = vi.fn().mockReturnValue({
    getCurrentPrice: vi.fn().mockReturnValue(BigNumber.from("13209363085060059262")),
  });
  //@ts-ignore
  rangeOperator.mockReturnValue({
    connect: vi.fn().mockReturnValue({
      swap: vi.fn().mockReturnValue({
        wait: vi.fn().mockResolvedValue(true),
      }),
    }),
  });
  //@ts-expect-error
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  //@ts-expect-error
  vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
};
describe("Default Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    defaultStatesWithApproval();
  });

  it("Should Load Correct Upper Wall Price", async () => {
    render(<Range />);
    expect(await screen.findByTestId("upper-wall")).toContain(/$24.18/);
  });
  it("Should Load Correct Lower Wall Price", async () => {
    render(<Range />);
    expect(await screen.findByTestId("lower-wall")).toContain(/$16.12/);
  });
  it("Should Display Max You Can Buy", async () => {
    render(<Range />);
    expect(await screen.findByTestId("max-row")).toContain(/Max You Can Buy/);
  });

  it("Should populate OHM Value automatically with 4.136381351142522 when 100 DAI amount is entered", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toContain(/4.136381351142522/);
  });

  it("Should populate DAI Value automatically with 145.05432383169222 when 6 OHM amount is entered", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/145.05432383169222/);
  });

  it("Should open the confirmation modal when Reserve amount is lower than balance", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]);
  });

  it("Should Successfully execute a buy swap", async () => {
    render(
      <>
        <Range />
      </>,
    );
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Range Swap Successful"));
  });
  it("Should Show a message when mutating", async () => {
    render(
      <>
        <Range />
      </>,
    );
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
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]);
    fireEvent.click(screen.getByLabelText("close"));
    expect(await screen.queryByText("Confirm Swap")).toBeNull();
  });

  it("Should display Amount exceeds balance when DAI amount entered exceeds balance", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance"));
  });
  it("Should display Amount exceeds capacity message when DAI amount entered exceeds available OHM capacity", async () => {
    render(<Range />);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "20000000" } });
    expect(screen.getByText("Amount exceeds capacity"));
  });

  it("Should populate input with max balance (10 DAI) when clicking Max button", async () => {
    render(<Range />);
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("reserve-amount")).toContain(/10/);
  });

  // it("Should render tooltip with correct data", async () => {
  //   render(<Range />);
  //   expect(await screen.findByText("Upper Cushion"));
  //   expect(await screen.findByText("Lower Cushion"));
  // });

  it("Should render with Ask price of $24.18 on chart", async () => {
    render(<Range />);
    expect(await screen.findByText("Ask: $24.18"));
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
    render(<Range />);
    fireEvent.click(screen.getByTestId("sell-tab"));
  });

  it("Should Display Max You Can Sell", async () => {
    expect(await screen.findByTestId("max-row")).toContain(/Max You Can Sell/);
  });

  it("Should Display Premium instead of Discount", async () => {
    expect(await screen.findByTestId("premium-discount")).toContain(/Premium/);
  });

  it("Should populate DAI Value automatically with 100 when 6.204572026713784 DAI amount is entered", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/100/);
  });
  it("Should populate OHM Value automatically with 6.204572026713784 OHM when 100 DAI is entered", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toContain(/6.204572026713784/);
  });

  it("Should change the OHM Value when switching back to the Buy Tab", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toContain(/100/);
    fireEvent.click(screen.getByTestId("buy-tab"));
    expect(await screen.findByTestId("ohm-amount")).toContain(/4.136381351142522/);
  });

  it("Should display Amount exceeds balance when OHM amount entered exceeds balance", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance"));
  });
  it("Should display Amount exceeds capacity message when OHM amount entered exceeds available DAI capacity", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "1000000" } });
    expect(await screen.getByText("Amount exceeds capacity"));
  });
  it("Should populate input with max balance (10 OHM) when clicking Max button", async () => {
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("ohm-amount")).toContain(/10/);
  });

  it("Should render with Bid price of $16.12 on chart", async () => {
    render(<Range />);
    expect(await screen.findByText("Bid: $16.12"));
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
