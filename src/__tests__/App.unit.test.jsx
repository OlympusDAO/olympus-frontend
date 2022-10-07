import "src/helpers/index";

import * as EthersContract from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import App from "src/App";
import { connectWallet, createMatchMedia, disconnectedWallet } from "src/testHelpers";
import { act, render, renderRoute, screen } from "src/testUtils";
import * as Contract from "src/typechain";

jest.mock("src/helpers/index", () => ({
  ...jest.requireActual("src/helpers/index"),
  // prevent safety check message from blocking wallet connect error message
  shouldTriggerSafetyCheck: jest.fn().mockReturnValue(false),
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.useRealTimers();
});

describe("<App/>", () => {
  it("should render component", () => {
    disconnectedWallet();
    renderRoute("/");
    // testing for the connect wallet text in the wallet button
    expect(screen.getAllByText("Connect Wallet")[0]).toBeInTheDocument();
    expect(screen.findByText("Bonds")).toBeInTheDocument();
  });
  it("should not render an error message when user wallet is connected and cached but not locked", async () => {
    // Workaround for long-running tasks
    jest.setTimeout(60000);
    connectWallet();

    await act(async () => {
      renderRoute("/");
    });
    const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeNull(); // expect its not found
  });
  it("should not render a connection error message when user wallet is not cached, i.e. user has not connected wallet yet", async () => {
    connectWallet();
    await act(async () => {
      renderRoute("/");
    });
    const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
    expect(errorMessage).toBeNull(); // expect its not found
  });
});

describe("Account Balances Slice", () => {
  beforeEach(() => {
    jest.mock("@ethersproject/contracts");
  });
  it("should load Account Balances with no error", async () => {
    connectWallet();
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
    connectWallet();
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
    process.env.REACT_APP_STAGING_ENV = true;
  });
  it("Should display a notification banner when hostname = staging.olympusdao.finance", async () => {
    connectWallet();
    render(<App />);
    expect(screen.getByTestId("staging-notification")).toHaveStyle({ marginLeft: "264px" });
    expect(
      screen.getByText("You are on the staging site. Any interaction could result in loss of assets."),
    ).toBeInTheDocument();
  });
  it("Should display no left Margin on Mobile", async () => {
    connectWallet();
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
  });
  it("Should not display a notification when hostname not staging.olympusdao.finance", async () => {
    connectWallet();
    render(<App />);
    expect(
      screen.queryByText("You are on the staging site. Any interaction could result in loss of assets."),
    ).not.toBeInTheDocument();
  });
});
