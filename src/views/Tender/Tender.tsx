import { t, Trans } from "@lingui/macro";
import { Box, Grid, LinearProgress, makeStyles, Switch, Theme, Typography } from "@material-ui/core";
import { InputWrapper, Paper, PrimaryButton, Tab, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";

const Tender: React.FC = () => {
  const [view, setView] = useState(0);
  const [redeemToken, setRedeemToken] = useState(false);

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

  //   //Stub for balance
  //   const balReq = true;
  //   useEffect(() => {
  //     balancesOf("0x9863056b4bdb32160a70107a6797dd06b56e8137", NetworkId.FANTOM).then(res => {
  //       const chicken = res.find(address => address.contractAddress === "0x8e2549225e21b1da105563d419d5689b80343e01");
  //       if (chickenBal) {
  //         setChickenBal(chicken.balance);
  //       }
  //     });
  //   }, [balReq]);

  //TEMP Hardcoded
  const confirmation = true;
  const address = "0x0000000000000000000000000000000000000000";
  const isAllowanceDataLoading = true;
  const stakeDisabled = false;
  const stakeOnClick = () => console.log("Stake onClick");
  const stakeButtonText = "Deposit";
  const quantity = "123";
  const handleChangeQuantity = (event: any) => console.log("handleChangeQuantity", event);
  const setMax = () => console.log("setMax");
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center" justifyContent="center" alignContent="center">
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
          <Grid container className="stake-action-row">
            {address && !isAllowanceDataLoading ? (
              view === 0 && (
                <>
                  <Grid item xs={12} sm={8} className="stake-grid-item">
                    <Box mt={"10px"}>
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        {view === 0 ? (
                          <>
                            <Trans>First time staking</Trans> <b>OHM</b>?
                            <br />
                            <Trans>Please approve Olympus Dao to use your</Trans> <b>OHM</b> <Trans>for staking</Trans>.
                          </>
                        ) : (
                          <>
                            <Trans>First time unstaking</Trans> <b>{confirmation ? "gOHM" : "sOHM"}</b>?
                            <br />
                            <Trans>Please approve Olympus Dao to use your</Trans>{" "}
                            <b>{confirmation ? "gOHM" : "sOHM"}</b> <Trans>for unstaking</Trans>.
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} className="stake-grid-item">
                    <Box mt={1}>
                      <PrimaryButton fullWidth className="stake-button" disabled={stakeDisabled} onClick={stakeOnClick}>
                        {stakeButtonText}
                      </PrimaryButton>
                    </Box>
                  </Grid>
                </>
              )
            ) : (
              <>
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
              </>
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Tender;
