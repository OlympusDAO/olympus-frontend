import * as useGiveInfo from "src/hooks/useGiveInfo";
import * as useStakingRebaseRate from "src/hooks/useStakingRebaseRate";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockRecipientInfo, mockRedeemableBalance, mockStakingRebaseRate, mockWeb3Context } from "src/testHelpers";

import { act, render, screen } from "../../../testUtils";
import RedeemYield from "../RedeemYield";

// TODO convert to typescript
let context;
let redeemData;
let recipientData;
let stakingData;

beforeEach(() => {
  context = jest.spyOn(useWeb3Context, "useWeb3Context");

  redeemData = "100.0";
  recipientData = {
    totalDebt: "100.0",
    carry: "0.0",
    agnosticDebt: "0.0",
    indexAtLastChange: "0.0",
  };
  stakingData = 0.002146913392161418;
});

afterEach(() => {
  //jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Redeem Yield", () => {
  it("should render Redeem Yield Screen", async () => {
    context.mockReturnValue(mockWeb3Context);

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(mockRecipientInfo(recipientData));

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    context.mockReturnValue(mockWeb3Context);

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    // Pretend as if it is loading
    const _recipientInfo = mockRecipientInfo(recipientData);
    _recipientInfo.data = null;
    _recipientInfo.isLoading = true;
    recipientInfo.mockReturnValue(_recipientInfo);

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });

    expect(screen.getByText("Redeem Yield").closest("button")).toHaveAttribute("disabled");
  });

  it("should have disabled redeem button when recipient info is loading", async () => {
    context.mockReturnValue(mockWeb3Context);

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance("0")); // Zero redeemable balance

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(recipientInfo);

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });

    expect(screen.getByText("Redeem Yield").closest("button")).toHaveAttribute("disabled");
  });

  it("should show redeemable balance as 100 sOHM", async () => {
    context.mockReturnValue(mockWeb3Context);

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(mockRecipientInfo(recipientData));

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("redeemable-balance")).toHaveTextContent("100 sOHM");
  });

  it("should show extra content if project wallet", async () => {
    context.mockReturnValue({ ...mockWeb3Context, address: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c" });

    const redeemable = jest.spyOn(useGiveInfo, "useRedeemableBalance");
    redeemable.mockReturnValue(mockRedeemableBalance(redeemData));

    const recipientInfo = jest.spyOn(useGiveInfo, "useRecipientInfo");
    recipientInfo.mockReturnValue(mockRecipientInfo(recipientData));

    const stakingRebaseRate = jest.spyOn(useStakingRebaseRate, "useStakingRebaseRate");
    stakingRebaseRate.mockReturnValue(mockStakingRebaseRate(stakingData));

    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />)); //eslint-disable-line
    });
    expect(screen.getByText("sOHM Goal")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
