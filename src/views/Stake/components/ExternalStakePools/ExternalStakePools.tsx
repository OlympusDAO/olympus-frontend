import { t, Trans } from "@lingui/macro";
import { Box, makeStyles, Table, TableCell, TableHead, TableRow, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, OHMTokenProps, Paper, SecondaryButton, Token, TokenStack } from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import { beetsPools, joePools, jonesPools, spiritPools, sushiPools, zipPools } from "src/helpers/AllExternalPools";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";

import {
  BeetsPoolAPY,
  JoePoolAPY,
  JonesPoolAPY,
  SpiritPoolAPY,
  SushiPoolAPY,
  ZipPoolAPY,
} from "./hooks/useStakePoolAPY";
import { useStakePoolBalance } from "./hooks/useStakePoolBalance";
import { BalancerPoolTVL, useStakePoolTVL } from "./hooks/useStakePoolTVL";

const useStyles = makeStyles(theme => ({
  stakePoolsWrapper: {
    display: "grid",
    gridTemplateColumns: `1.0fr 0.5fr 0.5fr 1.5fr auto`,
    gridTemplateRows: "auto",
    alignItems: "center",
  },
  stakePoolHeaderText: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
  poolPair: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },
  poolName: {
    marginLeft: "10px",
  },
}));

const AllPools = (props: { isSmallScreen: boolean }) => (
  <>
    {sushiPools.map(pool => (
      <SushiPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {joePools.map(pool => (
      <JoePools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {spiritPools.map(pool => (
      <SpiritPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {beetsPools.map(pool => (
      <BeetsPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {zipPools.map(pool => (
      <ZipPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
    {jonesPools.map(pool => (
      <JonesPools pool={pool} isSmallScreen={props.isSmallScreen} />
    ))}
  </>
);

const ExternalStakePools = () => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <AllPools isSmallScreen={isSmallScreen} />
      ) : (
        <Paper headerText={t`Farm Pool`}>
          <Table>
            <TableHead className={styles.stakePoolHeaderText}>
              <TableRow>
                <TableCell align="center">
                  <Trans>Asset</Trans>
                </TableCell>
                <TableCell>
                  <Trans>TVL</Trans>
                </TableCell>
                <TableCell>
                  <Trans>APY</Trans>
                </TableCell>
                <TableCell>{connected ? t`Balance` : ""}</TableCell>
              </TableRow>
            </TableHead>
            <AllPools isSmallScreen={isSmallScreen} />
          </Table>
        </Paper>
      )}
    </Zoom>
  );
};

const StakePool: React.FC<{ pool: ExternalPool; tvl?: number; apy?: number }> = props => {
  const { connected } = useWeb3Context();

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <TableRow>
      <TableCell>
        <Box display="flex" flexDirection="row" alignItems="center">
          <TokenStack tokens={props.pool.icons} />
          <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px", marginRight: "10px" }}>
            {props.pool.poolName}
          </Typography>
          <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} />
        </Box>
      </TableCell>
      <TableCell>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!props.tvl ? <Skeleton width={80} /> : formatCurrency(props.tvl)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!props.apy ? 0 : formatNumber(props.apy * 100, 2)}%
        </Typography>
      </TableCell>
      <TableCell>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {!connected ? (
            ""
          ) : !userBalance ? (
            <Skeleton width={80} />
          ) : (
            `${userBalance.toString({ decimals: 4, trim: false, format: true })} LP`
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <SecondaryButton size="small" target="_blank" href={props.pool.href} fullWidth>
          {t`Stake on`} {props.pool.stakeOn}
        </SecondaryButton>
      </TableCell>
    </TableRow>
  );
};

const MobileStakePool: React.FC<{ pool: ExternalPool; tvl?: number; apy?: number }> = props => {
  const styles = useStyles();
  const { connected } = useWeb3Context();

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Paper>
      <div className={styles.poolPair}>
        <TokenStack tokens={props.pool.icons} />

        <div className={styles.poolName}>
          <Typography>{props.pool.poolName}</Typography>
        </div>
        <div className={styles.poolName}>
          <Token name={NetworkId[props.pool.networkID] as OHMTokenProps["name"]} style={{ fontSize: "15px" }} />
        </div>
      </div>

      <DataRow title={`TVL`} isLoading={!props.tvl} balance={props.tvl ? formatCurrency(props.tvl) : undefined} />
      <DataRow
        title={`APY`}
        isLoading={!props.apy}
        balance={props.apy ? `${formatNumber(props.apy * 100, 2)} %` : "0"}
      />

      {connected && (
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
const SpiritPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = SpiritPoolAPY(props.pool);
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

const ZipPools: React.FC<{ pool: ExternalPool; isSmallScreen: boolean }> = props => {
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);
  const { apy } = ZipPoolAPY(props.pool);
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

export default ExternalStakePools;
