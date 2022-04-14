import { fireEvent } from "@testing-library/dom";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balances from "src/hooks/useBalance";
import * as Contract from "src/hooks/useContract";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import * as Prices from "src/hooks/usePrices";
import * as ZapBalances from "src/hooks/useZapTokenBalances";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import * as ZapFactory from "src/typechain/factories/Zap__factory";

import { zapAPIResponse } from "../__mocks__/mockZapBalances";
import ZapStakeAction from "../ZapStakeAction";

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("<ZapStakeAction/> ", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    //@ts-expect-error
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    //@ts-expect-error
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    //@ts-expect-error
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "3400.00" });
    //@ts-expect-error
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "32.00" });
    //@ts-expect-error
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
  });

  it("gOHM should autopopulate with correct value based on ETH input", async () => {
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

  it("Should Execute Zap Successfully", async () => {
    //@ts-expect-error
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(10) });
    ZapFactory.Zap__factory.connect = jest.fn().mockReturnValue({
      ZapStake: jest.fn().mockReturnValue({
        wait: jest.fn().mockReturnValue(true),
      }),
    });
    render(
      <>
        <Messages />
        <ZapStakeAction />
      </>,
    );
    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "0.8" } });
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getAllByText("gOHM")[0]);
    fireEvent.click(await screen.findByText("Zap-Stake"));
    expect(await screen.findByText("Successful Zap!"));
  });

  it("sOHM should autopopulate with correct value based on ETH input", async () => {
    //@ts-expect-error
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
    fireEvent.click(await screen.getAllByText("sOHM")[0]);
    expect(await screen.getByDisplayValue("84.943")).toBeInTheDocument();
    expect(await screen.findByText("Zap-Stake")).toBeInTheDocument();
  });

  it("Should Approve", async () => {
    //@ts-expect-error
    Contract.useDynamicTokenContract = jest.fn().mockReturnValue({
      approve: jest.fn().mockReturnValue({
        wait: jest.fn().mockResolvedValue(true),
      }),
    });
    //@ts-expect-error
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
  });
});

describe("Loading Balances", () => {
  beforeEach(() => {
    const zapBalances = jest.spyOn(ZapBalances, "useZapTokenBalances");
    //@ts-expect-error
    zapBalances.mockReturnValueOnce({ isLoading: true });
    //@ts-expect-error
    ContractAllowance.useContractAllowance = jest.fn().mockReturnValue({ data: BigNumber.from(0) });
    //@ts-expect-error
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    //@ts-expect-error
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

describe("<ZapStakeAction/> Not on Mainnet", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, networkId: 123 });
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    //@ts-expect-error
    Balances.useSohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    //@ts-expect-error
    Balances.useGohmBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10") } });
    //@ts-expect-error
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "3400.00" });
    //@ts-expect-error
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "32.00" });
    //@ts-expect-error
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

    expect(screen.getByText("Enter Amount").closest("button")).toBeDisabled();
  });
});
