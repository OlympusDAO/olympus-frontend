import { t, Trans } from "@lingui/macro";
import { Box, makeStyles, Typography, useTheme, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, Paper, SecondaryButton, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import allPools, { fetchPoolData } from "src/helpers/AllExternalPools";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPoolwBalance } from "src/lib/ExternalPool";

export const useExternalPools = (address: string) => {
  const { isLoading, data } = useQuery(["externalPools", address], () => fetchPoolData(address), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: allPools,
  });
  return { isLoading, pools: data };
};

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

const MobileStakePool = ({ pool, isLoading }: { pool: ExternalPoolwBalance; isLoading: boolean }) => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  return (
    <Paper>
      <div className={styles.poolPair}>
        <TokenStack tokens={pool.icons} />
        <div className={styles.poolName}>
          <Typography>{pool.poolName}</Typography>
        </div>
      </div>
      <DataRow title={`TVL`} balance={pool.tvl} isLoading={pool.tvl ? false : true} />
      {connected && (
        <DataRow title={t`Balance`} balance={`${pool.userBalance} LP`} isLoading={pool.userBalance ? false : true} />
      )}
      {/* Pool Staking Linkouts */}
      <SecondaryButton href={pool.href} fullWidth>
        {`${t`Stake on`} ${pool.stakeOn}`}
      </SecondaryButton>
    </Paper>
  );
};

const StakePool = ({ pool, isLoading }: { pool: ExternalPoolwBalance; isLoading: boolean }) => {
  const theme = useTheme();
  const styles = useStyles();
  const { connected } = useWeb3Context();

  return (
    <Box style={{ gap: theme.spacing(1.5) }} className={styles.stakePoolsWrapper}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TokenStack tokens={pool.icons} />
        <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px" }}>
          {pool.poolName}
        </Typography>
      </Box>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!pool.tvl ? <Skeleton width={30} /> : pool.tvl}
      </Typography>
      <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
        {!pool.userBalance && connected ? (
          <Skeleton width={30} />
        ) : connected && pool.userBalance ? (
          `${pool.userBalance} LP`
        ) : (
          ""
        )}
      </Typography>
      <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
        <SecondaryButton target="_blank" href={pool.href} fullWidth>
          {`${t`Stake on`} ${pool.stakeOn}`}
        </SecondaryButton>
      </Box>
    </Box>
  );
};

export default function ExternalStakePool() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connect, connected, networkId, providerInitialized } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  // const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();
  const styles = useStyles();
  const allStakePools = useExternalPools(address);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked && providerInitialized) {
      // view specific redux actions can be dispatched here
    }
  }, [walletChecked, networkId, providerInitialized, address, provider]);

  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <>
          {allStakePools?.pools?.map(pool => (
            <MobileStakePool pool={pool} isLoading={allStakePools?.isLoading} />
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
              {connected && t`Balance`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(4), padding: "16px 0px" }}>
            {allStakePools?.pools?.map(pool => (
              <StakePool pool={pool} isLoading={allStakePools?.isLoading} />
            ))}
          </Box>
        </Paper>
      )}
    </Zoom>
  );
}
