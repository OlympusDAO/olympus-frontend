import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "../../helpers";
import { calcBondDetails, calculateUserBondDetails } from "../../actions/Bond.actions.js";
import { Grid, Backdrop, Paper, Box, Tab, Tabs, Typography } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import BondHeader from "./BondHeader";
import BondRedeemV1 from "./BondRedeemV1";
import BondRedeem from "./BondRedeem";
import BondPurchase from "./BondPurchase";
import "./bond.scss";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Bond({ bond, address, provider }) {
  const dispatch = useDispatch();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const marketPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].marketPrice;
  });
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
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

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <Grid container id="bond-view">
      <Backdrop open={true}>
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="ohm-card ohm-modal">
=======
        <Paper className="ohm-card ohm-modal">
<<<<<<< HEAD
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
          <div className="card-content">
            <BondHeader
              bond={bond}
              slippage={slippage}
              recipientAddress={recipientAddress}
              onSlippageChange={onSlippageChange}
              onRecipientAddressChange={onRecipientAddressChange}
            />

<<<<<<< HEAD
            <div className="bond-price-data-row">
              <div className="bond-price-data">
                <h4>Bond Price</h4>
                <h4 id="bond-price-id" className="price">
                  {trim(bondPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
                </h4>
=======
      <Paper className="ohm-card ohm-modal">
        <div className="card-content">
        <BondHeader
          bond={bond}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onSlippageChange={onSlippageChange}
          onRecipientAddressChange={onRecipientAddressChange}
        />

        <div className="bond-price-data-row">
          <div className="bond-price-data">
            <h4>Bond Price</h4>
            <h4 id="bond-price-id" className="price">
              {trim(bondPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
            </h4>
          </div>
          <div className="bond-price-data">
            <h4>Market Price</h4>
            <h4 id="bond-market-price-id" className="price">
              {trim(marketPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
            </h4>
          </div>
        </div>

        <div className="bond-main-info">
          <div className="swap-input-column">
              <div className="stake-toggle-row">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${view === "bond" ? "btn-light" : ""}`}
=======
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
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
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
<<<<<<< HEAD
                  </button>
                  {bond !== 'frax' && <button
                    type="button"
                    className={`btn ${view === "redeem_v1" ? "btn-light" : ""}`}
                    onClick={() => {
                      setView("redeem_v1");
                    }}
                  >
                    Redeem v1.0
                  </button>}
                </div>
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
              </div>
              <div className="bond-price-data">
                <h4>Market Price</h4>
                <h4 id="bond-market-price-id" className="price">
                  {trim(marketPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
                </h4>
              </div>
            </div>

            <div className="bond-main-info">
              <div className="swap-input-column">
                <div className="stake-toggle-row">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${view === "bond" ? "btn-light" : ""}`}
                      onClick={() => {
                        setView("bond");
                      }}
                    >
                      Bond
                    </button>
                    <button
                      type="button"
                      className={`btn ${view === "redeem" ? "btn-light" : ""}`}
                      onClick={() => {
                        setView("redeem");
                      }}
                    >
                      Redeem
                    </button>
                    {bond !== "frax" && (
                      <button
                        type="button"
                        className={`btn ${view === "redeem_v1" ? "btn-light" : ""}`}
                        onClick={() => {
                          setView("redeem_v1");
                        }}
                      >
                        Redeem v1.0
                      </button>
                    )}
                  </div>
                </div>

                {view === "redeem_v1" ? (
                  <BondRedeemV1 provider={provider} address={address} bond={bond + "_v1"} />
                ) : (
                  <>
                    <div className="input-row">
                      {view === "bond" && (
                        <div className="input-group ohm-input-group">
                          <input
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            type="number"
                            className="form-control"
                            placeholder="Type an amount"
                          />

                          <button className="btn" type="button" onClick={setMax}>
                            Max
                          </button>
                        </div>
                      )}

                      {view === "redeem" && (
                        <div
                          id="bond-claim-btn"
                          className="transaction-button stake-button"
                          onClick={() => {
                            onRedeem({ autostake: false });
                          }}
                        >
                          Claim
                        </div>
                      )}

                      {view === "redeem" && (
                        <div
                          id="bond-claim-autostake-btn"
                          className="transaction-button stake-button"
                          onClick={() => {
                            onRedeem({ autostake: true });
                          }}
                        >
                          Claim and Autostake
                        </div>
                      )}

                      {hasAllowance() && view === "bond" && (
                        <div id="bond-btn" className="transaction-button stake-button" onClick={onBond}>
                          Bond
                        </div>
                      )}

                      {!hasAllowance() && view === "bond" && (
                        <div id="bond-approve-btn" className="transaction-button stake-button" onClick={onSeekApproval}>
                          Approve
                        </div>
=======
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
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
                      )}

                      {!hasAllowance() && view === "bond" && (
                        <div className="stake-notification">
                          <em>
<<<<<<< HEAD
                            <p>
                              Note: The "Approve" transaction is only needed when bonding for the first time; subsequent
                              bonding only requires you to perform the "Bond" transaction.
                            </p>
=======
                            <Typography variant="body2">
                              Note: The "Approve" transaction is only needed when bonding for the first time; subsequent
                              bonding only requires you to perform the "Bond" transaction.
                            </Typography>
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
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
<<<<<<< HEAD
        </div>
<<<<<<< HEAD
=======
      </Paper>
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
=======
=======
          <BondHeader
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
            onSlippageChange={onSlippageChange}
            onRecipientAddressChange={onRecipientAddressChange}
          />

          <Box direction="row" className="bond-price-data-row">
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Bond Price
              </Typography>
              <Typography variant="h3" className="price" color="textSecondary">
                {trim(bondPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
              </Typography>
            </div>
            <div className="bond-price-data">
              <Typography variant="h5" color="textSecondary">
                Market Price
              </Typography>
              <Typography variant="h3" color="textSecondary" className="price">
                {trim(marketPrice, 2)} {bond.indexOf("frax") >= 0 ? "FRAX" : "DAI"}
              </Typography>
            </div>
          </Box>

          <Tabs
            centered
            value={view}
            textColor="primary"
            indicatorColor="primary"
            onChange={changeView}
            aria-label="bond tabs"
          >
            <Tab label="Bond" {...a11yProps(0)} />
            <Tab label="Redeem" {...a11yProps(1)} />
            <Tab label="Redeem v1" {...a11yProps(2)} disabled />
          </Tabs>

          <TabPanel value={view} index={0}>
            <BondPurchase provider={provider} address={address} bond={bond} slippage={slippage} />
          </TabPanel>
          <TabPanel value={view} index={1}>
            <BondRedeem provider={provider} address={address} bond={bond} />
          </TabPanel>
          <TabPanel value={view} index={2}>
            <BondRedeemV1 provider={provider} address={address} bond={bond + "_v1"} />
          </TabPanel>
>>>>>>> refactored bond views
        </Paper>
>>>>>>> fixed topbar, stake mobile buttons, bond view, bond modal
      </Backdrop>
    </Grid>
  );
}

export default Bond;
