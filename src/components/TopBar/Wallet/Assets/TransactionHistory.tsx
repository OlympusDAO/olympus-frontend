import { Box, Button, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { OHMTokenProps, OHMTokenStackProps, TransactionRow } from "@olympusdao/component-library";
import { FC, useRef, useState } from "react";
import {
  GOHM_ADDRESSES,
  MIGRATOR_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  STAKING_ADDRESSES,
} from "src/constants/addresses";
import { shorten, trim } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { CovalentResponse, CovalentTransaction } from "src/lib/covalent.types";
import { addresses, NetworkId } from "src/networkDetails";

import useIntersectionObserver from "../helpers";
import { GetTransactionHistory, GetTransferHistory } from "../queries";

const useStyles = makeStyles<Theme>(theme => ({
  tabNav: {
    "& p": {
      "&:first-child": {
        paddingLeft: "0px",
      },
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.palette.type === "light" ? theme.palette.primary.main : theme.colors.primary[300],
        textDecoration: "underline",
        textUnderlineOffset: ".23rem",
      },
      cursor: "pointer",
    },
  },
}));

/*
 * Interface for Wallet Transactions. Extends CovalentTransaction
 */
export interface WalletTransaction extends CovalentTransaction {
  type: "bond" | "zap" | "staking" | "zap" | "migration" | "33together" | "borrow" | "all";
  details?: "string";
  contract_ticker_symbol?: OHMTokenProps["name"];
  sender_contract_ticker_symbol?: OHMTokenStackProps["tokens"];
}

export interface OHMTransactionHistoryProps {
  address?: string;
}

/**
 * Component for Displaying TransactionHistory
 */

const TransactionHistory: FC<OHMTransactionHistoryProps> = () => {
  const classes = useStyles();
  const {
    data: covalentTransactions,
    isFetched: covalentTransactionsIsFetched,
    hasNextPage: covalentTransactionsHasNextPage,
    fetchNextPage: covalentTransactionsFetchNextPage,
    isFetchingNextPage: covalentTransactionsIsFetchingNextPage,
  } = GetTransactionHistory();
  const { address, networkId } = useWeb3Context();
  const { data: gOhmTransfers, isFetched: gOhmTransfersFetched } = GetTransferHistory(
    GOHM_ADDRESSES[networkId as keyof typeof GOHM_ADDRESSES],
  );
  const { data: ohmTransfers, isFetched: ohmTransfersFetched } = GetTransferHistory(
    OHM_ADDRESSES[networkId as keyof typeof OHM_ADDRESSES],
  );
  const { data: sOhmTransfers, isFetched: sOhmTransfersFetched } = GetTransferHistory(
    SOHM_ADDRESSES[networkId as keyof typeof SOHM_ADDRESSES],
  );
  const { data: ohmTransfersV1, isFetched: ohmTransfersV1Fetched } = GetTransferHistory(
    addresses[networkId].OHM_ADDRESS,
  );
  const { data: sOhmTransfersV1, isFetched: sOhmTransfersV1Fetched } = GetTransferHistory(
    addresses[networkId].SOHM_ADDRESS,
  );
  const { data: wsOhmTransfersV1, isFetched: wsOhmTransfersV1Fetched } = GetTransferHistory(
    addresses[networkId].WSOHM_ADDRESS,
  );
  const loadMoreButtonRef = useRef(null);
  const [filter, setFilter] = useState("all");

  function getKeyByValue(value: any) {
    return Object.keys(addresses[networkId]).find(key => {
      return addresses[networkId][key as any].toLowerCase() === value.toLowerCase() ? true : false;
    });
  }

  const filterTransfers = (transfers: CovalentResponse) => {
    if (!transfers.error) {
      return transfers.data.items.map(item => {
        if (item.transfers) {
          return {
            ...item,
            details:
              item.transfers[0].transfer_type === "OUT"
                ? `Transfer to ${shorten(item.to_address)}`
                : `Deposit from ${shorten(item.to_address)}`,
            value: item.transfers[0].delta / 10 ** item.transfers[0].contract_decimals,
            contract_ticker_symbol: item.transfers[0].contract_ticker_symbol,
            type: "transfer",
          };
        }
      });
    }
    throw new Error("Invalid Transfer");
  };
  const filterTransactions = (transactions: CovalentResponse) => {
    if (!transactions.error && NetworkId.MAINNET === networkId) {
      return transactions.data.items
        .filter(transaction => {
          return (
            (getKeyByValue(transaction.to_address) || getKeyByValue(transaction.from_address)) &&
            transaction.log_events &&
            transaction.log_events[0]
          );
        })
        .map((transaction: CovalentTransaction) => {
          if (transaction.log_events) {
            switch (transaction.to_address.toLowerCase()) {
              case addresses[networkId].BOND_DEPOSITORY.toLowerCase():
                if (transaction.log_events[0].decoded.params[1].value.toLowerCase() === address.toLowerCase()) {
                  return {
                    ...transaction,
                    details: "Bond Claimed",
                    type: "bond",
                    value:
                      Number(transaction.log_events[0].decoded.params[2].value) /
                      10 ** transaction.log_events[0]?.sender_contract_decimals,
                  };
                }
                return {
                  ...transaction,
                  details: "Bond Purchased",
                  type: "bond",
                  value:
                    Number(transaction.log_events[1]?.decoded.params[2].value) /
                    10 ** transaction.log_events[1]?.sender_contract_decimals,
                };
              case addresses[networkId].STAKING_HELPER_ADDRESS.toLowerCase():
              case STAKING_ADDRESSES[networkId as keyof typeof STAKING_ADDRESSES].toLowerCase():
                if (
                  transaction.log_events[0]?.decoded.params[0].value.toLowerCase() ===
                    STAKING_ADDRESSES[networkId as keyof typeof STAKING_ADDRESSES].toLowerCase() &&
                  transaction.log_events[0]?.sender_address.toLowerCase() === OHM_ADDRESSES[networkId].toLowerCase()
                ) {
                  return {
                    ...transaction,
                    details: "Unstake",
                    type: "staking",
                    value:
                      Number(transaction.log_events[0]?.decoded.params[2].value) /
                      10 ** transaction.log_events[0]?.sender_contract_decimals,
                  };
                } else {
                  return {
                    ...transaction,
                    details: "Stake",
                    type: "staking",
                    value:
                      Number(transaction.log_events[0]?.decoded.params[2].value) /
                      10 ** transaction.log_events[0]?.sender_contract_decimals,
                  };
                }

              case addresses[networkId].ZAP.toLowerCase():
                return {
                  ...transaction,
                  details: `Zap to ${transaction.log_events[1]?.sender_contract_ticker_symbol} `,
                  type: "zap",
                  value:
                    Number(transaction.log_events[1]?.decoded.params[2].value) /
                    10 ** transaction.log_events[1]?.sender_contract_decimals,
                };

              case MIGRATOR_ADDRESSES[networkId].toLowerCase():
                return {
                  ...transaction,
                  details: "Migration",
                  type: "migration",
                  value:
                    Number(transaction.log_events[0]?.decoded.params[2].value) /
                    10 ** transaction.log_events[0]?.sender_contract_decimals,
                };

              case addresses[networkId].PT_PRIZE_POOL_ADDRESS.toLowerCase():
                return {
                  ...transaction,
                  details: "33Together Claim",
                  type: "33together",
                  value:
                    Number(transaction.log_events[1]?.decoded.params[2].value) /
                    10 ** transaction.log_events[1]?.sender_contract_decimals,
                };
              case addresses[networkId].FUSE_6_SOHM.toLowerCase():
              case addresses[networkId].FUSE_18_SOHM.toLowerCase():
              case addresses[networkId].FUSE_36_SOHM.toLowerCase():
                const event = transaction.log_events.filter(
                  (event: { decoded: { name: string }; sender_address: string }) => {
                    return (
                      event.decoded.name == "Transfer" &&
                      event.sender_address !== addresses[networkId].FUSE_36_SOHM.toLowerCase() &&
                      event.sender_address !== addresses[networkId].FUSE_18_SOHM.toLowerCase() &&
                      event.sender_address !== addresses[networkId].FUSE_6_SOHM.toLowerCase()
                    );
                  },
                );
                return {
                  ...transaction,
                  details: "Supply to Fuse",
                  type: "borrow",
                  value: Number(event[0]?.decoded.params[2].value) / 10 ** event[0]?.sender_contract_decimals,
                  log_events: [
                    {
                      ...transaction.log_events[0],
                      sender_contract_ticker_symbol: event[0].sender_contract_ticker_symbol,
                    },
                  ],
                };
              case addresses[networkId].FIATDAO_WSOHM_ADDRESS.toLowerCase():
                if (
                  transaction.log_events[0]?.sender_address.toLowerCase() ===
                  addresses[networkId].FIATDAO_WSOHM_ADDRESS.toLowerCase()
                ) {
                  return {
                    ...transaction,
                    details: "FiatDao Withdraw",
                    type: "staking",
                    value:
                      Number(transaction.log_events[0]?.decoded.params[2].value) /
                      10 ** transaction.log_events[1]?.sender_contract_decimals,
                  };
                } else {
                  return {
                    ...transaction,
                    details: "FiatDao Deposit",
                    type: "staking",
                    value:
                      Number(transaction.log_events[0]?.decoded.params[2].value) /
                      10 ** transaction.log_events[1]?.sender_contract_decimals,
                  };
                }
            }
            return transaction;
          }
        })
        .filter((transaction: any) => transaction.type);
    }
    return [];
  };

  const getSymbols = (transaction: WalletTransaction) => {
    if (transaction.contract_ticker_symbol) {
      return [transaction.contract_ticker_symbol];
    } else {
      if (transaction.log_events) {
        switch (transaction.log_events[0]?.sender_address.toLowerCase()) {
          //Sushi OHM-DAI LP
          case "0x055475920a8c93cffb64d039a8205f7acc7722d3":
            return ["OHM", "DAI"] as OHMTokenStackProps["tokens"];
          case addresses[networkId].ZAP.toLowerCase():
            return [transaction.log_events[1]?.sender_contract_ticker_symbol as OHMTokenProps["name"]];
          case addresses[networkId].PT_PRIZE_POOL_ADDRESS.toLowerCase():
            return [transaction.log_events[1]?.sender_contract_ticker_symbol as OHMTokenProps["name"]];
          case addresses[networkId].FIATDAO_WSOHM_ADDRESS.toLowerCase():
            return ["wsOHM"] as OHMTokenStackProps["tokens"];
          default:
            return [transaction.log_events[0]?.sender_contract_ticker_symbol as OHMTokenProps["name"]];
        }
      }

      return ["OHM"] as OHMTokenStackProps["tokens"];
    }
  };

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: covalentTransactionsFetchNextPage,
    enabled: !!covalentTransactionsHasNextPage,
  });

  const transfers = [gOhmTransfers, ohmTransfers, sOhmTransfers, ohmTransfersV1, sOhmTransfersV1, wsOhmTransfersV1];
  const loaded =
    covalentTransactionsIsFetched &&
    gOhmTransfersFetched &&
    sOhmTransfersFetched &&
    ohmTransfersFetched &&
    ohmTransfersV1Fetched &&
    sOhmTransfersV1Fetched &&
    wsOhmTransfersV1Fetched;

  const transactions =
    loaded &&
    [...transfers, covalentTransactions]
      .reduce((previousGroup: any, currentGroup: any) => {
        if (currentGroup && currentGroup.pages) {
          const page = currentGroup.pages.reduce((lastPage: CovalentTransaction[], currentPage: CovalentResponse) => {
            if (!currentPage.error) {
              const filtered =
                currentPage.type === "transfer" ? filterTransfers(currentPage) : filterTransactions(currentPage);
              return [...lastPage, ...filtered];
            }
            return [...lastPage];
          }, []);
          return [...previousGroup, ...page];
        }
        return [...previousGroup];
      }, [])
      .sort((a: { block_height: number }, b: { block_height: number }) => {
        return b.block_height - a.block_height;
      });

  const filteredTransactions = (type = "all") => {
    if (transactions) {
      if (type === "all") {
        return transactions;
      } else {
        return transactions.filter((transaction: WalletTransaction) => {
          return transaction.type === type;
        });
      }
    }
    return [];
  };

  const filterList = [
    { label: "All", value: "all" },
    { label: "Staking", value: "staking" },
    { label: "Bond", value: "bond" },
    { label: "Zap", value: "zap" },
    { label: "Borrow", value: "borrow" },
  ];

  return (
    <>
      {loaded && (
        <>
          <Box display="flex" flexDirection="row" className={classes.tabNav} mb="18px">
            {filterList.map((filterItem, index) => (
              <Typography
                key={index}
                className={filter === filterItem.value ? "active" : ""}
                onClick={() => setFilter(filterItem.value)}
              >
                {filterItem.label}
              </Typography>
            ))}
          </Box>

          {transactions && (
            <>
              {filteredTransactions(filter).map((transaction: WalletTransaction, index) => {
                return (
                  <TransactionRow
                    key={index}
                    assetName={
                      transaction.sender_contract_ticker_symbol
                        ? transaction.sender_contract_ticker_symbol
                        : getSymbols(transaction)
                    }
                    transactionDetails={
                      transaction.details
                        ? transaction.details
                        : transaction.log_events && transaction.log_events[0]?.decoded.name
                    }
                    quantity={trim(Number(transaction.value), 4)}
                    href={`https://etherscan.io/tx/${transaction.tx_hash}`}
                    hrefText="View on Etherscan"
                  />
                );
              })}
              {filteredTransactions(filter).length === 0 ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="body1" color="textSecondary">
                    No Transactions
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" mt={"15px"}>
                  <Button
                    ref={loadMoreButtonRef}
                    onClick={() => covalentTransactionsFetchNextPage()}
                    disabled={
                      !covalentTransactionsHasNextPage ||
                      covalentTransactionsIsFetchingNextPage ||
                      (transactions && transactions.length === 0)
                    }
                  >
                    {covalentTransactionsIsFetchingNextPage
                      ? "Loading more..."
                      : covalentTransactionsHasNextPage
                      ? "Load Newer"
                      : "No more transactions"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
export default TransactionHistory;
