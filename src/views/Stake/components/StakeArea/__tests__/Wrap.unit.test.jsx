import { cleanup, fireEvent } from "@testing-library/react";
import { BigNumber } from "ethers";
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
import { vi } from "vitest";
vi.mock("src/hooks/useContractAllowance");

beforeEach(() => {
  connectWallet();
  useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });
  ZapFactory.Zap__factory.connect = vi.fn().mockReturnValue({
    ZapStake: vi.fn().mockReturnValue({
      wait: vi.fn().mockReturnValue(true),
    }),
  });
  StakeFactory.OlympusStakingv2__factory.connect = vi.fn().mockReturnValue({
    wrap: vi.fn().mockResolvedValue({
      wait: vi.fn().mockReturnValue(true),
    }),
  });
  vi.spyOn(Index, "useCurrentIndex").mockReturnValue({ data: new DecimalBigNumber("10", 9) });

  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockReturnValue(zapAPIResponse) });

  vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: new DecimalBigNumber("10", 9) } });
  render(
    <>
      <StakeInputArea />
    </>,
  );
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("Wrap to gOHM", () => {
  afterEach(() => {
    cleanup();
  });
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
    expect(await screen.findByText("Wrap to gOHM"));
    fireEvent.click(await screen.findByText("Wrap to gOHM"));
    // expect modal
    expect(await screen.findByTestId("stake-confirmation-modal"));
    expect(await screen.findByTestId("submit-modal-button"));
    fireEvent.click(await screen.findByTestId("submit-modal-button"));
    expect(await screen.findByText("Successfully wrapped sOHM to gOHM"));
  });

  it("Should display Approve Staking when wrapping sOHM and staking contract not approved", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "5" } });
    useContractAllowance.mockReturnValue({ data: BigNumber.from(0) });
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    expect(await screen.findByText("Wrap to gOHM"));
    fireEvent.click(await screen.findByText("Wrap to gOHM"));
    // expect modal
    expect(await screen.findByTestId("stake-confirmation-modal"));
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
    vi.spyOn(Balance, "useBalance").mockReturnValue({ 1: { data: undefined } });
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "10000" } });
    expect(await screen.findByText("Wrap to gOHM"));
    fireEvent.click(screen.getByText("Wrap to gOHM"));
    // expect modal
    expect(await screen.findByTestId("stake-confirmation-modal"));
    expect(await screen.findByTestId("submit-modal-button"));
    fireEvent.click(await screen.findByTestId("submit-modal-button"));
    expect(await screen.findByText("Please refresh your page and try again"));
  });

  it("Button displays amount exceeds balance message when amount > wallet balance", async () => {
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("sOHM"));
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "10000" } });
    fireEvent.click(await screen.getByText("Amount exceeds balance"));
  });
});
