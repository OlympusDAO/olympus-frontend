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

  const stakeDisabled = false;
  const stakeOnClick = () => console.log("Stake onClick");
  const stakeButtonText = "Deposit";
  const quantity = "123";
  const handleChangeQuantity = (event: any) => console.log("handleChangeQuantity", event);
  const setMax = () => console.log("setMax");
  const classes = useStyles();
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
                    onChange={handleChangeQuantity}
                    labelWidth={0}
                    endString={t`Max`}
                    endStringOnClick={setMax}
                    buttonText={stakeButtonText}
                    buttonOnClick={stakeOnClick}
                    disabled={stakeDisabled}
                  />
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={"15px"}
                  >
                    <Typography>Deposit Chicken for: $55 gOHM</Typography>
                    <Switch
                      checked={redeemToken}
                      onChange={() => setRedeemToken(!redeemToken)}
                      color="default"
                      className={classes.switch}
                      inputProps={{ "aria-label": "stake to gohm" }}
                    />
                    <Typography> Deposit Chicken for: $50 DAI</Typography>
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
