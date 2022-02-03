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
import { ChangeEvent, useState } from "react";
//import { NetworkId } from "src/constants";
import { trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useGohmPrice } from "src/hooks/usePrices";

import {
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
  const { provider, address, connect } = useWeb3Context();
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);
  const { data: gOhmPrice } = useGohmPrice();
  const tokenBalance = Balance(address);
  const gOhmExchangeRate = GOhmExchangeRate();
  const daiExchangeRate = DaiExchangeRate();
  const { amount: depositedBalance, choice } = Deposits(address);
  const totalDeposits = TotalDeposits();
  const maxDeposits = MaxDeposits();
  const escrowState = EscrowState();
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

  const setDeposit = (amount: number) => {
    setQuantity(amount);
    daiExchangeRate && setDaiValue(amount * daiExchangeRate);

    //Sets gOHM USD Equivalent value.
    gOhmPrice && gOhmExchangeRate && setgOHMValue((Number(amount) * gOhmExchangeRate) / gOhmPrice);
  };

  //Check escrow state and assign variables.
  let redeemButtonText = "Redeem";
  let redeemButtonOnClick = () => {
    return;
  };
  if (escrowState === "FAILED") {
    redeemButtonText = "Withdraw";
    redeemButtonOnClick = () => Withdraw();
  }
  if (escrowState === "SUCCESS") {
    redeemButtonOnClick = () => Redeem();
  }

  //disabled button if no token balance or contract failed state
  const depositButtonDisabled = Number(tokenBalance) > 0 && escrowState != "FAILED" ? false : true;
  //disable button if no token balance and state != PENDING
  const redeemButtonDisabled = Number(depositedBalance) > 0 && escrowState === "PENDING" ? true : false;

  //Currency formatters for the token balances
  const usdValue = quantity ? new Intl.NumberFormat("en-US").format(Number(quantity) * 55) : 0;
  const gOhm = new Intl.NumberFormat("en-US").format(gOhmValue);
  const dai = new Intl.NumberFormat("en-US").format(daiValue);
  const allowChoice = daiExchangeRate && daiExchangeRate > 0 && gOhmExchangeRate && gOhmExchangeRate > 0;

  //If both exchange rates are positive. allow choice. Else default to the rate that is positive.
  const redemptionToken = () => {
    if (allowChoice) {
      return redeemToken ? "gOHM" : "DAI";
    } else {
      return gOhmExchangeRate && gOhmExchangeRate > 0 ? "gOHM" : "DAI";
    }
  };
  const totalDepositsFormatted = totalDeposits && new Intl.NumberFormat("en-US").format(totalDeposits);
  const maxDepositsFormatted = maxDeposits && new Intl.NumberFormat("en-US").format(maxDeposits);

  const progressValue = totalDeposits && maxDeposits ? (totalDeposits / maxDeposits) * 100 : 0;

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };
  const classes = useStyles();

  return (
    <div id="stake-view">
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
              <InputWrapper
                id="amount-input"
                type="number"
                label={t`Enter an amount`}
                value={quantity}
                onChange={e => e.target.value && setDeposit(Number(e.target.value))}
                labelWidth={0}
                endString={t`Max`}
                endStringOnClick={() => tokenBalance && setDeposit(tokenBalance)}
                buttonText={t`Deposit for ${redemptionToken}`}
                buttonOnClick={() => Deposit(quantity, redeemToken)}
                disabled={depositButtonDisabled}
              />
              {allowChoice && (
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

                    <Switch checked={redeemToken} onChange={() => setRedeemToken(!redeemToken)} color="default" />
                    <Typography>
                      Deposit {quantity} Chicken for {gOhm} gOHM (~${usdValue})
                    </Typography>
                  </Box>
                  <Divider color="secondary" />
                </>
              )}

              <Grid item>
                <DataRow title={t`Current Chicken Balance`} balance={`${trim(Number(tokenBalance), 4)} Chicken`} />
                <DataRow title={t`Deposited Balance`} balance={`${depositedBalance} Chicken`} />
              </Grid>
            </>
          ) : (
            view === 1 && (
              <Box display="flex" justifyContent={"center"} mt={"10px"}>
                <Box display="flex" flexDirection="column">
                  <Typography>Redeem for {choice ? "gOHM" : "DAI"}</Typography>
                  <PrimaryButton disabled={redeemButtonDisabled} onClick={redeemButtonOnClick}>
                    {redeemButtonText}
                  </PrimaryButton>
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
