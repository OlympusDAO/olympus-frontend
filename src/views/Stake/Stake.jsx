import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Flex, Card } from "rimble-ui";
import { Grid } from "@material-ui/core";
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
import { useWeb3Context } from "src/hooks/Web3Context";

function Stake() {
  const { address, provider, connect } = useWeb3Context();

  const dispatch = useDispatch();

  const [view, setView] = useState("stake");
  const [quantity, setQuantity] = useState();
  const [migrationWizardOpen, setMigrationWizardOpen] = useState(false);

  const isSmallScreen = useMediaQuery("(max-width: 1125px)");
  const isMediumScreen = useMediaQuery("(min-width: 1279px, max-width: 1500px)");
  const isNarrowScreen = useMediaQuery("(max-width:460px)");

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

  const openMigrationWizard = () => {
    setMigrationWizardOpen(true);
  };

  const closeMigrationWizard = () => {
    setMigrationWizardOpen(false);
  };

  const trimmedSOHMBalance = trim(sohmBalance, 4);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedSOHMBalance, 4);

  // TODO: the two grids need `container` props to justify.
  return (
    <Grid id="stake-view" direction="row" justify="center">
      {/* <Grid item sm={8} lg={6}> */}
      <Card className={`ohm-card primary ${isSmallScreen && "mobile"} ${isMediumScreen && "med"}`}>
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
                    </div>
                  </Grid>

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
                  <button type="button" className="btn stake-button btn-overwrite-primer m-2" onClick={connect} key={2}>
                    Connect Wallet
                  </button>
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
                    </div>
                  </div>

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
                            subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                            transaction.
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
                        <p className="price-label">ROI (5-Day Rate)</p>
                        <p className="price-data">{trim(fiveDayRate * 100, 4)}%</p>
                      </div>
                    </div>
                  </div>
                </Grid>
              </>
            )}
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
}

export default Stake;
