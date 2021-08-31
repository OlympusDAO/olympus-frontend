import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  FormControl,
  Box,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Fade,
  Slide,
} from "@material-ui/core";
import { shorten, trim, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { changeApproval, bondAsset } from "../../slices/BondSlice";
import { BONDS } from "../../constants";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";

function BondPurchase({ bond, slippage }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [recipientAddress, setRecipientAddress] = useState(address);
  const [quantity, setQuantity] = useState("");

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);
  const vestingTerm = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].vestingBlock;
  });

  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const maxBondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].maxBondPrice;
  });
  const interestDue = useSelector(state => {
    return state.account[bond] && state.account[bond].interestDue;
  });
  const pendingPayout = useSelector(state => {
    return state.account[bond] && state.account[bond].pendingPayout;
  });
  const debtRatio = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });
  const bondQuote = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondQuote;
  });
  const balance = useSelector(state => {
    return state.account[bond] && state.account[bond].balance;
  });
  const allowance = useSelector(state => {
    return state.account[bond] && state.account[bond].allowance;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const hasEnteredAmount = () => {
    return !(isNaN(quantity) || quantity === 0 || quantity === "");
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  async function onBond() {
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
    }
  }

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);

  const setMax = () => {
    setQuantity((balance || "").toString());
  };

  const balanceUnits = () => {
    if (bond.indexOf("_lp") >= 0) return "LP";
    else if (bond === BONDS.dai) return "DAI";
    else if (bond === BONDS.eth) return "wETH";
    else return "FRAX";
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
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
        {hasAllowance() ? (
          <Button
            variant="contained"
            color="primary"
            id="bond-btn"
            className="transaction-button"
            disabled={isPendingTxn(pendingTransactions, "bond_" + bond)}
            onClick={onBond}
          >
            {txnButtonText(pendingTransactions, "bond_" + bond, "Bond")}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            id="bond-approve-btn"
            className="transaction-button"
            disabled={isPendingTxn(pendingTransactions, "approve_" + bond)}
            onClick={onSeekApproval}
          >
            {txnButtonText(pendingTransactions, "approve_" + bond, "Approve")}
          </Button>
        )}

        {!hasAllowance() && (
          <div className="help-text">
            <em>
              <Typography variant="body2">
                Note: The "Approve" transaction is only needed when bonding for the first time; subsequent bonding only
                requires you to perform the "Bond" transaction.
              </Typography>
            </em>
          </div>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>Your Balance</Typography>
            <Typography>
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                <>
                  {trim(balance, 4)} {balanceUnits()}
                </>
              )}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>You Will Get</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondQuote, 4) || "0"} OHM`}
            </Typography>
          </div>

          <div className={`data-row`}>
            <Typography>Max You Can Buy</Typography>
            <Typography id="bond-value-id" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(maxBondPrice, 4) || "0"} OHM`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>ROI</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}</Typography>
          </div>

          <div className="data-row">
            <Typography>Debt Ratio</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}</Typography>
          </div>

          <div className="data-row">
            <Typography>Vesting Term</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
          </div>

          {recipientAddress !== address && (
            <div className="data-row">
              <Typography>Recipient</Typography>
              <Typography>{isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}</Typography>
            </div>
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
