import { fireEvent } from "@testing-library/dom";
import Router from "react-router";
import * as Contract from "src/constants/contracts";
import * as Token from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import {
  inverseMarketPrice,
  inverseMarkets,
  inverseTerms,
  marketPrice,
  markets,
  mockInverseLiveMarkets,
  mockNoLiveMarkets,
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

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe("Inverse Bonds", () => {
  beforeEach(() => {
    const bondDepository = jest.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const inverseBondDepository = jest.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");

    bondDepository.mockReturnValue({
      liveMarkets: jest.fn().mockResolvedValue(mockNoLiveMarkets),
      terms: jest.fn().mockImplementation(id => {
        return Promise.resolve(terms[id]);
      }),
      markets: jest.fn().mockImplementation(id => {
        return Promise.resolve(markets[id]);
      }),
      marketPrice: jest.fn().mockImplementation(id => {
        return Promise.resolve(marketPrice[id]);
      }),
    });

    inverseBondDepository.mockReturnValue({
      liveMarkets: jest.fn().mockResolvedValue(mockInverseLiveMarkets),
      terms: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseTerms[id]);
      }),
      markets: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarkets[id]);
      }),
      marketPrice: jest.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarketPrice[id]);
      }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display OHM DAI Inverse Bond", async () => {
    // Starts on the inverse bond screen
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds/inverse" });
    jest.spyOn(Router, "useParams").mockReturnValue({});

    render(<Bond />);

    fireEvent.click(await screen.findByTestId("inverse-bond-tab"));
    expect(await screen.findByText("DAI")).toBeInTheDocument();
  });

  it("Should Display No Active Bonds Message on Bonds screen", async () => {
    // Starts on the inverse bond screen
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds/inverse" });
    jest.spyOn(Router, "useParams").mockReturnValue({});

    render(<Bond />);

    // Frontend now defaults to the inverse bonds tab if there are no bonds
    // So the location needs to be explicitly changed
    fireEvent.click(await screen.findByTestId("bond-tab"));
    expect(await screen.findByText("No active bonds")).toBeInTheDocument();
  });

  it("should default to inverse bond tab", async () => {
    // Starts on the bond screen
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds" });
    jest.spyOn(Router, "useParams").mockReturnValue({});

    render(<Bond />);

    expect(await screen.findByTestId("8--bond")).toBeInTheDocument(); // bond id of 8
    expect(await screen.findByText("Sold Out")).toBeInTheDocument(); // Price of the DAI inverse bond. isSoldOut = true so this should be not return price.
  });
});

describe("Bond Modal", () => {
  beforeEach(() => {
    const bondDepository = jest.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: jest.fn().mockReturnValue({
        deposit: jest.fn().mockResolvedValue({
          wait: jest.fn().mockReturnValue(true),
        }),
      }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should display bond modal with Instant Payout Bond (Inverse)", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "8" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/inverse/8" });
    render(<BondModalContainer />);
    expect(await screen.findByText("Instantly")).toBeInTheDocument();
    // NOTE (appleseed): checking for 0 DAI estimated payment (you will get)
    expect(await screen.findByText("0 DAI")).toBeInTheDocument();
  });
});
