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
import { Skeleton } from "@material-ui/lab";
import { DataRow } from "@olympusdao/component-library";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NetworkId } from "src/constants";
import { useAppSelector } from "src/hooks";
import { IAllBondData } from "src/hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import ConnectButton from "../../components/ConnectButton/ConnectButton";
import { prettifySeconds, secondsUntilBlock, shorten, trim } from "../../helpers";
import useDebounce from "../../hooks/Debounce";
import { bondAsset, calcBondDetails, changeApproval } from "../../slices/BondSlice";
import { error } from "../../slices/MessagesSlice";
import { DisplayBondDiscount } from "./Bond";

interface IBondPurchaseProps {
  readonly bond: IAllBondData;
  readonly slippage: number;
  readonly recipientAddress: string;
}

function BondPurchase({ bond, slippage, recipientAddress }: IBondPurchaseProps) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock || 0;
  });

  const isBondLoading = useAppSelector(state => state.bonding.loading ?? true);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    const vestingTerm = bond.vestingTerm ? bond.vestingTerm.toString() : "0";
    const vestingBlock = parseInt(currentBlock.toString()) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error(t`Please enter a value!`));
    } else if (isNaN(Number(quantity))) {
      dispatch(error(t`Please enter a valid value!`));
    } else if (bond.interestDue > 0 || Number(bond.pendingPayout) > 0) {
      const shouldProceed = window.confirm(
        t`You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?`,
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage: Number(slippage),
            bond,
            networkID: networkId,
            provider,
            address: recipientAddress || address,
          }),
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage: Number(slippage),
          bond,
          networkID: networkId,
          provider,
          address: recipientAddress || address,
        }),
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity("0");
  };

  const hasAllowance = useCallback(() => {
    return bond.allowance > 0;
  }, [bond.allowance]);

  const setMax = () => {
    let maxQ;
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice;
    } else {
      maxQ = bond.balance;
    }
    setQuantity(maxQ.toString());
  };

  const bondDetailsDebounce = useDebounce(quantity, 1000);

  useEffect(() => {
    dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: networkId }));
  }, [bondDetailsDebounce]);

  useEffect(() => {
    let interval = 0;
    if (secondsToRefresh > 0) {
      interval = window.setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      if (bond.getBondability(networkId)) {
        clearInterval(interval);
        dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: networkId }));
        setSecondsToRefresh(SECONDS_TO_REFRESH);
      }
    }
    return () => clearInterval(interval);
  }, [secondsToRefresh, quantity]);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, bond, provider, networkID: networkId }));
  };

  const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = bond.allowance == null;

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
                {!bond.isBondable[networkId as NetworkId] ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    className="transaction-button"
                    disabled={true}
                  >
                    {/* NOTE (appleseed): temporary for ONHOLD MIGRATION */}
                    {/* <Trans>Sold Out</Trans> */}
                    {bond.LOLmessage}
                  </Button>
                ) : hasAllowance() ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
                    onClick={onBond}
                  >
                    {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond (v1)")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-approve-btn"
                    className="transaction-button"
                    disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                    onClick={onSeekApproval}
                  >
                    {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")}
                  </Button>
                )}
              </>
            )}{" "}
          </>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <DataRow
            title={t`Your Balance`}
            balance={`${trim(parseFloat(bond.balance), 4)} ${displayUnits}`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`You Will Get`}
            balance={`${trim(bond.bondQuote, 4) || "0"} ` + `${bond.payoutToken}`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Max You Can Buy`}
            balance={`${trim(bond.maxBondPrice, 4) || "0"} ` + `${bond.payoutToken}`}
            isLoading={isBondLoading}
          />
          {/* DisplayBondDiscount is not an acceptable type */}
          {/* <DataRow
            title={t`ROI`}
            balance={<DisplayBondDiscount key={bond.name} bond={bond} />}
            isLoading={isBondLoading}
          /> */}
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Typography>
              <Trans>ROI</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="80px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
            </Typography>
          </Box>
          <DataRow title={t`Debt Ratio`} balance={`${trim(bond.debtRatio / 10000000, 2)}%`} isLoading={isBondLoading} />
          <DataRow title={t`Vesting Term`} balance={vestingPeriod()} isLoading={isBondLoading} />
          {recipientAddress !== address && (
            <DataRow title={t`Recipient`} balance={shorten(recipientAddress)} isLoading={isBondLoading} />
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
