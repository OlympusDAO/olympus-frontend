import { useCallback, useEffect, useMemo, useState } from "react";
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
import { changeApproval, getSingleBond, IBondV2, IBondV2Balance, purchaseBond } from "src/slices/BondSliceV2";
import { BigNumber, ethers } from "ethers";
import { AppDispatch } from "src/store";

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
  const dispatch = useDispatch<AppDispatch>();
  const { provider, address, networkId } = useWeb3Context();
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex ?? "1";
  });

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const isBondLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  const balance = useAppSelector(state => state.bondingV2.balances[bond.quoteToken]);

  const balanceNumber: number = useMemo(
    () => (balance ? +balance.balance / Math.pow(10, bond.quoteDecimals) : 0),
    [balance],
  );

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  async function onBond() {
    if (quantity === "") {
      dispatch(error(t`Please enter a value!`));
    } else {
      dispatch(
        purchaseBond({
          amount: ethers.utils.parseUnits(quantity, bond.quoteDecimals),
          networkID: networkId,
          provider,
          bond,
          maxPrice: Math.round(Number(bond.priceTokenBigNumber.toString()) * (1 + slippage / 100)),
          address: recipientAddress,
        }),
      ).then(() => clearInput());
    }
  }

  const clearInput = () => {
    setQuantity("");
  };

  const hasAllowance = useCallback(() => {
    return +balance?.allowance > 0;
  }, [balance]);

  const setMax = () => {
    let maxQ;
    const maxPayout = (bond.priceToken * +bond.maxPayout) / Math.pow(10, 9);
    if (balanceNumber > maxPayout) {
      maxQ = maxPayout * 0.999;
    } else {
      maxQ = balanceNumber;
    }
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
      dispatch(getSingleBond({ bondIndex: bond.index, address, networkID: networkId, provider }));
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
                {balance ? (
                  hasAllowance() ? (
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
                  )
                ) : (
                  <Skeleton width="300px" height={40} />
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
              {isBondLoading ? <Skeleton width="100px" /> : <>{`${trim(balanceNumber, 4)} ${bond.displayName}`}</>}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>
              <Trans>You Will Get</Trans>
            </Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                `${trim(Number(quantity) / bond.priceToken, 4) || "0"} ` +
                `sOHM (≈${trim(+quantity / bond.priceToken / +currentIndex, 4) || "0"} gOHM)`
              )}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>
              <Trans>Max You Can Buy</Trans>
            </Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(+bond.maxPayout / 10 ** 9, 1) || "0"} ` + `sOHM`}
            </Typography>
          </div>

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
              <Trans>Duration</Trans>
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
      <div className="help-text">
        <em>
          <Typography variant="body2">
            Important: New bonds are auto-staked and no longer vest linearly. Simply claim as sOHM or gOHM at the end of
            the term.
          </Typography>
        </em>
      </div>
    </Box>
  );
}

export default BondPurchase;
