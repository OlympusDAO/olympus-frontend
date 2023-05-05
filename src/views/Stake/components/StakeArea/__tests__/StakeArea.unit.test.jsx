import { cleanup } from "@testing-library/react";
import { BigNumber } from "ethers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as ContractAllowance from "src/hooks/useContractAllowance";
import * as Index from "src/hooks/useCurrentIndex";
import * as Prices from "src/hooks/usePrices";
import * as Warmup from "src/hooks/useWarmupInfo";
import { connectWallet } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import { Zap__factory } from "src/typechain/factories/Zap__factory";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { zapAPIResponse } from "src/views/Zap/__mocks__/mockZapBalances";
import { beforeEach, describe, it, vi } from "vitest";

describe("<StakeArea/> Disconnected", () => {
  beforeEach(async () => {
    render(<StakeArea />);
  });
  it("should ask user to connect wallet", () => {
    expect(screen.getByText("Connect Wallet"));
  });
});

describe("<StakeArea/> Connected", () => {
  beforeEach(async () => {
    connectWallet();
    render(<StakeArea />);
  });
  it("should render the stake input Area when connected", async () => {
    expect(await screen.findByText("Unstaked Balance"));
  });
});

describe("<StakeInputArea/> Connected no Approval", () => {
  beforeEach(() => {
    connectWallet();
    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from(0),
    });
    vi.spyOn(Warmup, "useWarmupPeriod").mockReturnValue({ data: new DecimalBigNumber("2", 0) });
    vi.spyOn(Index, "useCurrentIndex").mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    //@ts-expect-error
    vi.spyOn(Prices, "useGohmPrice").mockReturnValue({ data: "120.56786330999999" });
    //@ts-expect-error
    vi.spyOn(Prices, "useOhmPrice").mockReturnValue({ data: "12.056786331" });
    render(
      <>
        <StakeInputArea />
      </>,
    );
  });
  afterEach(() => {
    cleanup();
  });
  it("should display stake approval message when clicking stake", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0.8" } });
    expect(await screen.findByTestId("staked-input"), { target: { value: "22.5447803865539" } });
    expect(await screen.findByTestId("submit-button"));
    fireEvent.click(await screen.findByTestId("submit-button"));

    // expect modal
    expect(await screen.findByTestId("stake-confirmation-modal"));
    // fireEvent.click(await screen.findByTestId("acknowledge-warmup"));

    // expect approval
    expect(await screen.findByText("Approve Staking"));
  });
  it("should successfully complete the contract approval", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0.8" } });
    expect(await screen.findByTestId("staked-input"), { target: { value: "22.5447803865539" } });
    expect(await screen.findByTestId("submit-button"));
    fireEvent.click(await screen.findByTestId("submit-button"));

    // expect modal
    expect(await screen.findByTestId("stake-confirmation-modal"));
    expect(screen.getByText("Approve Staking"));
    fireEvent.click(screen.getByText("Approve Staking"));

    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("100000000000000000000"),
    });
    expect(await screen.findByTestId("acknowledge-warmup"));
    fireEvent.click(await screen.findByTestId("acknowledge-warmup"));
    expect(screen.getAllByText("Stake"));
  });
});

describe("<StakeArea/> Connected with Approval", () => {
  beforeEach(() => {
    connectWallet();
    vi.mock("src/typechain/factories/Zap__factory");
    const instance = vi.mocked(Zap__factory);
    instance.connect = vi.fn().mockReturnValue({
      ZapStake: vi.fn().mockReturnValue({
        wait: vi.fn().mockReturnValue(true),
      }),
    });

    vi.spyOn(ContractAllowance, "useContractAllowance").mockReturnValue({
      data: BigNumber.from("100000000000000000000"),
    });
    vi.spyOn(Index, "useCurrentIndex").mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockReturnValue(zapAPIResponse) });
    //@ts-expect-error
    vi.spyOn(Prices, "useGohmPrice").mockReturnValue({ data: "120.56786330999999" });
    //@ts-expect-error
    vi.spyOn(Prices, "useOhmPrice").mockReturnValue({ data: "12.056786331" });

    render(
      <>
        <StakeInputArea />
      </>,
    );
  });
  it("gOHM conversion should appear correctly when Staking to gOHM", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "2" } });
    expect(await screen.findByTestId("staked-input"), { target: { value: "22.5447803865539" } });
  });

  it("gOHM conversion should appear correctly when Staking ETH to gOHM", async () => {
    fireEvent.click(screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByText("ETH"));
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0.8" } });
    expect(await screen.findByTestId("staked-input"), { target: { value: "22.5447803865539" } });
  });
});
