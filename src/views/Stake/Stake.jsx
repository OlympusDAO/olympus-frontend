import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
  SvgIcon,
  Tab,
  Tabs,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow,
  TableContainer,
  Link,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "../../actions/Stake.actions";
import { getFraxData } from "../../actions/App.actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as ArrowUp } from "../../assets/icons/v1.2/arrow-up.svg";
import "./stake.scss";
import { NavLink } from "react-router-dom";

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
function Stake({ provider, address, web3Modal, loadWeb3Modal, currentIndex }) {
=======
=======
>>>>>>> 153: adds current index following new design
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake({ provider, address, web3Modal, loadWeb3Modal }) {
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> staking view cleaned up, still needs some refactoring but fine for now
=======
=======
function Stake({ provider, address, web3Modal, loadWeb3Modal, currentIndex }) {
>>>>>>> 153: adds current index following new design
>>>>>>> 153: adds current index following new design
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
  const dispatch = useDispatch();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();
<<<<<<< HEAD
  const [migrationWizardOpen, setMigrationWizardOpen] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
=======
  const [txPending, setTxPending] = useState(false);
  const [tx, setTx] = useState();
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue

  const isSmallScreen = useMediaQuery("(max-width: 1125px)");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
  const isNarrowScreen = useMediaQuery("(max-width:460px)");
=======
	const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)")
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
=======
  const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
=======
=======
>>>>>>> staking view cleaned up, still needs some refactoring but fine for now

  const isSmallScreen = useMediaQuery("(max-width: 960px)");
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
  const isMobileScreen = useMediaQuery("(max-width: 513px)");
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal

  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fraxData = useSelector(state => {
    return state.fraxData;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.app.staking && state.app.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.app.staking && state.app.staking.ohmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const setMax = () => {
    if (view === "stake") {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      alert("Please enter a value!");
    } else {
      await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: 1 }));
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

  const ohmAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png";
  };

  const fraxAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png";
  };

  const loadFraxData = async () => {
    dispatch(getFraxData());
  };
<<<<<<< HEAD

  
=======
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented

  useEffect(() => {
    loadFraxData();
  }, []);

  let modalButton = [];

  if (web3Modal) {
    modalButton.push(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      <button type="button" className="btn stake-button btn-overwrite-primer m-2" onClick={loadWeb3Modal} key={2}>
        Connect Wallet
      </button>,
=======
      <Button variant="contained" color="primary"
        onClick={loadWeb3Modal}
        key={2}
      >
        Connect Wallet
      </Button>
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
    );
  }

  const openMigrationWizard = () => {
    setMigrationWizardOpen(true);
  };

  const closeMigrationWizard = () => {
    setMigrationWizardOpen(false);
  };

  const trimmedSOHMBalance = trim(sohmBalance, 4);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedSOHMBalance, 4);
=======
=======
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
      <Button variant="contained" color="primary" onClick={loadWeb3Modal} key={2}>
        Connect Wallet
      </Button>,
    );
  }

  const changeView = (event, newView) => {
    setView(newView);
  };
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented

  const trimmedSOHMBalance = trim(sohmBalance, 4);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedSOHMBalance, 4);

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <Grid id="stake-view" direction="row" justify="center">
<<<<<<< HEAD
      {/* <Grid item sm={8} lg={6}> */}
      <Card className={`ohm-card primary ${isSmallScreen && "mobile"} ${isMediumScreen && "med"}`}>
=======
      <Card className={`ohm-card primary ${isSmallScreen  && "mobile"} ${isMediumScreen && "med"}`}>
>>>>>>> removed unused scaffold-eth components and pruned scss
        <div className="card-header">
          <h5>Single Stake (3, 3)</h5>
          <RebaseTimer />

          {address && oldSohmBalance > 0.01 && (
            <div className="migrate-sohm-button" role="button" aria-label="migrate-sohm" onClick={openMigrationWizard}>
              <NavLink to="/stake/migrate">
                <NewReleases />
                Migrate sOHM
              </NavLink>
            </div>
          )}
          {address && oldSohmBalance < 0.01 && (
            <div
              className="migrate-sohm-button complete"
              role="button"
              aria-label="migrate-sohm-complete"
              onClick={openMigrationWizard}
            >
              <NavLink to="/stake/migrate">
                <CheckCircleIcon />
                sOHM Migrated
              </NavLink>
            </div>
          )}
        </div>

        <div className="card-content">
          <Grid direction="row" justify="center" alignItems="center">
            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6} lg={4}>
                    <div className="stake-apy">
                      <h2 className="title">APY</h2>
                      <h2 className="content">{stakingAPY && trim(stakingAPY * 100, 1)}%</h2>
=======
=======
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
    <div id="stake-view">
      <Paper className={`ohm-card`}>
        <Grid container direction="column" justify="center" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Single Stake (3, 3)</Typography>
              <RebaseTimer />

              {address && oldSohmBalance > 0.01 && (
                <Link className="migrate-sohm-button" component={NavLink} to="/stake/migrate" aria-label="migrate-sohm">
                  <NewReleases viewBox="0 0 24 24" />
                  <Typography>Migrate sOHM</Typography>
                </Link>
              )}
              {address && oldSohmBalance < 0.01 && (
                <Link
                  component={NavLink}
                  to="/stake/migrate"
                  className="migrate-sohm-button complete"
                  aria-label="migrate-sohm-complete"
                >
                  <CheckCircleIcon viewBox="0 0 24 24" />
                  <Typography>sOHM Migrated</Typography>
                </Link>
              )}
            </div>
          </Grid>

          <Grid item>
            <div className="stake-top-metrics">
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={4}>
                  <div className="stake-apy">
                    <Typography variant="h5" color="textSecondary">
                      APY
                    </Typography>
                    <Typography variant="h4">{stakingAPY && trim(stakingAPY * 100, 1)}%</Typography>
                  </div>
                </Grid>

                <Grid item xs={6} sm={6} lg={4}>
                  <div className="stake-tvl">
                    <Typography variant="h5" color="textSecondary">
                      TVL
                    </Typography>
                    <Typography variant="h4">
                      {stakingTVL &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(stakingTVL)}
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={6} sm={6} lg={4}>
                  <div className="stake-index">
                    <Typography variant="h5" color="textSecondary">
                      Current Index
                    </Typography>
                    <Typography variant="h4">{currentIndex && trim(currentIndex, 1)} OHM</Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <div className="staking-area">
            {!address ? (
              <div className="stake-wallet-notification">
                <Typography variant="h4" gutterBottom>
                  Connect your wallet to Stake OHM
                </Typography>
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
              </div>
            ) : (
              <>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                <Grid item>
                  <div className="stake-toggle-row">
<<<<<<< HEAD
                    <div className="btn-group" role="group">
                      <Button
                        onClick={() => {
                          setView("stake");
                        }}
                      >
                        Stake
                      </Button>
                      <Button
                        onClick={() => {
                          setView("unstake");
                        }}
                      >
                        Unstake
<<<<<<< HEAD
                      </button>
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
                    </div>
                  </div>

<<<<<<< HEAD
                  <Grid item xs={6} sm={6} lg={4}>
                    <div className="stake-tvl">
                      <h2 className="title">TVL</h2>
                      <h2 className="content">
                        {stakingTVL &&
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)}
                      </h2>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={6} lg={4}>
                    <div className="stake-index">
                      <h2 className="title">Current Index</h2>
                      <h2 className="content">{currentIndex && trim(currentIndex, 1)} OHM</h2>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            {!address ? (
              <div className="stake-wallet-notification">
                <h4>Connect your wallet to Stake OHM</h4>
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
              </div>
            ) : (
              <>
                <Grid item>
                  <div className="stake-toggle-row">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn ${view === "stake" ? "btn-light" : ""}`}
                        onClick={() => {
                          setView("stake");
                        }}
                      >
                        Stake
                      </button>
                      <button
                        type="button"
                        className={`btn ${view === "unstake" ? "btn-light" : ""}`}
                        onClick={() => {
                          setView("unstake");
                        }}
                      >
                        Unstake
                      </button>
=======
                      </Button>
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
                    </div>
=======
=======
                <div className="stake-toggle-row">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setView("stake");
                    }}
                  >
                    Stake
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setView("unstake");
                    }}
=======
=======
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
                <Box className="stake-action-row">
                  <Tabs
                    centered
                    value={view}
                    textColor="primary"
                    indicatorColor="primary"
                    className="stake-tab-buttons"
                    onChange={changeView}
                    aria-label="stake tabs"
>>>>>>> staking view cleaned up, still needs some refactoring but fine for now
                  >
                    <Tab label="Stake" {...a11yProps(0)} />
                    <Tab label="Untake" {...a11yProps(0)} />
                  </Tabs>

                  <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                    <InputLabel htmlFor="amount-input"></InputLabel>
                    <OutlinedInput
                      id="amount-input"
                      type="number"
                      placeholder="Enter an amount"
                      className="stake-input"
                      value={quantity}
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

<<<<<<< HEAD
                  {address && hasAllowance("ohm") && view === "stake" && (
>>>>>>> improved stake page styling
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onChangeStake("stake");
                        pending();
                      }}
                    >
                      Stake OHM
                    </Button>
                  )}

                  {address && hasAllowance("sohm") && view === "unstake" && (
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onChangeStake("unstake");
                      }}
                    >
                      Unstake OHM
                    </Button>
<<<<<<< HEAD
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
                  </div>
=======
                  )}
>>>>>>> improved stake page styling

                  {address && !hasAllowance("ohm") && view === "stake" && (
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onSeekApproval("ohm");
                      }}
                    >
                      Approve Stake
                    </Button>
                  )}

                  {address && !hasAllowance("sohm") && view === "unstake" && (
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onSeekApproval("sohm");
                      }}
                    >
                      Approve Unstake
                    </Button>
                  )}
                </Box>
=======
                  <TabPanel value={view} index={0} className="stake-tab-panel">
                    {address && hasAllowance("ohm") ? (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          onChangeStake("stake");
                        }}
                      >
                        Stake OHM
                      </Button>
                    ) : (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          onSeekApproval("ohm");
                        }}
                      >
                        Approve Stake
                      </Button>
                    )}
                  </TabPanel>

                  <TabPanel value={view} index={1} className="stake-tab-panel">
                    {address && hasAllowance("sohm") ? (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          onChangeStake("unstake");
                        }}
                      >
                        Unstake OHM
                      </Button>
                    ) : (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          onSeekApproval("sohm");
                        }}
                      >
                        Approve Unstake
                      </Button>
                    )}
                  </TabPanel>
>>>>>>> staking view cleaned up, still needs some refactoring but fine for now

                  <div className="help-text">
                    {address && ((!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1)) && (
                      <em>
                        <Typography variant="body2">
                          Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                          subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                          transaction.
                        </Typography>
                      </em>
                    )}
                  </div>
                </Box>

                <div className={`stake-user-data`}>
                  <div className="data-row">
                    <Typography>Your Balance</Typography>
                    <Typography>{trim(ohmBalance)} OHM</Typography>
                  </div>

<<<<<<< HEAD
                    {address && !hasAllowance("sohm") && view === "unstake" && (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          onSeekApproval("sohm");
                        }}
                      >
                        Approve Unstake
                      </Button>
                    )}
                  </Box>

                  <div className="stake-notification">
                    {address &&
                      ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                        <em>
                          <Typography variant="body2">
                            Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                            subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                            transaction.
<<<<<<< HEAD
<<<<<<< HEAD
                          </p>
                        </em>
                      )}
                  </div>
                </Grid>

                <Grid item>
                  <div className={`stake-user-data`}>
                    <div className="stake-price-data-column">
                      <div className="stake-price-data-row">
                        <p className="price-label">Your Balance</p>
                        <p className="price-data">{trim(ohmBalance)} OHM</p>
                      </div>

                      <div className="stake-price-data-row">
                        <p className="price-label">Your Staked Balance</p>
                        <p className="price-data">{trimmedSOHMBalance} sOHM</p>
                      </div>

                      <div className="stake-price-data-row">
                        <p className="price-label">Next Reward Value</p>
                        <p className="price-data">{nextRewardValue} sOHM</p>
                      </div>

                      <div className="stake-price-data-row">
                        <p className="price-label">Next Reward Yield</p>
                        <p className="price-data">{stakingRebasePercentage}%</p>
                      </div>

                      <div className="stake-price-data-row">
=======
                  <Flex className="stake-action-row">
                    <div className="input-group ohm-input-group">
                      <div className="logo-holder">
                        <div className="ohm-logo-bg">
                          <img
                            className="ohm-logo-tiny"
                            src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
                          />
                        </div>
                      </div>
                      <input
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        type="number"
                        className="form-control stake-input"
                        placeholder="Type an amount"
                      />
                      <button type="button" onClick={setMax}>
                        Max
                      </button>
                    </div>

                    {address && hasAllowance("ohm") && view === "stake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          onChangeStake("stake");
                        }}
                      >
                        Stake OHM
                      </div>
                    )}

                    {address && hasAllowance("sohm") && view === "unstake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          onChangeStake("unstake");
                        }}
                      >
                        Unstake OHM
                      </div>
                    )}

                    {address && !hasAllowance("ohm") && view === "stake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          onSeekApproval("ohm");
                        }}
                      >
                        Approve
                        {/* approve stake */}
                      </div>
                    )}

                    {address && !hasAllowance("sohm") && view === "unstake" && (
                      <div
                        className="stake-button"
                        onClick={() => {
                          onSeekApproval("sohm");
                        }}
                      >
                        Approve
                        {/* approve unstake */}
                      </div>
                    )}
                  </Flex>

                  <div className="stake-notification">
                    {address &&
                      ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                        <em>
                          <p>
                            Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                            subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.
=======
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
                          </p>
=======
                          </Typography>
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
                        </em>
                      )}
=======
                  <div className="data-row">
                    <Typography>Your Staked Balance</Typography>
<<<<<<< HEAD
                    <Typography>{trim(sohmBalance, 4)} sOHM</Typography>
>>>>>>> improved stake page styling
=======
                    <Typography>{trimmedSOHMBalance} sOHM</Typography>
                  </div>

                  <div className="data-row">
                    <Typography>Next Reward Amount</Typography>
                    <Typography>{nextRewardValue} sOHM</Typography>
>>>>>>> added reward amount
                  </div>

<<<<<<< HEAD
                <Grid item>
                  <div className={`stake-user-data`}>
                    <div className="stake-price-data-column">
                      <div className="stake-price-data-row">
                        <Typography>Your Balance</Typography>
                        <Typography>{trim(ohmBalance)} OHM</Typography>
                      </div>

                      <div className="stake-price-data-row">
                        <Typography>Your Staked Balance</Typography>
                        <Typography>{trim(sohmBalance, 4)} sOHM</Typography>
                      </div>

                      <div className="stake-price-data-row">
                        <Typography>Reward Yield</Typography>
                        <Typography>{trim(stakingRebase * 100, 4)}%</Typography>
                      </div>

                      <div className="stake-price-data-row">
<<<<<<< HEAD
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
                        <p className="price-label">ROI (5-Day Rate)</p>
                        <p className="price-data">{trim(fiveDayRate * 100, 4)}%</p>
=======
                        <Typography>ROI (5-Day Rate)</Typography>
                        <Typography>{trim(fiveDayRate * 100, 4)}%</Typography>
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
                      </div>
                    </div>
=======
                  <div className="data-row">
<<<<<<< HEAD
                    <Typography>Reward Yield</Typography>
                    <Typography>{trim(stakingRebase * 100, 4)}%</Typography>
>>>>>>> improved stake page styling
=======
                    <Typography>Next Reward Yield</Typography>
                    <Typography>{stakingRebasePercentage}%</Typography>
>>>>>>> added reward amount
                  </div>

                  <div className="data-row">
                    <Typography>ROI (5-Day Rate)</Typography>
                    <Typography>{trim(fiveDayRate * 100, 4)}%</Typography>
                  </div>
                </div>
              </>
            )}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          </Grid>
        </div>
      </Card>

      <Card className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <h5>Farm Pools</h5>
        </div>
        <div className="card-content">
          {!isSmallScreen ? (
            <table className="table table-borderless stake-table">
              <thead>
                <tr>
                  <th scope="col">Asset</th>
                  <th scope="col">APR</th>
                  <th scope="col">TVL</th>
                  <th scope="col">Balance</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Flex className="ohm-pairs mr-2">
                      <div className="ohm-pair ohm-logo-bg" style={{ zIndex: 2 }}>
                        <img src={`${ohmAssetImg()}`} />
                      </div>
                      <div className="ohm-pair" style={{ zIndex: 1 }}>
                        <img src={`${fraxAssetImg()}`} />
                      </div>
                      <p>OHM-FRAX</p>
                    </Flex>
                  </td>
                  <td>{fraxData && trim(fraxData.apy, 1)}%</td>
                  <td>
                    {fraxData &&
                      fraxData.tvl &&
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(fraxData.tvl)}
                  </td>
                  <td>{(fraxData && fraxData.balance) || 0} LP</td>
                  <td>
                    <a
                      role="button"
                      href="https://app.frax.finance/staking#Uniswap_FRAX_OHM"
                      className="stake-lp-button"
                      target="_blank"
                    >
                      Stake on Frax
                      <i className="fa fa-external-link-alt" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="stake-pool">
              <div className="pool-card-top-row">
                <Flex className="ohm-pairs mr-2">
                  <div className="ohm-pair" style={{ zIndex: 2 }}>
                    <div className="ohm-logo-bg">
                      <img src={`${ohmAssetImg()}`} />
                    </div>
                  </div>
                  <div className="ohm-pair" style={{ zIndex: 1 }}>
                    <img src={`${fraxAssetImg()}`} />
                  </div>
                  <p>OHM-FRAX</p>
                </Flex>
                <a
                  role="button"
                  href="https://app.frax.finance/staking#Uniswap_FRAX_OHM"
                  className="stake-lp-button"
                  target="_blank"
                >
                  Stake on Frax
                  <i className="fa fa-external-link-alt" />
                </a>
              </div>
              <div className="pool-data">
                <div className="pool-data-row">
                  <div className="pool-data-label">APR</div>
                  <div className="pool-data-label">{fraxData && trim(fraxData.apy, 1)}%</div>
                </div>
                <div item className="pool-data-row">
                  <div>TVL</div>
                  <div>
                    {fraxData &&
                      fraxData.tvl &&
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(fraxData.tvl)}
                  </div>
                </div>
                <div item className="pool-data-row">
                  <div>Balance</div>
                  <div>{(fraxData && fraxData.balance) || 0} LP</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Grid>
  );
=======
            </Grid>
          </div>
=======
            
          
=======
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
          </Grid>
>>>>>>> updated stake page to use paper and Button components, still need to override hover styles
=======
            </div>
          </Grid>  
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
        </Paper>

        <Paper className={`ohm-card secondary ${isSmallScreen  && "mobile"}`}>
          <div className="card-header">
            <h5>Farm Pools</h5>
=======
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
          </div>
        </Grid>
      </Paper>

      <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
        <div className="card-header">
          <Typography variant="h5">Farm Pools</Typography>
        </div>
        <div className="card-content">
          {!isSmallScreen ? (
            <TableContainer className="stake-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell>APR</TableCell>
                    <TableCell>TVL</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box className="ohm-pairs">
                        <div className="ohm-pair ohm-logo-bg" style={{ zIndex: 2 }}>
                          <img src={`${ohmAssetImg()}`} />
                        </div>
                        <div className="ohm-pair" style={{ zIndex: 1 }}>
                          <img src={`${fraxAssetImg()}`} />
                        </div>
                        <Typography>OHM-FRAX</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{fraxData && trim(fraxData.apy, 1)}%</TableCell>
                    <TableCell>
                      {fraxData &&
                        fraxData.tvl &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        }).format(fraxData.tvl)}
                    </TableCell>
                    <TableCell> {(fraxData && fraxData.balance) || 0} LP </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href="https://app.frax.finance/staking#Uniswap_FRAX_OHM"
                        target="_blank"
                        className="stake-lp-button"
                      >
                        <Typography variant="h6">
                          Stake on FRAX
                          <SvgIcon component={ArrowUp} color="primary" />
                        </Typography>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="stake-pool">
              <div className={`pool-card-top-row ${isMobileScreen && "small"}`}>
                <Box className="ohm-pairs">
                  <div className="ohm-pair" style={{ zIndex: 2 }}>
                    <div className="ohm-logo-bg">
                      <img src={`${ohmAssetImg()}`} />
                    </div>
                  </div>
                  <div className="ohm-pair" style={{ zIndex: 1 }}>
                    <img src={`${fraxAssetImg()}`} />
                  </div>
                  <Typography gutterBottom={false}>OHM-FRAX</Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://app.frax.finance/staking#Uniswap_FRAX_OHM"
                  target="_blank"
                  className="stake-lp-button"
                >
                  <Typography variant="h6">
                    Stake on FRAX
                    <SvgIcon component={ArrowUp} color="primary" />
                  </Typography>
                </Button>
              </div>
              <div className="pool-data">
                <div className="data-row">
                  <Typography>APR</Typography>
                  <Typography>{fraxData && trim(fraxData.apy, 1)}%</Typography>
                </div>
                <div className="data-row">
                  <Typography>TVL</Typography>
                  <Typography>
                    {fraxData &&
                      fraxData.tvl &&
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(fraxData.tvl)}
                  </Typography>
                </div>
                <div className="data-row">
                  <Typography>Balance</Typography>
                  <Typography>{(fraxData && fraxData.balance) || 0} LP</Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  )
>>>>>>> sidebar almost finished, just need to overide link colors and hover styles, stake page started
=======
=======
=======
      </Card>
    </Grid>
>>>>>>> commented out airbnb in eslint
>>>>>>> commented out airbnb in eslint
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
  );
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
}

export default Stake;
