import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { shorten, trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import {
  changeApproval,
  calcBondDetails,
  calculateUserBondDetails,
  bondAsset,
  redeemBond,
} from "../../actions/Bond.actions.js";
import {
  Grid,
  Backdrop,
  Paper,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
  OutlinedInput,
} from "@material-ui/core";
import BondHeader from "./BondHeader";
import BondRedeemV1 from "./BondRedeemV1";
import { BONDS } from "../../constants";
import "./bond.scss";

function Bond({ bond, address, provider }) {
  const dispatch = useDispatch();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState("bond");
  const [quantity, setQuantity] = useState();

  const ohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.app.balances && state.app.balances.sohm;
  });

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const bondMaturationBlock = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondMaturationBlock;
  });

  const vestingTerm = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].vestingBlock;
  });
  const marketPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].marketPrice;
  });
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const maxBondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].maxBondPrice;
  });
  const interestDue = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].interestDue;
  });
  const pendingPayout = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].pendingPayout;
  });
  const debtRatio = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });
  const bondQuote = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondQuote;
  });
  const balance = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].balance;
  });
  const allowance = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].allowance;
  });

  const hasEnteredAmount = () => {
    return !(isNaN(quantity) || quantity === 0 || quantity === "");
  };

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake }));
  }

  async function onBond() {
    console.log("slippage = ", slippage);
    console.log("recipientAddress = ", recipientAddress);

    if (quantity === "") {
      alert("Please enter a value!");
    } else if (isNaN(quantity)) {
      alert("Please enter a valid value!");
    } else if (interestDue > 0 || pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?",
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: 1,
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
          networkID: 1,
          provider,
          address: recipientAddress || address,
        }),
      );
    }
  }

  const setMax = () => {
    setQuantity(balance.toString());
  };

  const balanceUnits = () => {
    if (bond.indexOf("_lp") >= 0) return "LP";
    else if (bond === BONDS.dai) return "DAI";
  };

  async function loadBondDetails() {
    if (provider) await dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: 1 }));

    if (provider && address) {
      await dispatch(calculateUserBondDetails({ address, bond, provider, networkID: 1 }));
    }
  }

  useEffect(() => {
    loadBondDetails();
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ address, bond, provider, networkID: 1 }));
  };

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);

  return (
    <Grid container id="bond-view">
      <Backdrop open={true}>
        <Paper className="ohm-card ohm-modal">
          <div className="card-content">
            <BondHeader
              bond={bond}
              slippage={slippage}
              recipientAddress={recipientAddress}
              onSlippageChange={onSlippageChange}
              onRecipientAddressChange={onRecipientAddressChange}
            />

            <Box direction="row" className="bond-price-data-row">
              <div className="bond-price-data">
                <Typography variant="h4">Bond Price</Typography>
                <Typography variant="h3" id="bond-price-id" className="price">
                  {trim(bondPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
                </Typography>
              </div>
              <div className="bond-price-data">
                <Typography variant="h4">Market Price</Typography>
                <Typography variant="h3" id="bond-market-price-id" className="price">
                  {trim(marketPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
                </Typography>
              </div>
            </Box>

            <div className="bond-main-info">
              <div className="swap-input-column">
                <div className="bond-toggle-row">
                  <Button
                    variant="text"
                    color="primary"
                    className={`${view === "bond" ? "active" : ""}`}
                    onClick={() => {
                      setView("bond");
                    }}
                  >
                    Bond
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    className={`${view === "redeem" ? "active" : ""}`}
                    onClick={() => {
                      setView("redeem");
                    }}
                  >
                    Redeem
                  </Button>
                  {bond !== "frax" && (
                    <Button
                      variant="text"
                      color="primary"
                      className={`${view === "redeem_v1" ? "active" : ""}`}
                      onClick={() => {
                        setView("redeem_v1");
                      }}
                    >
                      Redeem v1.0
                    </Button>
                  )}
                </div>

                {view === "redeem_v1" ? (
                  <BondRedeemV1 provider={provider} address={address} bond={bond + "_v1"} />
                ) : (
                  <>
                    <div className="input-row">
                      {view === "bond" && (
                        <FormControl className="ohm-input-group" variant="outlined" color="primary">
                          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            labelWidth={70}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button variant="text" onClick={setMax}>
                                  Max
                                </Button>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      )}

                      {view === "redeem" && (
                        <Button
                          variant="contained"
                          color="primary"
                          id="bond-claim-btn"
                          className="transaction-button stake-button"
                          onClick={() => {
                            onRedeem({ autostake: false });
                          }}
                        >
                          Claim
                        </Button>
                      )}

                      {view === "redeem" && (
                        <Button
                          variant="contained"
                          color="primary"
                          id="bond-claim-autostake-btn"
                          className="transaction-button stake-button"
                          onClick={() => {
                            onRedeem({ autostake: true });
                          }}
                        >
                          Claim and Autostake
                        </Button>
                      )}

                      {hasAllowance() && view === "bond" && (
                        <Button
                          variant="contained"
                          color="primary"
                          id="bond-btn"
                          className="transaction-button stake-button"
                          onClick={onBond}
                        >
                          Bond
                        </Button>
                      )}

                      {!hasAllowance() && view === "bond" && (
                        <Button
                          variant="contained"
                          color="primary"
                          id="bond-approve-btn"
                          className="transaction-button stake-button"
                          onClick={onSeekApproval}
                        >
                          Approve
                        </Button>
                      )}

                      {!hasAllowance() && view === "bond" && (
                        <div className="stake-notification">
                          <em>
                            <Typography variant="body2">
                              Note: The "Approve" transaction is only needed when bonding for the first time; subsequent
                              bonding only requires you to perform the "Bond" transaction.
                            </Typography>
                          </em>
                        </div>
                      )}
                    </div>

                    <div className="stake-price-data-column">
                      {view === "bond" && (
                        <>
                          <div className="stake-price-data-row">
                            <p className="price-label">Your Balance</p>
                            <p className="price-data">
                              {trim(balance, 4)} {balanceUnits()}
                            </p>
                          </div>

                          <div className={`stake-price-data-row ${hasEnteredAmount() ? "" : "d-none"}`}>
                            <p className="price-label">You Will Get</p>
                            <p id="bond-value-id" className="price-data">
                              {trim(bondQuote, 4)} OHM
                            </p>
                          </div>

                          <div className={`stake-price-data-row ${hasEnteredAmount() ? "" : "d-none"}`}>
                            <p className="price-label">Max You Can Buy</p>
                            <p id="bond-value-id" className="price-data">
                              {trim(maxBondPrice, 4)} OHM
                            </p>
                          </div>
                        </>
                      )}

                      {view === "redeem" && (
                        <>
                          <div className="stake-price-data-row">
                            <p className="price-label">Pending Rewards</p>
                            <p id="bond-market-price-id" className="price-data">
                              {trim(interestDue, 4)} OHM
                            </p>
                          </div>
                          <div className="stake-price-data-row">
                            <p className="price-label">Claimable Rewards</p>
                            <p id="bond-market-price-id" className="price-data">
                              {trim(pendingPayout, 4)} OHM
                            </p>
                          </div>
                          <div className="stake-price-data-row">
                            <p className="price-label">Time until fully vested</p>
                            <p id="bond-market-price-id" className="price-data">
                              {vestingTime()}
                            </p>
                          </div>
                        </>
                      )}

                      {(view === "bond" || view === "redeem") && (
                        <>
                          <div className="stake-price-data-row">
                            <div className="stake-price-data-column">
                              <p>ROI</p>
                            </div>
                            <div className="stake-price-data-column">
                              <p>{trim(bondDiscount * 100, 2)}%</p>
                            </div>
                          </div>

                          <div className="stake-price-data-row">
                            <div className="stake-price-data-column">
                              <p>Debt Ratio</p>
                            </div>
                            <div className="stake-price-data-column">
                              <p>{trim(debtRatio / 10000000, 2)}%</p>
                            </div>
                          </div>

                          <div className="stake-price-data-row">
                            <div className="stake-price-data-column">
                              <p>Vesting Term</p>
                            </div>
                            <div className="stake-price-data-column">
                              <p>{vestingPeriod()}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* {view === "bond" && (
                  <div className="stake-price-data-column">
                    <div className="stake-price-data-row">
                      <p className="price-label">Slippage Tolerance</p>
                      <p id="bond-value-id" className="price-data">
                        {slippage}%
                      </p>
                    </div>
                  </div>
                )} */}

                      {view === "bond" && recipientAddress !== address && (
                        <div className="stake-price-data-row">
                          <p className="price-label">Recipient</p>
                          <p className="price-data">{shorten(recipientAddress)}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </Backdrop>
    </Grid>
  );
}

export default Bond;
