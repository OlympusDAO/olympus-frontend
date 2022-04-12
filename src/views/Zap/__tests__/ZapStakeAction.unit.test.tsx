import { fireEvent } from "@testing-library/dom";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useBalance from "src/hooks/useBalance";
import * as usePrices from "src/hooks/usePrices";
import * as useZapTokenBalances from "src/hooks/useZapTokenBalances";
import * as useWeb3Context from "src/hooks/web3Context";
import { NetworkId } from "src/networkDetails";
import { mockGohmBalance, mockOhmPrice, mockSohmBalance, mockWeb3Context, mockZapTokenBalances } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import { mockGohmPrice } from "../../../testHelpers";
import ZapStakeAction from "../ZapStakeAction";

const tokenBalances = {
  balances: {
    dai: {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      decimals: 18,
      hide: false,
      tokenImageUrl:
        "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
      symbol: "DAI",
      price: 0.998646,
      network: "ethereum",
      balance: 10000,
      balanceRaw: "10000",
      balanceUSD: 10000.0,
    },
    eth: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      hide: false,
      tokenImageUrl:
        "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
      symbol: "ETH",
      network: "ethereum",
      price: 3397.72,
      balance: 1,
      balanceRaw: "1",
      balanceUSD: 3397.72,
    },
  },
};

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

    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue(mockZapTokenBalances(tokenBalances));

    // Mock the OHM market price
    const ohmMarketData = jest.spyOn(usePrices, "useOhmPrice");
    ohmMarketData.mockReturnValue(mockOhmPrice(30));

    // Mock the gOHM market price
    const gOhmMarketData = jest.spyOn(usePrices, "useGohmPrice");
    gOhmMarketData.mockReturnValue(mockGohmPrice(3000));

    // Mock the sOHM balance
    const sOhmBalance = jest.spyOn(useBalance, "useSohmBalance");
    sOhmBalance.mockReturnValue(
      mockSohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("0"),
        [NetworkId.TESTNET_RINKEBY]: new DecimalBigNumber("0"),
      }),
    );

    // Mock the gOHM balance
    const gOhmBalance = jest.spyOn(useBalance, "useGohmBalance");
    gOhmBalance.mockReturnValue(
      mockGohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("0"),
        [NetworkId.TESTNET_RINKEBY]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.POLYGON]: new DecimalBigNumber("0"),
        [NetworkId.FANTOM]: new DecimalBigNumber("0"),
        [NetworkId.OPTIMISM]: new DecimalBigNumber("0"),
      }),
    );

    const { container } = render(<ZapStakeAction />);

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    // Since there is no output token selected, this is displayed
    expect(await screen.findByText("Enter Amount"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    // Once the output token has been selected, the zap button will be displayed
    expect(await screen.findByText("Zap-Stake"));
    expect(container).toMatchSnapshot();
  });

  it("should display loading modal if balances are still loading", () => {
    // Mock the Zapper API returning a loading status
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    const _tokenBalances = mockZapTokenBalances(tokenBalances);
    _tokenBalances.isLoading = true;
    balanceData.mockReturnValue(_tokenBalances);

    render(<ZapStakeAction />);

    fireEvent.click(screen.getByTestId("zap-input"));
    expect(screen.getByText("Dialing Zapper...")).toBeInTheDocument();
  });
});
