import { t, Trans } from "@lingui/macro";
import { Box, Link, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataRow,
  Icon,
  OHMTokenProps,
  Paper,
  SecondaryButton,
  Token,
  TokenStack,
  Tooltip,
} from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import {
  balancerPools,
  beetsPools,
  convexPools,
  curvePools,
  fraxPools,
  joePools,
  jonesPools,
  sushiPools,
} from "src/helpers/AllExternalPools";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";
import {
  BalancerPoolAPY,
  BalancerSwapFees,
  BeetsPoolAPY,
  ConvexPoolAPY,
  CurvePoolAPY,
  FraxPoolAPY,
  JoePoolAPY,
  JonesPoolAPY,
  SushiPoolAPY,
} from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolAPY";
import { useStakePoolBalance } from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolBalance";
import {
  BalancerPoolTVL,
  CurvePoolTVL,
  useStakePoolTVL,
} from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";
import { useAccount } from "wagmi";

const PREFIX = "ExternalStakePools";

const classes = {
  stakePoolsWrapper: `${PREFIX}-stakePoolsWrapper`,
  stakePoolHeaderText: `${PREFIX}-stakePoolHeaderText`,
  poolPair: `${PREFIX}-poolPair`,
  poolName: `${PREFIX}-poolName`,
};

const StyledTableHeader = styled(TableHead)(({ theme }) => ({
  [`&.${classes.stakePoolHeaderText}`]: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
}));

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

export const ExternalStakePools = () => {
  const { isConnected } = useAccount();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  return (
    <>
      {isSmallScreen ? (
        <AllPools isSmallScreen={isSmallScreen} />
      ) : (
        <Paper headerText={t`Farm Pool`}>
          <Table>
            <StyledTableHeader className={classes.stakePoolHeaderText}>
              <TableRow>
                <TableCell style={{ width: "250px", padding: "8px 0" }}>
                  <Trans>Asset</Trans>
                </TableCell>

                <TableCell style={{ width: isConnected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>TVL</Trans>
                </TableCell>

                <TableCell style={{ width: isConnected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>APY</Trans>
                </TableCell>

                {isConnected && <TableCell style={{ width: "100px", padding: "8px 0" }}>{t`Balance`}</TableCell>}
              </TableRow>
            </StyledTableHeader>
            <AllPools isSmallScreen={isSmallScreen} />
          </Table>
        </Paper>
      )}
    </>
  );
};

const AllPools = (props: { isSmallScreen: boolean }) => (
  <>
    {sushiPools.map(pool => (
      <SushiPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {joePools.map(pool => (
      <JoePools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {beetsPools.map(pool => (
      <BeetsPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {jonesPools.map(pool => (
      <JonesPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {balancerPools.map(pool => (
      <BalancerPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {curvePools.map(pool => (
      <CurvePools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {convexPools.map(pool => (
      <ConvexPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {fraxPools.map(pool => (
      <FraxPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
  </>
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
          <TokenStack tokens={props.pool.icons} />
          <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px", marginRight: "10px" }}>
            {props.pool.poolName}
            {props.pool.mintAndSync && (
              <Typography fontSize="12px" lineHeight="15px" justifyContent="center" alignSelf="center">
                Mint and Sync{" "}
                <Tooltip message={<ToolTipContent />}>
                  <Icon style={{ fontSize: "10px" }} name="info" />
                </Tooltip>
              </Typography>
            )}
          </Typography>
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
        <SecondaryButton size="small" target="_blank" rel="noopener noreferrer" href={props.pool.href} fullWidth>
          {t`Stake on`} {props.pool.stakeOn}
        </SecondaryButton>
      </TableCell>
    </TableRow>
  );
};

const MobileStakePool: React.FC<{ pool: ExternalPool; tvl?: number; apy?: number }> = props => {
  const { isConnected } = useAccount();

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Paper>
      <StyledPoolInfo className={classes.poolPair}>
        <TokenStack tokens={props.pool.icons} />

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
          title={t`Balance`}
          isLoading={!userBalance}
          balance={userBalance && `${userBalance.toString({ decimals: 4, trim: false, format: true })} LP`}
        />
      )}

      <SecondaryButton href={props.pool.href} fullWidth>
        {t`Stake on`} {props.pool.stakeOn}
      </SecondaryButton>
    </Paper>
  );
};

const SushiPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = SushiPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  );
};

const JoePools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = JoePoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  );
};

const BeetsPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = BalancerPoolTVL(props.pool);
  const { apy } = BeetsPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  );
};

const JonesPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = JonesPoolAPY(props.pool);
  return props.isSmallScreen ? (
    <MobileStakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
  ) : (
    <StakePool pool={props.pool} tvl={totalValueLocked} apy={apy} />
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
