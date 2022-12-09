import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import * as Contract from "src/constants/contracts";
import * as Token from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import { connectWallet } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import {
  indexesFor,
  inverseMarketPrice,
  inverseMarkets,
  inverseTerms,
  marketPrice,
  markets,
  mockLiveMarkets,
  mockNoInverseLiveMarkets,
  notes,
  terms,
} from "src/views/Bond/__mocks__/mockLiveMarkets";
import { Bond } from "src/views/Bond/Bond";
import { BondModalContainer } from "src/views/Bond/components/BondModal/BondModal";
import { vi } from "vitest";
beforeEach(async () => {
  Token.OHM_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("20"));
  Token.DAI_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_DAI_LP_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("200000"));
  Token.LUSD_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.FRAX_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
  vi.mock("react-router", async () => {
    const router = await vi.importActual("react-router");
    return {
      ...router,
      useParams: () => ({ id: "38" }),
    };
  });
});

afterEach(() => {
  Token.OHM_TOKEN.getPrice.mockReset();
  Token.DAI_TOKEN.getPrice.mockReset();
  Token.OHM_DAI_LP_TOKEN.getPrice.mockReset();
  Token.LUSD_TOKEN.getPrice.mockReset();
  Token.FRAX_TOKEN.getPrice.mockReset();
});

describe("Bonds", () => {
  beforeEach(() => {
    const bondDepository = vi.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const inverseBondDepository = vi.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: vi.fn().mockReturnValue({
        deposit: vi.fn().mockResolvedValue(true),
      }),
      liveMarkets: vi.fn().mockResolvedValue(mockLiveMarkets),
      terms: vi.fn().mockImplementation(id => {
        return Promise.resolve(terms[id]);
      }),
      markets: vi.fn().mockImplementation(id => {
        return Promise.resolve(markets[id]);
      }),
      marketPrice: vi.fn().mockImplementation(id => {
        return Promise.resolve(marketPrice[id]);
      }),
      indexesFor: vi.fn().mockResolvedValue(indexesFor),
      notes: vi.fn().mockResolvedValue(notes),
      wait: vi.fn().mockResolvedValue(true),
    });
    inverseBondDepository.mockReturnValue({
      connect: vi.fn().mockReturnValue({
        deposit: vi.fn().mockResolvedValue(true),
      }),
      liveMarkets: vi.fn().mockResolvedValue(mockNoInverseLiveMarkets),
      terms: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseTerms[id]);
      }),
      markets: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarkets[id]);
      }),
      marketPrice: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarketPrice[id]);
      }),
      wait: vi.fn().mockResolvedValue(true),
    });
  });

  it("should render component with LUSD", async () => {
    render(<Bond />);

    expect(await screen.findByText("LUSD"));
  });

  it("should render component with OHM-DAI LP", async () => {
    render(<Bond />);

    expect(await screen.queryAllByText("OHM-DAI LP")[0]);
  });

  it("should render component with FRAX", async () => {
    render(<Bond />);

    expect(await screen.findByText("FRAX"));
  });

  it("Should display the correct LP value", async () => {
    render(<Bond />);

    expect(await screen.findByText("14.21 FRAX"));
  });

  it("Should display the correct % Discount value", async () => {
    render(<Bond />);

    expect(await screen.findByText("28.95%"));
  });
});

describe("Bond Modal", () => {
  beforeEach(() => {
    connectWallet();
    const bondDepository = vi.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: vi.fn().mockReturnValue({
        deposit: vi.fn().mockResolvedValue({
          wait: vi.fn().mockReturnValue({ transactionHash: "" }),
        }),
      }),
    });
    vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  });

  // afterEach(() => {
  //   Balance.useBalance.mockReset();
  //   ContractAllowance.useContractAllowance.mockReset();
  // });

  it("Should display bond modal with Fixed Term Bond", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(<BondModalContainer />);
    expect(await screen.findByText("Vesting Term"));
  });

  it("Should display bond modal with Approve Button", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({ data: BigNumber.from(0) });
    render(<BondModalContainer />);
    expect(await screen.findByText("Approve OHM-DAI LP to Bond"));
  });

  it("Should Return Error when no amount is entered ", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(
      <>
        <BondModalContainer />
      </>,
    );
    fireEvent.click(await screen.findByText("Bond"));
    fireEvent.click(await screen.findByText("Confirm Bond"));
    expect(await screen.findByText("Please enter a number"));
  });

  it("Should Return Error when negative amount is entered", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(
      <>
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByTestId("fromInput"), {
      target: { value: "-1" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    fireEvent.click(await screen.findByText("Confirm Bond"));
    expect(await screen.findByText("Please enter a number greater than 0"));
  });

  it("Should Return Error when amount is greater than balance", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(
      <>
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByTestId("fromInput"), {
      target: { value: "20" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    fireEvent.click(await screen.findByText("Confirm Bond"));
    expect(await screen.findByText("You cannot bond more than your OHM-DAI LP balance"));
  });

  it("Return Error when Amount is > Max Payout", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(
      <>
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByTestId("fromInput"), {
      target: { value: "5" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    fireEvent.click(await screen.findByText("Confirm Bond"));
    expect(await screen.findByText("The maximum you can bond at this time is 0.348287073676420851 OHM-DAI LP"));
  });

  it("Should Execute Successfully", async () => {
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("10000000000000000000"),
    });
    render(
      <>
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByTestId("fromInput"), {
      target: { value: "0.31" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    fireEvent.click(await screen.findByText("Confirm Bond"));
    expect(await screen.findByText("Successfully bonded OHM-DAI LP"));
  });
});
