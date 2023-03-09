import { ArrowBack } from "@mui/icons-material";
import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataRow,
  InfoTooltip,
  OHMTokenProps,
  OHMTokenStackProps,
  SecondaryButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
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
        {isSmallScreen ? (
          <Table>
            <Box display="flex" justifyContent="start" mt="42px">
              <Typography fontSize="24px" textAlign="left" fontWeight={600}>
                Pool Farms
              </Typography>
            </Box>
            {defiLlamaPools &&
              defiLlamaPools.map(pool => (
                <Box mt="42px">
                  <StyledPoolInfo className={classes.poolPair}>
                    <TokenStack
                      tokens={normalizeSymbol(pool.symbol.split("-")) as OHMTokenStackProps["tokens"]}
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
                  <DataRow title={`APY`} balance={`${formatNumber(pool.apy || 0 * 100, 2)}%`} />

                  <SecondaryButton href={pool.project.link} fullWidth>
                    Stake on {pool.project.name}
                  </SecondaryButton>
                </Box>
              ))}
          </Table>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "450" }}>Asset</StyledTableCell>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "450" }}>TVL</StyledTableCell>
                <StyledTableCell sx={{ fontSize: "14px", fontWeight: "450" }}>
                  APY
                  <InfoTooltip message="APY = Base APY + Reward APY. For non-autocompounding pools we do not account for reinvesting, in which case APY = APR." />
                </StyledTableCell>

                <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }} width="100px"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defiLlamaPools &&
                defiLlamaPools.map(pool => (
                  <TableRow>
                    <TableCell style={{ padding: "8px 0" }}>
                      <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
                        <TokenStack
                          tokens={normalizeSymbol(pool.symbol.split("-")) as OHMTokenStackProps["tokens"]}
                          style={{ fontSize: "24px" }}
                        />
                        <Box marginLeft="14px" marginRight="10px">
                          <Typography>{pool.symbol}</Typography>
                        </Box>
                        <Token
                          name={defiLlamaChainToNetwork(pool.chain) as OHMTokenProps["name"]}
                          style={{ fontSize: "15px" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
                        {formatCurrency(pool.tvlUsd || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
                        <Tooltip
                          message={
                            <>
                              <p>Base APY: {formatNumber(pool.apyBase || 0 * 100, 2)}%</p>
                              <p>Reward APY: {formatNumber(pool.apyReward || 0 * 100, 2)}%</p>
                            </>
                          }
                        >
                          {" "}
                          {formatNumber(pool.apy || 0 * 100, 2)}%
                        </Tooltip>
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <SecondaryButton href={pool.project.link} size="small" fullWidth>
                        Stake on {pool.project.name}
                      </SecondaryButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </div>
  );
};
