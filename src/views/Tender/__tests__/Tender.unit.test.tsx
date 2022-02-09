import { ChangeEvent } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { render } from "../../../testUtils";
import { DepositLimitMessage, ProgressBar, RedemptionToggle, Tender, TokenSelector } from "..";
import {
  allowRedemtionChoice,
  disableDepositButton,
  disableRedeemButton,
  goOhmDepositExchangeRate,
  redeemMessage,
  redemptionToken,
} from "../helpers";
const queryClient = new QueryClient();

test("Calculate the gOhM Deposit Exchange Rate", () => {
  const exchangeRate = goOhmDepositExchangeRate(50, 50, 60);
  expect(exchangeRate).toEqual(1666666666666666.8);
});

describe("Redemption Token String", () => {
  test("returns gOHM if value is defined", () => {
    const string = redemptionToken(1);
    expect(string).toEqual("gOHM");
  });

  test("returns DAI if value is undefined", () => {
    const string = redemptionToken();
    expect(string).toEqual("DAI");
  });

  test("returns DAI if value is zero", () => {
    const string = redemptionToken(0);
    expect(string).toEqual("DAI");
  });
});

describe("Redemption Choice", () => {
  test("returns true if both exchange rates are positive, and no deposited balance", () => {
    const allowChoice = allowRedemtionChoice(50, 50, 0);
    expect(allowChoice).toEqual(true);
  });

  test("returns false if  both exchange rates are positive, and deposited balance", () => {
    const allowChoice = allowRedemtionChoice(50, 50, 1);
    expect(allowChoice).toEqual(false);
  });

  test("returns false if one exchange rate is zero and deposited balance is zero", () => {
    const allowChoice = allowRedemtionChoice(50, 0, 0);
    expect(allowChoice).toEqual(false);
  });
});

describe("Deposit Button", () => {
  const depositQuantity = 1;
  const escrowState = 0;
  const balance = 1;
  const isLoading = false;
  test("Disabled when balance is zero", () => {
    const disabled = disableDepositButton(depositQuantity, escrowState, 0, isLoading);
    expect(disabled).toEqual(true);
  });
  test("Disabled when escrow state=FAILED (1)", () => {
    const disabled = disableDepositButton(depositQuantity, 1, balance, isLoading);
    expect(disabled).toEqual(true);
  });
  test("Disabled when depositQuantity > balance", () => {
    const disabled = disableDepositButton(50, escrowState, balance, isLoading);
    expect(disabled).toEqual(true);
  });
  test("Disabled when isLoading = true", () => {
    const disabled = disableDepositButton(depositQuantity, escrowState, balance, true);
    expect(disabled).toEqual(true);
  });
  test("Enabled when balance is > 0", () => {
    const disabled = disableDepositButton(depositQuantity, escrowState, 1, isLoading);
    expect(disabled).toEqual(false);
  });
});

describe("Redeem Button", () => {
  const didRedeem = false;
  const escrowState = 1; // FAILED STATE
  const depositedBalance = 100;
  const isLoading = false;
  test("disabled if already claimed", () => {
    const disabled = disableRedeemButton(true, escrowState, depositedBalance, isLoading);
    expect(disabled).toEqual(true);
  });
  test("disabled if escrowState Pending (0)", () => {
    const disabled = disableRedeemButton(didRedeem, 0, depositedBalance, isLoading);
    expect(disabled).toEqual(true);
  });
  test("disabled if deposited balance is zero", () => {
    const disabled = disableRedeemButton(didRedeem, escrowState, 0, isLoading);
    expect(disabled).toEqual(true);
  });
  test("disabled if isLoading", () => {
    const disabled = disableRedeemButton(didRedeem, escrowState, depositedBalance, true);
    expect(disabled).toEqual(true);
  });
  test("enabled if escrowState FAILED (1)", () => {
    const disabled = disableRedeemButton(didRedeem, 1, depositedBalance, isLoading);
    expect(disabled).toEqual(false);
  });
  test("enabled if escrowState PASSED (2)", () => {
    const disabled = disableRedeemButton(didRedeem, 2, depositedBalance, isLoading);
    expect(disabled).toEqual(false);
  });
});

describe("Redeem Message", () => {
  const failedMessage = "The offer has not been accepted by the founders. Withdraw your tokens below.";
  const passedMessage = "The offer has been accepted by the founders. Redeem your tokens below.";
  test("matches if escrow state failed (1)", () => {
    expect(redeemMessage(1)).toEqual(failedMessage);
  });
  test("matches if escrow state passed (2)", () => {
    expect(redeemMessage(2)).toEqual(passedMessage);
  });
});

describe("Tender Snapshots", () => {
  it("should render <Tender/>", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Tender />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
  it("should render <DepositLimitMessage />", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <DepositLimitMessage />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
  it("should render <ProgressBar />", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ProgressBar totalDeposits={0} maxDeposits={0} />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
  it("should render <RedemptionToggle />", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RedemptionToggle
          quantity={0}
          daiValue={0}
          redeemToken={0}
          onChange={function (): void {
            throw new Error("Function not implemented.");
          }}
          gOhmValue={0}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
  it("should render <TokenSelector />", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <TokenSelector
          depositToken={0}
          onChange={function (event: ChangeEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
          }}
          tokens={[]}
        />
      </QueryClientProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
