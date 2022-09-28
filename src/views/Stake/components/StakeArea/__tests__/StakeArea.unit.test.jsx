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
    expect(await screen.findByText("Approve")).toBeInTheDocument();
  });

  it("should successfully complete the contract approval", async () => {
    approval.mockReturnValue({ data: { confirmations: 100 } });
    expect(screen.getByText("Approve")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Approve"));
    useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });
    act(async () => render(<StakeArea />));
    expect(screen.getByText("Stake to sOHM")).toBeInTheDocument();
  });
});

describe("<StakeArea/> Connected with Approval", () => {
  beforeEach(async () => {
    connectWallet();
    useContractAllowance.mockReturnValue({ data: BigNumber.from("100000000000000000000") });
    Index.useCurrentIndex = jest.fn().mockReturnValue({ data: new DecimalBigNumber("10", 9) });
    render(<StakeArea />);
  });
  it("should switch to gOHM when toggle is selected", async () => {
    fireEvent.click(await screen.findByRole("checkbox"));
    expect(screen.getByText("Stake to gOHM")).toBeInTheDocument();
  });

  it("gOHM conversion should appear correctly when Staking to gOHM", async () => {
    fireEvent.click(await screen.findByRole("checkbox"));
    expect(screen.getByText("Stake to gOHM")).toBeInTheDocument();
    fireEvent.input(await screen.findByRole("textbox"), { target: { value: "2" } });
    expect(screen.getByText("Stake 2 OHM → 0.2 gOHM")).toBeInTheDocument();
  });
});
