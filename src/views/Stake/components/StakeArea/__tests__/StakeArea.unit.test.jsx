import { BigNumber } from "ethers";
import Messages from "src/components/Messages/Messages";
import * as ApproveToken from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Index from "src/hooks/useCurrentIndex";
import { connectWallet } from "src/testHelpers";
import { act, fireEvent, render, screen, waitFor } from "src/testUtils";
import * as ZapFactory from "src/typechain/factories/Zap__factory";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";
import { zapAPIResponse } from "src/views/Zap/__mocks__/mockZapBalances";

jest.mock("src/hooks/useContractAllowance");
let data;
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("<StakeArea/> Disconnected", () => {
  beforeEach(async () => {
    render(<StakeArea />);
  });
  it("should ask user to connect wallet", () => {
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });
});

describe("<StakeArea/> Connected no Approval", () => {
  jest.mock("src/components/TokenAllowanceGuard/hooks/useApproveToken");
  let approval;
  beforeEach(async () => {
    connectWallet();
    approval = jest.spyOn(ApproveToken, "useApproveToken");
    useContractAllowance.mockReturnValue({ data: BigNumber.from(0) });
    render(<StakeArea />);
  });
  it("should render the stake input Area when connected", async () => {
    expect(screen.getByText("Unstaked Balance")).toBeInTheDocument();
  });
  it("should display unstake approval message when clicking unstake", async () => {
    fireEvent.click(screen.getByText("Unstake"));
    expect(await screen.findByText("Approve Unstaking")).toBeInTheDocument();
  });
  it("should successfully complete the contract approval", async () => {
    approval.mockReturnValue({ data: { confirmations: 100 } });
    expect(screen.getByText("Approve Staking")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Approve Staking"));
    useContractAllowance.mockReturnValue({ data: BigNumber.from(100) });
    act(async () => render(<StakeArea />));
    expect(screen.getAllByText("Stake")[1]).toBeInTheDocument();
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
    Index.useCurrentIndex = jest.fn().mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockReturnValue(zapAPIResponse) });
    //@ts-expect-error

    render(
      <>
        <Messages />
        <StakeArea />
      </>,
    );
  });
  it("gOHM conversion should appear correctly when Staking to gOHM", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "2" } });
    fireEvent.click(await screen.getAllByText("sOHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByTestId("gOHM-select"));
    await waitFor(async () => expect(await screen.findByTestId("staked-input")).toHaveValue(0.2));
  });

  it("gOHM conversion should appear correctly when Staking ETH to gOHM", async () => {
    fireEvent.click(await screen.getAllByText("OHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "0.8" } });
    await waitFor(async () => expect(await screen.findByText("Zap-Stake")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.click(await screen.findByText("Zap-Stake"));
    expect(await screen.findByText("Successful Zap!"));
  });
});
