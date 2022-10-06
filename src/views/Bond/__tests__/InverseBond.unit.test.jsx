import { BigNumber } from "ethers";
import Router from "react-router";
import * as Contract from "src/constants/contracts";
import * as Token from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import { connectWallet } from "src/testHelpers";
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
} from "src/views/Bond/__mocks__/mockLiveMarkets";
import { Bond } from "src/views/Bond/Bond";
import { BondModalContainer } from "src/views/Bond/components/BondModal/BondModal";

beforeEach(() => {
  connectWallet();

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
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds/inverse" });
    jest.spyOn(Router, "useParams").mockReturnValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display OHM DAI Inverse Bond", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds/inverse" });
    jest.spyOn(Router, "useParams").mockReturnValue({});
    // Starts on the inverse bond screen

    render(<Bond />);
    setTimeout(async () => {
      expect(screen.getByText("DAI")).toBeInTheDocument();
    }, 30000);
  });

  it("Shouldn't display bond tabs when only inverse bonds are live", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds/inverse" });
    jest.spyOn(Router, "useParams").mockReturnValue({});
    render(<Bond />);

    // Frontend now defaults to the inverse bonds tab if there are no bonds
    // There are no active bonds, so we shouldnt show tab
    expect(screen.queryByTestId("bond-tab")).toBeNull();
  });

  it("should default to inverse bond tab", async () => {
    // Starts on the bond screen
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/bonds" });
    jest.spyOn(Router, "useParams").mockReturnValue({});

    render(<Bond />);
    setTimeout(async () => {
      expect(await screen.findByTestId("8--bond")).toBeInTheDocument(); // bond id of 8
      expect(screen.getAllByText("Inverse Bond")[1]).toBeInTheDocument(); // Price of the DAI inverse bond.
    }, 30000);
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
    jest.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({ data: BigNumber.from(10) });

    render(<BondModalContainer />);
    expect(await screen.findByText("Instantly")).toBeInTheDocument();
    // NOTE (appleseed): checking for 0 DAI estimated payment (you will get)
    expect(await screen.findByText("0 DAI")).toBeInTheDocument();
  });
});
