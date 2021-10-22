import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ConnectButton from "../../components/ConnectButton.jsx";
import { useWeb3Context } from "../../hooks";
import { getTokenImage } from "src/helpers/index";
import { trim } from "src/helpers";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { getEarlyExitFee, poolWithdraw } from "../../slices/PoolThunk";
import { calculateOdds } from "../../helpers/33Together";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { error } from "../../slices/MessagesSlice";

const sohmImg = getTokenImage("sohm");

export const PoolWithdraw = props => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState(0);
  const [exitFee, setExitFee] = useState(0);
  const [newOdds, setNewOdds] = useState(0);
  const isPoolLoading = useSelector(state => state.poolData.loading);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const poolBalance = useSelector(state => {
    return state.account.balances && parseFloat(state.account.balances.pool);
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const poolIsLocked = useSelector(state => {
    return state.poolData && state.poolData.isRngRequested;
  });

  const setMax = () => {
    setQuantity(poolBalance);
  };

  const onWithdraw = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      dispatch(error("Please enter a value!"));
    } else {
      await dispatch(poolWithdraw({ action, value: quantity.toString(), provider, address, networkID: chainID }));
    }
  };

  // go fetch the Exit Fee from the contract
  const calcEarlyExitFee = async () => {
    const result = await dispatch(
      getEarlyExitFee({ value: quantity.toString(), provider, address, networkID: chainID }),
    );
    if (result.payload) {
      let userBalanceAfterWithdraw = poolBalance - quantity;
      let userOdds = calculateOdds(userBalanceAfterWithdraw, props.totalPoolDeposits, props.winners);
      setNewOdds(trim(userOdds, 4));
      setExitFee(result.payload.withdraw.stringExitFee);
    } else {
      dispatch(error(result.error.message));
      setExitFee(0);
    }
  };

  useEffect(() => {
    // when user types quantity display a warning with their early exit fee
    if (quantity > 0 && quantity <= poolBalance) {
      calcEarlyExitFee();
    } else if (quantity > poolBalance) {
      dispatch(error("You cannot withdraw more than your pool balance"));
      setExitFee(0);
    }
  }, [quantity]);

  useEffect(() => {
    props.setInfoTooltipMessage([
      "You can choose to withdraw the deposited fund at any time. By withdrawing the fund, you are eliminating reducing the chance to win the prize in this pool in future prize periods",
    ]);
  }, []);

  if (poolIsLocked) {
    return (
      <Box display="flex" alignItems="center" className="pool-deposit-ui" flexDirection="column">
        {/*<img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />*/}
        <Typography variant="h6">This Prize Pool is unable to accept withdrawals at this time.</Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          Withdrawals can be made once the prize has been awarded.
        </Typography>
        <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
          Check back soon!
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" className="pool-deposit-ui">
      {!address ? (
        <ConnectButton />
      ) : (
        <Box className="withdrawal-container">
          <Box display="flex" alignItems="center" flexDirection={`${isMobileScreen ? "column" : "row"}`}>
            <FormControl className="ohm-input" variant="outlined" color="primary">
              <InputLabel htmlFor="amount-input"></InputLabel>
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder="Enter an amount"
                className="pool-input"
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    <div className="logo-holder">{sohmImg}</div>
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
            <Button
              className="pool-withdraw-button"
              variant="contained"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, "pool_withdraw")}
              onClick={() => onWithdraw("withdraw")}
            >
              {exitFee > 0
                ? txnButtonText(pendingTransactions, "pool_withdraw", "Withdraw Early & pay " + exitFee + " sOHM")
                : txnButtonText(pendingTransactions, "pool_withdraw", "Withdraw sOHM")}
              {/* Withdraw sOHM */}
            </Button>
          </Box>
          {newOdds > 0 && quantity > 0 && (
            <Box padding={1}>
              <Typography color="error" variant="body2">
                Withdrawing {quantity} sOHM reduces your odds of winning to 1 in {newOdds}&nbsp;
              </Typography>
            </Box>
          )}
          {exitFee > 0 && (
            <Box margin={1}>
              <Typography color="error">
                Early withdraw will incur a fairness fee of {exitFee}. &nbsp;
                <Link
                  href="https://v3.docs.pooltogether.com/protocol/prize-pool/fairness"
                  target="_blank"
                  rel="noreferrer"
                  color="primary"
                >
                  <br />
                  Read more about Fairness{" "}
                  <SvgIcon component={ArrowUp} style={{ fontSize: "1rem", verticalAlign: "middle" }} />
                </Link>
              </Typography>
            </Box>
          )}

          {/* NOTE (Appleseed): added this bc I kept losing track of which accounts I had sOHM in during testing */}
          <div className={`stake-user-data`}>
            <div className="data-row">
              <Typography variant="body1" align="left">
                Your Pooled Balance (withdrawable)
              </Typography>
              <Typography variant="body1" align="right">
                {isPoolLoading ? (
                  <Skeleton width="80px" />
                ) : (
                  <>{new Intl.NumberFormat("en-US").format(poolBalance)} 33T</>
                )}
              </Typography>
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};

PoolWithdraw.propTypes = {
  totalPoolDeposits: PropTypes.number,
  winners: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setInfoTooltipMessage: PropTypes.func,
};
