import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balances from "src/hooks/useBalance";
import * as ContractTwo from "src/hooks/useContract";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import * as Prices from "src/hooks/usePrices";
import * as ZapBalances from "src/hooks/useZapTokenBalances";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";

import { zapAPIResponse } from "../__mocks__/mockZapBalances";
import ZapStakeAction from "../ZapStakeAction";

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});
let fetchedData;
describe("<ZapStakeAction/> ", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    fetchedData = global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "3400.00" });
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "32.00" });
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
  });

  it("gOHM should autopopulate with correct value based on ETH input", async () => {
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    render(
      <>
        <ZapStakeAction />
      </>,
    );
    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "0.8" } });
    expect(await screen.findByText("Enter Amount"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getAllByText("gOHM")[0]);
    expect(await screen.getByDisplayValue("0.7994635294117648")).toBeInTheDocument();
    expect(await screen.findByText("Zap-Stake")).toBeInTheDocument();
  });

  it("Should Approve", async () => {
    ContractTwo.useDynamicTokenContract = jest.fn().mockReturnValue({
      approve: jest.fn().mockReturnValue({
        wait: jest.fn().mockResolvedValue(true),
      }),
    });
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "5000" } });
    fireEvent.click(await screen.getAllByText("gOHM")[0]);
    fireEvent.click(await screen.getByText("Approve"));
    expect(await screen.findByText("Successfully approved")).toBeInTheDocument();
    ContractAllowance.useContractAllowance.mockReset();
  });
});

describe("Loading Balances", () => {
  beforeEach(() => {
    const zapBalances = jest.spyOn(ZapBalances, "useZapTokenBalances");
    zapBalances.mockReturnValueOnce({ isLoading: true });
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
  });

  it("should display loading modal if balances are still loading", () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
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

describe("Errors", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "3400.00" });
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "32.00" });
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: undefined });
  });
  it("Should Display Error when unable to approve allowance", async () => {
    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("DAI")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "5000" } });
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Approve"));
    expect(await screen.getAllByText("Error")[0]).toBeInTheDocument();
  });
});

describe("<ZapStakeAction/> Not on Mainnet", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, networkId: 123 });
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "3400.00" });
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "32.00" });
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
  });

  it("should display a message if not on Mainnet", () => {
    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );
    expect(
      screen.getByText("Zaps are only available on Ethereum Mainnet. Please switch networks."),
    ).toBeInTheDocument();
  });
});
