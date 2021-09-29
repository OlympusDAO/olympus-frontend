import { useCallback, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { ACTIONS, changeStake, getApproval, TYPES } from "../../slices/MigrateThunk";
import { useDispatch, useSelector } from "react-redux";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { trim } from "../../helpers";
import useEscape from "../../hooks/useEscape";
import { NavLink, useHistory } from "react-router-dom";
import "./stake.scss";
import "./migrate.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error } from "../../slices/MessagesSlice";

// this will need to know the users ohmBalance, stakedSOHM, and stakedWSOHM

export default function Migrate() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect } = useWeb3Context();

  const [view, setView] = useState("unstake"); // views = (approve) > unstake > approve > stake > done
  const [currentStep, setCurrentStep] = useState("1"); // steps = 1,2,3,4
  const [quantity, setQuantity] = useState();

  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.migrate && state.account.migrate.unstakeAllowance;
  });
  const newStakingAPY = useSelector(state => {
    return (state.app && state.app.stakingAPY) || 0;
  });

  const oldStakingAPY = useSelector(state => {
    return (state.app && state.app.oldStakingAPY) || 0;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const getStakeApproval = async () => {
    const dispatchObj = getApproval({
      type: TYPES.NEW,
      networkID: 1,
      provider,
      address,
    });
    await dispatch(dispatchObj);
  };

  const getUnstakeLegacyApproval = async () => {
    const dispatchObj = getApproval({
      type: TYPES.OLD,
      networkID: 1,
      provider,
      address,
    });
    await dispatch(dispatchObj);
  };

  const unStakeLegacy = async () => {
    if (Number.isNaN(quantity) || quantity === 0 || quantity === "") {
      dispatch(error("Please enter a value!"));
      return;
    }

    await dispatch(
      changeStake({ action: ACTIONS.UNSTAKE, address, value: quantity.toString(), provider, networkID: 1 }),
    );
  };

  const stakeOhm = async () => {
    if (Number.isNaN(quantity) || quantity === 0 || quantity === "") {
      dispatch(error("Please enter a value!"));
      return;
    }

    await dispatch(changeStake({ action: ACTIONS.STAKE, address, value: quantity.toString(), provider, networkID: 1 }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return false;
    },
    [stakeAllowance, unstakeAllowance],
  );

  useEffect(() => {
    // here we check the user's sohm and wsohm balance
    // if they still have sohm (old) they remain on step 1 (unstake)
    if (view === "unstake") {
      setQuantity(oldSohmBalance);
    } else {
      setQuantity(ohmBalance);
    }

    if (oldSohmBalance > 0) {
      setCurrentStep("1");
    } else if (sohmBalance > 0) {
      setCurrentStep("3");
    } else {
      setCurrentStep("2");
    }
  }, [view]);

  useEffect(() => {
    // setView based on sohm(new) vs sohm(old) balance
    // if there is any sohm(old) set to unstake
    if (oldSohmBalance > 0) {
      setCurrentStep("1");
      setView("unstake");
    } else if (ohmBalance > 0) {
      setCurrentStep("2");
      setView("stake");
    } else {
      setCurrentStep("3");
      setView("done");
    }
  }, [ohmBalance, oldSohmBalance, sohmBalance, stakeAllowance, unstakeAllowance]);

  useEffect(() => {
    // setView based on sohm(new) vs sohm(old) balance
    // if there is any sohm(old) set to unstake
    if (oldSohmBalance > 0) setView("unstake");
    else if (ohmBalance > 0) setView("stake");
    else setView("done");
  }, []);

  let history = useHistory();

  useEscape(() => {
    history.push("/stake");
  });

  let modalButton = <></>;
  if (!connected) {
    modalButton = (
      <button type="button" className="stake-button" onClick={connect}>
        Connect Wallet
      </button>
    );
  }

  return (
    <Grid container id="sohm-migration-view">
      <Backdrop open={true}>
        <Paper className="ohm-card ohm-modal">
          <div className="card-header">
            <Link component={NavLink} to="/stake" className="cancel-migrate">
              <SvgIcon component={XIcon} />
            </Link>
            <Typography variant="h3">sOHM Migration</Typography>
          </div>

          {!address ? (
            <div className="stake-wallet-notification">
              <Typography variant="h4">Connect your wallet to continue</Typography>
              <div className="wallet-menu" id="wallet-menu">
                <Button variant="contained" color="primary" onClick={connect}>
                  Connect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <div className="stake-migration-help">
                {view === "unstake" && (
                  <Typography>
                    Hey Ohmie, Olympus is updating the staking contract. So in order to continue earning those juicy
                    rewards you'll need to unstake your sOHM from the old contract and restake it to the new sOHM
                    contract.
                  </Typography>
                )}

                {view === "stake" && (
                  <Typography>
                    Youre almost done, all thats left now is to Stake your OHM to the new contract.
                  </Typography>
                )}

                {view === "done" && <Typography>Youre good to go, all OHM is staked to the new contract.</Typography>}
              </div>

              <Breadcrumbs className={`migration-breadcrumbs`} separator={<DoubleArrowIcon fontSize="medium" />}>
                <div
                  role="button"
                  onClick={() => {
                    setView("unstake");
                  }}
                  className={`breadcrumb ${currentStep === "1" ? "current-step" : "finished-step"}`}
                >
                  Step 1: Unstake sOHM (old)
                </div>
                <div
                  role="button"
                  onClick={() => {
                    setView("stake");
                  }}
                  className={`breadcrumb ${currentStep === "2" && "current-step"} ${
                    currentStep === "3" && "finished-step"
                  }`}
                >
                  Step 2: Stake sOHM (new)
                </div>
              </Breadcrumbs>

              {view !== "done" ? (
                <>
                  <Box display="flex" className="stake-action-row">
                    <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                      <InputLabel htmlFor="migrate-input"></InputLabel>
                      <OutlinedInput
                        id="migrate-input"
                        type="number"
                        placeholder={`${quantity}`}
                        className="stake-input"
                        // value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <div className="logo-holder">
                              <div className="ohm-logo-bg">
                                <img
                                  className="ohm-logo-tiny"
                                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
                                />
                              </div>
                            </div>
                          </InputAdornment>
                        }
                        labelWidth={0}
                        endAdornment={
                          <InputAdornment position="end">
                            <Button variant="text" onClick={setMax}>
                              Max
                            </Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl>

                    {address && hasAllowance("sohm") && view === "unstake" && (
                      <Button
                        variant="contained"
                        color="primary"
                        className="stake-button"
                        disabled={isPendingTxn(pendingTransactions, "migrate_unstaking")}
                        onClick={() => {
                          unStakeLegacy();
                          setView("stake");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "migrate_unstaking", "Unstake sOHM (legacy)")}
                      </Button>
                    )}

                    {address && hasAllowance("ohm") && view === "stake" && (
                      <Button
                        variant="contained"
                        color="primary"
                        className="stake-button"
                        disabled={isPendingTxn(pendingTransactions, "migrate_staking")}
                        onClick={() => {
                          stakeOhm();
                          setView("done");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "migrate_staking", "Stake OHM (new)")}
                      </Button>
                    )}

                    {address && !hasAllowance("sohm") && view === "unstake" && (
                      <Button
                        variant="contained"
                        color="primary"
                        className="stake-button"
                        onClick={() => {
                          getUnstakeLegacyApproval();
                        }}
                      >
                        {txnButtonText(pendingTransactions, "approve_migrate_unstaking", "Approve Unstake (legacy)")}
                      </Button>
                    )}

                    {address && !hasAllowance("ohm") && view === "stake" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          getStakeApproval();
                        }}
                      >
                        {txnButtonText(pendingTransactions, "approve_migrate_staking", "Approve Stake (new)")}
                      </Button>
                    )}
                  </Box>

                  <div className="stake-notification">
                    {address &&
                      ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                        <em>
                          <Typography>
                            "Approve" transaction is only needed when staking/unstaking for the first time; subsequent
                            staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.
                          </Typography>
                        </em>
                      )}
                  </div>
                </>
              ) : (
                <Typography>Stay classy, stay (3, 3)</Typography>
              )}

              <Box className={`stake-user-data`}>
                <div className="data-row">
                  <Typography>Ohm Balance</Typography>
                  <Typography>{trim(ohmBalance)} OHM</Typography>
                </div>
                <div className="data-row">
                  <Typography>Staked (new)</Typography>
                  <Typography>{trim(sohmBalance, 4)} sOHM</Typography>
                </div>

                <div className="data-row">
                  <Typography>APY (New)</Typography>
                  <Typography>{trim(newStakingAPY * 100, 4)}%</Typography>
                </div>

                <div className="data-row">
                  <Typography>Staked (legacy)</Typography>
                  <Typography>{trim(oldSohmBalance, 4)} sOHM</Typography>
                </div>

                <div className="data-row">
                  <Typography>APY (Legacy)</Typography>
                  <Typography>{trim(oldStakingAPY * 100, 4)}%</Typography>
                </div>
              </Box>
            </div>
          )}
        </Paper>
      </Backdrop>
    </Grid>
  );
}
