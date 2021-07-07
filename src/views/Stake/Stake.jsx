import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
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
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "../../actions/Stake.actions";
import { getFraxData } from "../../actions/App.actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../../style.scss";
import "./stake.scss";
import { NavLink } from "react-router-dom";

function Stake({ provider, address, web3Modal, loadWeb3Modal }) {
  const dispatch = useDispatch();

  const [view, setView] = useState("stake");
  const [quantity, setQuantity] = useState();
  const [migrationWizardOpen, setMigrationWizardOpen] = useState(false);

  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

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

  useEffect(() => {
    loadFraxData();
  }, []);

  let modalButton = [];

  if (web3Modal) {
    modalButton.push(
      <Button variant="contained" color="primary" onClick={loadWeb3Modal} key={2}>
        Connect Wallet
      </Button>,
    );
  }

  const openMigrationWizard = () => {
    setMigrationWizardOpen(true);
  };

  return (
    <div id="stake-view">
      <Paper className={`ohm-card`}>
        <Grid container direction="column" justify="center" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Single Stake (3, 3)</Typography>
              <RebaseTimer />

              {address && oldSohmBalance > 0.01 && (
                <div
                  className="migrate-sohm-button"
                  role="button"
                  aria-label="migrate-sohm"
                  onClick={openMigrationWizard}
                >
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
          </Grid>

          <Grid item>
            <div className="stake-top-metrics">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} lg={4}>
                  <div className="olympus-sushi">
                    <div>
                      <img
                        className="olympus-logo"
                        src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
                      />
                      <Typography variant="h4">Olympus</Typography>
                    </div>
                    <div>
                      <Link
                        color="textPrimary"
                        href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899"
                        target="_blank"
                      >
                        Buy on Sushiswap
                      </Link>
                      <i className="fa fa-external-link-alt" />
                    </div>
                  </div>
                </Grid>

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
                <Grid item>
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
                    >
                      Unstake
                    </Button>
                  </div>

                  <Box className="stake-action-row">
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
                      <Button onClick={setMax}>Max</Button>
                    </div>

                    {address && hasAllowance("ohm") && view === "stake" && (
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
                    )}

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

                  <div className="stake-notification">
                    {address &&
                      ((!hasAllowance("ohm") && view === "stake") || (!hasAllowance("sohm") && view === "unstake")) && (
                        <em>
                          <Typography variant="body2">
                            Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                            subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                            transaction.
                          </Typography>
                        </em>
                      )}
                  </div>
                </Grid>

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
                        <Typography>ROI (5-Day Rate)</Typography>
                        <Typography>{trim(fiveDayRate * 100, 4)}%</Typography>
                      </div>
                    </div>
                  </div>
                </Grid>
              </>
            )}
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
                          <i className="fa fa-external-link-alt" />
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
                    <i className="fa fa-external-link-alt" />
                  </Typography>
                </Button>
              </div>
              <div className="pool-data">
                <div className="pool-data-row">
                  <Typography>APR</Typography>
                  <Typography>{fraxData && trim(fraxData.apy, 1)}%</Typography>
                </div>
                <div className="pool-data-row">
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
                <div className="pool-data-row">
                  <Typography>Balance</Typography>
                  <Typography>{(fraxData && fraxData.balance) || 0} LP</Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default Stake;
