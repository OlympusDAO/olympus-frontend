import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TransactionRow } from "@olympusdao/component-library";
import { FC, useMemo, useRef, useState } from "react";
import { GOHM_TOKEN, OHM_TOKEN, SOHM_TOKEN, V1_OHM_TOKEN, V1_SOHM_TOKEN, WSOHM_TOKEN } from "src/constants/tokens";
import { Transaction } from "src/helpers/covalent/interpretTransaction";
import { nonNullable } from "src/helpers/types/nonNullable";

import useIntersectionObserver from "../helpers";
import { useTransactionHistory, useTransferHistory } from "../queries";

const PREFIX = "TransactionHistory";

const classes = {
  tabNav: `${PREFIX}-tabNav`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  "&.transaction-container": {
    "&>*:nth-child(odd) .row-details": {
      background: "transparent",
    },
  },
  [`& .${classes.tabNav}`]: {
    "& p": {
      "&:first-child": {
        paddingLeft: "0px",
      },
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.primary[300],
        textDecoration: "underline",
        textUnderlineOffset: ".23rem",
      },
      cursor: "pointer",
    },
  },
}));

const filters: Array<{ label: string; value: "all" | Transaction["type"] }> = [
  { label: "All", value: "all" },
  { label: "Staking", value: "staking" },
  { label: "Bond", value: "bond" },
  { label: "Zap", value: "zap" },
  { label: "Borrow", value: "borrow" },
];

export const TransactionHistory: FC = () => {
  const loadMoreButtonRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState<"all" | Transaction["type"]>("all");

  const transactions = useTransactionHistory();
  const ohmTransfers = useTransferHistory(OHM_TOKEN);
  const gohmTransfers = useTransferHistory(GOHM_TOKEN);
  const sohmTransfers = useTransferHistory(SOHM_TOKEN);
  const wsohmTransfers = useTransferHistory(WSOHM_TOKEN);
  const v1ohmTransfers = useTransferHistory(V1_OHM_TOKEN);
  const v1sohmTransfers = useTransferHistory(V1_SOHM_TOKEN);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    enabled: !!transactions.hasNextPage,
    onIntersect: transactions.fetchNextPage,
  });

  const queries = [
    transactions,
    gohmTransfers,
    ohmTransfers,
    sohmTransfers,
    v1ohmTransfers,
    v1sohmTransfers,
    wsohmTransfers,
  ];

  const allLoaded = queries.every(query => query.isFetched);

  const history = queries
    .map(query => query.data)
    .filter(nonNullable)
    .map(data => data.pages.flat())
    .flat()
    .sort((a, b) => b.transaction.block_height - a.transaction.block_height);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return history;
    return history.filter(transaction => transaction.type === activeFilter);
  }, [activeFilter, history]);

  if (!allLoaded) return null;

  return (
    <Root className="transaction-container">
      <Box display="flex" flexDirection="row" className={classes.tabNav} mb="18px">
        {filters.map(({ label, value }, index) => (
          <Typography
            key={index}
            onClick={() => setActiveFilter(value)}
            className={activeFilter === value ? "active" : ""}
          >
            {label}
          </Typography>
        ))}
      </Box>
      {filtered.map((transaction, index) => (
        <TransactionRow
          key={index}
          hrefText="View on Etherscan"
          assetName={transaction.token.icons}
          transactionDetails={transaction.details}
          href={`https://etherscan.io/tx/${transaction.transaction.tx_hash}`}
          quantity={transaction.value.toString({ decimals: 4, format: true, trim: false })}
        />
      ))}
      {filtered.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <Typography variant="body1" color="textSecondary">
            No transactions
          </Typography>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" mt={"15px"}>
          <Button
            ref={loadMoreButtonRef}
            onClick={() => transactions.fetchNextPage()}
            disabled={!transactions.hasNextPage || transactions.isFetchingNextPage || filtered.length === 0}
          >
            {transactions.isFetchingNextPage
              ? "Loading transactions..."
              : transactions.hasNextPage
              ? "Load more transactions"
              : "No more transactions"}
          </Button>
        </Box>
      )}
    </Root>
  );
};
