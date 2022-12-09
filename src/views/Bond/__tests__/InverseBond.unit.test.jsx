import * as Contract from "src/constants/contracts";
import * as Token from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
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
import { vi } from "vitest";

beforeEach(() => {
  connectWallet();

  Token.OHM_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("20"));
  Token.DAI_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_DAI_LP_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("200000"));
  Token.LUSD_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.FRAX_TOKEN.getPrice = vi.fn().mockResolvedValue(new DecimalBigNumber("1"));
});
describe("Inverse Bonds", () => {
  beforeEach(() => {
    const bondDepository = vi.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const inverseBondDepository = vi.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const v3BondDepository = vi.spyOn(Contract.BOND_AGGREGATOR_CONTRACT, "getEthersContract");

    bondDepository.mockReturnValue({
      liveMarkets: vi.fn().mockResolvedValue(mockNoLiveMarkets),
      terms: vi.fn().mockImplementation(id => {
        return Promise.resolve(terms[id]);
      }),
      markets: vi.fn().mockImplementation(id => {
        return Promise.resolve(markets[id]);
      }),
      marketPrice: vi.fn().mockImplementation(id => {
        return Promise.resolve(marketPrice[id]);
      }),
      indexesFor: vi.fn().mockResolvedValue([]),
    });

    v3BondDepository.mockReturnValue({
      liveMarketsFor: vi.fn().mockResolvedValue(mockNoLiveMarkets),
    });

    inverseBondDepository.mockReturnValue({
      liveMarkets: vi.fn().mockResolvedValue(mockInverseLiveMarkets),
      terms: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseTerms[id]);
      }),
      markets: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarkets[id]);
      }),
      marketPrice: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarketPrice[id]);
      }),
    });
    // vi.mock("react-router", async () => {
    //   const router = await vi.importActual("react-router");
    //   return {
    //     ...router,
    //     useParams: () => ({ id: 0 }),
    //     useLocation: () => ({ pathname: "/bonds/inverse" }),
    //   };
    // });
  });

  it("should display OHM DAI Inverse Bond", async () => {
    // Starts on the inverse bond screen
    render(<Bond />);
    expect(await screen.findByText("DAI"));
  });

  it("should default to inverse bond tab", async () => {
    render(<Bond />);

    expect(await screen.findByTestId("8--bond")); // bond id of 8
    expect(await screen.findByText("Bond for DAI"));
  });
});

describe("Bond Modal", () => {
  beforeEach(() => {
    const bondDepository = vi.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
      connect: vi.fn().mockReturnValue({
        deposit: vi.fn().mockResolvedValue({
          wait: vi.fn().mockReturnValue(true),
        }),
        indexesFor: vi.fn(),
      }),
    });
    const inverseBondDepository = vi.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");

    inverseBondDepository.mockReturnValue({
      liveMarkets: vi.fn().mockResolvedValue(mockInverseLiveMarkets),
      terms: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseTerms[id]);
      }),
      markets: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarkets[id]);
      }),
      marketPrice: vi.fn().mockImplementation(id => {
        return Promise.resolve(inverseMarketPrice[id]);
      }),
    });
    vi.mock("react-router", async () => {
      const router = await vi.importActual("react-router");
      return {
        ...router,
        useParams: () => ({ id: "8" }),
        useLocation: () => ({ pathname: "/inverse/8" }),
      };
    });
  });

  it("Should display bond modal with Instant Payout Bond (Inverse)", async () => {
    render(
      <>
        <BondModalContainer />
      </>,
    );
    expect(await screen.findByText("Instantly"));
  });
});
