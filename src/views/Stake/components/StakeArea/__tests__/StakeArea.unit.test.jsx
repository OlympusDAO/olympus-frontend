import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import * as ApproveToken from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Index from "src/hooks/useCurrentIndex";
import * as Prices from "src/hooks/usePrices";
import { connectWallet } from "src/testHelpers";
import { act, fireEvent, render, screen } from "src/testUtils";
import * as ZapFactory from "src/typechain/factories/Zap__factory";
import { StakeInputArea } from "src/views/Stake/components/StakeArea/components/StakeInputArea/StakeInputArea";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { zapAPIResponse } from "src/views/Zap/__mocks__/mockZapBalances";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
vi.mock("src/hooks/useContractAllowance");
let data;
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("<StakeArea/> Disconnected", () => {
  beforeEach(async () => {
    render(<StakeArea />);
  });
  it("should ask user to connect wallet", () => {
    expect(screen.getByText("Connect Wallet"));
  });
});

describe("<StakeArea/> Connected no Approval", () => {
  vi.mock("src/components/TokenAllowanceGuard/hooks/useApproveToken");
  let approval;
  beforeEach(async () => {
    connectWallet();
    approval = vi.spyOn(ApproveToken, "useApproveToken");
    useContractAllowance.mockReturnValue({ data: BigNumber.from(0) });
    render(<StakeArea />);
  });
  it("should render the stake input Area when connected", async () => {
    expect(screen.getByText("Unstaked Balance"));
  });
  it("should display unstake approval message when clicking unstake", async () => {
    fireEvent.click(screen.getByText("Unstake"));
    expect(await screen.findByText("Approve Unstaking"));
  });
  it("should successfully complete the contract approval", async () => {
    expect(screen.getByText("Approve Staking"));
    fireEvent.click(screen.getByText("Approve Staking"));
    useContractAllowance.mockReturnValue({ data: BigNumber.from(100) });
    await act(async () => render(<StakeArea />));
    expect(screen.getAllByText("Stake")[1]);
  });
});

describe("<StakeArea/> Connected with Approval", () => {
  beforeEach(async () => {
    connectWallet();
    ZapFactory.Zap__factory.connect = jest.fn().mockReturnValue({
      ZapStake: jest.fn().mockReturnValue({
        wait: jest.fn().mockReturnValue(true),
      }),
    });
    useContractAllowance.mockReturnValue({ data: BigNumber.from(1000) });
    Index.useCurrentIndex = vi.fn().mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    //@ts-expect-error
    //@ts-expect-error
    Prices.useGohmPrice = jest.fn().mockReturnValue({ data: "120.56786330999999" });
    //@ts-expect-error
    Prices.useOhmPrice = jest.fn().mockReturnValue({ data: "12.056786331" });

    render(
      <>
        <Messages />
        <StakeInputArea />
      </>,
    );
  });
  it("gOHM conversion should appear correctly when Staking to gOHM", async () => {
    fireEvent.click(await screen.getAllByText("sOHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByTestId("gOHM-select"));
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "2" } });
    //expect(await screen.findByTestId("staked-input")).toHaveValue(0.2);
  });

  it("gOHM conversion should appear correctly when Staking ETH to gOHM", async () => {
    fireEvent.click(await screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0.8" } });
    //expect(await screen.findByTestId("staked-input")).toHaveValue(225.44780386553904);
    expect(await screen.findByText("Zap-Stake")).toBeInTheDocument();
    fireEvent.click(await screen.findByText("Zap-Stake"));
    expect(await screen.findByText("Successful Zap!"));
  });
});
