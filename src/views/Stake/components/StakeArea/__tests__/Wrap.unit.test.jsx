import { fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as Balance from "src/hooks/useBalance";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Index from "src/hooks/useCurrentIndex";
import { connectWallet } from "src/testHelpers";
import { render, screen } from "src/testUtils";
import * as StakeFactory from "src/typechain/factories/OlympusStakingv2__factory";
import * as ZapFactory from "src/typechain/factories/Zap__factory";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { zapAPIResponse } from "src/views/Zap/__mocks__/mockZapBalances";

jest.mock("src/hooks/useContractAllowance");
let container;

beforeEach(() => {
  connectWallet();
  useContractAllowance.mockReturnValue({ data: BigNumber.from(10000) });
  ZapFactory.Zap__factory.connect = jest.fn().mockReturnValue({
    ZapStake: jest.fn().mockReturnValue({
      wait: jest.fn().mockReturnValue(true),
    }),
  });
  StakeFactory.OlympusStakingv2__factory.connect = jest.fn().mockReturnValue({
    wrap: jest.fn().mockResolvedValue({
      wait: jest.fn().mockReturnValue(true),
    }),
  });
  Index.useCurrentIndex = jest.fn().mockReturnValue({ data: new DecimalBigNumber("10", 9) });

  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });

  Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  ({ container } = render(
    <>
      <Messages />
      <StakeInputArea />
    </>,
  ));
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Wrap ", () => {
  it("Should display Wrap to gOHM when selecting sOHM as the FROM asset", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "5" } });
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    expect(await screen.findByText("Wrap to gOHM"));
  });
  it("Should display successfully wrapped sOHM to gOHM when clicking submit", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "5" } });
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    fireEvent.click(await screen.findByText("Wrap to gOHM"));
    expect(await screen.findByText("Successfully wrapped sOHM to gOHM")).toBeInTheDocument();
  });
  it("Should display Approve Staking when wrapping sOHM and staking contract not approved", async () => {
    useContractAllowance.mockReturnValue({ data: BigNumber.from(0) });
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    expect(await screen.findByText("Approve Staking"));
  });
});

describe("Check Wrap to gOHM Error Messages", () => {
  it("Error message with amount <=0", async () => {
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0" } });
    expect(screen.getByText("Enter an amount"));
  });

  it("Error message amount > 0 and no undefined wallet balance", async () => {
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    Balance.useBalance = jest.fn().mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "10000" } });
    fireEvent.click(screen.getByText("Wrap to gOHM"));
    expect(await screen.findByText("Please refresh your page and try again")).toBeInTheDocument();
  });

  it("Button displays amount exceeds balance message when amount > wallet balance", async () => {
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "10000" } });
    fireEvent.click(await screen.getByText("Amount exceeds balance"));
  });
});
