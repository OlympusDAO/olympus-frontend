import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import Router from "react-router";
import Messages from "src/components/Messages/Messages";
import * as Contract from "src/constants/contracts";
import * as Token from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
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
} from "../__mocks__/mockLiveMarkets";
import { Bond } from "../Bond";
import { BondModalContainer } from "../components/BondModal/BondModal";

beforeEach(() => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  data.mockReturnValue(mockWeb3Context);

  Token.OHM_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("20"));
  Token.DAI_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_DAI_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("200000"));
  Token.LUSD_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.FRAX_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
});

afterEach(() => {
  jest.resetAllMocks();

  Token.OHM_TOKEN.getPrice.mockReset();
  Token.DAI_TOKEN.getPrice.mockReset();
  Token.OHM_DAI_LP_TOKEN.getPrice.mockReset();
  Token.LUSD_TOKEN.getPrice.mockReset();
  Token.FRAX_TOKEN.getPrice.mockReset();
});

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
}));

describe("Bonds", () => {
  beforeEach(() => {
    const bondDepository = jest.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const inverseBondDepository = jest.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: jest.fn().mockReturnValue({
        deposit: jest.fn().mockResolvedValue(true),
      }),
      liveMarkets: jest.fn().mockResolvedValue(mockLiveMarkets),
      terms: jest.fn().mockImplementation(id => {
        return Promise.resolve(terms[id]);
      }),
      markets: jest.fn().mockImplementation(id => {
        return Promise.resolve(markets[id]);
      }),
      marketPrice: jest.fn().mockImplementation(id => {
        return Promise.resolve(marketPrice[id]);
      }),
      indexesFor: jest.fn().mockResolvedValue(indexesFor),
      notes: jest.fn().mockResolvedValue(notes),
      wait: jest.fn().mockResolvedValue(true),
    });
    inverseBondDepository.mockReturnValue({
      connect: jest.fn().mockReturnValue({
        deposit: jest.fn().mockResolvedValue(true),
      }),
      liveMarkets: jest.fn().mockResolvedValue(mockNoInverseLiveMarkets),
      terms: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseTerms[id]);
      }),
      markets: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarkets[id]);
      }),
      marketPrice: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarketPrice[id]);
      }),
      wait: jest.fn().mockResolvedValue(true),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render component with LUSD", async () => {
    render(<Bond />);

    expect(await screen.findByText("LUSD")).toBeInTheDocument();
  });

  it("should render component with OHM-DAI LP", async () => {
    render(<Bond />);

    expect(await screen.queryAllByText("OHM-DAI LP")[0]).toBeInTheDocument();
  });

  it("should render component with FRAX", async () => {
    render(<Bond />);

    expect(await screen.findByText("FRAX")).toBeInTheDocument();
  });

  it("Should display the correct LP value", async () => {
    render(<Bond />);

    expect(await screen.findByText("$17.21")).toBeInTheDocument();
  });

  it("Should display the correct % Discount value", async () => {
    render(<Bond />);

    expect(await screen.findByText("13.96%")).toBeInTheDocument();
  });
});

describe("Bond Modal", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "38" });
    const bondDepository = jest.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: jest.fn().mockReturnValue({
        deposit: jest.fn().mockResolvedValue({
          wait: jest.fn().mockReturnValue({ transactionHash: "" }),
        }),
      }),
    });
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  });

  afterEach(() => {
    jest.resetAllMocks();

    Balance.useBalance.mockReset();
    ContractAllowance.useContractAllowance.mockReset();
  });

  it("Should display bond modal with Fixed Term Bond", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(<BondModalContainer />);
    expect(await screen.findByText("Duration")).toBeInTheDocument();
  });

  it("Should display bond modal with Approve Button", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
    render(<BondModalContainer />);
    expect(await screen.findByText("Approve")).toBeInTheDocument();
  });

  it("Should Return Error when no amount is entered ", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <Messages />
        <BondModalContainer />
      </>,
    );
    fireEvent.click(await screen.findByText("Bond"));
    expect(await screen.findByText("Please enter a number")).toBeInTheDocument();
  });

  it("Should Return Error when negative amount is entered", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <Messages />
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of OHM-DAI LP"), {
      target: { value: "-1" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    expect(await screen.findByText("Please enter a number greater than 0")).toBeInTheDocument();
  });

  it("Should Return Error when amount is greater than balance", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <Messages />
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of OHM-DAI LP"), {
      target: { value: "20" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    expect(await screen.findByText("You cannot bond more than your OHM-DAI LP balance")).toBeInTheDocument();
  });

  it("Return Error when Amount is > Max Payout", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <Messages />
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of OHM-DAI LP"), {
      target: { value: "5" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    expect(
      await screen.findByText("The maximum you can bond at this time is 0.348287073676420851 OHM-DAI LP"),
    ).toBeInTheDocument();
  });

  it("Should Execute Successfully", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <Messages />
        <BondModalContainer />
      </>,
    );
    fireEvent.change(await screen.findByPlaceholderText("Enter an amount of OHM-DAI LP"), {
      target: { value: "0.31" },
    });
    fireEvent.click(await screen.findByText("Bond"));
    expect(await screen.findByText("Successfully bonded OHM-DAI LP")).toBeInTheDocument();
  });
});
