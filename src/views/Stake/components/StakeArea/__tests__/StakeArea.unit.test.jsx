import { BigNumber } from "ethers";
import * as ApproveToken from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import * as Index from "src/hooks/useCurrentIndex";
import { connectWallet } from "src/testHelpers";
import { act, fireEvent, render, screen } from "src/testUtils";
import { StakeArea } from "src/views/Stake/components/StakeArea/StakeArea";

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
    useContractAllowance.mockReturnValue({ data: BigNumber.from(1000) });
    Index.useCurrentIndex = jest.fn().mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    render(<StakeArea />);
  });
  it("gOHM conversion should appear correctly when Staking to gOHM", async () => {
    fireEvent.input(await screen.findByTestId("ohm-input"), { target: { value: "2" } });
    fireEvent.click(await screen.getAllByText("sOHM")[0]);
    expect(screen.getByText("Select a token"));
    fireEvent.click(await screen.findByTestId("gOHM-select"));
    expect(await screen.findByTestId("staked-input")).toHaveValue(0.2);
  });
});
