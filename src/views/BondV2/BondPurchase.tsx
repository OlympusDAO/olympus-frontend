import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { t, Trans } from "@lingui/macro";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Typography,
} from "@material-ui/core";
import { prettifySeconds, secondsUntilBlock, shorten, trim } from "../../helpers";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import useDebounce from "../../hooks/Debounce";
import { error } from "../../slices/MessagesSlice";
import { DisplayBondDiscount } from "./BondV2";
import ConnectButton from "../../components/ConnectButton";
import { useAppSelector } from "src/hooks";
import { changeApproval, getSingleBond, IBondV2, purchaseBond } from "src/slices/BondSliceV2";

function BondPurchase({
  bond,
  slippage,
  recipientAddress,
}: {
  bond: IBondV2;
  slippage: number;
  recipientAddress: string;
}) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const isBondLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  const balance = useAppSelector(state => state.bondingV2.balances[bond.quoteToken]);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  async function onBond() {
    if (quantity === "") {
      dispatch(error(t`Please enter a value!`));
    } else {
      await dispatch(
        purchaseBond({
          amount: Number(quantity),
          networkID: networkId,
          provider,
          bond,
          maxPrice: 0,
          address: recipientAddress || address,
        }),
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity("");
  };

  const hasAllowance = useCallback(() => {
    return +balance.allowance > 0;
  }, [balance]);

  const setMax = () => {
    let maxQ;
    // if (bond.maxBondPrice * bond.bondPrice < Number(bond.capacity)) {
    //   // there is precision loss here on Number(bond.balance)
    //   maxQ = bond.maxBondPrice * bond.bondPrice.toString();
    // } else {
    maxQ = balance.balance;
    // }
    setQuantity(maxQ.toString());
  };

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      dispatch(getSingleBond({ bond, address, networkID: networkId, provider }));
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval!);
  }, [secondsToRefresh, quantity]);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, provider, networkID: networkId, bond }));
  };

  // const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = useAppSelector(state => state.bondingV2.balanceLoading);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            {isAllowanceDataLoading ? (
              <Skeleton width="200px" />
            ) : (
              <>
                {!hasAllowance() ? (
                  <div className="help-text">
                    <em>
                      <Typography variant="body1" align="center" color="textSecondary">
                        <Trans>First time bonding</Trans> <b>{bond.displayName}</b>? <br />{" "}
                        <Trans>Please approve Olympus Dao to use your</Trans> <b>{bond.displayName}</b>{" "}
                        <Trans>for bonding</Trans>.
                      </Typography>
                    </em>
                  </div>
                ) : (
                  <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-amount">
                      <Trans>Amount</Trans>
                    </InputLabel>
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
                            <Trans>Max</Trans>
                          </Button>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}
                {hasAllowance() ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, "bond_" + bond.displayName)}
                    onClick={onBond}
                  >
                    {txnButtonText(pendingTransactions, "bond_" + bond.displayName, "Bond")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-approve-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, `approve_${bond.displayName}_bonding`)}
                    onClick={onSeekApproval}
                  >
                    {txnButtonText(pendingTransactions, `approve_${bond.displayName}_bonding`, "Approve")}
                  </Button>
                )}
              </>
            )}{" "}
          </>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>
              <Trans>Your Balance</Trans>
            </Typography>{" "}
            <Typography id="bond-balance">
              {isBondLoading ? <Skeleton width="100px" /> : <>{trim(+balance?.balance, 4)}</>}
            </Typography>
          </div>

          {/* <div className={`data-row`}>
            <Typography>
              <Trans>You Will Get</Trans>
            </Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                `${trim(bond.bondQuote, 4) || "0"} ` + `${bond.payoutToken}`
              )}
            </Typography>
          </div> */}

          {/* <div className={`data-row`}>
            <Typography>
              <Trans>Max You Can Buy</Trans>
            </Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                `${trim(bond.maxBondPrice, 4) || "0"} ` + `${bond.payoutToken}`
              )}
            </Typography>
          </div> */}

          <div className="data-row">
            <Typography>
              <Trans>ROI</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : <DisplayBondDiscount key={bond.displayName} bond={bond} />}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>
              <Trans>Vesting Term</Trans>
            </Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : bond.duration}</Typography>
          </div>

          {recipientAddress !== address && (
            <div className="data-row">
              <Typography>
                <Trans>Recipient</Trans>{" "}
              </Typography>
              <Typography>{isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}</Typography>
            </div>
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
