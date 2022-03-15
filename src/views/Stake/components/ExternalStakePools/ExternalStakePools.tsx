import { t, Trans } from "@lingui/macro";
import { Box, makeStyles, Typography, useTheme, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, Paper, SecondaryButton, TokenStack } from "@olympusdao/component-library";
import { formatCurrency } from "src/helpers";
import allPools from "src/helpers/AllExternalPools";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPool } from "src/lib/ExternalPool";

import { useStakePoolBalance } from "./hooks/useStakePoolBalance";
import { useStakePoolTVL } from "./hooks/useStakePoolTVL";

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

const ExternalStakePools = () => {
  const theme = useTheme();
  const styles = useStyles();
  const { connected } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <>
          {allPools.map(pool => (
            <MobileStakePool pool={pool} />
          ))}
        </>
      ) : (
        <Paper headerText={t`Farm Pool`}>
          <Box className={styles.stakePoolsWrapper} style={{ gap: theme.spacing(1.5), marginBottom: "0.5rem" }}>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ marginLeft: "75px" }}>
              <Trans>Asset</Trans>
            </Typography>

            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ paddingLeft: "3px" }}>
              <Trans>TVL</Trans>
            </Typography>

            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              {connected ? t`Balance` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(4), padding: "16px 0px" }}>
            {allPools.map(pool => (
              <StakePool pool={pool} />
            ))}
          </Box>
        </Paper>
      )}
    </Zoom>
  );
};

const StakePool: React.FC<{ pool: ExternalPool }> = props => {
  const theme = useTheme();
  const styles = useStyles();
  const { connected } = useWeb3Context();
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Box style={{ gap: theme.spacing(1.5) }} className={styles.stakePoolsWrapper}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TokenStack tokens={props.pool.icons} />

        <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px" }}>
          {props.pool.poolName}
        </Typography>
      </Box>

      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!totalValueLocked ? <Skeleton width={80} /> : formatCurrency(totalValueLocked)}
      </Typography>

      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!connected ? "" : !userBalance ? <Skeleton width={80} /> : `${userBalance.toFormattedString(4)} LP`}
      </Typography>

      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
        <SecondaryButton target="_blank" href={props.pool.href} fullWidth>
          {t`Stake on`} {props.pool.stakeOn}
        </SecondaryButton>
      </Box>
    </Box>
  );
};

const MobileStakePool: React.FC<{ pool: ExternalPool }> = props => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  const { data: totalValueLocked } = useStakePoolTVL(props.pool);

  const userBalances = useStakePoolBalance(props.pool);
  const userBalance = userBalances[props.pool.networkID].data;

  return (
    <Paper>
      <div className={styles.poolPair}>
        <TokenStack tokens={props.pool.icons} />

        <div className={styles.poolName}>
          <Typography>{props.pool.poolName}</Typography>
        </div>
      </div>

      <DataRow
        title={`TVL`}
        isLoading={!totalValueLocked}
        balance={totalValueLocked ? formatCurrency(totalValueLocked) : undefined}
      />

      {connected && (
        <DataRow
          title={t`Balance`}
          isLoading={!userBalance}
          balance={userBalance && `${userBalance.toFormattedString(4)} LP`}
        />
      )}

      <SecondaryButton href={props.pool.href} fullWidth>
        {t`Stake on`} {props.pool.stakeOn}
      </SecondaryButton>
    </Paper>
  );
};

export default ExternalStakePools;
