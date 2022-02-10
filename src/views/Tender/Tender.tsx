import { t } from "@lingui/macro";
import { Box, Divider, Grid, Typography } from "@material-ui/core";
import { DataRow, InputWrapper, Paper, PrimaryButton, Tab, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, useEffect, useState } from "react";
import CountdownTimer from "src/components/CountdownTimer/CountdownTimer";
import { trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useGohmPrice } from "src/hooks/usePrices";

import { DepositLimitMessage, NotificationMessage, ProgressBar, RedemptionToggle } from "./";
import {
  allowRedemtionChoice,
  disableDepositButton,
  disableRedeemButton,
  goOhmDepositExchangeRate,
  redeemMessage,
  redemptionToken,
} from "./helpers";
import {
  Approve,
  Balance,
  DaiExchangeRate,
  Deposit,
  Deposits,
  EscrowState,
  GOhmExchangeRate,
  MaxDeposits,
  Redeem,
  StakedAllowance,
  StakedBalance,
  TotalDeposits,
  UnstakedAllowance,
  Withdraw,
  WrappedAllowance,
  WrappedBalance,
} from "./queries";
import { TokenSelector } from "./TokenSelector";

const Tender = () => {
  const { address } = useWeb3Context();
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);
  const { data: gOhmPrice = 0 } = useGohmPrice();
  const gOhmExchangeRate = GOhmExchangeRate();
  const daiExchangeRate = DaiExchangeRate();
  const { amount: depositedBalance = 0, choice, index, ohmPrice, didRedeem } = Deposits(address);
  const totalDeposits = TotalDeposits();
  const maxDeposits = MaxDeposits();
  const escrowState = EscrowState();
  const approve = Approve();
  const deposit = Deposit();
  const redeem = Redeem();
  const withdraw = Withdraw();
  const [depositToken, setDepositToken] = useState(0);
  const tokens = [
    { balance: Balance(), label: "Chicken", value: 0, allowance: UnstakedAllowance() },
    { balance: StakedBalance(), label: "sChicken", value: 1, allowance: StakedAllowance() },
    { balance: WrappedBalance(), label: "wsChicken", value: 2, allowance: WrappedAllowance() },
  ];
  const hasBalances = tokens.some(token => token.balance > 0) ? true : false;

  //exchange rate of gOhm from Deposit
  const gOhmDepositExchangeRate = goOhmDepositExchangeRate(gOhmExchangeRate, index, ohmPrice);

  //If both exchange rates are positive and havent yet deposited, allow redemption choice.
  const allowChoice = allowRedemtionChoice(daiExchangeRate, gOhmExchangeRate, depositedBalance);

  //disabled button if no token balance or contract failed state or quantity entered exceeds balance or no quantity entered
  const depositButtonDisabled = disableDepositButton(
    quantity,
    escrowState,
    tokens[depositToken].balance,
    approve.isLoading || deposit.isLoading,
  );

  //disable if no deposited balance or escrow State === PENDING or redeemed or redeem loading or withdraw loading
  const redeemButtonDisabled = disableRedeemButton(
    didRedeem,
    escrowState,
    depositedBalance,
    redeem.isLoading || withdraw.isLoading,
  );

  useEffect(() => {
    //mapping this to state so choice and redeemToken are always the same
    if (choice === 0 || choice === 1) {
      setRedeemToken(choice);
    }
  }, [choice]);

  //Updates quantity of deposit and display values of gOHM and DAI
  const setDeposit = (amount: number) => {
    setQuantity(amount);
    setDaiValue(amount * daiExchangeRate);
    //Sets gOHM USD Equivalent value.
    setgOHMValue((amount * gOhmExchangeRate) / gOhmPrice);
  };

  //Set Redemption Strings
  let redemptionTokenString = redemptionToken(gOhmExchangeRate);
  if (allowChoice) {
    redemptionTokenString = redemptionToken(redeemToken);
  } else if (depositedBalance) {
    redemptionTokenString = redemptionToken(choice);
  }

  //amounts displayed on the redeem page
  const gOhmClaimAmount = (depositedBalance * gOhmDepositExchangeRate) / 1e18;
  const daiClaimAmount = depositedBalance * daiExchangeRate;
  const claimAmount = choice === 1 ? gOhmClaimAmount : choice === 0 && daiClaimAmount;
  const redeemableBalString = claimAmount ? `${trim(Number(claimAmount), 4)} ${redemptionTokenString}` : "0.00";

  //Check escrow state and assign variables.
  let redeemButtonText = `Redeem for ${redeemableBalString}`;
  let redeemButtonOnClick = () => {
    return;
  };
  const message = redeemMessage(escrowState);

  //Failed State
  if (escrowState === 1) {
    redeemButtonText = `Withdraw for ${depositedBalance} Chicken`;
    redeemButtonOnClick = () => withdraw.mutate();
  }
  //Passed State
  if (escrowState === 2) {
    redeemButtonOnClick = () => redeem.mutate();
  }

  //check allowance and set onclick / button text
  let depositOnClick: () => void;
  let depositButtonText: string;
  if (tokens[depositToken].allowance > 0) {
    depositOnClick = () => deposit.mutate({ quantity, redeemToken, depositToken: tokens[depositToken].value });
    depositButtonText = `Deposit for ${redemptionTokenString}`;
  } else {
    //Mutate based on depositToken choice 0=unstaked, 1=staked, 2=wrapped
    depositOnClick = () => approve.mutate(tokens[depositToken].value);
    depositButtonText = `Approve`;
  }
  //Change Button Text based on conditions
  approve.isLoading && (depositButtonText = "Approving...");
  deposit.isLoading && (depositButtonText = "Depositing...");
  redeem.isLoading && (redeemButtonText = "Redeeming...");
  withdraw.isLoading && (redeemButtonText = "Withdrawing...");
  didRedeem && (redeemButtonText = "Already Redeemed");
  !depositedBalance && (redeemButtonText = "No Tokens Deposited");

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepositToken(Number((event.target as HTMLInputElement).value));
  };

  return (
    <div id="stake-view">
      <NotificationMessage />
      <Paper headerText={t`Chicken Tender Offer`} zoom={false}>
        <ProgressBar totalDeposits={totalDeposits} maxDeposits={maxDeposits} />
        <Box className="stake-action-area">
          <Tabs centered value={view} onChange={changeView} aria-label="stake tabs" style={{ marginBottom: ".25rem" }}>
            <Tab label={t`Deposit`} />
            <Tab label={t`Redeem`} />
          </Tabs>
          {address && view === 0 ? (
            <>
              {totalDeposits && maxDeposits && totalDeposits / maxDeposits >= 1 ? (
                <DepositLimitMessage />
              ) : (
                <>
                  {hasBalances && (
                    <TokenSelector tokens={tokens} depositToken={depositToken} onChange={handleTokenChange} />
                  )}
                  <CountdownTimer
                    endsAt={new Date("December 1, 2022")}
                    timerTitle={t`Chicken Tender offer will open for deposits in:`}
                  />
                  <InputWrapper
                    id="amount-input"
                    type="number"
                    label={t`Enter an amount`}
                    value={quantity ? quantity : ""}
                    onChange={e => Number(e.target.value) >= 0 && setDeposit(Number(e.target.value))}
                    labelWidth={0}
                    endString={t`Max`}
                    endStringOnClick={() => setDeposit(tokens[depositToken].balance)}
                    buttonText={depositButtonText}
                    buttonOnClick={depositOnClick}
                    disabled={depositButtonDisabled}
                  />

                  {allowChoice && (
                    <RedemptionToggle
                      gOhmValue={gOhmValue}
                      quantity={quantity}
                      daiValue={daiValue}
                      redeemToken={redeemToken}
                      onChange={() => setRedeemToken(redeemToken ? 0 : 1)}
                    />
                  )}
                </>
              )}
              <Grid item>
                {tokens.map((token, index) => (
                  <DataRow
                    key={index}
                    title={`${token.label} ${t`Balance`}`}
                    balance={`${trim(Number(token.balance), 4)} ${token.label}`}
                  />
                ))}
                <Divider color="secondary" />
                <DataRow title={t`Deposited Balance`} balance={`${depositedBalance} Chicken `} />
                <DataRow title={t`Redeemable Balance if Accepted`} balance={redeemableBalString} />
              </Grid>
            </>
          ) : (
            view === 1 && (
              <Box display="flex" justifyContent={"center"} mt={"10px"}>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1" color="textSecondary">
                    {message}
                  </Typography>
                  <Box display="flex" justifyContent={"center"} mt={"10px"}>
                    <PrimaryButton disabled={redeemButtonDisabled} onClick={redeemButtonOnClick}>
                      {redeemButtonText}
                    </PrimaryButton>
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default Tender;
