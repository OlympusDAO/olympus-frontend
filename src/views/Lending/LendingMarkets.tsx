import { Check } from "@mui/icons-material";
import { Box, FormControl, InputLabel, MenuItem, Select, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import {
  Chip,
  OHMTokenProps,
  OHMTokenStackProps,
  TextButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { formatCurrency, formatNumber } from "src/helpers";
import { defiLlamaChainToNetwork } from "src/helpers/defiLlamaChainToNetwork";
import { normalizeSymbol } from "src/helpers/normalizeSymbol";
import { LendAndBorrowPool, useGetLendAndBorrowStats } from "src/hooks/useGetLendBorrowStats";
import { DefiLlamaPool } from "src/hooks/useGetLPStats";

const PREFIX = "ExternalStakePools";

const classes = {
  stakePoolsWrapper: `${PREFIX}-stakePoolsWrapper`,
  stakePoolHeaderText: `${PREFIX}-stakePoolHeaderText`,
  poolPair: `${PREFIX}-poolPair`,
  poolName: `${PREFIX}-poolName`,
};

const StyledPoolInfo = styled("div")(() => ({
  [`&.${classes.poolPair}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
  },

  [`& .${classes.poolName}`]: {
    marginLeft: "10px",
  },
}));

export const LendingMarkets = () => {
  const { data: defiLlamaPools } = useGetLendAndBorrowStats();
  console.log(defiLlamaPools, "defiLlamaPools");
  const [poolFilter, setPoolFilter] = useState("all");
  const theme = useTheme();
  const networks = [...new Set(defiLlamaPools?.map(pool => pool.chain))];
  const [networkFilter, setNetworkFilter] = useState<undefined | string>(undefined);
  const stablePools =
    defiLlamaPools &&
    defiLlamaPools.filter(pool => {
      const symbols = pool.symbol.split("-");
      const stable =
        symbols.includes("DAI") ||
        symbols.includes("USDC") ||
        symbols.includes("FRAXBP") ||
        symbols.includes("OHMFRAXBP");
      return stable;
    });

  const volatilePools =
    defiLlamaPools &&
    defiLlamaPools.filter(pool => {
      const symbols = pool.symbol.split("-");
      const volatile =
        !symbols.includes("DAI") &&
        !symbols.includes("USDC") &&
        !symbols.includes("FRAXBP") &&
        !symbols.includes("OHMFRAXBP");
      return volatile;
    });

  const gOHMPools =
    defiLlamaPools &&
    defiLlamaPools.filter(pool => {
      const symbols = pool.symbol.split("-");
      const stable = symbols.includes("GOHM");
      return stable;
    });

  const ohmPools = defiLlamaPools?.filter(pool => pool.symbol === "OHM") || [];

  const poolList =
    poolFilter === "stable"
      ? stablePools
      : poolFilter === "volatile"
      ? volatilePools
      : poolFilter === "gohm"
      ? gOHMPools
      : poolFilter === "ohm"
      ? ohmPools
      : defiLlamaPools;

  const poolListByNetwork = networkFilter ? poolList?.filter(pool => pool.chain === networkFilter) : poolList;
  const PoolChip = ({ label }: { label: string }) => (
    <Chip
      label={
        <Typography fontWeight="500" fontSize="12px">
          {poolFilter === label.toLowerCase() && <Check sx={{ fontSize: "12px", marginRight: "3px" }} />}
          {label}
        </Typography>
      }
      template={poolFilter === label.toLowerCase() ? undefined : "gray"}
      onClick={() => (poolFilter === label.toLowerCase() ? setPoolFilter("all") : setPoolFilter(label.toLowerCase()))}
    />
  );

  const columns: GridColDef<LendAndBorrowPool>[] = [
    {
      field: "symbol",
      headerName: "Lend",
      renderCell: params => {
        const symbols =
          params.row.symbol !== "OHMFRAXBP-F"
            ? params.row.symbol.split("-").filter(s => s !== "")
            : ["OHM", "FRAX", "CRV"];
        return (
          <StyledPoolInfo className={classes.poolPair}>
            <TokenStack
              tokens={normalizeSymbol(symbols) as OHMTokenStackProps["tokens"]}
              style={{ fontSize: "27px" }}
              network={defiLlamaChainToNetwork(params.row.chain) as OHMTokenProps["name"]}
            />

            <div className={classes.poolName}>
              <Typography fontWeight={700}>{params.row.symbol}</Typography>
            </div>
          </StyledPoolInfo>
        );
      },
      minWidth: 120,
    },
    {
      field: "mintAsset",
      headerName: "Borrow",
      valueGetter: params => {
        return params.row.lendAndBorrow.mintedCoin || "OHM";
      },
      renderCell: params => {
        const symbol = normalizeSymbol([params.row.lendAndBorrow.mintedCoin || "OHM"]) as OHMTokenStackProps["tokens"];
        return (
          <StyledPoolInfo className={classes.poolPair}>
            {params.row.lendAndBorrow.mintedCoin === "DOLA" ? (
              <SvgIcon style={{ fontSize: "27px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267.65 267.65">
                  <circle cx="133.83" cy="133.83" r="133.83" fill="#161e53"></circle>
                  <path
                    fill="#ffbb51"
                    d="M179.67 88.16l9.38-24.96h-15.41l-6.19 16.41a56.5 56.5 0 00-10.63-4.27l4.58-12.15h-15.41l-3.74 9.92c-.49 0-.98-.03-1.48-.03h-17.9a35.6 35.6 0 01-6.99-1.6c-.79-.26-1.56-.55-2.32-.86l-5.08 13.48-39.37 104.47h29.65l-5.99 15.89h15.41l6-15.89h12.24l-5.99 15.89h15.41l5.99-15.9c31.87-.54 57.26-26.82 56.72-58.69-.27-15.91-7.1-31-18.87-41.71zm-89.73 85.99l32.66-86.63c1.47.14 2.94.2 4.41.2s3.01-.07 4.48-.21h5.36l-32.66 86.64H89.94zm29.65 0l32.16-85.25c3.71.98 7.27 2.44 10.6 4.35l-30.52 80.89h-12.24zm51.84-12.7a42.916 42.916 0 01-24 12.19l26.61-70.57c14.39 17.2 13.25 42.53-2.61 58.38z"
                  ></path>
                </svg>
              </SvgIcon>
            ) : (
              <TokenStack tokens={symbol} style={{ fontSize: "27px" }} />
            )}

            <div className={classes.poolName}>
              <Typography fontWeight={700}>{params.row.lendAndBorrow.mintedCoin || "OHM"}</Typography>
            </div>
          </StyledPoolInfo>
        );
      },
      minWidth: 110,
    },
    {
      field: "tvlUsd",
      headerName: "TVL",
      valueFormatter: (params: GridValueFormatterParams) => formatCurrency(params.value, 0),
      minWidth: 110,
    },
    {
      field: "apy",
      headerName: "Supply APY",
      renderCell: params => (
        <>
          {params.row.apyBase || params.row.apyReward ? (
            <Tooltip
              message={
                <>
                  <p>Base APY: {formatNumber(params.row.apyBase || 0, 2)}%</p>
                  <p>Reward APY: {formatNumber(params.row.apyReward || 0, 2)}%</p>
                </>
              }
            >
              {formatNumber(params.row.apy || 0, 2)}%
            </Tooltip>
          ) : (
            <>{formatNumber(params.row.apy || 0, 2)}%</>
          )}
        </>
      ),
      minWidth: 110,
    },
    {
      field: "borrowApy",
      headerName: "Borrow APY",
      valueGetter: params => {
        return params.row.lendAndBorrow.apyBaseBorrow - params.row.lendAndBorrow.apyRewardBorrow;
      },
      renderCell: params => (
        <>
          {params.row.lendAndBorrow.apyBaseBorrow || params.row.lendAndBorrow.apyRewardBorrow ? (
            <Tooltip
              message={
                <>
                  <p>Base APY: {formatNumber(params.row.lendAndBorrow.apyBaseBorrow || 0, 2)}%</p>
                  <p>Reward APY: {formatNumber(params.row.lendAndBorrow.apyRewardBorrow || 0, 2)}%</p>
                </>
              }
            >
              {formatNumber(params.row.lendAndBorrow.apyBaseBorrow - params.row.lendAndBorrow.apyRewardBorrow || 0, 2)}%
            </Tooltip>
          ) : (
            <>{formatNumber(params.row.lendAndBorrow.apyBaseBorrow || 0, 2)}%</>
          )}
        </>
      ),
    },
    {
      field: "ltv",
      headerName: "LTV",
      valueGetter: params => {
        return params.row.lendAndBorrow.ltv;
      },
      renderCell: params => <>{formatNumber(params.row.lendAndBorrow.ltv * 100)}%</>,
      minWidth: 30,
    },
    {
      field: "available",
      headerName: "Available to Borrow",
      valueGetter: params => {
        return (
          (params.row.lendAndBorrow.debtCeilingUsd || params.row.lendAndBorrow.totalSupplyUsd) -
          params.row.lendAndBorrow.totalBorrowUsd
        );
      },
      renderCell: params => (
        <>
          {formatCurrency(
            (params.row.lendAndBorrow.debtCeilingUsd || params.row.lendAndBorrow.totalSupplyUsd) -
              params.row.lendAndBorrow.totalBorrowUsd,
          )}
        </>
      ),
      minWidth: 150,
    },
    {
      field: "projectName",
      headerName: "",
      renderCell: (params: GridRenderCellParams<DefiLlamaPool>) => (
        <TextButton
          href={params.row.projectLink}
          size="small"
          fullWidth
          style={{ justifyContent: "left", fontWeight: "700" }}
        >
          {params.row.projectName}
        </TextButton>
      ),
      minWidth: 100,
      flex: 1,
    },
  ];

  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Lend & Borrow Markets
              </Typography>
            </Box>
          </Box>
        }
      ></PageTitle>
      <Box width="97%" maxWidth="974px">
        <Box mb="18px" mt="9px">
          <Typography>Borrow & Lend against OHM or gOHM with our trusted partners </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" gap="9px">
            <PoolChip label="All" />
            <PoolChip label="OHM" />
            <PoolChip label="gOHM" />
          </Box>
          <FormControl
            sx={{
              m: 1,
              minWidth: 210,
              "& .MuiFormLabel-filled": {
                display: "none",
              },
            }}
          >
            <InputLabel id="demo-select-small">Filter by Network</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={networkFilter}
              label="Age"
              onChange={e => {
                setNetworkFilter(e.target.value as string);
              }}
              fullWidth
              sx={{
                height: "44px",
                backgroundColor: theme.colors.gray[700],
                border: "none",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {networks.map(network => (
                <MenuItem value={network} key={network}>
                  <Token
                    name={defiLlamaChainToNetwork(network) as OHMTokenProps["name"]}
                    style={{ fontSize: "27px", marginRight: "9px" }}
                  />
                  <Typography fontWeight={700}>{network}</Typography>
                </MenuItem>
              ))}
              <MenuItem value={undefined} key="1">
                All Networks
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <DataGrid
          columns={columns}
          rows={(poolListByNetwork as LendAndBorrowPool[]) || []}
          autoHeight
          sx={{
            border: 0,
            fontSize: "15px",
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-withBorderColor": {
              border: "none",
            },
            "& .MuiDataGrid-iconSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: "available", sort: "desc" }],
            },
          }}
          disableRowSelectionOnClick
          rowHeight={58}
          disableColumnMenu
          hideFooter
        />
      </Box>
    </div>
  );
};
