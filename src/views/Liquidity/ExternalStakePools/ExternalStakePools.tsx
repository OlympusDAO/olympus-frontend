import { ArrowBack, Check } from "@mui/icons-material";
import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Chip,
  DataRow,
  InfoTooltip,
  OHMTokenProps,
  OHMTokenStackProps,
  SecondaryButton,
  TextButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { formatCurrency, formatNumber } from "src/helpers";
import { defiLlamaChainToNetwork } from "src/helpers/defiLlamaChainToNetwork";
import { normalizeSymbol } from "src/helpers/normalizeSymbol";
import { useGetLPStats } from "src/hooks/useGetLPStats";

const PREFIX = "ExternalStakePools";

const classes = {
  stakePoolsWrapper: `${PREFIX}-stakePoolsWrapper`,
  stakePoolHeaderText: `${PREFIX}-stakePoolHeaderText`,
  poolPair: `${PREFIX}-poolPair`,
  poolName: `${PREFIX}-poolName`,
};

const StyledPoolInfo = styled("div")(() => ({
  [`&.${classes.poolPair}`]: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },

  [`& .${classes.poolName}`]: {
    marginLeft: "10px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "6px",
}));

export const ExternalStakePools = () => {
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const { data: defiLlamaPools } = useGetLPStats();
  const [poolFilter, setPoolFilter] = useState("all");

  const stablePools =
    defiLlamaPools &&
    defiLlamaPools.filter(pool => {
      const symbols = pool.symbol.split("-");
      const stable = symbols.includes("DAI") || symbols.includes("USDC");
      return stable;
    });

  const volatilePools =
    defiLlamaPools &&
    defiLlamaPools.filter(pool => {
      const symbols = pool.symbol.split("-");
      const stable = !symbols.includes("DAI") && !symbols.includes("USDC");
      return stable;
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

  console.log(defiLlamaPools, "pools");
  return (
    <div id="stake-view">
      <PageTitle
        name={
          <Box display="flex" flexDirection="row" alignItems="center">
            <Link component={RouterLink} to="/liquidity">
              <Box display="flex" flexDirection="row">
                <ArrowBack />
                <Typography fontWeight="500" marginLeft="9.5px" marginRight="18px">
                  Back
                </Typography>
              </Box>
            </Link>

            <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
              <Typography fontSize="32px" fontWeight={500}>
                Liquidity Pools
              </Typography>
            </Box>
          </Box>
        }
      ></PageTitle>
      <Box width="97%" maxWidth="974px">
        <Box mb="18px" mt="9px">
          <Typography>
            Increase OHM's use in DeFi by pairing your OHM with other ERC-20 tokens and provide liquidity
          </Typography>
        </Box>
        <Box display="flex" gap="9px">
          <PoolChip label="Stable" />
          <PoolChip label="Volatile" />
          <PoolChip label="gOHM" />
        </Box>
        {isSmallScreen ? (
          <Table>
            <Box display="flex" justifyContent="start" mt="42px">
              <Typography fontSize="24px" textAlign="left" fontWeight={600}>
                Pool Farms
              </Typography>
            </Box>
            {poolList &&
              poolList.map(pool => {
                const symbols = pool.symbol.split("-").filter(s => s !== "");
                return (
                  <Box mt="42px">
                    <StyledPoolInfo className={classes.poolPair}>
                      <TokenStack
                        tokens={normalizeSymbol(symbols) as OHMTokenStackProps["tokens"]}
                        style={{ fontSize: "24px" }}
                      />

                      <div className={classes.poolName}>
                        <Typography>{pool.symbol}</Typography>
                      </div>
                      <div className={classes.poolName}>
                        <Token
                          name={defiLlamaChainToNetwork(pool.chain) as OHMTokenProps["name"]}
                          style={{ fontSize: "15px" }}
                        />
                      </div>
                    </StyledPoolInfo>

                    <DataRow title={`TVL`} balance={formatCurrency(pool.tvlUsd || 0)} />
                    <DataRow title={`APY`} balance={`${formatNumber(pool.apy || 0, 2)}%`} />

                    <SecondaryButton href={pool.project.link} fullWidth>
                      Stake on {pool.project.name}
                    </SecondaryButton>
                  </Box>
                );
              })}
          </Table>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "700" }}>Asset</StyledTableCell>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "700" }}>TVL</StyledTableCell>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "700" }}>
                  APY
                  <InfoTooltip message="APY = Base APY + Reward APY. For non-autocompounding pools we do not account for reinvesting, in which case APY = APR." />
                </StyledTableCell>

                <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }} width="100px"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poolList &&
                poolList.map(pool => {
                  const symbols = pool.symbol.split("-").filter(s => s !== "");

                  return (
                    <TableRow>
                      <TableCell style={{ padding: "8px 0" }}>
                        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
                          <TokenStack
                            tokens={normalizeSymbol(symbols) as OHMTokenStackProps["tokens"]}
                            style={{ fontSize: "24px" }}
                          />
                          <Box marginLeft="14px" marginRight="10px">
                            <Typography fontWeight="700">{pool.symbol}</Typography>
                          </Box>
                          <Token
                            name={defiLlamaChainToNetwork(pool.chain) as OHMTokenProps["name"]}
                            style={{ fontSize: "15px" }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell style={{ padding: "8px 0" }}>
                        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }} fontWeight="700">
                          {formatCurrency(pool.tvlUsd || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: "8px 0" }}>
                        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }} fontWeight="700">
                          <Tooltip
                            message={
                              <>
                                <p>Base APY: {formatNumber(pool.apyBase || 0, 2)}%</p>
                                <p>Reward APY: {formatNumber(pool.apyReward || 0, 2)}%</p>
                              </>
                            }
                          >
                            {" "}
                            {formatNumber(pool.apy || 0, 2)}%
                          </Tooltip>
                        </Typography>
                      </TableCell>

                      <TableCell style={{ padding: "8px 0" }}>
                        <TextButton
                          href={pool.project.link}
                          size="small"
                          fullWidth
                          style={{ justifyContent: "left", fontWeight: "700" }}
                        >
                          {pool.project.name}
                        </TextButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </Box>
    </div>
  );
};
