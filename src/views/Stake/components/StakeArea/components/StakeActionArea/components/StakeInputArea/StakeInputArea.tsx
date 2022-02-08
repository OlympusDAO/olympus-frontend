import { t } from "@lingui/macro";
import { Box, Grid, makeStyles, Paper, Switch, Tab, Tabs, Theme } from "@material-ui/core";
import { InfoTooltip, Input, PrimaryButton } from "@olympusdao/component-library";
import { formatUnits } from "ethers/lib/utils";
import React, { useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { GOHM_ADDRESSES, OHM_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { useBalance } from "src/hooks/useBalances";
import { NetworkId } from "src/networkDetails";

import { GOHMConversion } from "./components/GOHMConversion";
import { useStakeMutation } from "./hooks/useStakeMutation";

const useStyles = makeStyles<Theme>(theme => ({
  inputRow: {
    justifyContent: "space-around",
    alignItems: "center",
    height: "auto",
    marginTop: "4px",
  },
  gridItem: {
    width: "100%",
    paddingRight: "5px",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: "0",
    },
  },
  button: {
    alignSelf: "center",
    width: "100%",
    minWidth: "163px",
    maxWidth: "542px",
    height: "43px",
  },
}));

export const StakeInputArea: React.FC<{ isZoomed: boolean }> = props => {
  const classes = useStyles();
  const [stakedAssetType, setStakedAssetType] = useState<"sOHM" | "gOHM">("sOHM");
  const [currentAction, setCurrentAction] = useState<"STAKE" | "UNSTAKE">("STAKE");

  const fromToken = currentAction === "STAKE" ? "OHM" : stakedAssetType;

  const [amount, setAmount] = useState("");
  const addresses = fromToken === "OHM" ? OHM_ADDRESSES : fromToken === "sOHM" ? SOHM_ADDRESSES : GOHM_ADDRESSES;
  const { data: balance } = useBalance(addresses);

  const setMax = () => {
    if (!balance) return;

    setAmount(formatUnits(balance[NetworkId.MAINNET], fromToken === "gOHM" ? 36 : 18));
  };

  const stakeMutation = useStakeMutation(currentAction, stakedAssetType);
  const handleSubmit = (event: React.FormEvent<StakeFormElement>) => {
    event.preventDefault();
    const amount = event.currentTarget.elements["amount-input"].value;
    stakeMutation.mutate(amount);
  };

  return (
    <Box className="stake-action-area">
      <Tabs
        centered
        textColor="primary"
        aria-label="stake tabs"
        indicatorColor="primary"
        key={String(props.isZoomed)}
        className="stake-tab-buttons"
        value={currentAction === "STAKE" ? 0 : 1}
        //hides the tab underline sliding animation in while <Zoom> is loading
        TabIndicatorProps={!props.isZoomed ? { style: { display: "none" } } : undefined}
        onChange={(_, view: number) => setCurrentAction(view === 0 ? "STAKE" : "UNSTAKE")}
      >
        <Tab aria-label="stake-button" label={t({ id: "do_stake", comment: "The action of staking (verb)" })} />

        <Tab aria-label="unstake-button" label={t`Unstake`} />
      </Tabs>

      <Box my={2}>
        <TokenAllowanceGuard token={fromToken}>
          <form onSubmit={handleSubmit}>
            <Grid container className={classes.inputRow}>
              <Grid item xs={12} sm={8} className={classes.gridItem}>
                <Input
                  value={amount}
                  labelWidth={0}
                  id="amount-input"
                  endString={t`Max`}
                  name="amount-input"
                  className={classes.input}
                  endStringOnClick={setMax}
                  disabled={stakeMutation.isLoading}
                  label={t`Enter an amount of` + ` ${fromToken}`}
                  onChange={event => setAmount(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4} className={classes.gridItem}>
                <Box sx={{ marginTop: { xs: 1, sm: 0 } }}>
                  <PrimaryButton fullWidth type="submit" className={classes.button} disabled={stakeMutation.isLoading}>
                    {currentAction === "STAKE"
                      ? stakeMutation.isLoading
                        ? "Staking to "
                        : "Stake to "
                      : stakeMutation.isLoading
                      ? "Unstaking "
                      : "Unstake "}

                    {stakedAssetType}

                    {stakeMutation.isLoading ? "..." : ""}
                  </PrimaryButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TokenAllowanceGuard>
      </Box>

      <Paper className="ohm-card confirm-dialog">
        <Box display={[null, "flex"]} alignItems="center" justifyContent="space-between">
          <Grid component="label" container alignItems="center" spacing={1} wrap="nowrap">
            <Grid item>sOHM</Grid>

            <Grid item>
              <Switch
                color="primary"
                className="stake-to-ohm-checkbox"
                checked={stakedAssetType === "gOHM"}
                inputProps={{ "aria-label": "stake to gohm" }}
                onChange={(_, checked) => setStakedAssetType(checked ? "gOHM" : "sOHM")}
              />
            </Grid>

            <Grid item>
              gOHM
              <InfoTooltip
                message={`Toggle to switch between ${
                  currentAction === "STAKE" ? "staking to" : "unstaking from"
                } sOHM or gOHM`}
              />
            </Grid>
          </Grid>

          <Box marginTop={[2, 0]} flexShrink={0}>
            {stakedAssetType === "gOHM" && <GOHMConversion amount={amount} action={currentAction} />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

interface StakeFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { "amount-input": HTMLInputElement };
}
