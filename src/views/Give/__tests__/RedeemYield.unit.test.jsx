import { configureStore } from "@reduxjs/toolkit";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import * as useWeb3Context from "src/hooks/web3Context";
import accountReducer from "src/slices/AccountSlice";
import appReducer from "src/slices/AppSlice";
import pendingTransactionsReducer from "src/slices/PendingTxnsSlice";
import * as Pending from "src/slices/PendingTxnsSlice";
import { mockWeb3Context } from "src/testHelpers";

import { act, render, screen } from "../../../testUtils";
import RedeemYield from "../RedeemYield";

jest.mock("src/hooks/useCurrentIndex");

let store;
let redeemingStore;
let context;
beforeEach(() => {
  context = jest.spyOn(useWeb3Context, "useWeb3Context");
  const preloadedState = {
    app: {
      loading: false,
    },
    account: {
      giving: {
        sohmGive: 999999999000000000,
        donationInfo: [
          {
            date: "Mar 30, 2022",
            deposit: "1.0",
            recipient: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c",
            yieldDonated: "0.0",
          },
        ],
        loading: false,
      },
    },
  };

  const redeemingState = {
    app: {
      circSupply: 15203090.685576908,
      currentBlock: 14523245,
      currentIndex: "112.391236227",
      currentIndexV1: "46.721314322",
      fiveDayRate: 0.03269220242927484,
      loading: false,
      loadingMarketPrice: false,
      marketCap: 500132858.5349252,
      marketPrice: 32.90090902231928,
      secondsToEpoch: 5812,
      stakingAPY: 9.46828503212633,
      stakingRebase: 0.002146913392161418,
      stakingTVL: 405991286.3415339,
      totalSupply: 16732992.484142939,
      treasuryMarketValue: 444014377.20682436,
    },
    account: {
      giving: {
        sohmGive: 999999999000000000,
        gohmGive: 999999999000000000000000,
        donationInfo: [
          {
            date: "Mar 30, 2022",
            deposit: "1.0",
            recipient: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c",
            yieldDonated: "0.0",
          },
        ],
        loading: false,
      },
      redeeming: {
        gohmRedeemable: "0.1",
        recipientInfo: {
          totalDebt: "100",
          agnosticDebt: "1",
        },
      },
    },
  };

  const reducer = {
    account: accountReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
  };

  store = configureStore({
    reducer,
    devTools: true,
    preloadedState,
  });

  redeemingStore = configureStore({
    reducer,
    devTools: true,
    preloadedState: redeemingState,
  });
});

afterEach(() => {
  //jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("Redeem Yield", () => {
  it("should render Redeem Yield Screen", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    context.mockReturnValue(mockWeb3Context);
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />));
    });
    expect(container).toMatchSnapshot();
  });

  it("should have disabled redeem button when there are pending transaction(s)", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    context.mockReturnValue(mockWeb3Context);
    const pending = jest.spyOn(Pending, "isPendingTxn");
    pending.mockReturnValue(true);
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />, store)); //eslint-disable-line
    });
    expect(screen.getByText("Redeem Yield").closest("button")).toHaveAttribute("disabled");
  });

  it("should show recipient info correctly", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    context.mockReturnValue(mockWeb3Context);
    const pending = jest.spyOn(Pending, "isPendingTxn");
    pending.mockReturnValue(true);
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />, redeemingStore)); //eslint-disable-line
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByText("100 sOHM")).toBeInTheDocument();
    expect(screen.getAllByText("10 sOHM")[1]).toBeInTheDocument();
  });

  it("should show extra content if project wallet", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    context.mockReturnValue({ ...mockWeb3Context, address: "0xd3B4a9604c78DDA8692d85Dc15802BA12Fb82b6c" });
    let container;
    await act(async () => {
      ({ container } = render(<RedeemYield />, redeemingStore)); //eslint-disable-line
    });
    expect(screen.getByText("sOHM Goal")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
