import { configureStore } from "@reduxjs/toolkit";
import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import App from "src/App";
import Messages from "src/components/Messages/Messages";
import * as useWeb3Context from "src/hooks/web3Context";
import appReducer from "src/slices/AppSlice";
import messagesReducer from "src/slices/MessagesSlice";
import zapReducer from "src/slices/ZapSlice";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import * as Contract from "src/typechain";

import { zapAPIResponse } from "../__mocks__/mockZapBalances";
import ZapStakeAction from "../ZapStakeAction";

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

const preloadedState = {
  zap: {
    allowances: {},
    balancesLoading: false,
    changeAllowanceLoading: false,
    stakeLoading: false,
    balances: {
      dai: {
        hide: false,
        type: "base",
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
      eth: {
        hide: false,
        type: "base",
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
    },
  },
};

describe("<ZapStakeAction/> ", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
  });
  it("Submit Button Should be disabled with < 2 tokens selected enabled with two selected", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    render(
      <>
        <App />
        <ZapStakeAction />
      </>,
    );
    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "0.8" } });
    expect(await screen.findByText("Minimum Output Amount: 0.5"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getAllByText("gOHM")[2]);
    fireEvent.input(await screen.findByTestId("zap-amount-output"), { target: { value: "0.8" } });
    expect(screen.getByText("Zap-Stake"));
  });

  it("Should Approve", async () => {
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(0)),
      symbol: jest.fn().mockReturnValue("DAI"),
      approve: jest.fn().mockReturnValue({
        wait: jest.fn().mockResolvedValue(true),
      }),
    });
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });

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
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockImplementation(() => {
        throw new Error("Error");
      }),
      symbol: jest.fn().mockReturnValue("DAI"),
    });

    // use only reducers required for this component test
    const reducer = {
      app: appReducer,
      zap: zapReducer,
      messages: messagesReducer,
    };

    const store = configureStore({
      reducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
      preloadedState,
    }) as any; //eslint-disable-line

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
      store,
    );
    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    expect(await screen.findByText("An error has occurred when fetching token allowance."));
  });

  it("Should Display Error when unable to approve allowance", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(0)),
      symbol: jest.fn().mockReturnValue("DAI"),
      approve: jest.fn().mockImplementation(() => {
        throw new Error("Error");
      }),
    });
    const reducer = {
      app: appReducer,
      zap: zapReducer,
      messages: messagesReducer,
    };

    const store = configureStore({
      reducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
      preloadedState,
    }) as any; //eslint-disable-line

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
      store,
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
    const reducer = {
      app: appReducer,
      zap: zapReducer,
      messages: messagesReducer,
    };

    const store = configureStore({
      reducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: { ...preloadedState, zap: { ...preloadedState.zap, balancesLoading: true } },
    }) as any; //eslint-disable-line

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
      store,
    );

    fireEvent.click(screen.getByTestId("zap-input"));
    expect(screen.getByText("Dialing Zapper...")).toBeInTheDocument();
  });
  it("should display a message if not on Mainnet", () => {
    const reducer = {
      app: appReducer,
      zap: zapReducer,
      messages: messagesReducer,
    };

    const store = configureStore({
      reducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: { ...preloadedState, zap: { ...preloadedState.zap, balancesLoading: true } },
    }) as any; //eslint-disable-line

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
      store,
    );
    expect(screen.getByText("Dialing Zapper...")).toBeInTheDocument();
  });
});

describe("<ZapStakeAction/> Not on Mainnet", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, networkId: 123 });
  });

  it("should display a message if not on Mainnet", () => {
    const reducer = {
      app: appReducer,
      zap: zapReducer,
      messages: messagesReducer,
    };

    const store = configureStore({
      reducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
      preloadedState: preloadedState,
    }) as any; //eslint-disable-line

    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
      store,
    );
    expect(screen.getByText("Zaps are only available on Mainnet")).toBeInTheDocument();
  });
});
