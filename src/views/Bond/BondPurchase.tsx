import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Typography, FormControl, Box, InputLabel, OutlinedInput, InputAdornment, Button } from "@material-ui/core";
import { shorten, trim, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails, bondAsset } from "../../actions/Bond.actions";
import { BONDS } from "../../constants";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useAppSelector } from "src/hooks";

interface IBondPurchaseProps {
  readonly address: string;
  readonly bond: string;
  readonly provider: StaticJsonRpcProvider | undefined;
  readonly slippage: number;
}

function BondPurchase({ provider, address, bond, slippage }: IBondPurchaseProps) {
  const dispatch = useDispatch();

  const [recipientAddress, setRecipientAddress] = useState(address);
  const [quantity, setQuantity] = useState(0); // TS-REFACTOR-TODO: set initial state to 0

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
  });

  // TS-REFACTOR-TODO: casted as not null for all state.bonding
  const vestingTerm = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].vestingBlock;
  });

  const bondDiscount = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].bondDiscount!; // TS-REFACTOR-TODO: casted as not null
  });
  const maxBondPrice = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].maxBondPrice!; // TS-REFACTOR-TODO: casted as not null
  });
  const interestDue = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].interestDue!; // TS-REFACTOR-TODO: casted as not null
  });
  const pendingPayout = useAppSelector(state => {
    return state.bonding![bond] && Number(state.bonding![bond].pendingPayout!); // TS-REFACTOR-TODO: casted as not null
  });
  const debtRatio = useAppSelector(state => {
    return state.bonding![bond] && (state.bonding![bond].debtRatio! as number); // TS-REFACTOR-TODO: casted as not null
  });
  const bondQuote = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].bondQuote!; // TS-REFACTOR-TODO: casted as not null
  });
  const balance = useAppSelector(state => {
    return state.bonding![bond] && Number(state.bonding![bond].balance!); // TS-REFACTOR-TODO: casted as not null number
  });
  const allowance = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].allowance!; // TS-REFACTOR-TODO: casted as not null
  });

  const hasEnteredAmount = () => {
    return !(isNaN(quantity) || quantity === 0);
  };

  const vestingPeriod = () => {
    // TS-REFACTOR-TODO: we assume vestingTerm is not undefined here
    const vestingBlock = parseInt(currentBlock.toString()) + parseInt(vestingTerm!.toString());
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  async function onBond() {
    console.log("slippage = ", slippage);
    console.log("recipientAddress = ", recipientAddress);

    // TS-REFACTOR-TODO: we check if quantity is 0 instead of "" as Number("") === 0
    if (quantity === 0) {
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
            value: quantity.toString(),
            slippage,
            bond,
            networkID: 1,
            provider: provider!, // TS-REFACTOR-TODO: casting as not null
            address: recipientAddress || address,
          }),
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity.toString(),
          slippage,
          bond,
          networkID: 1,
          provider: provider!, // TS-REFACTOR-TODO: casting as not null
          address: recipientAddress || address,
        }),
      );
    }
  }

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);

  const setMax = () => {
    setQuantity(balance);
  };

  const balanceUnits = () => {
    if (bond.indexOf("_lp") >= 0) return "LP";
    else if (bond === BONDS.dai) return "DAI";
    else return "FRAX";
  };

  async function loadBondDetails() {
    // TS-REFACTOR-TODO: casted as number
    if (provider) await dispatch(calcBondDetails({ bond, value: quantity.toString(), provider, networkID: 1 }));

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

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            type="number"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))} // TS-REFACTOR-TODO: cast as number
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
          <Button variant="contained" color="primary" id="bond-btn" className="transaction-button" onClick={onBond}>
            Bond
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            id="bond-approve-btn"
            className="transaction-button"
            onClick={onSeekApproval}
          >
            Approve
          </Button>
        )}
      </Box>

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

      <div className="data-row">
        <Typography>Your Balance</Typography>
        <Typography>
          {trim(balance, 4)} {balanceUnits()}
        </Typography>
      </div>

      <div className={`data-row`}>
        <Typography>You Will Get</Typography>
        <Typography id="bond-value-id" className="price-data">
          {trim(bondQuote, 4) || ""} OHM
        </Typography>
      </div>

      <div className={`data-row`}>
        <Typography>Max You Can Buy</Typography>
        <Typography id="bond-value-id" className="price-data">
          {trim(maxBondPrice, 4) || ""} OHM
        </Typography>
      </div>

      <div className="data-row">
        <Typography>ROI</Typography>
        <Typography>{trim(bondDiscount * 100, 2)}%</Typography>
      </div>

      <div className="data-row">
        <Typography>Debt Ratio</Typography>
        <Typography>{trim(debtRatio / 10000000, 2)}%</Typography>
      </div>

      <div className="data-row">
        <Typography>Vesting Term</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>

      {recipientAddress !== address && (
        <div className="data-row">
          <Typography>Recipient</Typography>
          <Typography>{shorten(recipientAddress)}</Typography>
        </div>
      )}
    </Box>
  );
}

export default BondPurchase;
