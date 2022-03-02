import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TransactionRow } from "@olympusdao/component-library";
import { FC } from "react";

import { GetTransactionHistory } from "../queries";

const useStyles = makeStyles<Theme>(theme => ({}));

export interface OHMTransactionHistoryProps {
  address?: string;
}

/**
 * Component for Displaying TransactionHistory
 */
const TransactionHistory: FC<OHMTransactionHistoryProps> = () => {
  const classes = useStyles();
  const staking = GetTransactionHistory();
  console.log("staking", staking);
  return (
    <>
      {staking.isFetched && (
        <>
          {staking.data.transfers.map((trans: { rawContract: { value: number } }) => (
            <TransactionRow assetName="sOHM" transactionDetails="Staked" quantity={trans.rawContract.value / 1e9} />
          ))}
        </>
      )}
    </>
  );
};

export default TransactionHistory;
