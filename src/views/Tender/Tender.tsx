import { t } from "@lingui/macro";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  LinearProgress,
  makeStyles,
  Radio,
  RadioGroup,
  SvgIcon,
  Switch,
  Theme,
  Typography,
} from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import { DataRow, InputWrapper, Paper, PrimaryButton, Tab, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, useEffect, useState } from "react";
import { trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useGohmPrice } from "src/hooks/usePrices";

import { NotificationMessage } from "./NotificationMessage";
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

const Tender = () => {
  const { address } = useWeb3Context();
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);
  const { data: gOhmPrice } = useGohmPrice();
  const gOhmExchangeRate = GOhmExchangeRate();
  const daiExchangeRate = DaiExchangeRate();
  const { amount: depositedBalance, choice, index, ohmPrice, didRedeem } = Deposits(address);
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
  const useStyles = makeStyles<Theme>(() => ({
    progress: {
      backgroundColor: "#768299",
      borderRadius: "4px",
      marginTop: "3px",
      marginBottom: "3px",
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#F8CC82",
      },
    },
  }));
  const classes = useStyles();

  //exchange rate of gOhm from Deposit
  const gOhmDepositExchangeRate =
    gOhmExchangeRate && index && ohmPrice && (gOhmExchangeRate * 1e17) / (index * ohmPrice);

  //amount displayed on the redeem page
  const claimAmount =
    choice === 1
      ? depositedBalance &&
        gOhmExchangeRate &&
        gOhmDepositExchangeRate &&
        (depositedBalance * gOhmDepositExchangeRate) / 1e18
      : choice === 0 && depositedBalance && daiExchangeRate && depositedBalance * daiExchangeRate;
  const redeemableBalString = claimAmount ? `${trim(Number(claimAmount), 4)} ${choice ? "gOHM" : "DAI"}` : "0.00";
  const progressValue = totalDeposits && maxDeposits ? (totalDeposits / maxDeposits) * 100 : 0;

  //If both exchange rates are positive and havent yet deposited, allow choice.
  const allowChoice = daiExchangeRate > 0 && gOhmExchangeRate > 0 && !depositedBalance;

  //disabled button if no token balance or contract failed state or quantity entered exceeds balance
  const depositButtonDisabled =
    !tokens[depositToken].balance ||
    escrowState === 1 ||
    quantity > tokens[depositToken].balance ||
    !quantity ||
    approve.isLoading ||
    deposit.isLoading
      ? true
      : false;
  //disable if no deposited balance or escrow State === PENDING or redeemed or redeem loading or withdraw loading
  const redeemButtonDisabled =
    !Number(depositedBalance) || escrowState === 0 || didRedeem === true || redeem.isLoading || withdraw.isLoading
      ? true
      : false;

  //Currency formatters for the token balances
  const usdValue = quantity ? new Intl.NumberFormat("en-US").format(Number(quantity) * 55) : 0;
  const gOhm = new Intl.NumberFormat("en-US").format(gOhmValue);
  const dai = new Intl.NumberFormat("en-US").format(daiValue);
  const totalDepositsFormatted = totalDeposits && new Intl.NumberFormat("en-US").format(totalDeposits);
  const maxDepositsFormatted = maxDeposits && new Intl.NumberFormat("en-US").format(maxDeposits);

  useEffect(() => {
    //mapping this to state so choice and redeemToken are always the same
    if (choice === 0 || choice === 1) {
      setRedeemToken(choice);
    }
  }, [choice]);

  //Updates quantity of deposit and display values of gOHM and DAI
  const setDeposit = (amount: number) => {
    setQuantity(amount);
    daiExchangeRate && setDaiValue(amount * daiExchangeRate);
    //Sets gOHM USD Equivalent value.
    gOhmPrice && gOhmExchangeRate && setgOHMValue((Number(amount) * gOhmExchangeRate) / gOhmPrice);
  };

  //Check escrow state and assign variables.
  let redeemButtonText = `Redeem for ${redeemableBalString}`;
  let redeemButtonOnClick = () => {
    return;
  };
  let message = "";
  //Failed State
  if (escrowState === 1) {
    redeemButtonText = `Withdraw for ${depositedBalance} Chicken`;
    redeemButtonOnClick = () => withdraw.mutate();
    message = "The offer has not been accepted by the founders. Withdraw your tokens below.";
  }
  //Passed State
  if (escrowState === 2) {
    redeemButtonOnClick = () => redeem.mutate();
    message = "The offer has been accepted by the founders. Redeem your tokens below.";
  }

  //Set Strings from 0 or 1
  const redemptionToken = () => {
    if (allowChoice) {
      return redeemToken ? "gOHM" : "DAI";
    } else if (depositedBalance) {
      return choice ? "gOHM" : "DAI";
    } else {
      return gOhmExchangeRate && gOhmExchangeRate > 0 ? "gOHM" : "DAI";
    }
  };

  //check allowance and set onclick / button text
  let depositOnClick: () => void;
  let depositButtonText: string;
  if (tokens[depositToken].allowance > 0) {
    depositOnClick = () => deposit.mutate({ quantity, redeemToken, depositToken: tokens[depositToken].value });
    depositButtonText = `Deposit for ${redemptionToken()}`;
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

  const DepositLimitMessage = () => (
    <Box display="flex" justifyContent="center" mt="10px" mb="10px">
      <Typography variant="h5" color="textSecondary">
        Deposit limit has been reached
      </Typography>
    </Box>
  );

  const RedemptionToggle = () => (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="15px"
        marginBottom="25px"
        textAlign="center"
      >
        <Typography>
          Deposit {quantity} Chicken for ${dai} DAI
        </Typography>
        <Switch
          checked={redeemToken ? true : false}
          onChange={() => setRedeemToken(redeemToken ? 0 : 1)}
          color="default"
        />
        <Typography>
          Deposit {quantity} Chicken for {gOhm} gOHM (~${usdValue})
        </Typography>
      </Box>
      <Divider color="secondary" />
    </>
  );

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepositToken(Number((event.target as HTMLInputElement).value));
  };

  const hasBalances = tokens.some(token => token.balance > 0) ? true : false;

  const TokenSelector = () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">Deposit Token</FormLabel>
      <RadioGroup name="tokenGroup" value={depositToken} onChange={handleTokenChange} row>
        {tokens.map((token, index) => {
          if (token.balance > 0) {
            return (
              <FormControlLabel
                value={index}
                control={
                  <Radio
                    icon={<SvgIcon component={RadioButtonUnchecked} viewBox="0 0 24 24" />}
                    checkedIcon={<SvgIcon component={RadioButtonChecked} viewBox="0 0 24 24" />}
                    disableRipple={true}
                    color="primary"
                  />
                }
                label={token.label}
                key={index}
              />
            );
          }
        })}
      </RadioGroup>
    </FormControl>
  );
  return (
    <div id="stake-view">
      <NotificationMessage />
      <Paper headerText={t`Chicken Tender Offer`}>
        <Box display="flex" justifyContent={"center"} mb={"10px"}>
          <Typography>
            {totalDepositsFormatted}/{maxDepositsFormatted} Chickens Deposited
          </Typography>
        </Box>
        <Box style={{ width: "50%", margin: "0 25%" }}>
          <LinearProgress className={classes.progress} variant="determinate" value={progressValue} />
        </Box>
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
                  {hasBalances && <TokenSelector />}
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

                  {allowChoice && <RedemptionToggle />}
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
