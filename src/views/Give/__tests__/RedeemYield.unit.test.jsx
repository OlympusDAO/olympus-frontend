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
} from "src/testHelpers";
import { act, render, screen } from "src/testUtils";
import * as useRedeem from "src/views/Give/hooks/useRedeem";
import RedeemYield from "src/views/Give/RedeemYield";
import * as WAGMI from "wagmi";

// TODO convert to typescript
let context;
let redeemData;
let recipientData;
let stakingData;

beforeEach(() => {
  const wallet = connectWallet();

  redeemData = "100.0";
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

describe("Redeem Yield", () => {
  beforeEach(() => {
    jest.spyOn(useCurrentIndex, "useCurrentIndex").mockReturnValue(mockCurrentIndex(new DecimalBigNumber("100", 9)));

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(mockRecipientInfo(recipientData));

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    const redeem = jest.spyOn(useRedeem, "useRedeem");
    redeem.mockReturnValue({ isLoading: false });
  });

  it("should render Redeem Yield Screen", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should have disabled redeem button when there are pending transaction(s)", async () => {
    jest.spyOn(useRedeem, "useRedeem").mockReturnValue({ isLoading: true });

    render(<RedeemYield />);

    expect(screen.getByText("Redeem Yield").closest("button")).toBeDisabled();
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    // Pretend as if it is loading
    const _recipientInfo = mockRecipientInfo(recipientData);
    _recipientInfo.data = null;
    _recipientInfo.isLoading = true;
    recipientInfo.mockReturnValue(_recipientInfo);

    render(<RedeemYield />);

    expect(screen.getByText("Redeem Yield").closest("button")).toBeDisabled();
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance("0")); // Zero redeemable balance

    render(<RedeemYield />);

    expect(screen.getByText("Redeem Yield").closest("button")).toBeDisabled();
  });

  it("should show redeemable balance as 100 sOHM", async () => {
    const result = render(<RedeemYield />);

    expect(screen.getByTestId("redeemable-balance")).toHaveTextContent("100 sOHM");
    expect(result.container).toMatchSnapshot();
  });

  it("should show extra content if project wallet", async () => {
    //@ts-ignore
    WAGMI.useAccount = jest.fn(() => {
      return { ...wallet, address: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c" };
    });

    const result = render(<RedeemYield />);
    expect(screen.getByText("sOHM Goal")).toBeInTheDocument();
    expect(result.container).toMatchSnapshot();
  });
});
