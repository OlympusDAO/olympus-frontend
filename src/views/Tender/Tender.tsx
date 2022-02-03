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
import { NetworkId } from "src/constants";
import { trim } from "src/helpers";
import { useGohmPrice } from "src/hooks/usePrices";
import { balancesOf } from "src/lib/fetchBalances";

const Tender = (props: { walletAddress: string }) => {
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0.00");
  const [quantity, setQuantity] = useState("");
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);
  const [depositedBalance, setDepositedBalance] = useState("0.00");
  const [redeemableBalance, setRedeemableBalance] = useState("0.00");
  const [contractBalance, setContractBalance] = useState(0);
  const { data: gOhmPrice } = useGohmPrice();

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

  useEffect(() => {
    if (props.walletAddress) {
      balancesOf(props.walletAddress, NetworkId.FANTOM).then(res => {
        const token = res.find(address => address.contractAddress === process.env.REACT_APP_TENDER_BALANCE_ADDRESS);
        if (token && token.balance) {
          setTokenBalance(token.balance);
        }
      });
    }

    //TODO: Contract call for Querying Deposited Balance
    //Call deposits. Should return amount of Token Deposited.
    setDepositedBalance("10.00");

    //TODO: Contract call for Querying Redeemable Balance
    //How much of which token can I claim? Which Function?
    setRedeemableBalance("00.00");

    //TODO: Contract Call for Contract Balance
    //Call totalDeposits
    setContractBalance(500000);
  }, [props.walletAddress]);

  const setDeposit = (amount: string) => {
    setQuantity(amount);
    setDaiValue(parseInt(amount) * 50);
    //Sets gOHM USD Equivalent value.
    gOhmPrice && setgOHMValue((parseInt(amount) * 55) / gOhmPrice);
  };

  //TODO: Contract call for Deposit Tokens
  //call deposit. 0 = DAI, 1 = gOHM
  const deposit = () => console.log("Make the Contract Call for Deposit");

  //TODO: Contract call for Redeem Tokens
  //Call Redeem function.
  const redeem = () => console.log("Make the Contract Call for Redeem");

  //TODO: Contract call for Withdraw
  //call withdraw if state=FAILED
  const withdraw = () => console.log("Make the Contract Call for Withdraw");

  //TODO: Check the Escrow State
  // call State
  // if PENDING allow deposit
  // If FAILED allow withdraw
  // If SUCCESS allow redeemDAI or redeemGOHM

  /* TODO: Accept Offer .
   * Does User Have Tokens in wallet (tokenBalance > 0)?
   * Does State === Passed
   * If Yes, Redeem Button Text === Accept Offer.
   *  - Redeem Button OnClick = AcceptOffer Contract Call.
   *
   * Can the user select a redemption token? Or is it always gOHM at this point?
   * How to check accept offer period is open or closed?
   * */

  //disabled button if no token balance
  const depositButtonDisabled = parseInt(tokenBalance) > 0 ? false : true;
  const redeemButtonDisabled = parseInt(redeemableBalance) > 0 ? false : true;

  //Currency formatters for the token balances
  const usdValue = quantity ? new Intl.NumberFormat("en-US").format(parseInt(quantity) * 55) : 0;
  const gOhm = new Intl.NumberFormat("en-US").format(gOhmValue);
  const dai = new Intl.NumberFormat("en-US").format(daiValue);
  //if false gOHM, if true DAI
  const redemptionToken = redeemToken ? "DAI" : "gOHM";
  const contractBalanceFormatted = new Intl.NumberFormat("en-US").format(contractBalance);
  //TODO: Is contract cap retrieved from the contract?
  const progressValue = (contractBalance / 970000) * 100;

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
          <Typography>{contractBalanceFormatted}/970,000 Chickens Deposited</Typography>
        </Box>
        <Box style={{ width: "50%", margin: "0 25%" }}>
          <LinearProgress className={classes.progress} variant="determinate" value={progressValue} />
        </Box>
        <Box className="stake-action-area">
          <Tabs centered value={view} onChange={changeView} aria-label="stake tabs">
            <Tab label={t`Deposit`} />
            <Tab label={t`Redeem`} />
          </Tabs>
          {props.walletAddress && view === 0 ? (
            <>
              <InputWrapper
                id="amount-input"
                type="number"
                label={t`Enter an amount`}
                value={quantity}
                onChange={e => setDeposit(e.target.value)}
                labelWidth={0}
                endString={t`Max`}
                endStringOnClick={() => setDeposit(tokenBalance)}
                buttonText={t`Deposit for ${redemptionToken}`}
                buttonOnClick={() => deposit()}
                disabled={depositButtonDisabled}
              />
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
                  Deposit {quantity} Chicken for {gOhm} gOHM (~${usdValue})
                </Typography>
                <Switch checked={redeemToken} onChange={() => setRedeemToken(!redeemToken)} color="default" />
                <Typography>
                  Deposit {quantity} Chicken for ${dai} DAI
                </Typography>
              </Box>

              <Grid item>
                <Divider color="secondary" />
                <DataRow title={t`Current Chicken Balance`} balance={`${trim(Number(tokenBalance), 4)} Chicken`} />
                <DataRow title={t`Deposited Balance`} balance={`${depositedBalance} Chicken`} />
              </Grid>
            </>
          ) : (
            view === 1 && (
              <Box display="flex" justifyContent={"center"} mt={"10px"}>
                <PrimaryButton disabled={redeemButtonDisabled} onClick={() => redeem()}>
                  Redeem
                </PrimaryButton>
              </Box>
            )
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default Tender;
