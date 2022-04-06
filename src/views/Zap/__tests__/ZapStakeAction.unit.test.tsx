import { fireEvent } from "@testing-library/dom";
import nock from "nock";
import { act } from "react-dom/test-utils";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { render, screen } from "../../../testUtils";
import ZapStakeAction from "../ZapStakeAction";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("<ZapStakeAction/> ", () => {
  it("Submit Button Should be disabled with < 2 tokens selected enabled with two selected", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    const walletAddress = "0x49afdd21097ee0c6e40d69e3233a73ed76ed43e4".toLowerCase();

    // Mock the response from the Zapper API
    nock("https://api.zapper.fi")
      .persist()
      .get(
        `/v1/protocols/tokens/balances?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241&addresses%5B%5D=${walletAddress}&newBalances=true`,
      )
      .reply(200, () => {
        return {
          [walletAddress]: {
            products: [
              {
                label: "Tokens",
                assets: [
                  {
                    type: "wallet",
                    balanceUSD: 10000.0,
                    tokens: [
                      {
                        type: "base",
                        hide: false,
                        network: "ethereum",
                        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
                        decimals: 18,
                        symbol: "DAI",
                        price: 0.998646,
                        balance: 10000,
                        balanceRaw: "10000",
                        balanceUSD: 10000.0,
                        tokenImageUrl:
                          "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
                      },
                    ],
                  },
                  {
                    type: "wallet",
                    balanceUSD: 3397.72,
                    tokens: [
                      {
                        type: "base",
                        hide: false,
                        network: "ethereum",
                        address: "0x0000000000000000000000000000000000000000",
                        decimals: 18,
                        symbol: "ETH",
                        price: 3397.72,
                        balance: 1,
                        balanceRaw: "1",
                        balanceUSD: 3397.72,
                        tokenImageUrl:
                          "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        };
      });

    let container;
    await act(async () => {
      ({ container } = render(<ZapStakeAction />));
    });

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    expect(await screen.findByText("Minimum Output Amount: 0.5"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    expect(await screen.findByText("Zap-Stake"));
    expect(container).toMatchSnapshot();
  }, 20000);
});
