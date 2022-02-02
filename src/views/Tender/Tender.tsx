import { t } from "@lingui/macro";
import { Box, Grid, LinearProgress, makeStyles, Switch, Theme, Typography } from "@material-ui/core";
import { DataRow, InfoNotification, InputWrapper, Paper, Tab, Tabs, TextButton } from "@olympusdao/component-library";
import { ChangeEvent, useEffect, useState } from "react";
import { NetworkId } from "src/constants";
import { trim } from "src/helpers";
import { balancesOf } from "src/lib/fetchBalances";

const Tender = (props: { walletAddress: string }) => {
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0.00");
  const [quantity, setQuantity] = useState("");
  const [daiValue, setDaiValue] = useState(0);
  const [gOhmValue, setgOHMValue] = useState(0);

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
    switch: {
      marginLeft: "8px",
      marginRight: "8px",
    },
  }));

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  useEffect(() => {
    balancesOf(props.walletAddress, NetworkId.FANTOM).then(res => {
      const token = res.find(address => address.contractAddress === process.env.REACT_APP_TENDER_BALANCE_ADDRESS);
      if (token && token.balance) {
        setTokenBalance(token.balance);
      }
    });
  }, [props.walletAddress]);

  //TEMP Hardcoded

  const buttonDisabled = false;
  const currentgOHMPrice = 5000;
  const stakeOnClick = () => console.log("Stake onClick");

  const setDeposit = (amount: string) => {
    setQuantity(amount);
    setDaiValue(parseInt(amount) * 50);
    //ToDo: Need to display gOHM value. (Token Qty * 55 / currentgOHMUSDPrice)
    //Where does current gOHMUSDPrice come from?
    setgOHMValue((parseInt(amount) * 55) / currentgOHMPrice);
  };

  const classes = useStyles();

  //Currency formatters for the token balances
  const usdValue = quantity ? new Intl.NumberFormat("en-US").format(parseInt(quantity) * 55) : 0;
  const gOhm = new Intl.NumberFormat("en-US").format(gOhmValue);
  const dai = new Intl.NumberFormat("en-US").format(daiValue);
  return (
    <Box display="flex" alignItems="center" justifyContent="center" alignContent="center">
      <Box display="flex" flexDirection="column">
        <InfoNotification style={{ width: "97%" }}>
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
        <Paper headerText={t`Chicken Tender Offer`}>
          <Box display="flex" justifyContent={"center"} mb={"10px"}>
            <Typography>485,000/970,000 Chickens Deposited</Typography>
          </Box>

          <Box style={{ width: "50%", margin: "0 25%" }}>
            <LinearProgress className={classes.progress} variant="determinate" value={50} />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignContent="center"
            width="50%"
          ></Box>
          <Box className="stake-action-area">
            <Tabs
              centered
              value={view}
              textColor="primary"
              indicatorColor="primary"
              className="stake-tab-buttons"
              onChange={changeView}
              aria-label="stake tabs"
              //hides the tab underline sliding animation in while <Zoom> is loading
              TabIndicatorProps={{ style: { display: "none" } }}
            >
              <Tab label={t`Deposit`} />
              <Tab label={t`Redeem`} />
            </Tabs>

            {props.walletAddress && (
              <>
                <Grid container className="stake-action-row">
                  <InputWrapper
                    id="amount-input"
                    type="number"
                    label={t`Enter an amount`}
                    value={quantity}
                    onChange={e => setDeposit(e.target.value)}
                    labelWidth={0}
                    endString={t`Max`}
                    endStringOnClick={() => setDeposit(tokenBalance)}
                    buttonText={t`Deposit`}
                    buttonOnClick={stakeOnClick}
                    disabled={buttonDisabled}
                  />
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={"15px"}
                  >
                    <Typography>
                      Deposit Chicken for: {gOhm} gOHM (~${usdValue})
                    </Typography>
                    <Switch
                      checked={redeemToken}
                      onChange={() => setRedeemToken(!redeemToken)}
                      color="default"
                      className={classes.switch}
                      inputProps={{ "aria-label": "stake to gohm" }}
                    />
                    <Typography> Deposit Chicken for: ${dai} DAI</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <DataRow title={t`Current Chicken Balance`} balance={`${trim(Number(tokenBalance), 4)} Chicken`} />
                  <DataRow title={t`Deposited Balance`} balance={`0.00`} />
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Tender;
