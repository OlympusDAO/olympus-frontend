import { t } from "@lingui/macro";
import { Box, Divider, Grid, LinearProgress, makeStyles, Switch, Theme, Typography } from "@material-ui/core";
import {
  DataRow,
  InfoNotification,
  InputWrapper,
  Paper,
  PrimaryButton,
  Tab,
  Tabs,
  TextButton,
} from "@olympusdao/component-library";
import { ChangeEvent, useEffect, useState } from "react";
import { trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useGohmPrice } from "src/hooks/usePrices";

import {
  Allowance,
  Approve,
  Balance,
  DaiExchangeRate,
  Deposit,
  Deposits,
  EscrowState,
  GOhmExchangeRate,
  MaxDeposits,
  Redeem,
  TotalDeposits,
  Withdraw,
} from "./queries";

const Tender = () => {
  const { provider, address, connect, networkId } = useWeb3Context();
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);
  const { data: gOhmPrice } = useGohmPrice();
  const tokenBalance = Balance(address);
  const gOhmExchangeRate = GOhmExchangeRate();
  const daiExchangeRate = DaiExchangeRate();
  const { amount: depositedBalance, choice, index, ohmPrice } = Deposits(address);
  const totalDeposits = TotalDeposits();
  const maxDeposits = MaxDeposits();
  const escrowState = EscrowState();
  const allowance = Allowance(address);
  const approve = Approve();
  const deposit = Deposit(quantity, redeemToken);
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
  const allowChoice =
    daiExchangeRate && daiExchangeRate > 0 && gOhmExchangeRate && gOhmExchangeRate > 0 && !depositedBalance;

  //disabled button if no token balance or contract failed state or quantity entered exceeds balance
  const depositButtonDisabled =
    !Number(tokenBalance) ||
    escrowState === 1 ||
    quantity > Number(tokenBalance) ||
    approve.isLoading ||
    deposit.isLoading
      ? true
      : false;
  //disable if no deposited balance or escrow State === PENDING
  const redeemButtonDisabled = !Number(depositedBalance) || escrowState === 0 ? true : false;

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
    redeemButtonOnClick = () => Withdraw();
    message = "The offer has not been accepted by the founders. Withdraw your tokens below.";
  }
  //Passed State
  if (escrowState === 2) {
    redeemButtonOnClick = () => Redeem();
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
  if (allowance && allowance > 0) {
    depositOnClick = () => deposit.mutate();
    depositButtonText = `Deposit for ${redemptionToken()}`;
  } else {
    depositOnClick = () => approve.mutate();
    depositButtonText = `Approve`;
  }

  if (approve.isLoading) {
    depositButtonText = `Approving...`;
  }
  if (deposit.isLoading) {
    depositButtonText = `Depositing...`;
  }

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  console.log("totalDeposits", totalDeposits);
  console.log("totaldepositsformatted", totalDepositsFormatted);
  console.log("despoits", depositedBalance);

  const DepositLimitMessage = () => (
    <Box display="flex" justifyContent="center" mt="10px" mb="10px">
      <Typography variant="h5" color="textSecondary">
        Deposit limit has been reached
      </Typography>
    </Box>
  );

  console.log(allowance, "allowance");
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

  const NotificationMessage = () => (
    <Box width="97%" maxWidth="833px">
      <InfoNotification>
        This is a very important message about redeeming your Chicken Tender Offer.
        <TextButton
          href="#"
          style={{
            margin: "0px",
            marginLeft: "10px",
            padding: "0px",
            lineHeight: "20px",
            paddingBottom: "2px",
            height: "inherit",
          }}
        >
          Learn More
        </TextButton>
      </InfoNotification>
    </Box>
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
          <Tabs centered value={view} onChange={changeView} aria-label="stake tabs">
            <Tab label={t`Deposit`} />
            <Tab label={t`Redeem`} />
          </Tabs>
          {address && view === 0 ? (
            <>
              {totalDeposits && maxDeposits && totalDeposits / maxDeposits >= 1 ? (
                <DepositLimitMessage />
              ) : (
                <>
                  <InputWrapper
                    id="amount-input"
                    type="number"
                    label={t`Enter an amount`}
                    value={quantity}
                    onChange={e => e.target.value && setDeposit(Number(e.target.value))}
                    labelWidth={0}
                    endString={t`Max`}
                    endStringOnClick={() => tokenBalance && setDeposit(tokenBalance)}
                    buttonText={depositButtonText}
                    buttonOnClick={depositOnClick}
                    disabled={depositButtonDisabled}
                  />
                  {allowChoice && <RedemptionToggle />}
                </>
              )}
              <Grid item>
                <DataRow title={t`Current Chicken Balance`} balance={`${trim(Number(tokenBalance), 4)} Chicken`} />
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
