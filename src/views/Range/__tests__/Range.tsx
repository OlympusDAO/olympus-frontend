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
import * as WAGMI from "wagmi";

global.ResizeObserver = require("resize-observer-polyfill");
jest.mock("src/hooks/useContractAllowance");
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

const defaultStatesWithApproval = () => {
  const rangeOperator = jest.spyOn(Contract.RANGE_OPERATOR_CONTRACT, "getEthersContract");
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
  //@ts-ignore
  rangeOperator.mockReturnValue({
    connect: jest.fn().mockReturnValue({
      swap: jest.fn().mockReturnValue({
        wait: jest.fn().mockResolvedValue(true),
      }),
    }),
  });
  //@ts-expect-error
  useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });
  //@ts-expect-error
  Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
};
describe("Default Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    defaultStatesWithApproval();
    render(<Range />);
  });

  it("Should Display Max You Can Buy", async () => {
    setTimeout(async () => {
      expect(await screen.findByTestId("max-row")).toHaveTextContent("Max You Can Buy");
    }, 30000);
  });

  it("Should populate OHM Value automatically with 4.136381351142522 when 100 DAI amount is entered", async () => {
    setTimeout(async () => {
      fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
      expect(await screen.findByTestId("ohm-amount")).toHaveValue("4.136381351142522");
    }, 30000);
  });

  it("Should populate DAI Value automatically with 145.05432383169222 when 6 OHM amount is entered", async () => {
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("145.05432383169222");
  });

  it("Should open the confirmation modal when Reserve amount is lower than balance", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]).toBeInTheDocument();
  });

  it("Should Successfully execute a buy swap", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Range Swap Successful")).toBeInTheDocument();
  });
  it("Should Show a message when mutating", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    //waiting for isMutating to be caught
    setTimeout(async () => {
      expect(
        await screen.findByText("Please don't close this modal until all wallet transactions are confirmed."),
      ).toBeInTheDocument();
    }, 10000);
  });

  it("Should close the confirmation modal when clicking the close button", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    expect(await screen.getAllByText("Confirm Swap")[0]).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("close"));
    expect(await screen.queryByText("Confirm Swap")).not.toBeInTheDocument();
  });

  it("Should display Amount exceeds balance when DAI amount entered exceeds balance", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance")).toBeInTheDocument();
  });
  it("Should display Amount exceeds capacity message when DAI amount entered exceeds available OHM capacity", async () => {
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "20000000" } });
    expect(screen.getByText("Amount exceeds capacity")).toBeInTheDocument();
  });

  it("Should populate input with max balance (10 DAI) when clicking Max button", async () => {
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("10");
  });

  // it("Should render tooltip with correct data", async () => {
  //   render(<Range />);
  //   expect(await screen.findByText("Upper Cushion"));
  //   expect(await screen.findByText("Lower Cushion"));
  // });

  it("Should render with Ask price of $24.18 on chart", async () => {
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

  it("Should Load page without error. With Correct Max values based on capacity", async () => {
    expect(await screen.findByTestId("max-row")).toHaveTextContent("605396.96 OHM (14635907.74 DAI)");
  });
});

describe("Sell Tab Main Range View", () => {
  beforeEach(() => {
    connectWallet();
    //@ts-expect-error
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  });

  it("Should Display Max You Can Sell", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("max-row")).toHaveTextContent("Max You Can Sell");
  });

  it("Should Display Discount instead of Premium", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("premium-discount")).toHaveTextContent("Discount");
  });

  it("Should populate DAI Value automatically with 81.38628391985866 when 6.204572026713784 DAI amount is entered", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("81.38628391985866");
  });
  it("Should populate OHM Value automatically with 7.623608952122014 OHM when 100 DAI is entered", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "100" } });
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("7.623608952122014");
  });

  it("Should change the OHM Value when switching back to the Buy Tab", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "6.204572026713784" } });
    expect(await screen.findByTestId("reserve-amount")).toHaveValue("81.38628391985866");
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("3.366447070448939");
  });

  it("Should display Amount exceeds balance when OHM amount entered exceeds balance", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "11" } });
    expect(await screen.getByText("Amount exceeds balance")).toBeInTheDocument();
  });
  it("Should display Amount exceeds capacity message when OHM amount entered exceeds available DAI capacity", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.input(await screen.findByTestId("ohm-amount"), { target: { value: "1000000" } });
    expect(await screen.getByText("Amount exceeds capacity")).toBeInTheDocument();
  });
  it("Should populate input with max balance (10 OHM) when clicking Max button", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    fireEvent.click(screen.getAllByText("Max")[0]);
    expect(await screen.findByTestId("ohm-amount")).toHaveValue("10");
  });

  it("Should render with Bid price of $13.12 on chart", async () => {
    const { container } = render(<Range />);
    fireEvent.click(container.getElementsByClassName("arrow-wrapper")[0]);
    expect(await screen.findByText("Bid: $13.12"));
  });
});

describe("Error Checks Disconnected", () => {
  beforeEach(() => {
    defaultStatesWithApproval();
    invalidAddress();
  });

  it("Should render an error when empty/invalid address", async () => {
    render(
      <>
        <Range />
      </>,
    );
    fireEvent.input(await screen.findByTestId("reserve-amount"), { target: { value: "6" } });
    fireEvent.click(screen.getByTestId("range-submit"));
    fireEvent.click(screen.getByTestId("disclaimer-checkbox"));
    fireEvent.click(screen.getByTestId("range-confirm-submit"));
    expect(await screen.findByText("Invalid address")).toBeInTheDocument();
  });

  it("Should render an error when ther is an invalid signer", async () => {
    connectWallet();
    //@ts-ignore
    WAGMI.useSigner = jest.fn(() => {
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
    expect(await screen.findByText("Please connect a wallet to Range Swap")).toBeInTheDocument();
  });
});
