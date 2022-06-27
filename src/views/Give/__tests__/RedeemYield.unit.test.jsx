import { wallet } from "@rainbow-me/rainbowkit";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useCurrentIndex from "src/hooks/useCurrentIndex";
import * as useGiveInfo from "src/hooks/useGiveInfo";
import * as useStakingRebaseRate from "src/hooks/useStakingRebaseRate";
import {
  connectWallet,
  mockCurrentIndex,
  mockRecipientInfo,
  mockRedeemableBalance,
  mockStakingRebaseRate,
  mockTotalDonated,
} from "src/testHelpers";
import * as useRedeem from "src/views/Give/hooks/useRedeem";
import * as WAGMI from "wagmi";

import { act, render, screen, within } from "../../../testUtils";
import RedeemRebases from "../RedeemRebases";

// TODO convert to typescript
let context;
let redeemData;
let recipientData;
let stakingData;

beforeEach(() => {
  const wallet = connectWallet();

  redeemData = "1";
  recipientData = {
    sohmDebt: "1000.0",
    gohmDebt: "10.0",
  };
  stakingData = 0.002146913392161418;
});

afterEach(() => {
  //jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Redeem Rebases", () => {
  beforeEach(() => {
    jest.spyOn(useCurrentIndex, "useCurrentIndex").mockReturnValue(mockCurrentIndex(new DecimalBigNumber("100", 9)));

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(mockRecipientInfo(recipientData));

    const totalDonated = jest.spyOn(useGiveInfo, "useTotalDonated");
    totalDonated.mockReturnValue(mockTotalDonated("1"));

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    const redeem = jest.spyOn(useRedeem, "useRedeem");
    redeem.mockReturnValue({ isLoading: false });
  });

  it("should render Redeem Rebases Screen", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<RedeemRebases />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should have disabled redeem button when there are pending transaction(s)", async () => {
    jest.spyOn(useRedeem, "useRedeem").mockReturnValue({ isLoading: true });

    render(<RedeemRebases />);

    expect(screen.getByText("Redeem sOHM").closest("button")).toBeDisabled();
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    // Pretend as if it is loading
    const _recipientInfo = mockRecipientInfo(recipientData);
    _recipientInfo.data = null;
    _recipientInfo.isLoading = true;
    recipientInfo.mockReturnValue(_recipientInfo);

    render(<RedeemRebases />);

    expect(screen.getByText("Redeem sOHM").closest("button")).toBeDisabled();
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance("0")); // Zero redeemable balance

    render(<RedeemRebases />);

    expect(screen.getByText("Redeem sOHM").closest("button")).toBeDisabled();
  });

  it("should show donated sOHM as 100 sOHM", async () => {
    render(<RedeemRebases />);
    const { getByText } = within(screen.getByTestId("data-redeemable-sohm"));
    expect(getByText("100 sOHM")).toBeInTheDocument();
  });

  it("should show redeemable balance as 100 sOHM", async () => {
    render(<RedeemRebases />);
    const { getByText } = within(screen.getByTestId("redeemable-balance"));
    expect(getByText("100 sOHM")).toBeInTheDocument();
  });

  it("should show extra content if project wallet", async () => {
    //@ts-ignore
    WAGMI.useAccount = jest.fn(() => {
      return { ...wallet, data: { ...wallet.data, address: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c" } };
    });

    const result = render(<RedeemRebases />);
    expect(screen.getByText("% of sOHM Goal")).toBeInTheDocument();
    expect(result.container).toMatchSnapshot();
  });
});
