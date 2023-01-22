import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataRow,
  Icon,
  OHMTokenProps,
  SecondaryButton,
  TextButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import { balancerPools, convexPools, curvePools, fraxPools } from "src/helpers/AllExternalPools";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";
import {
  BalancerPoolAPY,
  BalancerSwapFees,
  ConvexPoolAPY,
  CurvePoolAPY,
  FraxPoolAPY,
} from "src/views/Liquidity/ExternalStakePools/hooks/useStakePoolAPY";
import { useStakePoolBalance } from "src/views/Liquidity/ExternalStakePools/hooks/useStakePoolBalance";
import { CurvePoolTVL } from "src/views/Liquidity/ExternalStakePools/hooks/useStakePoolTVL";
import { useAccount } from "wagmi";

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
  const { isConnected } = useAccount();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  return (
    <>
      <Box mb="18px" mt="9px">
        <Typography variant="h1">Pool Farms</Typography>
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
          <AllPools isSmallScreen={isSmallScreen} />
        </Table>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>Asset</StyledTableCell>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>TVL</StyledTableCell>
              <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>APY</StyledTableCell>
              {isConnected && (
                <StyledTableCell sx={{ fontSize: "12px", fontWeight: "450" }}>{`Balance`}</StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <AllPools isSmallScreen={isSmallScreen} />
        </Table>
      )}
    </>
  );
};

const AllPools = (props: { isSmallScreen: boolean }) => (
  <TableBody>
    {balancerPools.map(pool => (
      <BalancerPools key={pool.poolId} pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {curvePools.map(pool => (
      <CurvePools key={pool.poolId} pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {convexPools.map(pool => (
      <ConvexPools key={pool.poolId} pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {fraxPools.map(pool => (
      <FraxPools key={pool.poolId} pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
  </TableBody>
);

const StakePool: React.FC<{ pool: ExternalPool; tvl?: number; apy?: number }> = props => {
  const { isConnected } = useAccount();

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;
  const ToolTipContent = () => (
    <>
      <Typography pb={"5px"}>Mint and Sync Pool</Typography>
      <Link href="https://olympusdao.medium.com/mint-sync-ffde42a72c23" target="_blank">
        Learn More
      </Link>
    </>
  );
  return (
    <TableRow>
      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" flexDirection="row" alignItems="center" style={{ whiteSpace: "nowrap" }}>
          <TokenStack tokens={props.pool.icons} style={{ fontSize: "24px" }} />
          <Box marginLeft="14px" marginRight="10px">
            <Typography>{props.pool.poolName}</Typography>
            {props.pool.mintAndSync && (
              <Box>
                <Tooltip message={<ToolTipContent />}>
                  <Typography fontSize="12px" lineHeight="15px" justifyContent="center" alignSelf="center">
                    Mint and Sync <Icon style={{ fontSize: "10px" }} name="info" />
                  </Typography>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} />
        </Box>
      </TableCell>
      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!props.tvl ? <Skeleton width={60} /> : formatCurrency(props.tvl)}
        </Typography>
      </TableCell>
      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.apy === undefined || isNaN(props.apy) ? (
            <Skeleton width={60} />
          ) : (
            `${formatNumber(props.apy * 100, 2)}%`
          )}
        </Typography>
      </TableCell>

      {isConnected && (
        <TableCell style={{ padding: "8px 0" }}>
          <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
            {!userBalance ? (
              <Skeleton width={60} />
            ) : (
              `${userBalance.toString({ decimals: 4, trim: false, format: true })} LP`
            )}
          </Typography>
        </TableCell>
      )}

      <TableCell style={{ padding: "8px 0" }}>
        <TextButton href={props.pool.href} rel="noopener noreferrer" target="_blank">
          {`Stake on`} {props.pool.stakeOn}
        </TextButton>
      </TableCell>
    </TableRow>
  );
};

const MobileStakePool: React.FC<{ pool: ExternalPool; tvl?: number; apy?: number }> = props => {
  const { isConnected } = useAccount();

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Box mt="42px">
      <StyledPoolInfo className={classes.poolPair}>
        <TokenStack tokens={props.pool.icons} style={{ fontSize: "24px" }} />

        <div className={classes.poolName}>
          <Typography>{props.pool.poolName}</Typography>
        </div>
        <div className={classes.poolName}>
          <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} />
        </div>
      </StyledPoolInfo>

      <DataRow title={`TVL`} isLoading={!props.tvl} balance={props.tvl ? formatCurrency(props.tvl) : undefined} />
      <DataRow
        title={`APY`}
        isLoading={!props.apy}
        balance={props.apy ? `${formatNumber(props.apy * 100, 2)} %` : undefined}
      />

      {isConnected && (
        <DataRow
          title={`Balance`}
          isLoading={!userBalance}
          balance={userBalance && `${userBalance.toString({ decimals: 4, trim: false, format: true })} LP`}
        />
      )}

      <SecondaryButton href={props.pool.href} fullWidth>
        {`Stake on`} {props.pool.stakeOn}
      </SecondaryButton>
    </Box>
  );
};

const BalancerPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data } = BalancerSwapFees(props.pool.address);
  const { apy } = BalancerPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={data.totalLiquidity} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={data.totalLiquidity} apy={apy} />
  );
};

const ConvexPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { apy, tvl } = ConvexPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={tvl} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={tvl} apy={apy} />
  );
};

const CurvePools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data } = CurvePoolTVL(props.pool);
  const { apy } = CurvePoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={data.usdTotal} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={data.usdTotal} apy={apy} />
  );
};

const FraxPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { apy, tvl } = FraxPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={tvl} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={tvl} apy={apy} />
  );
};
