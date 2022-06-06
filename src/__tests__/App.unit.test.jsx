import "src/helpers/index";

import * as EthersContract from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import App from "src/App";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { createMatchMedia } from "src/testHelpers";
import * as Contract from "src/typechain";
import Web3Modal from "web3modal";

import { act, render, renderRoute, screen } from "../testUtils";

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
    renderRoute("/");
    expect(screen.getByText("Connect your wallet to stake OHM")).toBeInTheDocument();
  });
  it("should not render an error message when user wallet is connected and cached but not locked", async () => {
    // Workaround for long-running tasks
    jest.setTimeout(60000);

    Web3Modal.prototype.connect = jest.fn().mockImplementation(async () => {
      // mock connection promise that never resolves
      return new Promise(function (resolve, reject) {
        // do not call resolve or reject
      });
    });
    // mock cached provider
    Web3Modal.prototype.cachedProvider = jest.fn();
    await act(async () => {
      renderRoute("/");
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
      renderRoute("/");
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
      renderRoute("/");
    });
    expect(Web3Modal.prototype.connect).toHaveBeenCalledOnce();
    const errorMessage = await screen.getByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeInTheDocument();
  });
});

describe("Account Balances Slice", () => {
  beforeEach(() => {
    jest.mock("@ethersproject/contracts");
  });
  it("should load Account Balances with no error", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    Contract.GOHM__factory.connect = jest.fn().mockReturnValue({
      balanceOf: jest.fn().mockReturnValue(BigNumber.from(10)),
      allowance: jest.fn().mockReturnValue(BigNumber.from(10)),
      balanceFrom: jest.fn().mockReturnValue(BigNumber.from(10)),
    });
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      balanceOf: jest.fn().mockReturnValue(BigNumber.from(10)),
      allowance: jest.fn().mockReturnValue(BigNumber.from(10)),
    });
    EthersContract.Contract = jest.fn().mockReturnValue({
      allowance: jest.fn().mockReturnValue(BigNumber.from(10)),
      callStatic: jest.fn().mockReturnValue({
        balanceOfUnderlying: jest.fn().mockReturnValue(BigNumber.from(10)),
        underlying: jest.fn().mockReturnValue(BigNumber.from(10)),
      }),
    });

    expect(() => render(<App />)).not.toThrowError();
  });

  it("should load Account Balances and throw error", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    Contract.GOHM__factory.connect = jest.fn().mockReturnValue({
      balanceOf: jest.fn().mockImplementation(() => {
        throw Error("An Error!");
      }),
      allowance: jest.fn().mockReturnValue(BigNumber.from(10)),
      balanceFrom: jest.fn().mockReturnValue(BigNumber.from(10)),
    });
    Contract.IERC20__factory.connect = jest.fn().mockReturnValue({
      balanceOf: jest.fn().mockReturnValue(BigNumber.from(10)),
      allowance: jest.fn().mockReturnValue(BigNumber.from(10)),
    });
    EthersContract.Contract = jest.fn().mockReturnValue({
      allowance: jest.fn().mockImplementation(() => {
        throw Error("An Error!");
      }),
      callStatic: jest.fn().mockReturnValue({
        balanceOfUnderlying: jest.fn().mockReturnValue(BigNumber.from(10)),
        underlying: jest.fn().mockReturnValue(BigNumber.from(10)),
      }),
    });

    //we should handle the error and not throw
    expect(() => render(<App />)).not.toThrowError();
  });
});

describe("Staging Notification Checks", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    process.env.REACT_APP_STAGING_ENV = true;
  });
  it("Should display a notification banner when hostname = staging.olympusdao.finance", async () => {
    render(<App />);
    expect(screen.getByTestId("staging-notification")).toHaveStyle({ marginLeft: "312px" });
    expect(
      screen.getByText("You are on the staging site. Any interaction could result in loss of assets."),
    ).toBeInTheDocument();
  });
  it("Should display no left Margin on Mobile", async () => {
    window.matchMedia = createMatchMedia("300px");
    render(<App />);
    expect(screen.getByTestId("staging-notification")).toHaveStyle({ marginLeft: "0px" });
    expect(
      screen.getByText("You are on the staging site. Any interaction could result in loss of assets."),
    ).toBeInTheDocument();
  });
});
describe("Production Notification Check", () => {
  beforeEach(() => {
    process.env.REACT_APP_STAGING_ENV = false;
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
  });
  it("Should not display a notification when hostname not staging.olympusdao.finance", async () => {
    render(<App />);
    expect(
      screen.queryByText("You are on the staging site. Any interaction could result in loss of assets."),
    ).not.toBeInTheDocument();
  });
});
