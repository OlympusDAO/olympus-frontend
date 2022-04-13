import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useBalance from "src/hooks/useBalance";
import * as usePrices from "src/hooks/usePrices";
import * as useZapTokenBalances from "src/hooks/useZapTokenBalances";
import * as useWeb3Context from "src/hooks/web3Context";
import { NetworkId } from "src/networkDetails";
import {
  mockGohmBalance,
  mockGohmPrice,
  mockOhmPrice,
  mockSohmBalance,
  mockWeb3Context,
  mockZapTokenBalances,
} from "src/testHelpers";
import { render, screen } from "src/testUtils";
import * as Contract from "src/typechain";

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
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
  });

  it("Submit Button Should be disabled with < 2 tokens selected enabled with two selected", async () => {
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
  });

  it("Should Approve", async () => {
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(0)),
      symbol: jest.fn().mockReturnValue("DAI"),
      approve: jest.fn().mockReturnValue({
        wait: jest.fn().mockResolvedValue(true),
      }),
    });

    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue(mockZapTokenBalances(tokenBalances));

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "5000" } });
    expect(await screen.findByText("Minimum Output Amount: 0.5"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    fireEvent.click(await screen.getByText("Approve"));
    expect(await screen.findByText("Successfully approved token!"));
  });

  it("Should Display Error when unable to retrieve allowances", async () => {
    // Contract throws an error when trying to get the allowance
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockImplementation(() => {
        throw new Error("Error");
      }),
      symbol: jest.fn().mockReturnValue("DAI"),
    });

    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue(mockZapTokenBalances(tokenBalances));

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );
    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    expect(await screen.findByText("An error has occurred when fetching token allowance."));
  });

  it("Should Display Error when unable to approve allowance", async () => {
    // Contract throws error
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(0)),
      symbol: jest.fn().mockReturnValue("DAI"),
      approve: jest.fn().mockImplementation(() => {
        throw new Error("Error");
      }),
    });

    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue(mockZapTokenBalances(tokenBalances));

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "5000" } });
    expect(await screen.findByText("Minimum Output Amount: 0.5")).toBeInTheDocument;
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Approve"));
    expect(await screen.getAllByText("Error")[0]).toBeInTheDocument();
  });

  it("should display loading modal if balances are still loading", () => {
    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    const _balanceData = mockZapTokenBalances(tokenBalances);
    // Still loading
    _balanceData.isLoading = true;
    _balanceData.data = undefined;
    balanceData.mockReturnValue(_balanceData);

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );

    fireEvent.click(screen.getByTestId("zap-input"));
    expect(screen.getByText("Dialing Zapper...")).toBeInTheDocument();
  });
});

describe("<ZapStakeAction/> Not on Mainnet", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, networkId: 123 });
  });

  it("should display a message if not on Mainnet", () => {
    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue(mockZapTokenBalances(tokenBalances));

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );
    expect(screen.getByText("Zaps are only available on Mainnet")).toBeInTheDocument();
  });
});
