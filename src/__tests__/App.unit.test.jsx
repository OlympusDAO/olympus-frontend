import "src/helpers/index";

import Web3Modal from "web3modal";

import { act, renderRoute, screen } from "../testUtils";

jest.mock("src/helpers/index", () => ({
  ...jest.requireActual("src/helpers/index"),
  // prevent safety check message from blocking wallet connect error message
  shouldTriggerSafetyCheck: jest.fn().mockReturnValue(false),
}));

jest.mock("web3modal");

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.useRealTimers();
});

describe("<App/>", () => {
  it("should render component", () => {
    renderRoute("/#");
    expect(screen.getByText("Connect your wallet to stake OHM")).toBeInTheDocument();
  });

  it("should not render an error message when user wallet is connected and cached but not locked", async () => {
    Web3Modal.prototype.connect = jest.fn().mockImplementation(async () => {
      // mock connection promise that never resolves
      return new Promise(function (resolve, reject) {
        // do not call resolve or reject
      });
    });
    // mock cached provider
    Web3Modal.prototype.cachedProvider = jest.fn();
    await act(async () => {
      const { container } = await renderRoute("/#");
      expect(container).toMatchSnapshot();
    });
    expect(Web3Modal.prototype.connect).toHaveBeenCalledOnce();
    const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeNull(); // expect its not found
    await act(async () => {
      jest.runAllTimers();
    });
  });

  it("should not render a connection error message when user wallet is not cached, i.e. user has not connected wallet yet", async () => {
    Web3Modal.prototype.connect = jest.fn();
    // no cached provider
    Web3Modal.prototype.cachedProvider = undefined;
    await act(async () => {
      const { container } = await renderRoute("/#");
      expect(container).toMatchSnapshot();
    });
    expect(Web3Modal.prototype.connect).toHaveBeenCalledTimes(0);
    const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeNull(); // expect its not found
  });

  it("should render an error message when user wallet is connected and cached then locked", async () => {
    Web3Modal.prototype.connect = jest.fn().mockImplementation(async () => {
      throw Error("Wallet Locked");
    });
    Web3Modal.prototype.cachedProvider = jest.fn().mockImplementation(() => {
      // mock cached provider
      return jest.fn();
    });
    await act(async () => {
      const { container } = await renderRoute("/#");
      expect(container).toMatchSnapshot();
    });
    expect(Web3Modal.prototype.connect).toHaveBeenCalledOnce();
    const errorMessage = await screen.getByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeInTheDocument();
  });
});
