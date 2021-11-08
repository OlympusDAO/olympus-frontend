import { useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
  Typography,
  Box,
  Slide,
  Slider,
  TextField,
  Grid,
  Paper,
} from "@material-ui/core";
import { redeemBond, changeApproval } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { DisplayBondDiscount } from "./Bond";

function BondRedeem({ bond }) {
  // const { bond: bondName } = bond;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });
  const [quantity, setQuantity] = useState("");
  const [ref, setRef] = useState(0);

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }
  const setMax = () => {
    let maxQ;
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice.toString();
    } else {
      maxQ = bond.balance;
    }
    setQuantity(maxQ);
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(quantity)) {
      dispatch(error("Please enter a valid value!"));
    } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      if (shouldProceed) {
        // Limit buy arguments *** inserted here
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          }),
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
        }),
      );
      clearInput();
    }
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };
  const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = bond.allowance == null;

  const hasAllowance = useCallback(() => {
    return bond.allowance > 0;
  }, [bond.allowance]);

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
  };
  const marks = [
    {
      value: 50,
      label: "50%",
    },
  ];
  useEffect(() => {
    console.log(bond);
    console.log(bondingState);
    console.log(bondDetails);
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Paper flexWrap="wrap" justifyContent="space-around" style={{ color: "white", backgroundColor: "#34363D" }}>
        {isAllowanceDataLoading ? (
          <Skeleton width="200px" />
        ) : (
          <>
            {!hasAllowance() ? (
              <div className="help-text">
                <em>
                  <Typography variant="body1" align="center" backGroundColor="textSecondary">
                    First time limit buying <b>{bond.displayName}</b>? <br /> Please approve Olympus Dao to use your{" "}
                    <b>{bond.displayName}</b> for limit buying.
                  </Typography>
                </em>
              </div>
            ) : (
              <div>
                <FormControl className="ohm-input" variant="outlined" color="primary">
                  <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    labelWidth={55}
                    endAdornment={
                      <InputAdornment position="end">
                        <Button variant="text" onClick={setMax}>
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Grid
                  container
                  spacing={4}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid item xs={10} justifyContent="center" alignItems="center">
                    <Slider className="ohm-input" valueLabelDisplay="auto" step={0.1} marks={marks} min={0} max={100} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <TextField
                      onChange={e => setRef(e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">{ref}</InputAdornment>,
                      }}
                      id="outlined-basic"
                      label="%"
                      variant="outlined"
                      size="small"
                    />{" "}
                  </Grid>

                  <Grid item xs={7}>
                    {!bond.isAvailable[chainID] ? (
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-btn"
                        className="transaction-button"
                        disabled={true}
                      >
                        Sold Out
                      </Button>
                    ) : hasAllowance() ? (
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-btn"
                        className="transaction-button"
                        disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                        onClick={onBond}
                      >
                        {txnButtonText(pendingTransactions, "bond_" + bond.name, "Limit Buy")}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-approve-btn"
                        className="transaction-button"
                        disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                        onClick={onSeekApproval}
                      >
                        {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </div>
            )}
          </>
        )}
      </Paper>

      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>Your Balance</Typography>
            <Typography>
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                <>
                  {trim(bond.balance, 4)} {displayUnits}
                </>
              )}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>You Will Get</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.bondQuote, 4) || "0"} OHM`}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>Max You Can Buy</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.maxBondPrice, 4) || "0"} OHM`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>ROI</Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>Debt Ratio</Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.debtRatio / 10000000, 2)}%`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>Vesting Term</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
