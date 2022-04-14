import { fireEvent } from "@testing-library/dom";
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
beforeEach(() => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  data.mockReturnValue(mockWeb3Context);

  Token.OHM_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("20"));
  Token.DAI_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_DAI_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("200000"));
  Token.OHM_WETH_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
  Token.OHM_LUSD_LP_TOKEN.getPrice = jest.fn().mockResolvedValue(new DecimalBigNumber("1"));
});

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
    render(<Bond />);
  });

  it("should display OHM DAI Inverse Bond", async () => {
    fireEvent.click(await screen.findByText("Inverse Bond"));
    expect(await screen.findByText("DAI")).toBeInTheDocument();
  });

  it("Should Display No Active Bonds Message", async () => {
    expect(await screen.findByText("No active bonds")).toBeInTheDocument();
  });
});
