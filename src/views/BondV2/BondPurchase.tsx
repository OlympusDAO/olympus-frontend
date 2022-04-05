import { t, Trans } from "@lingui/macro";
import { Box, FormControl, Slide, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow, Input, PrimaryButton } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { changeApproval, getSingleBond, IBondV2, purchaseBond } from "src/slices/BondSliceV2";
import { changeInverseApproval, purchaseInverseBond } from "src/slices/InverseBondSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { AppDispatch } from "src/store";

import ConnectButton from "../../components/ConnectButton/ConnectButton";
import { shorten, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { DisplayBondDiscount } from "./BondV2";

function BondPurchase({
  bond,
  slippage,
  recipientAddress,
  inverseBond,
}: {
  bond: IBondV2;
  slippage: number;
  recipientAddress: string;
  inverseBond: boolean;
}) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch<AppDispatch>();
  const { provider, address, networkId } = useWeb3Context();
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex ?? "1";
  });

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const helpText = inverseBond
    ? t`Important: Inverse Bonds have 0 vesting time & payout instantly.`
    : t`Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim as sOHM or gOHM at the end of the term.`;

  const isBondLoading = useAppSelector(state => {
    if (inverseBond) {
      return state.inverseBonds.loading ?? true;
    } else {
      return state.bondingV2.loading ?? true;
    }
  });

  // const balance = useAppSelector(state => state.bondingV2.balances[bond.quoteToken]);
  const balance = useAppSelector(state => {
    if (inverseBond) {
      return state.inverseBonds.balances[bond.quoteToken];
    } else {
      return state.bondingV2.balances[bond.quoteToken];
    }
  });
  const maxBondable = +bond.maxPayoutOrCapacityInQuote;

  const balanceNumber: number = useMemo(
    () => (balance ? +balance.balance / Math.pow(10, bond.quoteDecimals) : 0),
    [balance],
  );

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  async function onBond() {
    if (quantity === "" || Number(quantity) <= 0) {
      dispatch(error(t`Please enter a value!`));
    } else if (Number(quantity) > maxBondable) {
      dispatch(
        error(
          t`Max capacity is ${maxBondable} ${bond.displayName} for ${trim(
            +bond.maxPayoutOrCapacityInBase,
            4,
          )} sOHM. Click Max to autocomplete.`,
        ),
      );
    } else {
      if (inverseBond) {
        dispatch(
          purchaseInverseBond({
            amounts: [ethers.utils.parseUnits(trim(Number(quantity), 9), "gwei"), 0],
            networkID: networkId,
            provider,
            bond,
            maxPrice: Math.round(Number(bond.priceTokenBigNumber.toString()) * (1 + slippage / 100)),
            address: recipientAddress,
          }),
        ).then(() => clearInput());
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
  }

  const clearInput = () => {
    setQuantity("");
  };

  const hasAllowance = useCallback(() => {
    return +balance?.allowance > 0;
  }, [balance]);

  const setMax = () => {
    let maxQ: string;
    const maxBondableNumber = maxBondable * 0.999;
    if (balanceNumber > maxBondableNumber) {
      maxQ = maxBondableNumber.toString();
    } else {
      maxQ = ethers.utils.formatUnits(balance.balance, bond.quoteDecimals);
    }
    setQuantity(maxQ);
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
    if (inverseBond) {
      dispatch(changeInverseApproval({ address, provider, networkID: networkId, bond }));
    } else {
      dispatch(changeApproval({ address, provider, networkID: networkId, bond }));
    }
  };

  // const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = useAppSelector(state => state.bondingV2.balanceLoading[bond.quoteToken]);

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
                  <FormControl className="ohm-input" fullWidth>
                    <Input
                      endString={t`Max`}
                      id="outlined-adornment-amount"
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      placeholder={t`Amount`}
                      endStringOnClick={setMax}
                      labelWidth={55}
                    />
                  </FormControl>
                )}
                {bond.soldOut ? (
                  <PrimaryButton id="bond-btn" className="transaction-button" disabled={true}>
                    <Trans>Sold Out</Trans>
                  </PrimaryButton>
                ) : balance ? (
                  hasAllowance() ? (
                    <PrimaryButton
                      id="bond-btn"
                      className="transaction-button"
                      disabled={isPendingTxn(pendingTransactions, "bond_" + bond.displayName)}
                      onClick={onBond}
                    >
                      {txnButtonText(pendingTransactions, "bond_" + bond.displayName, "Bond")}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      id="bond-approve-btn"
                      className="transaction-button"
                      disabled={isPendingTxn(pendingTransactions, `approve_${bond.displayName}_bonding`)}
                      onClick={onSeekApproval}
                    >
                      {txnButtonText(pendingTransactions, `approve_${bond.displayName}_bonding`, "Approve")}
                    </PrimaryButton>
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
          <DataRow
            title={t`Your Balance`}
            balance={`${trim(balanceNumber, 4)} ${bond.displayName}`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`You Will Get`}
            balance={
              inverseBond
                ? `${trim(Number(quantity) / bond.priceToken, 4) || "0"} ${bond.payoutName}`
                : `${trim(Number(quantity) / bond.priceToken, 4) || "0"} ` +
                  `sOHM (≈${trim(+quantity / bond.priceToken / +currentIndex, 4) || "0"} gOHM)`
            }
            tooltip={t`The total amount of payout asset you will recieve from this bond purhcase. (sOHM amount will be higher due to rebasing)`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Max You Can Buy`}
            balance={
              inverseBond
                ? `${trim(+bond.maxPayoutOrCapacityInBase, 4) || "0"} ${bond.payoutName} (≈${
                    trim(+bond.maxPayoutOrCapacityInQuote, 4) || "0"
                  } ${bond.displayName})`
                : `${trim(+bond.maxPayoutOrCapacityInBase, 4) || "0"} sOHM (≈${
                    trim(+bond.maxPayoutOrCapacityInQuote, 4) || "0"
                  } ${bond.displayName})`
            }
            isLoading={isBondLoading}
            tooltip={t`The maximum quantity of payout token we are able to offer via bonds at this moment in time.`}
          />
          <DataRow
            title={t`Discount`}
            balance={<DisplayBondDiscount key={bond.displayName} bond={bond} />}
            tooltip={t`Negative discount is bad (you pay more than the market value). The bond discount is the percentage difference between OHM's market value and the bond's price.`}
            isLoading={isBondLoading}
          />
          {!inverseBond && (
            <DataRow
              title={t`Duration`}
              balance={bond.duration}
              isLoading={isBondLoading}
              tooltip={t`The duration of the Bond whereby the bond can be claimed in it’s entirety.  Bonds are no longer vested linearly and are locked for entire duration.`}
            />
          )}
          {recipientAddress !== address && (
            <DataRow title={t`Recipient`} balance={shorten(recipientAddress)} isLoading={isBondLoading} />
          )}
        </Box>
      </Slide>
      <div className="help-text">
        <em>
          <Typography variant="body2">{helpText}</Typography>
        </em>
      </div>
    </Box>
  );
}

export default BondPurchase;
