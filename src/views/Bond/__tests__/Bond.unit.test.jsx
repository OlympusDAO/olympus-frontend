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
  mockLiveMarkets,
  mockNoInverseLiveMarkets,
  terms,
} from "../__mocks__/mockLiveMarkets";
import { Bond } from "../Bond";
beforeEach(() => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  data.mockReturnValue(mockWeb3Context);

  Token.OHM_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("20"));
  Token.DAI_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_DAI_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("200000"));
  Token.OHM_WETH_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_LUSD_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
});

describe("Bonds", () => {
  beforeEach(() => {
    const bondDepository = jest.spyOn(Contract.BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    const inverseBondDepository = jest.spyOn(Contract.OP_BOND_DEPOSITORY_CONTRACT, "getEthersContract");
    bondDepository.mockReturnValue({
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
    });
    inverseBondDepository.mockReturnValue({
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
    });
    render(<Bond />);
  });

  it("should render component with OHM-LUSD LP", async () => {
    expect(await screen.findByText("OHM-LUSD LP")).toBeInTheDocument();
  });

  it("should render component with OHM-DAI LP", async () => {
    expect(await screen.findByText("OHM-DAI LP")).toBeInTheDocument();
  });

  it("should render component with OHM-WETH LP", async () => {
    expect(await screen.findByText("OHM-WETH LP")).toBeInTheDocument();
  });

  it("Should display the correct LP value", async () => {
    expect(await screen.findByText("$17.21")).toBeInTheDocument();
  });
  it("Should display the correct % Discount value", async () => {
    expect(await screen.findByText("13.96%")).toBeInTheDocument();
  });
});
