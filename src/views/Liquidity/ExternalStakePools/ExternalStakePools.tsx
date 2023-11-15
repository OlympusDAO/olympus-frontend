import { Check } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import {
  Chip,
  OHMTokenProps,
  OHMTokenStackProps,
  SecondaryButton,
  TertiaryButton,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { useState } from "react";
import PageTitle from "src/components/PageTitle";
import { formatCurrency, formatNumber } from "src/helpers";
import { defiLlamaChainToNetwork } from "src/helpers/defiLlamaChainToNetwork";
import { normalizeSymbol } from "src/helpers/normalizeSymbol";
import { DefiLlamaPool, useGetLPStats } from "src/hooks/useGetLPStats";

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

export const ExternalStakePools = () => {
  const { data: defiLlamaPools } = useGetLPStats();
  const [poolFilter, setPoolFilter] = useState("all");
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

  const poolList =
    poolFilter === "stable"
      ? stablePools
      : poolFilter === "volatile"
      ? volatilePools
      : poolFilter === "gohm"
      ? gOHMPools
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

  const columns: GridColDef<DefiLlamaPool>[] = [
    {
      field: "symbol",
      headerName: "Pool",
      renderCell: (params: GridRenderCellParams<DefiLlamaPool>) => {
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
      minWidth: 250,
      flex: 1,
    },
    {
      field: "tvlUsd",
      headerName: "TVL",
      valueFormatter: (params: GridValueFormatterParams) => formatCurrency(params.value, 0),
      minWidth: 200,
    },
    {
      field: "apy",
      headerName: "APY",
      renderCell: (params: GridRenderCellParams<DefiLlamaPool>) => (
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
    },
    {
      field: "projectName",
      headerName: "Project Name",
      renderCell: (params: GridRenderCellParams<DefiLlamaPool>) => params.row.projectName,
      minWidth: 200,
    },
    {
      field: "id",
      headerName: "",
      renderCell: (params: GridRenderCellParams<DefiLlamaPool>) => (
        <TertiaryButton href={`https://defillama.com/yields/pool/${params.row.id}`} size="small">
          View Details
        </TertiaryButton>
      ),
      sortable: false,
      minWidth: 200,
    },
  ];

  return (
    <>
      <PageTitle
        name="Liquidity Pools"
        subtitle="Increase OHM's use in DeFi by pairing your OHM with other ERC-20 tokens and provide liquidity"
        noMargin
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" gap="9px">
          <PoolChip label="All" />
          <PoolChip label="Stable" />
          <PoolChip label="Volatile" />
          <PoolChip label="gOHM" />
        </Box>
      </Box>
      <DataGrid
        columns={columns}
        rows={poolListByNetwork || []}
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
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
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
            sortModel: [{ field: "tvlUsd", sort: "desc" }],
          },
          pagination: {
            paginationModel: {
              pageSize: 3,
            },
          },
        }}
        disableRowSelectionOnClick
        rowHeight={58}
        disableColumnMenu
        hideFooter
      />
      <Box display="flex" justifyContent="center">
        <SecondaryButton href="https://defillama.com/yields?token=GOHM&token=OHM">
          Explore More on DefiLlama
        </SecondaryButton>
      </Box>
    </>
  );
};
